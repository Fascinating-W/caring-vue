/*
 * @Author: Wanko
 * @Date: 2023-05-16 16:23:10
 * @LastEditors: Wanko
 * @LastEditTime: 2023-05-22 19:42:05
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
