import { Suspense } from "react"

const Count = async ({count}) => {
  return <h5>{count}</h5>
}

export default () => {
  const increase = () => {}
  const decrease = () => {}

  return (
    <>
      Count:{' '} 
      <Suspense fallback='--'>
        <Count/>
      </Suspense>
      <button onClick={increase}>Increase</button>
      <button onClick={decrease}>Decrease</button>
    </>
    )
}