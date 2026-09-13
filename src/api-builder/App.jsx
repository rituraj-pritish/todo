import { createContext, createElement, useContext, useEffect, useState } from "react"

import ErrorBoundary from "../error-boundary"

// https://tailwindcss.com/docs/detecting-classes-in-source-files#dynamic-class-names

const Input = (props) => {
  return (
    <input {...props} 
      className="px-2 border rounded-sm border-blue-300"
    />
  )
}

const Form = (props) => {
  return (
    <form 
      {...props}
      className={'p-2 border-2 rounded-sm border-dashed border-orange-300'}
    />
  )
}

const Button = props => {
  return (
    <button 
      {...props} 
      className={'cursor-pointer border rounded-sm border-red-300'} 
    />
  )
}

const INITIAL_CONTEXT_VALUE = {
  component: {
    name: '',
    dom: {

    },
    endpoint: {

    }
  },
  selectionIdentifier: null
}

const ComponentContext = createContext(INITIAL_CONTEXT_VALUE)

const ComponentProvider = ({children}) => {
  const [value, setValue] = useState(INITIAL_CONTEXT_VALUE)

  const {
    dom,
    endpoint
  } = value

  const setSelectionIdentifier = (identifier) => {
    setValue(prevValue => ({
      ...prevValue,
      selectionIdentifier: identifier
    }))
  }

  return (
    <ComponentContext value={{
      dom,
      endpoint,
      updateDom: updatedDomCb => {
        setValue(prevValue => ({
          ...prevValue,
          dom: updatedDomCb(prevValue)
        }))
      },
      updateEndpoint: updatedEndpoint => {
        setValue(prevValue => ({
          ...prevValue,
          endpoint: updatedEndpoint
        }))
      },
      setSelectionIdentifier
    }}>
      {children}
    </ComponentContext>
  )
}

const UpdateDom = () => {
  const {updateDom} = useContext(ComponentContext)

  const add = (type) => {
    updateDom(prevDom => {
      if(type === 'save') {
        return {
          ...prevDom,
          node: {
            'form': {
              
            }
          }
        }
      }
    })
  }

  const button = 'cursor-pointer px-4 py-2 border-2 border-dotted rounded-l'

  return (
    <div className="grid grid-flow-col gap-4">
      <button className={`${button} border-blue-500`} onClick={() => add('save')}>save data</button>
      <button className={`${button} border-green-500`} onClick={() => add('retreive')}>retreive data</button>
    </div>
  )
}

const Dom = () => {
  const {dom} = useContext(ComponentContext)

  if(!dom) return null

  const {node, props, children} = dom

  const createNode = (nodeConfig) => {
    let element
    switch(Object.keys(nodeConfig)[0]) {
      case 'form':
        element = Form
        break;
    }

    return element
  }

  return (
    <div className="border p-2">
     {createElement(
      createNode(node), props, children
     )}
    </div>
  )
}

export default () => {
  // add only in dev version
  useEffect(() => {
    const eventSource = new EventSource('/api/re-load')
    eventSource.onmessage = () => {
      window.location.reload()
    }
    
    eventSource.onerror = err => {
      // debug ERR_INCOMPLETE_CHUNKED_ENCODING error
      setTimeout(() => {
        window.location.reload()
      }, 300)
    }
  }, [])

  return (
    <ErrorBoundary>
      <ComponentProvider>
        <section>
          <div className="p-2" style={{height: '50vh'}}>
            <UpdateDom/>
          </div>
          <hr/>
          <div className="p-2" style={{height: '50vh'}}>
            <Dom/>
          </div>
        </section>
      </ComponentProvider>
    </ErrorBoundary>
  )
}