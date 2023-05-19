import { defineComponent,h,Fragment,ref } from "vue";
type Foo<T extends string>={
  [key in T]:any
}
interface Props<T extends string|number=string> extends Foo<'c'|'d'>{
  a:T
  b:string
}


const Comp = defineComponent((props:Props)=>{
  return ()=>h(
    "div",
    null,
    `${props.a}-${props.b}`
  )
})
export default defineComponent({
  setup() {
    const a=ref("")
    return ()=>h(
      Fragment,
      [
        h('input',{value:a.value,onInput:(e:InputEvent)=>{a.value=(e.target as HTMLInputElement).value}}),
        h(Comp as any,{a:a.value,b:"233"})
      ]
    )
  }
})