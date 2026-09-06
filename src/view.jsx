import { startTransition, useActionState, useEffect } from "react"
import { createRoot } from "react-dom/client"

import './view.css'

const INITIAL_STATE = 3
const ACTION_TYPES = {
    GET: 'GET',
    INCREASE: 'INCREASE',
    DECREASE: 'DECREASE'
}

const reducerAction = async (prevState, actionPayload) => {
    switch(actionPayload.type) {
        case ACTION_TYPES.GET: {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(prevState)
                }, 1000);
            })
            break
        }
        case ACTION_TYPES.INCREASE: {
            return new Promise(resolve => {
                setTimeout(() => resolve(prevState + 1), 1000)
            })
            break
        }

        case ACTION_TYPES.DECREASE: {
            return prevState - 1
            break
        }

        default:
            throw new Error('action type not defined')
    }
}

const App = () => {
    const [state, dispatchAction, isPending] = useActionState(reducerAction, INITIAL_STATE)
    useEffect(() => {
         startTransition(() => {
            dispatchAction({type: ACTION_TYPES.GET})
        })
    }, [])

    const increase = () => {
        startTransition(() => {
            dispatchAction({type: ACTION_TYPES.INCREASE})
        })
    }

    const decrease = () => {
        dispatchAction({type: ACTION_TYPES.DECREASE})
    }

    return (
        <div>
            <button onClick={decrease}>Decrease</button>
            <span>Count: {isPending ? '--' : state}</span>
            <button onClick={increase}>Increase</button>
        </div>
    )
}

const rootEl = document.getElementById('root')
const root = createRoot(rootEl)
rootEl.classList.add('rendered')
root.render(<App/>)