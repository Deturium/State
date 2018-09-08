import React from 'react'
import produce from 'immer'

export * from 'immer'

// utils
function identity<T = any>(identity: T) {
  return identity
}

function shallowEqual(objA: any, objB: any) {
  if (objA === objB) {
    return true
  }

  if (typeof objA !== "object" || typeof objB !== "object") {
    return false
  }

  const keysA = Object.keys(objA)

  for (let idx = 0; idx < keysA.length; idx++) {
    let key = keysA[idx]

    if (objA[key] !== objB[key]) {
      return false
    }
  }

  return true
}


export default function init<T, S>(initStore: T, reducers: S) {

  let _store = initStore

  function createSubscribe() {
    const listenerList: any = []

    return {
      listen: (listener: Function) => {
        listenerList.push(listener)
      },

      unListen: (listener: Function) => {
        listenerList.splice(listenerList.indexOf(listener), 1)
      },

      update: (action: keyof S) => {
        const updator = reducers[action]

        if (updator && typeof updator === 'function') {

          const nextStore = produce<T>(_store, draft => { updator(draft) })

          if (_store !== nextStore) {

            for (let i = 0; i < listenerList.length; i++) {
              listenerList[i](nextStore, _store)
            }

            _store = nextStore
          }

        } else {

          console.error(`reducers[${action}] is not a function`)

        }
      },
    }
  }

  const { listen, unListen, update } = createSubscribe()


  class Provider extends React.PureComponent<{
    selector?: (store: T) => any
  }> {

    componentDidMount() {
      listen(this.reRender)
    }

    componentWillUnmount() {
      unListen(this.reRender)
    }

    reRender = (nextStore: T, prevStore: T) => {
      const selector = this.props.selector

      if (!(selector && shallowEqual(selector(nextStore), selector(prevStore)))) {
        // force update
        this.forceUpdate()
      }
    }

    render() {
      const selector = this.props.selector || identity

      return (this.props.children as (props: any) => React.ReactNode)(selector(_store))
    }
  }

  const Ctx: React.SFC<{
    selector?: (store: T) => any
  }> = (props) => <Provider selector={props.selector}>{props.children}</Provider>

  return {
    Ctx,

    Put: update,

    Store: () => _store
  }
}
