import { useState, useEffect } from 'react'

declare global {
  interface Window {
    __$$GLOBAL_STATE_: {
      [key: string]: object
    }
  }
}

// Prepare for debug tools
window.__$$GLOBAL_STATE_ = {}

type Listener = () => void

export class Container<State extends object = {}> {
  namespace: string

  state: Readonly<State>
  _listeners: Listener[] = []

  _attachToGlobal() {
    window.__$$GLOBAL_STATE_[this.namespace] = this.state
  }

  _subscribe(fn: Listener) {
    this._listeners.push(fn)
  }

  _unsubscribe(fn: Listener) {
    const listeners = this._listeners
    listeners.splice(listeners.indexOf(fn), 1)
  }

  setState<K extends keyof State>(
    state: ((prevState: Readonly<State>) => Pick<State, K> | State | null) | (Pick<State, K> | State | null),
    callback?: () => void
  ) {
    return Promise.resolve().then(() => {
      let nextState: Pick<State, K> | State | null

      if (typeof state === 'function') {
        nextState = (state as Function)(this.state)
      } else {
        nextState = state
      }

      if (nextState == null) {
        if (callback) callback()
        return
      }

      this.state = Object.assign(
        {},
        this.state,
        nextState
      )

      const promises = this._listeners
        .map(listener => listener())

      return Promise
        .all(promises)
        .then(() => {
          if (callback) {
            return callback()
          }
        })
    })
  }
}

/**
 * 注入一个全局 Container
 * @param containerInstance 全局 container 实例
 */
export function useGlobalContainer<T extends Container>(containerInstance: T) {
  const forceUpdate = useState(null)[1]

  useEffect(() => {
    const listener = () => forceUpdate(null)
    containerInstance._subscribe(listener)

    return () => containerInstance._unsubscribe(listener)
  }, [])

  return containerInstance
}
