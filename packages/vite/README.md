<center><h1>vue-ts-props-plugin/vite</h1></center>

What is this
------------

This is a plugin to implement [this](https://github.com/vuejs/core/blob/a95e612b252ae59eaf56e0b8ddba66948d4ac20e/packages/dts-test/defineComponent.test-d.tsx#LL1256C1-L1289C3).It will compiler code `defineComponent((props:Props)=>(()=>JSX)))` to `defineComponent({props,setup})`.

Install
-------

```
//vite
yarn install vue-ts-props-plugin-vite
```

Usage
-----

```typescript
//vite
import { defineConfig } from "vite";
import { VueTSPropsPlugin } from "vue-ts-props-plugin-vite";
export default defineConfig({
  plugins:[VueTSPropsPlugin()]
}) 
```

[License](https://github.com/mengdaoshizhongxinyang/vue-ts-props-plugin/blob/main/LICENSE)
