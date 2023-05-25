/*
 * @Author: Wanko
 * @Date: 2023-05-16 16:23:10
 * @LastEditors: Wanko
 * @LastEditTime: 2023-05-25 17:00:06
 * @Description:
 */
/**
 * 判断是否为一个数组
 */
export const isArray = Array.isArray

export const isObject = (val: unknown) => {
  return val !== null && typeof val === 'object'
}

/**
 * @Description: 对比两个数据是否发生改变，不一致则表示发生改变
 * @param {any} value
 * @param {any} oldValue
 * @return {*}
 */
export const hasChanged = (value: any, oldValue: any): boolean =>
  !Object.is(value, oldValue)

/**
 * @Description:
 * @return {*}
 */
export const isFunction = (val: unknown): val is Function => {
  return typeof val === 'function'
}

export const extend = Object.assign

/**
 * @Description: 只读的空对象
 * @return {*}
 */

export const EMPTY_OBJ: { readonly [key: string]: any } = {}
