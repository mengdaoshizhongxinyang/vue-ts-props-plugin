import swc from "rollup-plugin-swc3";
import { VueTSPropsPlugin } from "./src";
import { defineConfig } from "vite";
import { resolve,extname } from 'path'
export default defineConfig({
  plugins: [swc({
    include: /\.[mc]?[jt]sx?$/,
    exclude: /node_modules/,
    tsconfig: 'tsconfig.json',
    jsc: {}
  }),VueTSPropsPlugin()],
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
