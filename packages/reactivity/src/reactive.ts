/*
 * @Author: Wanko
 * @Date: 2023-05-22 10:41:29
 * @LastEditors: Wanko
 * @LastEditTime: 2023-05-22 19:45:35
 * @Description:
 */
import { isObject } from '@vue/shared'
import { mutableHandlers } from './baseHandlers'

/**
 * @Description: 响应性map缓存proxy对象
 * @return {*}
 */
export const reactiveMap = new WeakMap<object, any>()

/**
 * @Description: 为复杂数据类型，创建响应性对象
 * @param {object} target 被代理对象
 * @return {funcion} 代理对象创建函数
 */
export function reactive(target: object) {
  return createReactiveObject(target, mutableHandlers, reactiveMap)
}

/**
 * @Description: 创建响应式对象
 * @param {object} target 被代理对象
 * @param {ProxyHandler} baseHandlers proxy的第二个参数
 * @param {WeakMap} proxyMap 缓存proxy实例的map
 * @return {proxy}  返回proxy实例
 */
function createReactiveObject(
  target: object,
  baseHandlers: ProxyHandler<any>,
  proxyMap: WeakMap<object, any>
) {
  // 从缓存里获取proxy
  const existingProxy = proxyMap.get(target)
  if (existingProxy) {
    return existingProxy
  }

  const proxy = new Proxy(target, baseHandlers)

  proxyMap.set(target, proxy)

  return proxy
}

/**
 * @Description: 判断是否是一个引用类型数据
 * @param {*} T 传递的参数是什么类型，返回的参数就是什么类型
 * @return {*}
 */
export const toReactive = <T extends unknown>(value: T): T => {
  return isObject(value) ? reactive(value as object) : value
}
