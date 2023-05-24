import { defineComponent, h } from "vue";
export default defineComponent((foo:{foo:string})=>{
  return ()=>h('div',foo.foo)
})
