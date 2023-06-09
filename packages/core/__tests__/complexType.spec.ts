import { expect,it,describe,test } from "vitest";
import { transform } from "../index";
import { join } from "path";
describe("complex type",()=>{

  test("extends type",()=>{
    expect(transform(join(__dirname,"./complexType/extends.ts")))
      .toMatch(`props: { a: { type: Number, required: true }, b: { type: String, required: true }, c: { type: null, required: false }, d: { type: null, required: false } }`)
  })

  test("generic type",()=>{
    expect(transform(join(__dirname,"./complexType/generic.ts")))
      .toMatch(`props: { foo: { type: String, required: true } }`)
  })

  test("enum type",()=>{
    expect(transform(join(__dirname,"./complexType/enum.ts")))
      .toMatch(`props: { foo: { type: [String, Number], required: true } }`)
  })

  test("unionProps type",()=>{
    expect(transform(join(__dirname,"./complexType/unionProps.ts")))
      .toMatch(`props: { a: { type: [Number, String], required: true }, b: { type: String, required: false }, c: { type: Number, required: false } }`)
  })
})
