import { createContext, createElement, useContext, useEffect, useState } from "react"

import ErrorBoundary from "../error-boundary"

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

const generateJSX = (Component, props, ...children) => {
  // remove local event handlers
  return `
    <${Component.name} ${Object.entries(props).map(([key, value]) => `${key}=${value}`).join(' ')}>
      ${children.length > 1 ? children.map((childArgs) => {
        return generateJSX(...childArgs)
      }).join('') : children}
    </${Component.name}>
  `
}

const INITIAL_CONTEXT_VALUE = {
  args: [
         Form, 
      {
        key: 'Form',
        identifier: 'Form'
      },
       [Input,
          {
            key: 'Form.Input',
            identifier: 'Form.Input'
          }],
      [Button,
      {
        key: 'Form.Button',
        identifier: 'Form.Button'
      },
      'Btn Text']
  ],
  selectionIdentifier: null
}

const ComponentContext = createContext(INITIAL_CONTEXT_VALUE)

const ComponentProvider = ({children}) => {
  const [value, setValue] = useState(INITIAL_CONTEXT_VALUE)

  const setSelectionIdentifier = (identifier) => {
    setValue(prevValue => ({
      ...prevValue,
      selectionIdentifier: identifier
    }))
  }

  return (
    <ComponentContext value={{
      ...value,
      setSelectionIdentifier
    }}>
      {children}
    </ComponentContext>
  )
}

  const BasicElements = () => {
    return (
       <div className="grid grid-cols-auto grid-flow-col  gap-4">
      <Button 
        className={'hover:bg-orange-100 px-6 py-2 border-2 rounded-sm border-orange-300 text-orange-300'}
        onClick={() => add('form')}
      >
        Form
      </Button>
            <Button 
        className={'hover:bg-green-100 px-6 py-2 border-2 rounded-sm border-green-300 text-green-300'}
        onClick={() => add('data')}
      >
        Data
      </Button>
      </div>
    )
  }

    const FormElements = () => {
    return (
       <div className="grid grid-cols-auto grid-flow-col  gap-4">
      <Button 
        className={'hover:bg-blue-100 px-6 py-2 border-2 rounded-sm border-blue-300 text-blue-300'}
        onClick={() => add('input')}
      >
        Input
      </Button>
            <Button 
        className={'hover:bg-slate-100 px-6 py-2 border-2 rounded-sm border-slate-300 text-slate-300'}
        onClick={() => add('button')}
      >
        Button
      </Button>
      </div>
    )
  }

    const InputOptions = () => {
    return (
      <Input placeholder='placeholder'/>
    )
  }

  const ButtonOptions = () => {
    return (
      <Input placeholder='button text'/>
    )
  }


const Options = () => {
  const {selectionIdentifier} = useContext(ComponentContext)

  if(selectionIdentifier?.endsWith('Form')) {
    return <FormElements/>
  } else if(selectionIdentifier?.endsWith('Input')) {
    return <InputOptions/>
  } else if(selectionIdentifier?.endsWith('Button')) {
    return <ButtonOptions/>
  } else {
    return <BasicElements/>
  }
}

export default () => {
  const {args} = useContext(ComponentContext)

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

  const render = (Component, props, ...childArgs) => {
    const children = childArgs?.length > 1
      ? childArgs.map(cArgs => render(...cArgs))
      : childArgs[0]
      
    return createElement(
      Component,
      props,
      children
    )
  }

  return (
    <ErrorBoundary>
      <ComponentProvider>
        <section className="m-2 p-2">
        
        <Input value='Component' />
        <div className="p-4 border-1 border-black-100">
          {args.length > 0 ? render(...args) : null}
        </div>


        <hr className="my-4"/>
          <p>select element from above to view element specific options</p>

          <Options/>
          <br/>
          <Button onClick={() => generateJSX(...args)}>Generate JSX</Button>
        </section>
      </ComponentProvider>
    </ErrorBoundary>
  )
}