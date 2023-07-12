import { defineComponent, h } from "vue";
export default defineComponent(
  (props:{a:1,b:string}|{a:'2',c:number})=>{
    return ()=>h('div')
  }
)