import { startTransition, useActionState, useEffect, useRef } from "react"
import { createRoot } from "react-dom/client"

import ErrorBoundary from './error-boundary'

import './view.css'

const INITIAL_STATE = []
const ACTION_TYPES = {
    GET: 'GET',
    ADD: 'ADD',
    DELETE: 'DELETE',
    COMPLETE: 'COMPLETE'
}

const reducerAction = async (prevState, actionPayload) => {
    switch(actionPayload.type) {
        case ACTION_TYPES.GET: {
            // return new Promise(async (resolve, reject) => {
            //     const res = await fetch('/api/todos')
            //     if(!res.ok) {
            //         const error = (await res.json()).error
            //         reject(error)
            //     } else {
            //         const todos = (await res.json()).data
            //         resolve(todos)
            //     }
            // })
            const res = await fetch('/api/todos')
            const todos = (await res.json()).data
            console.log('data', todos)
            return todos

            break
        }

        case ACTION_TYPES.ADD: {
            await fetch('/api/todos', {
                method: 'post',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    title: actionPayload.title
                })
            })
            break
        }

        case ACTION_TYPES.DELETE: {
            await fetch(`/api/todos/${actionPayload.id}`, {
                method: 'delete'
            })
            break
        }

        case ACTION_TYPES.COMPLETE: {
            await fetch(`/api/todos/${actionPayload.id}`, {
                method: 'put'
            })
        }

        default:
            throw new Error('action type not defined')
    }
}

const App = () => {
    const [state, dispatchAction, isPending] = useActionState(reducerAction, INITIAL_STATE)
    const inputRef = useRef()

    useEffect(() => {
         startTransition(() => {
            dispatchAction({type: ACTION_TYPES.GET})
        })
    }, [])

    const add = () => {
        startTransition(() => {
            dispatchAction({type: ACTION_TYPES.ADD, title: inputRef.current.value})
        })
    }

    const complete = (id) => {
        dispatchAction({type: ACTION_TYPES.COMPLETE, id})
    }

    const remove = (id) => {
        dispatchAction({type: ACTION_TYPES.DELETE, id})
    }

    console.log('sta', state, isPending)
    return (
        <>
            {
                isPending
                    ?   state.todos.map(todo => {
                        return (
                            <div>
                                <h5>{todo.title}</h5>
                                <button onClick={() => complete(todo.id)}>Complete</button>
                                <button onClick={() => remove(todo.id)}>Delete</button>
                            </div>
                        )
                    }) : 'loading...'
            }
            <input type='text' placeholder='Add new' ref={inputRef}/>
            <button onClick={add}>Add</button>
        </>
    )
}

const rootEl = document.getElementById('root')
const root = createRoot(rootEl)
rootEl.classList.add('rendered')
root.render(
    <ErrorBoundary>
        <App/>
    </ErrorBoundary>
)