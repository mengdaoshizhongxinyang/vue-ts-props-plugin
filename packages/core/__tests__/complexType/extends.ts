import { defineComponent,h,Fragment,ref } from "vue";
type Foo<T extends string>={
  [key in T]?:any
}
interface Props extends Foo<'c'|'d'>{
  a:number
  b:string
}
export default defineComponent((props:Props)=>{
  return ()=>h("div")
})