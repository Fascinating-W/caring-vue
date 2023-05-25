/*
 * @Author: Wanko
 * @Date: 2023-05-25 17:07:29
 * @LastEditors: Wanko
 * @LastEditTime: 2023-05-25 18:23:31
 * @Description: 调度队列
 */

// 状态
let isFlushPending = false

// 队列数组，存放执行函数
const pendingPreFlushCbs: Function[] = []

// 异步任务队列

const resolvedPromise = Promise.resolve() as Promise<any>

// 当前的执行任务

let currentFlushPromise: Promise<void> | null = null

export function queuePreFlushCb(cb: Function) {
  queueCb(cb, pendingPreFlushCbs)
}

// 一个cb就是一个任务
function queueCb(cb: Function, pendingQueue: Function[]) {
  // 将任务放到队列里
  pendingQueue.push(cb)
  queueFlush()
}

/**
 * @Description: 依次执行队列中的执行函数，只有isFlushPending为false时才执行
 * @return {*}
 */
function queueFlush() {
  if (!isFlushPending) {
    isFlushPending = true
    // 把任务队列中的任务丢到微任务队列中，避免通过主线任务执行，丢到微任务的目的就是为了控制执行规则
    currentFlushPromise = resolvedPromise.then(flushJobs)
  }
}

/**
 * @Description: 真正处理队列的函数
 * @return {*}
 */

function flushJobs() {
  // 开始处理队列 不再是等待状态
  isFlushPending = false
  flushPreFlushCbs()
}

/**
 * @Description: 循环处理队列
 * @return {*}
 */

export function flushPreFlushCbs() {
  if (pendingPreFlushCbs.length) {
    // 去重浅拷贝
    let activePreFlushCbs = [...new Set(pendingPreFlushCbs)]
    pendingPreFlushCbs.length = 0
    for (let i = 0; i < activePreFlushCbs.length; i++) {
      activePreFlushCbs[i]()
    }
  }
}
