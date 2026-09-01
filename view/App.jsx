import { useState } from "react"

export default () => {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>Count: {count}</div>
      <button onClick={() => setCount(c => c - 1)}>Decrease</button>
      <button onClick={() => setCount(c => c + 1)}>Increase</button>
    </>
  )
}