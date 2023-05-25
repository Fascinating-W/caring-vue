/*
 * @Author: Wanko
 * @Date: 2023-05-25 18:53:25
 * @LastEditors: Wanko
 * @LastEditTime: 2023-05-25 19:30:49
 * @Description:
 */
import { EMPTY_OBJ, hasChanged, isObject } from '@vue/shared'
import { isReactive } from 'packages/reactivity/src/reactive'
import { queuePreFlushCb } from './scheduler'
import { ReactiveEffect } from 'packages/reactivity/src/effect'

export interface WatchOptions<immediate = boolean> {
  immediate?: immediate
  deep?: boolean
}

export function watch(source, cb: Function, options?: WatchOptions) {
  return doWatch(source, cb, options)
}

function doWatch(
  source,
  cb: Function,
  { immediate, deep }: WatchOptions = EMPTY_OBJ
) {
  // getter 是一个函数类型
  let getter: () => any
  if (isReactive(source)) {
    getter = () => source
    deep = true
  } else {
    getter = () => EMPTY_OBJ
  }

  if (cb && deep) {
    // 浅拷贝，baseGetter和getter指向同一块内存空间
    const baseGetter = getter
    // 匿名函数
    getter = () => traverse(baseGetter())
  }

  let oldValue = {}
  // 触发watch其实就是触发job

  /**
   * @Description: job函数，本质就是为了拿到newVal
   * @return {*}
   */
  const job = () => {
    if (cb) {
      const newValue = effect.run()
      if (deep || hasChanged(newValue, oldValue)) {
        // 有变化触发cb
        cb(newValue, oldValue)
        oldValue = newValue
      }
    }
  }

  let scheduler = () => queuePreFlushCb(job)

  const effect = new ReactiveEffect(getter, scheduler)

  if (cb) {
    if (immediate) {
      job()
    } else {
      oldValue = effect.run()
    }
  } else {
    effect.run()
  }

  return () => {
    effect.stop()
  }
}

/**
 * @Description: 循环读取属性，触发依赖（触发effect的getter）
 * @param {unknown} value
 * @return {*}
 */
export function traverse(value: unknown) {
  if (!isObject(value)) return

  // 如果是一个对象，循环对象上属性,value as object断言成object
  for (const key in value as object) {
    // 递归触发traverse
    traverse((value as object)[key])
  }
  return value
}
