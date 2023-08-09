<center><h1>vue-ts-props-plugin</h1></center>

What is this
------------

This is a plugin to implement [this](https://github.com/vuejs/core/blob/a95e612b252ae59eaf56e0b8ddba66948d4ac20e/packages/dts-test/defineComponent.test-d.tsx#LL1256C1-L1289C3).It will compiler code `defineComponent((props:Props)=>(()=>JSX)))` to `defineComponent({props,setup})`.You can use it like:

```typescript
import { defineComponent, ref } from "vue";
type Foo<T extends string>=Record<T,number>
interface Props<T> extends Foo<'c'>{
  a?:string,
  b:T
}
const Comp=defineComponent(<T extends string|number>(props:Props<T>,ctx:{})=>{
  return ()=><div>{ props.b }</div>
})
```

Install
-------

```
//vite
yarn install vue-ts-props-plugin-vite
```

## Usage

```typescript
//vite
import { defineConfig } from "vite";
import { VueTSPropsPlugin } from "vue-ts-props-plugin-vite";
export default defineConfig({
  plugins:[VueTSPropsPlugin()]
}) 
```

## Q & A

> How to get a better development experience?

* [Overload defineComponent function](./docs/GetBetterType.md).

> How to define emit or slots?

* [It is basically the same as the usage in the documentation.](./docs/EmitOrSlot.md)

> How to support expose type?

* [demo](./docs/Expose.md)

[License](https://github.com/mengdaoshizhongxinyang/vue-ts-props-plugin/blob/main/LICENSE)
