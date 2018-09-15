import React from 'react'
import produce, { Draft } from 'immer'

type Listener = () => void
type ContainerType = { new (...args: any[]): Container }
type ContainerMap = Map<ContainerType, Container>

const MAP = React.createContext<ContainerMap>(new Map())

class Container<State = any> {
  state: State
  _listeners: Listener[] = []

  put(producer: (state: Draft<State>) => void) {
    const nextState = produce(this.state, draft => {
      producer(draft)
    })

    if (this.state !== nextState) {
      this.state = nextState
      this._listeners.forEach(listener => listener())
    }
  }

  _subscribe(fn: Listener) {
    this._listeners.push(fn)
  }

  _unsubscribe(fn: Listener) {
    const listeners = this._listeners
    listeners.splice(listeners.indexOf(fn), 1)
  }
}


class Ctx extends React.PureComponent<{
  instances: Container[]
  children: (...containers: Container[]) => React.ReactNode
}> {

  componentDidMount() {
    this.props.instances.forEach(instance => instance._subscribe(this.reRender))
  }

  componentWillUnmount() {
    this.props.instances.forEach(instance => instance._unsubscribe(this.reRender))
  }

  reRender = () => {
    this.forceUpdate()
  }

  render() {
    return this.props.children.apply(null, this.props.instances)
  }
}


const createInstances = (map: ContainerMap, containers:  (Container | ContainerType)[]) => {
  if (map === null) {
    throw new Error(
      'You must wrap your <Subscribe> components with a <Prodiver>'
    )
  }

  return containers.map(containerItem => {
    let instance

    if (containerItem instanceof Container) {
      instance = containerItem

    } else {
      instance = map.get(containerItem)

      if (!instance) {
        instance = new containerItem()
        map.set(containerItem, instance)
      }
    }

    return instance
  })
}


const Subscribe: React.SFC<{
  to: (Container | ContainerType)[]
  children: (...instances: Container[]) => React.ReactNode
}> = ({to, children}) => {
  return (
    <MAP.Consumer>
      {map => <Ctx
        instances={createInstances(map, to)}
      >
        {children}
      </Ctx>}
    </MAP.Consumer>
  )
}


const Provider: React.SFC<{
  inject?: Container[]
  children: React.ReactNode
}> = ({inject, children}) => {
  return (
    <MAP.Consumer>
      {map => {
        const childMap = new Map(map)

        if (inject) {
          inject.forEach(instance => {
            childMap.set(instance.constructor as ContainerType, instance)
          })
        }

        return (
          <MAP.Provider value={childMap}>
            {children}
          </MAP.Provider>
        )
      }}
    </MAP.Consumer>
  )
}


export {
  Container,

  Subscribe,

  Provider,
}
