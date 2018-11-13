import React from 'react'
import { Container, useGlobalContainer } from '../src/index'

interface State {
  count: number
}

class CounterContainer extends Container<State> {
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

  SUB_ASYNC = async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 500)
    })
    this.state.count -= 1
  }

  // function should be curry
  ADD_N = (n: number) => () => {
    this.state.count += n

    if (n >= 10) {
      // return false to prevent broadcast mutation
      return false
    }
  }
}


const counterInstance = new CounterContainer()

function Counter1() {
  const counter = useGlobalContainer(counterInstance)

  return (
    <>
      <p>{counter.state.count}</p>
      <button onClick={ counter.updator(counter.ADD) }>+1</button>
      <button onClick={ counter.updator(counter.SUB_ASYNC) }>-1</button>
    </>
  )
}

function Counter2() {
  const counter = useGlobalContainer(counterInstance)
  const { state, updator, ADD_N } = counter

  function sub2() {
    this.state.count -= 2
  }

  return (
    <>
      <p>{state.count}</p>
      <button onClick={ updator(ADD_N(2)) }>+2</button>
      <button onClick={ updator(ADD_N(10)) }>+10 without notify</button>

      {/* dark magic, think twice if your name is not Hydrogen */}
      <button onClick={ updator(sub2.bind(counter)) }>-2</button>
    </>
  )
}


export default function() {
  // let's update counter
  counterInstance.update(counterInstance.ADD_N(5))

  return (
    <>
      <h2>Counter 1</h2>
      <Counter1></Counter1>

      <h2>Counter 2</h2>
      <Counter2></Counter2>
    </>
  )
}
