import { defineComponent,h,Fragment,ref } from "vue";
export default defineComponent(<T extends string>(props:{foo:T})=>{
  return ()=>h("div")
})