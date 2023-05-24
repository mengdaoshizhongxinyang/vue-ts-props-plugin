import * as ts from "typescript";

export function transform(file: string) {
  const program = ts.createProgram([file], {})
  const checker = program.getTypeChecker()
  const source = program.getSourceFile(file)
  function isDefineComponentNode(node: ts.CallExpression) {
    if (node.getChildCount() && node.getChildAt(0).getText() == "defineComponent") {
      return true
    }
    return false
  }
  type TypeLabel = 'string' | 'number' | 'null' | 'array' | 'object' | 'boolean' | 'function' | 'symbol'

  function collectType(type: ts.Type): TypeLabel[] {
    let flags=type.flags
    if(flags&ts.TypeFlags.EnumLiteral){
      flags^=ts.TypeFlags.EnumLiteral
    }
    switch (flags) {
      case ts.TypeFlags.TypeParameter:
        return (type.symbol.declarations || []).map(item=>{
          if(ts.isTypeParameterDeclaration(item) && item.constraint){
            return collectType(checker.getTypeAtLocation(item.constraint))
          }else{
            return []
          }
        }).flat(1)
      case ts.TypeFlags.Any:
      case ts.TypeFlags.Unknown:
      case ts.TypeFlags.Void:
      case ts.TypeFlags.VoidLike:
        return ["null"]
      case ts.TypeFlags.Union:
        return (type as ts.UnionType).types.map(subType => {
          return collectType(subType)
        }).flat(1)
      case ts.TypeFlags.String:
      case ts.TypeFlags.StringLiteral:
      case ts.TypeFlags.StringLike:
        return ['string']
      case ts.TypeFlags.Boolean:
      case ts.TypeFlags.BooleanLike:
      case ts.TypeFlags.BooleanLiteral:
        return ['boolean']
      case ts.TypeFlags.Object:
      case ts.TypeFlags.Intersection:
        if(checker.isArrayLikeType(type)){
          return ['array']
        }
        const isFunction=checker.getSignaturesOfType(type,ts.SignatureKind.Call).length||
          checker.getSignaturesOfType(type,ts.SignatureKind.Construct).length
        if(isFunction){
          return ['function']
        }
        return ['object']
      case ts.TypeFlags.Number:
      case ts.TypeFlags.NumberLiteral:
      case ts.TypeFlags.NumberLike:
        return ['number']
      case ts.TypeFlags.ESSymbol:
      case ts.TypeFlags.ESSymbolLike:
      case ts.TypeFlags.UniqueESSymbol:
        return ['symbol']
      default:
        return []
    }
  }

  function unique(strArr: TypeLabel[]) {
    for (const str of strArr) {
      if (str == 'null') {
        return 'null'
      }
    }
    if(strArr.length==0){
      return 'null'
    }
    if (strArr.length == 1) {
      return strArr[0]
    }
    return Array.from(new Set(strArr))
  }

  function createPropertyType(propertySymbol: ts.Symbol): ts.Expression {
    const type = checker.getTypeOfSymbol(propertySymbol)
    const typeLabels=unique(collectType(type))
    if(typeof typeLabels=='string'){
      return createTypeIdentifier(typeLabels)
    }else{
      return ts.factory.createArrayLiteralExpression(typeLabels.map(label=>createTypeIdentifier(label)), false)
    }
  }

  function createTypeIdentifier(label: TypeLabel) {
    switch (label){
      case "string":
        return ts.factory.createIdentifier("String")
      case "number":
        return ts.factory.createIdentifier("Number")
      case "boolean":
        return ts.factory.createIdentifier("Boolean")
      case "symbol":
        return ts.factory.createIdentifier("Symbol")
      case "object":
        return ts.factory.createIdentifier("Object")
      case "function":
        return ts.factory.createIdentifier("Function")
      case "array":
        return ts.factory.createIdentifier("Array")
      default:
        return ts.factory.createIdentifier("null")
    }
  }

  function createPropertyAssignment(propertySymbol: ts.Symbol): ts.ObjectLiteralElementLike {
    const isOptional = ((propertySymbol.flags & ts.SymbolFlags.Optional) != 0)
    const name = propertySymbol.name
    return ts.factory.createPropertyAssignment(
      ts.factory.createIdentifier(name),
      ts.factory.createObjectLiteralExpression(
        [
          ts.factory.createPropertyAssignment(
            ts.factory.createIdentifier("type"),
            createPropertyType(propertySymbol)
          ),
          ts.factory.createPropertyAssignment(
            ts.factory.createIdentifier("required"),
            isOptional?ts.factory.createFalse():ts.factory.createTrue()
          )
        ]
      )
    )
  }

  function updateProps(component:ts.ArrowFunction|ts.FunctionExpression){
    const [props,...ctx]=component.parameters
    if(ts.isArrowFunction(component)){
      return ts.factory.updateArrowFunction(
        component,
        component.modifiers,
        component.typeParameters,
        [
          ts.factory.updateParameterDeclaration(
            props,
            props.modifiers,
            props.dotDotDotToken,
            props.name,
            props.questionToken,
            undefined,
            props.initializer
          ),
          ...ctx,
        ],
        component.type,
        component.equalsGreaterThanToken,
        component.body
      )
    }else{
      return ts.factory.updateFunctionExpression(
        component,
        component.modifiers,
        component.asteriskToken,
        component.name,
        component.typeParameters,
        [
          ts.factory.updateParameterDeclaration(
            props,
            props.modifiers,
            props.dotDotDotToken,
            props.name,
            props.questionToken,
            undefined,
            props.initializer
          ),
          ...ctx,
        ],
        component.type,
        component.body
      )
    }
  }

  function buildDefineComponentNode(node: ts.CallExpression, checker: ts.TypeChecker) {
    if (node.arguments.length == 1) {
      const component = node.arguments[0]
      const identifier = node.getChildAt(0) as ts.Identifier
      if (ts.isFunctionLike(component) && component.parameters.length) {
        const propsParameter = component.parameters[0]
        const propsIdentifier= propsParameter.getChildAt(0) as ts.Identifier
        const type = checker.getTypeAtLocation(propsParameter)
        const properties = type.getProperties()
        const props: ts.ObjectLiteralElementLike[] = []
        for (const property of properties) {
          props.push(createPropertyAssignment(property))
        }
        const options = ts.factory.createObjectLiteralExpression(
          [ts.factory.createPropertyAssignment(
            propsIdentifier,
            ts.factory.createObjectLiteralExpression(props)
          ), ts.factory.createPropertyAssignment(
            ts.factory.createIdentifier('setup'),
            updateProps(component)
          )]
        )
        return ts.factory.updateCallExpression(node, identifier, undefined, [options])
      }
    }
    return node
  }

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
