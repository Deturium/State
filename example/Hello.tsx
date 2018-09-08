import React from 'react'
import init, { Draft } from '../src'

const initStore = {
  cnt: 1,
  obj: { count: 10 }
}

type S = typeof initStore

const reducers = {
  'ADD': (state: Draft<S>) => { state.cnt += 1 },
  'SUB': (state: Draft<S>) => { state.obj.count -= 1 },
}

const { Ctx, Put } = init(initStore, reducers)

class Count extends React.Component<{
  name: string, value: number
}> {

  componentDidUpdate() {
    const { name, value } = this.props
    console.log(`Update ${name} to ${value}`)
  }

  render() {
    const { name, value } = this.props
    return <p>{`Hello, ${name} is ${value}`}</p>
  }
}

const Hello: React.SFC = () => <>
  <Ctx>
    {(state: S) => <Count name="cnt" value={state.cnt}/>}
  </Ctx>

  <Ctx selector={(state: S) => ({count: state.obj.count})}>
    {(state: { count: number }) => <Count name="obj.count" value={state.count}/>}
  </Ctx>

  <button onClick={() => Put('ADD')}>+</button>
  <button onClick={() => Put('SUB')}>-</button>
</>

export default Hello
