
```typescript
//**/vue.d.ts

import "vue"
import { RenderFunction, type VNode } from "vue";
declare module "vue" {
  type OverloadProps<TOverload> = Pick<TOverload, keyof TOverload>;
  type OverloadUnionRecursive<TOverload, TPartialOverload = unknown> = TOverload extends (
    ...args: infer TArgs
  ) => infer TReturn
    ? TPartialOverload extends TOverload
    ? never
    :
    | OverloadUnionRecursive<
      TPartialOverload & TOverload,
      TPartialOverload & ((...args: TArgs) => TReturn) & OverloadProps<TOverload>
    >
    | ((...args: TArgs) => TReturn)
    : never;
  type OverloadUnion<TOverload extends (...args: any[]) => any> = Exclude<
    OverloadUnionRecursive<
      (() => never) & TOverload
    >,
    TOverload extends () => never ? never : () => never
  >;

  type UnionToIntersection<U> =
    (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never
  type LastOf<T> =
    UnionToIntersection<T extends any ? () => T : never> extends () => (infer R) ? R : never

  type Push<T extends any[], V> = [...T, V];

  type TuplifyUnion<T, L = LastOf<T>, N = [T] extends [never] ? true : false> =
    true extends N ? [] : Push<TuplifyUnion<Exclude<T, L>>, L>

  type EmitUnionToProps<T extends ((...args: any[]) => any)[]> =
    T extends [infer L, ...infer R]
    ? R extends ((...args: any[]) => any)[]
    ? Parameters<L> extends [infer K, ...infer A]
    ? { [key in K as `on${Capitalize<key>}`]?: (...args: A) => any } & EmitUnionToProps<R>
    : {}
    : {}
    : {}

  export function defineComponent<
    P extends Record<string, any>,
    S extends Record<string, (...args:any[])=>VNode>,
    A extends Record<string, unknown>,
    E extends (...args: any[]) => any,
    R extends RenderFunction
  >(setup: (props: P, ctx: {
    attrs:A,
    emit: E,
    slots: S
  }) => R): (
    props: P & EmitUnionToProps<TuplifyUnion<OverloadUnion<E>>>
  ) => ReturnType<R>
}
```
