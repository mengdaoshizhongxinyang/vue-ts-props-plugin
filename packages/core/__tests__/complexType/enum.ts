import { defineComponent,h,Fragment,ref } from "vue";
enum Foo{
  a="1",
  b=2
}
export default defineComponent(<T extends string>(props:{foo:Foo})=>{
  return ()=>h("div")
})