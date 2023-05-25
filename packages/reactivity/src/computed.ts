/*
 * @Author: Wanko
 * @Date: 2023-05-24 16:08:51
 * @LastEditors: Wanko
 * @LastEditTime: 2023-05-24 16:38:09
 * @Description:
 */
import { isFunction } from '@vue/shared'
import { Dep } from './dep'
import { ReactiveEffect } from './effect'
import { trackRefValue, triggerRefValue } from './ref'
export function computed(getterOrOptions) {
  let getter

  const onlyGetter = isFunction(getterOrOptions)

  // * 如果传进来的是一个函数
  if (onlyGetter) {
    getter = getterOrOptions
  }

  const cRef = new ComputedRefImpl(getter)
  return cRef
}

export class ComputedRefImpl<T> {
  // 用于依赖收集
  public dep?: Dep = undefined
  // _value! 必然存在的
  private _value!: T
  public readonly effect: ReactiveEffect<T>
  public readonly __v_isRef = true
  // 默认是脏数据，需要重新执行调度器
  public _dirty = true
  constructor(getters) {
    this.effect = new ReactiveEffect(getters, () => {
      if (!this._dirty) {
        this._dirty = true
        triggerRefValue(this)
      }
    })
    this.effect.computed = this
  }

  get value() {
    trackRefValue(this)
    if (this._dirty) {
      this._dirty = false
      this._value = this.effect.run()
    }
    return this._value
  }
}
