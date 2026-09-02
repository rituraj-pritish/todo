import { useState } from "react"

export default () => {
  const [count, setCount] = useState(0)

  return (
    <>
      <span>Count: {count}</span>
      <button onClick={() => setCount(c => c - 1)}>Decrease</button>
      <button onClick={() => setCount(c => c + 1)}>Increase</button>
    </>
  )
}