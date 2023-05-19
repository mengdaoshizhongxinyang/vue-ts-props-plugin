import swc from "rollup-plugin-swc3";
import { VueJSXPropsPlugin } from "./src";
import { defineConfig } from "vite";
import { resolve,extname } from 'path'
export default defineConfig({
  plugins: [VueJSXPropsPlugin(),swc({
    include: /\.[mc]?[jt]sx?$/,
    exclude: /node_modules/,
    tsconfig: 'tsconfig.json',
    jsc: {}
  })],
  build:{
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, './src/index.ts'),
      name: 'index',
      formats:['es','cjs'],
      // the proper extensions will be added
      fileName: 'index',

    },
    rollupOptions:{
      external:['path','typescript'],
      output:{
        dir:"dist"
      }
    }
  }
})
