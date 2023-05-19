import * as ts from "typescript";

function isDefineComponentNode(node: ts.CallExpression) {
  if (node.getChildCount() && node.getChildAt(0).getText() == "defineComponent") {
    return true
  }
  return false
}

function buildDefineComponentNode(node: ts.CallExpression, checker: ts.TypeChecker) {
  if (node.arguments.length == 1) {
    const component = node.arguments[0]
    const identifier = node.getChildAt(0) as ts.Identifier
    if (ts.isFunctionLike(component) && component.parameters.length) {
      const propsParameter = component.parameters[0]
      const type = checker.getTypeAtLocation(propsParameter)
      const args = checker.getPropertiesOfType(type)
      const props = args.map(item => {
        return item.escapedName.toString()
      })
      const options = ts.factory.createObjectLiteralExpression(
        [ts.factory.createPropertyAssignment(
          ts.factory.createIdentifier('props'),
          ts.factory.createArrayLiteralExpression(
            props.map(prop => {
              return ts.factory.createStringLiteral(prop)
            })
          )
        ), ts.factory.createPropertyAssignment(
          ts.factory.createIdentifier('setup'),
          component
        )]
      )
      return ts.factory.updateCallExpression(node, identifier, undefined, [options])
    }
  }
  return node
}


export function transform(file: string) {
  const program = ts.createProgram([file], {})
  const checker = program.getTypeChecker()
  const source = program.getSourceFile(file)

  if (source) {
    
    const { transformed } = ts.transform<ts.Node>(source, [
      (context)=>{
        function visit(node: ts.Node):ts.Node {
          if (ts.isCallExpression(node) && isDefineComponentNode(node)) {
            return buildDefineComponentNode(node, checker)
          }
          return ts.visitEachChild(node, visit, context)
        }
        return (node)=>{
          return ts.visitNode(node, visit)
        }
      }
    ])
    const printer = ts.createPrinter();
    const code = printer.printNode(ts.EmitHint.SourceFile, transformed[0], source);
    return code
  } else {
    throw Error("file is error")
  }
}
