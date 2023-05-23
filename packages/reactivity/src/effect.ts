/*
 * @Author: Wanko
 * @Date: 2023-05-22 11:17:40
 * @LastEditors: Wanko
 * @LastEditTime: 2023-05-22 17:03:15
 * @Description: 收集和触发依赖
 */
import { isArray } from '@vue/shared'
import { Dep, createDep } from './dep'
type KeyToDepMap = Map<any, Dep>
const targetMap = new WeakMap<any, KeyToDepMap>()

/**
 * @Description: effect函数
 * @param {function} fn 执行方法,ReactiveEffect的实例
 * @return {*} 以ReactiveEffect实例为this的执行函数
 */
export function effect<T = any>(fn: () => T) {
  const _effect = new ReactiveEffect(fn)
  _effect.run()
}

// 当前被激活的effect
export let activeEffect: ReactiveEffect | undefined
export class ReactiveEffect<T = any> {
  constructor(public fn: () => T) {}
  /**
   * @Description: 调用run函数实际是调用传入的fn函数
   * @return {*}
   */
  run() {
    activeEffect = this
    return this.fn()
  }
}
/**
 * @Description: 收集依赖的方法
 * @param {object} target 被代理对象
 * @param {unknown} key 被代理对象的key
 * @return {*}
 */
export function track(target: object, key: unknown) {
  // *不存在执行函数，直接return
  if (!activeEffect) return
  // *读取targetMap,根据target获取map
  let depsMap = targetMap.get(target)
  // *map存在，在生成新的map对象，并把该对象赋值给对应的value
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }

  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = createDep()))
  }
  trackEffects(dep)
}

/**
 * @Description: 利用dep依次跟踪指定key的所有effect
 * @return {*}
 */
export function trackEffects(dep: Dep) {
  // activeEffect! 强行放入
  dep.add(activeEffect!)
}

/**
 * @Description: 触发依赖
 * @param {object} target 被代理对象
 * @param {unknown} key 被代理对象的key
 * @param {unknown} newValue 被代理对象的key设置的新值
 * @return {*}
 */
export function trigger(target: object, key: unknown, newValue: unknown) {
  console.log('触发依赖')

  const depsMap = targetMap.get(target)
  if (!depsMap) return

  // * effect 是一个 ReactiveEffect, as 描述类型
  const dep: Dep | undefined = depsMap.get(key)

  if (!dep) return
  // 依次触发dep
  triggerEffects(dep)
}

/**
 * @Description: 依次触发dep中保存的fn
 * @return {*}
 */
export function triggerEffects(dep: Dep) {
  const effects = isArray(dep) ? dep : [...dep]
  for (const effect of effects) {
    triggerEffect(effect)
  }
}

/**
 * @Description: 触发指定依赖
 * @param {ReactiveEffect} effect
 * @return {*}
 */
export function triggerEffect(effect: ReactiveEffect) {
  effect.run()
}
