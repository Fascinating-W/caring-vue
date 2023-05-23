/*
 * @Author: Wanko
 * @Date: 2023-05-22 19:07:40
 * @LastEditors: Wanko
 * @LastEditTime: 2023-05-22 19:53:11
 * @Description:
 */
import { hasChanged } from '@vue/shared'
import { Dep, createDep } from './dep'
import { activeEffect, trackEffects, triggerEffects } from './effect'
import { toReactive } from './reactive'
export interface Ref<T = any> {
  value: T
}

export function ref(value?: unknown) {
  return createRef(value, false)
}

function createRef(rawValue: unknown, shallow: boolean) {
  if (isRef(rawValue)) {
    return rawValue
  }

  return new RefImpl(rawValue, shallow)
}

export function isRef(r: any): r is Ref {
  // 转为boolean值
  return !!(r && r.__v_isRef === true)
}

/**
 * @Description: 收集ref依赖
 * @param {*} ref
 * @return {*}
 */
export function trackRefValue(ref) {
  if (activeEffect) {
    trackEffects(ref.dep || (ref.dep = createDep()))
  }
}

/**
 * @Description: 触发ref依赖
 * @param {*} ref
 * @return {*}
 */
export function triggerRefValue(ref) {
  if (ref.dep) {
    triggerEffects(ref.dep)
  }
}

class RefImpl<T> {
  private _value: T
  // 传递给ref的原始值
  private _rawValue: T
  public dep?: Dep = undefined

  public readonly __v_isRef = true
  constructor(value: T, public readonly __v_isShallow: boolean) {
    this._rawValue = value
    // 如果是引用类型数据，_value是一个proxy的实例
    this._value = __v_isShallow ? value : toReactive(value)
  }

  get value() {
    trackRefValue(this)
    return this._value
  }

  set value(newVal) {
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal
      this._value = toReactive(newVal)
      triggerRefValue(this)
    }
  }
}
