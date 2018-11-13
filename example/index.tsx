import React from 'react'
import ReactDOM from 'react-dom'

import Counter from './Counter'

const App = () => <>
  <Counter />
</>


ReactDOM.render(
  <App />,
  document.getElementById('root')
)
