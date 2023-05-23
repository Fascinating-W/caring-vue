import { track, trigger } from './effect'

const get = createGetter()

/**
 * @Description: 闭包函数
 * @return {*}
 */
function createGetter() {
  return function get(target: Object, key: string | symbol, receiver: object) {
    const res = Reflect.get(target, key, receiver)
    // 依赖收集
    track(target, key)
    return res
  }
}

const set = createSetter()

/**
 * @Description: 闭包函数
 * @return {*}
 */
function createSetter() {
  return function set(
    target: Object,
    key: string | symbol,
    value: unknown,
    receiver: object
  ) {
    const res = Reflect.set(target, key, value, receiver)

    // 触发依赖
    trigger(target, key, value)
    return res
  }
}

export const mutableHandlers: ProxyHandler<object> = {
  get,
  set
}
