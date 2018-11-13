import React from 'react'
import { Container, useGlobalContainer } from '../src/index'

interface State {
  count: number
}

class GlobalContainer extends Container<State> {
  namespace = 'counter'

  state: State = {
    count: 0,
  }

  constructor() {
    super()
    this._attachToGlobal()
  }

  // recommemd use arrow function
  ADD = () => {
    this.state.count += 1
  }

  SUB = () => {
    this.state.count -= 1
  }

  // function should be curry
  ADD_N = (n: number) => () => {
    this.state.count += n
  }
}


const counterInstance = new GlobalContainer()

function Counter1() {
  const counter = useGlobalContainer(counterInstance)

  return (
    <>
      <p>{counter.state.count}</p>
      <button onClick={() => { counter.updator(counter.ADD) }}>+1</button>
      <button onClick={() => { counter.updator(counter.SUB) }}>+2</button>
    </>
  )
}

function Counter2() {
  const counter = useGlobalContainer(counterInstance)

  function sub2() {
    this.state.count -= 2
  }

  return (
    <>
      <p>{counter.state.count}</p>
      <button onClick={() => { counter.updator(counter.ADD_N(2)) }}>+2</button>
      <button onClick={() => { counter.updator(counter.ADD_N(10), false) }}>+10 without notify</button>

      {/* dark magic, think twice before hack */}
      <button onClick={() => { counter.updator(sub2.bind(counter)) }}>-2</button>
    </>
  )
}


export default function() {
  return (
    <>
      <h2>Counter 1</h2>
      <Counter1></Counter1>

      <h2>Counter 2 use same Container</h2>
      <Counter2></Counter2>
    </>
  )
}
