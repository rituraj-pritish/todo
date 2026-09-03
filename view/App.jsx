import { Suspense, useState } from "react"

import Count from './Count'

export default () => {
  const [count, setCount] = useState(5)

  const increase = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        setCount(c => c + 1)
      }, 300)
    })
  }

  const decrease = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        setCount(c => c - 1)
      }, 300)
    })
  }

  const promise = new Promise(resolve => {
    setTimeout(() => resolve(count), 300)
  })

  return (
    <>
      Count:{' '} 
      <h6>
        <Suspense fallback='--'>
          <Count promise={promise}/>
        </Suspense>
      </h6>
      <button onClick={decrease}>Decrease</button>
      <button onClick={increase}>Increase</button>
    </>
    )
}