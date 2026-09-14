import { createContext, createElement, Fragment, useContext, useEffect, useState } from "react"

import ErrorBoundary from "../error-boundary"

const colors = {
  form: {
    border: 'border-orange-300',
  },
  input: {
    border: 'border-blue-300'
  },
  button: {
    border: 'border-red-300'
  }
}

const classNames = {
  form: {
    border: `border border-dashed ${colors.form.border} rounded-sm`
  },
  input: {
    border: `border ${colors.input.border} rounded-sm`
  },
  button: {
    border: `border ${colors.button.border} rounded-sm`
  }
}

const Input = (props) => {
  return (
    <input {...props} 
      className={`${props.className} px-2 ${classNames.input.border}`}
    />
  )
}

const Form = (props) => {
  return (
    <form 
      {...props}
      className={`${props.className || ''} p-2 ${classNames.form.border}`}
    />
  )
}

const Button = props => {
  return (
    <button 
      {...props} 
      className={`cursor-pointer ${props.className || ''} ${classNames.button.border}`} 
    />
  )
}

const INITIAL_CONTEXT_VALUE = {
  component: {
    name: '',
    dom: {
      id: 'form.0',
      node: {
            'form': {
            }
          },
      children: [
        {
          id: 'input.1',
          node: {
            input: {

            }
          }
        },
        {
          id: 'button.2',
          node: {
            button: {

            }
          },
          children: 'btn text'
        }
      ]
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
    component: { dom, endpoint },
    selectionIdentifier
  } = value

  const setSelectionIdentifier = (identifier) => {
    setValue(prevValue => ({
      ...prevValue,
      selectionIdentifier: identifier
    }))
  }

  return (
    <ComponentContext value={{
      selectionIdentifier,
      dom,
      endpoint,
      updateDom: updatedDomCb => {
        setValue(prevValue => ({
          ...prevValue,
          component: {
            ...prevValue.component,
            dom: updatedDomCb(prevValue.component.dom)
          }
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
  const {updateDom, selectionIdentifier} = useContext(ComponentContext)

  const add = (type) => {
    updateDom(prevDom => {
      if(type === 'save') {
        return {
          ...prevDom,
          node: {
            form: {
              
            }
          }
        }
      }

      if(['input', 'button'].includes(type)) {
        return {
          ...prevDom,
          children: (prevDom.children || []).concat({
            id: `${type}.${(prevDom.chilren || []).length + 1}`,
            node: {
              [type]: {

              }
            },
            children: type === 'button' ? 'submit' : undefined
          })
        }
      }
    })
  }

  const button = 'cursor-pointer px-4 py-2 border-2 border-dotted rounded-l'

  const getOptions = (identifier) => {
    switch(true) {
      case identifier?.startsWith('form'): {
        return (
          <>
            <button className={`${button} border-blue-500`} onClick={() => add('input')}>input</button>
            <button className={`${button} border-red-500`} onClick={() => add('button')}>button</button>
          </>
        )
      }

      case identifier?.startsWith('input'): {
        return (
          <>
          </>
        )
      }

      default: {
        return (
          <>
            <button className={`${button} border-blue-500`} onClick={() => add('save')}>save data</button>
            <button className={`${button} border-green-500`} onClick={() => add('retreive')}>retreive data</button>
          </>
        )
      }
    }
  }

  return (
    <div className="grid grid-flow-col gap-4">
      {getOptions(selectionIdentifier)}
    </div>
  )
}

const hoverBorder = '!border-2 !border-purple-300'

const ElementSelector = () => {
  const {dom, updateDom, setSelectionIdentifier, selectionIdentifier} = useContext(ComponentContext)

  const getSelector = (config) => {
    const baseElement = config.id.split('.')[0]
    return (
      <Fragment key={config.id}>
        <span 
          className={`cursor-pointer grid grid-flow-col items-center hover:bg-purple-200 ${selectionIdentifier === config.id ? 'bg-purple-400' : ''}`} 
          onClick={() => setSelectionIdentifier(config.id)}
          onMouseEnter={() => {
            updateDom(prevDom => {
              const newDom = {...prevDom}

              if(config.id.startsWith('form')) {
                newDom.props = {
                  ...newDom.props,
                  className: `${newDom?.props?.className || ''} ${hoverBorder}`
                }
              } else if(Array.isArray(newDom.children)) {
                newDom.children = newDom.children.map(childConfig => {
                  if(childConfig.id === config.id) return {
                    ...childConfig,
                    props: {
                      ...childConfig.props,
                      className: `${childConfig?.props?.className || ''} ${hoverBorder}`
                    }
                  }

                  return childConfig
                })
              }

              return newDom
            })
          }}
          onMouseLeave={() => {
            updateDom(prevDom => {
              const newDom = {...prevDom}

              if(config.id.startsWith('form')) {
                newDom.props.className = newDom.props.className.replace(hoverBorder, '')
              } if(Array.isArray(newDom.children)) {
                newDom.children = newDom.children.map(childConfig => {
                  if(childConfig.id === config.id) return {
                    ...childConfig,
                    props: {
                      className: childConfig.props.className.replace(hoverBorder, '')
                    }
                  }
                  return childConfig
                })
              }
              return newDom
            })
          }}
        >
          <span className={`inline-block w-10 h-2 ${classNames?.[baseElement]?.border}`}></span>
          <p className="">{baseElement}</p>
        </span>
        {Array.isArray(config.children) ? config.children.map(childConfig => getSelector(childConfig)) : undefined}
      </Fragment>
    )
  }

  return (
    <div className="h-full p-2 border-l">
      {getSelector(dom)}
    </div>
  )
}

const Dom = () => {
  const {dom, selectionIdentifier} = useContext(ComponentContext)

  if(!dom) return null

  const createNode = (domConfig) => {
    const newConfig = {...domConfig}

    newConfig.props = {
      ...newConfig.props,
      key: newConfig.id
    }
    if(newConfig.id.startsWith('form')) {
      newConfig.node = Form
    }
    
    if(newConfig.id.startsWith('input')) {
      newConfig.node = Input
    }

    if(newConfig.id.startsWith('button')) {
      newConfig.node = Button
    }

    // find alternate solution to override classname other than !important
    if(newConfig.id === selectionIdentifier) {
      newConfig.props = {
        ...newConfig.props,
        className: `border-2 !border-purple-400 ${newConfig.props?.className || ''}`
      }
    }

    if(newConfig.children) {
      if(Array.isArray(newConfig.children)) {
        newConfig.children = newConfig.children.map(childConfig => {
          return createNode(childConfig)
        })
      }
    }

    return createElement(newConfig.node, newConfig.props, newConfig.children)
  }

  return (
    <div className="grid grid-flow-col grid" style={{height: '50vh'}}>
      <div className="p-2 col-span-20">
        {
          createNode(dom)
        }
      </div>
      <ElementSelector/>
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
          <Dom/>
        </section>
      </ComponentProvider>
    </ErrorBoundary>
  )
}