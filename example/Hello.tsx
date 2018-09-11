import React from 'react'
import { Container, Provider, Subscribe } from '../src'

interface State {
  count: number
  obj: { cnt: number }
}

class CounterContainer extends Container<State> {
  state = {
    count: 1,
    obj: { cnt: 2 },
  }

  ADD(count: number) {
    this.put(state => {
      state.count += count
    })
  }

  SUB() {
    this.put(state => {
      state.obj.cnt -= 1
    })
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
    {(Counter: CounterContainer) => <>
      <Count name="cnt" value={Counter.state.count}/>
      <Count name="obj.count" value={Counter.state.obj.cnt}/>

      <button onClick={() => Counter.ADD(1)}>+</button>
      <button onClick={() => Counter.SUB()}>-</button>
    </>}
  </Subscribe>

</Provider>

export default Hello
