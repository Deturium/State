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

  // recommemd use arrow function
  ADD = () => {
    this.setState(state => ({
      count: state.count + 1
    }))
  }

  SUB_ASYNC = async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 500)
    })
    this.setState(state => ({
      count: state.count - 1
    }))
  }

  // function should be curry
  SET_N = (count: number) => () => {
    this.setState({
      count
    },
    // callback after state change
    () => {
      console.log(`[AFTER SET_${count}] couter is ${this.state.count}`)
    })
  }
}


const counterInstance = new CounterContainer()
counterInstance._attachToGlobal()


function Counter1() {
  const counter = useGlobalContainer(counterInstance)

  return (
    <>
      <p>{counter.state.count}</p>
      <button onClick={ counter.ADD }>+1</button>
      <button onClick={ counter.SUB_ASYNC }>-1</button>
    </>
  )
}

function Counter2() {
  const counter = useGlobalContainer(counterInstance)
  const { state, ADD, SET_N } = counter

  return (
    <>
      <p>{state.count}</p>
      <button onClick={ ADD }>+1</button>
      <button onClick={ SET_N(10) }>10</button>
    </>
  )
}


export default function() {
  // let's update counter
  counterInstance.SET_N(5)

  return (
    <>
      <h2>Counter 1</h2>
      <Counter1></Counter1>

      <h2>Counter 2</h2>
      <Counter2></Counter2>
    </>
  )
}
