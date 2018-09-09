import React from 'react'
import Store, { Draft } from '../src'

const initStore = {
  cnt: 1,
  obj: { count: 10 }
}

type S = typeof initStore

const reducers = {
  'ADD': (state: Draft<S>, payload: number) => { state.cnt += payload },
  'SUB': (state: Draft<S>) => { state.obj.count -= 1 },
}

const { Provider, Consumer, Put } = Store(initStore, reducers)

class Count extends React.Component<{
  name: string, value: number
}> {

  componentDidUpdate() {
    console.log(`Update ${this.props.name} to ${this.props.value}`)
  }

  render() {
    return <p>{`Hello, ${this.props.name} is ${this.props.value}`}</p>
  }
}

const Hello: React.SFC = () => <Provider>
  <Consumer>
    {(state: S) => <Count name="cnt" value={state.cnt}/>}
  </Consumer>

  <Consumer>
    {(state: S) => <Count name="obj.count" value={state.obj.count}/>}
  </Consumer>

  <button onClick={() => Put('ADD', 1)}>+</button>
  <button onClick={() => Put('SUB')}>-</button>
</Provider>

export default Hello
