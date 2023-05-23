import { ReactiveEffect } from './effect'

// 定义Dep类型，保存多个ReactiveEffect的set
export type Dep = Set<ReactiveEffect>

/**
 * @Description:
 * @param {ReactiveEffect} effects
 * @return {*} 返回的是一个Dep类型，即ReactiveEffect的Set集合
 */
export const createDep = (effects?: ReactiveEffect[]): Dep => {
  const dep = new Set<ReactiveEffect>(effects) as Dep
  return dep
}
