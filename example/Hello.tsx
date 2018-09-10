import React from 'react'
import { Container, Provider, Subscribe } from '../src'

const initState = {
  count: 1,
  obj: { cnt: 2 },
}

type State = typeof initState

class CounterContainer extends Container<State> {
  state = initState

  constructor() {
    super()
    this.put = super.put.bind(this)
  }

  ADD(state, payload) {
    state.count += payload
  }

  SUB(state) {
    state.obj.cnt -= 1
  }
}

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
  <Subscribe to={[CounterContainer]}>
    {({state, put}) => <>
      <Count name="cnt" value={(state as State).count}/>
      <Count name="obj.count" value={(state as State).obj.cnt}/>
      <button onClick={() => put('ADD', 1)}>+</button>
      <button onClick={() => put('SUB')}>-</button>
    </>}
  </Subscribe>
</Provider>

export default Hello
