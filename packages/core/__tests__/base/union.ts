import { defineComponent, h } from "vue";
export default defineComponent((props:{foo:string|number})=>{
  return ()=>h('div')
})
