import { type Plugin } from 'vite'
import { extname } from 'path';
import { transform } from "@vue-ts-props-plugin/core";
export function VueJSXPropsPlugin():Plugin{
  return {
    name:"VueJSXPropsPlugin",
    async transform(_,id){
      const ext=extname(id)
      if(ext=='.tsx' || ext=='.ts'){
        return transform(id)
      }
    }
  }
}
