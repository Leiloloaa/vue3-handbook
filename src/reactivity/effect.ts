let activeEffect
class ActiveEffect {
  private _fn: any
  constructor(fn) {
    activeEffect = this
    this._fn = fn
  }
  run() {
    this._fn()
  }
}

export function effect(fn) {
  const _effect = new ActiveEffect(fn)
  _effect.run()
}

// 创建一个全局变量
const targetsMap = new WeakMap()
export function track(target, key) {
  // 存储结构 {} => { {}:[] } 两个 map + 一个 set
  // 首先需要取值，如果没有就要初始化
  let depMaps = targetsMap.get(target)
  if (!depMaps) {
    depMaps = new Map()
    targetsMap.set(target, depMaps)
  }
  let dep = depMaps.get(key)
  if (!dep) {
    dep = new Set()
    depMaps.set(key, dep)
  }
  // 收集 fn，从哪里来？？？
  // effect 中的 run 函数中 fn
  // 定义一个全局变量
  dep.add(activeEffect)
}

export function trigger(target, key) {
  let depsMap = targetsMap.get(target)
  let dep = depsMap.get(key)
  for (const effect of dep) {
    effect.run()
  }
}