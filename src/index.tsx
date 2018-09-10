import React from 'react'
import produce from 'immer'

type Listener = () => void
type ContainerConstructor = { new(): Container }
type ContainerMap = Map<ContainerConstructor, Container>

const CTX = React.createContext<ContainerMap>(new Map);

class Container<State = {}> {
  state: State
  _listeners: Listener[] = []

  put(action: string, payload?: any) {

    const updator = (this as any)[action]

    this.state = produce(this.state, draft => {
      updator(draft, payload)
    })

    this._listeners.forEach(listener => listener())
  }

  __subscribe(fn: Listener) {
    this._listeners.push(fn)
  }

  __unsubscribe(fn: Listener) {
    this._listeners = this._listeners.filter(f => f !== fn)
  }

}


class _Subscribe extends React.PureComponent<{
  instances: Container[]
  children: (...containers: Container[]) => React.ReactNode
}> {

  componentDidMount() {
    this.props.instances.forEach(instance => instance.__subscribe(this.reRender))
  }

  componentWillUnmount() {
    this.props.instances.forEach(instance => instance.__unsubscribe(this.reRender))
  }

  reRender = () => {
    this.forceUpdate()
  }

  render() {
    return this.props.children.apply(null, this.props.instances)
  }
}


const createInstances = (map: ContainerMap, containers:  (Container | ContainerConstructor)[]) => {
  if (map === null) {
    throw new Error(
      'You must wrap your <Subscribe> components with a <Provider>'
    );
  }

  return containers.map(containerItem => {
    let instance

    if (
      typeof containerItem === 'object' &&
      containerItem instanceof Container
    ) {
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
  to: (Container | ContainerConstructor)[]
  children: (...containers: Container[]) => React.ReactNode
}> = ({to, children}) => {
  return (
    <CTX.Consumer>
      {map => <_Subscribe
        instances={createInstances(map, to)}
      >
        {children}
      </_Subscribe>}
    </CTX.Consumer>
  )
}


const Provider: React.SFC<{
  inject?: Container[]
}> = ({inject, children}) => {
  return (
    <CTX.Consumer>
      {parentMap => {
        const childMap = new Map(parentMap)

        if (inject) {
          inject.forEach(instance => {
            childMap.set(instance.constructor as ContainerConstructor, instance)
          })
        }

        return (
          <CTX.Provider value={childMap}>
            {children}
          </CTX.Provider>
        )
      }}
    </CTX.Consumer>
  )
}


export {
  Container,

  Subscribe,

  Provider,
}
