import { Component, useEffect, useState } from "react"
import ErrorBoundary from "../error-boundary"

const Input = (props) => {
  return <input {...props}/>
}

const Form = (props) => {
  return <form {...props}/>
}

const Button = props => {
  return <button {...props} className={`cursor-pointer ${props.className}`} />
}

export default () => {
  const [children, setChildren] = useState([])
  const [selectedElement, setSelectedElement] = useState()

  useEffect(() => {
    const eventSource = new EventSource('/api/re-load')
    eventSource.onmessage = () => {
      window.location.reload()
    }
    
    eventSource.onerror = err => {
      // debug ERR_INCOMPLETE_CHUNKED_ENCODING error
      window.location.reload()
    }

    add()
  }, [])

  const add = (element) => {
    const form = {
      Component: Form,
      props: {
        className: `cursor-pointer p-2 border-2 rounded-sm border-dashed ${selectedElement ? 'border-purple-300' : 'border-orange-300'} hover:border-purple-500`,
        onClick: e => console.log('e', e)
      },
      children: [

      ]
    }

    setChildren(prevChildren => prevChildren.concat(form))
  }

  const renderChildren = elements => {
    if(!elements) return null
    return elements.map((element, idx) => <element.Component key={idx.toString()} {...element.props}>{renderChildren(element.children)}</element.Component>)
  }

  return (
    <ErrorBoundary>
      <section className="m-2 p-2">
        <h4>Component</h4>
      <div className="p-4 border-1 border-black-100">
        {renderChildren(children)}
      </div>


      <hr className="my-4"/>
        <h4>Elements</h4>
        <p>click on element to add</p>

      <div className="grid grid-cols-auto grid-flow-col  gap-4">
      <Button 
        className={'hover:bg-orange-100 px-6 py-2 border-2 rounded-sm border-orange-300 text-orange-300'}
        onClick={() => add('form')}
      >
        Form
      </Button>
            <Button 
        className={'hover:bg-green-100 px-6 py-2 border-2 rounded-sm border-green-300 text-green-300'}
        // onClick={() => add('data')}
        onClick={() => setSelectedElement(1)}
      >
        Data
      </Button>
      </div>
      {/* <Form className={`border-2 ${selectedElement ? 'border-purple-200' : 'border-orange-200'}`}>{selectedElement}</Form> */}
      </section>
    </ErrorBoundary>
  )
}