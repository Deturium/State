import React from 'react'
import produce from 'immer'

export * from 'immer'

export default function Store<S, R>(store: S, reduces: R) {

  const { Provider, Consumer } = React.createContext<S>(store)

  const subscribeList: Function[] = []


  const Put = (action: keyof R, payload?: any) => {
    const updator = reduces[action]

    if (updator && typeof updator === 'function') {
      const nextStore = produce<S>(store, draft => { updator(draft, payload) })

      if (nextStore !== store) {
        subscribeList.forEach(fn => fn())
        store = nextStore
      }
    }
  }


  class _MyProvider extends React.PureComponent {
    componentDidMount() {
      subscribeList.push(this.reRender)
    }

    componentWillUnmount() {
      subscribeList.splice(subscribeList.indexOf(this.reRender), 1)
    }

    reRender = () => {
      this.forceUpdate()
    }

    render() {
      return <Provider value={store}>{this.props.children}</Provider>
    }
  }

  const MyProvider: React.ComponentType = _MyProvider


  return {
    Provider: MyProvider,

    Consumer,

    Put,
  }

}


