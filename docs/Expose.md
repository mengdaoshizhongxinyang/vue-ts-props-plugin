```typescript
import { computed, defineComponent, getCurrentInstance, ref, type VNode } from "vue"
function renderWith<V extends () => VNode, T extends Record<string, any>>(val: V, expose: T) {
  const proxy = getCurrentInstance()?.proxy
  if (proxy) {
    Object.assign(proxy, expose)
    return val as unknown as (() => (ReturnType<V> & T))
  } else {
    throw Error()
  }
}
const Comp = defineComponent(
  (props: { a?: string, b?: string }) => {
    const foo=computed(()=>`${props.a}-${props.b}`)
    function bar(){
      console.log(foo.value)
    }
    return renderWith(() => <div>{props.a}</div>,{bar,foo})
  })

export default  defineComponent(() => {
  const temp = ref<ReturnType<typeof Comp>>()
  function handleClick(){
    console.log(temp.value?.foo.value)
    temp.value?.bar()
  }
  return () => <>
  <button onClick={handleClick}>click it</button>
  <Comp a={'233'} b={'foo'} ref={temp}></Comp>
  </>
})
```
