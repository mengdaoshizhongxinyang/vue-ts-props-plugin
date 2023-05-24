import { expect,it,describe,test } from "vitest";
import { transform } from "../index";
import { join } from "path";
describe("base",()=>{
  test("base",()=>{
    expect(transform(join(__dirname,"./base/base.ts")).replaceAll("\n","").replaceAll(" ",""))
      .toBe(
`import { defineComponent, h } from "vue";
export default defineComponent({ props: { foo: { type: String, required: true } }, setup: (props) => {
        return () => h('div');
    } });`.replaceAll("\n","").replaceAll(" ",""))
  })

  test("required property",()=>{
    expect(transform(join(__dirname,"./base/unRequired.ts")))
      .toMatch(`props: { foo: { type: String, required: false } }`)
  })

  test("union property",()=>{
    expect(transform(join(__dirname,"./base/union.ts")))
      .toMatch(`props: { foo: { type: [String, Number], required: true } }`)
  })

  test("any type property",()=>{
    expect(transform(join(__dirname,"./base/any.ts")))
      .toMatch(`props: { foo: { type: null, required: true } }`)
  })

  test("prop is other name ",()=>{
    expect(transform(join(__dirname,"./base/otherName.ts")))
      .toMatch(`foo: { foo: { type: String, required: true } }`)
  })
})
