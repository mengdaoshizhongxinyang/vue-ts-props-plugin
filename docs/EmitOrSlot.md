```typescript
import { defineComponent } from "vue"
const Comp = defineComponent(
  (
    props: { a?: string, b?: string },
    { emit, slots }: {
      emit: {
        (event: 'myClick', e: string): void
        (event: 'dblclick'): void
      },
      slots: {
        content: () => any
      }
    }
  ) => {

    return () => <div onClick={() => emit('myClick', "111")}>{props.a}{slots.content()}</div>
  }
)

export default defineComponent(() => {
  return () => <>
    <Comp a={'23333'} onMyClick={(str) => { console.log(str) }}>{
      { content: () => <span style={{ color: "red" }}>233</span> }
    }</Comp>
  </>
})

```
