import { createContext, createElement, Fragment, useContext, useEffect, useState } from "react"
import useLocalStorage from './useLocalStorage.js'

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
  },
  selection: {
    hover: 'bg-purple-300',
    border: 'border-purple-400',
    selected: 'bg-purple-500'
  }
}

const classNames = {
  form: {
    border: `border border-dashed ${colors.form.border}`
  },
  input: {
    border: `border ${colors.input.border}`
  },
  button: {
    base: 'cursor-pointer px-4 py-2',
    border: 'border border-red-300'
  },
  selection: {
    hover: 'hover:bg-purple-300',
    border: '!border-2 !border-purple-400',
    selected: `!${colors.selection.selected}`
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
      className={`p-2 ${classNames.form.border} ${props.className || ''}`}
    />
  )
}

const Button = props => {
  return (
    <button 
      {...props} 
      className={`${props.className || ''} cursor-pointer ${classNames.button.border}`} 
    />
  )
}

const INITIAL_CONTEXT_VALUE = {
  component: {
    name: '',
    dom: {
      // id: 'form.0',
      // node: {
      //       'form': {
      //       }
      //     },
      // children: [
      //   {
      //     id: 'input.0-form.0',
      //     node: {
      //       input: {

      //       }
      //     }
      //   },
      //   {
      //     id: 'button.1-form.0',
      //     node: {
      //       button: {

      //       }
      //     },
      //     children: 'btn text'
      //   }
      // ]
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
      updateDom: (...args) => {
        // update base node
        if(args.length === 1) {
          const [updatedDomCb] = args

                  setValue(prevValue => ({
          ...prevValue,
          component: {
            ...prevValue.component,
            dom: updatedDomCb(prevValue.component.dom)
          }
        }))
        }

        // update nested node
        if(args.length >= 2) {
          const [configId, updateConfigCb, options] = args

          setValue(prevValue => {
            const newValue = {...prevValue}

            const dom = newValue.component.dom
            const [elementId, parentId] = configId.split('-')

            if(dom.id === configId) {
              if(options?.delete === true) {
                newValue.component.dom = {}
              } else {
                newValue.component.dom = updateConfigCb(dom, dom)
              }
            } else if (parentId && parentId === dom.id) {
              if(options?.delete === true) {
                newValue.component.dom.children = dom.children.filter(childConfig => childConfig.id !== configId)
              } else {
                newValue.component.dom.children = dom.children.map(childConfig => {
                  if(childConfig.id === configId) {
                    return updateConfigCb(childConfig, dom)
                  }
                  return childConfig
                })
              }
            }

            return newValue
          })
        }
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

const BASE_FORM_ID = 'form'

const UpdateDom = () => {
  const {updateDom, selectionIdentifier} = useContext(ComponentContext)
  const {create} = useLocalStorage('db')

  const add = (type) => {
    updateDom(prevDom => {
      if(type === 'save') {
        return {
          ...prevDom,
          id: `${BASE_FORM_ID}.0`,
          node: {
            form: {
              
            }
          },
          props: {

          }
        }
      }

      if(['input', 'button'].includes(type)) {
        const id = `${type}.${(prevDom.chilren || []).length + 1}-${BASE_FORM_ID}.0`
        return {
          ...prevDom,
          children: (prevDom.children || []).concat({
            id,
            node: {
              [type]: {

              },
            },
                      props: {
                        onChange: e => {
                          updateDom(id, config => {
                            config.props.value = e.target.value
                            return config
                          })
                        }

              },
            children: type === 'button' ? 'submit' : undefined
          })
        }
      }
    })
  }

  const getOptions = (identifier) => {
    switch(true) {
      case identifier?.startsWith('form'): {
        return (
          <>
            <button className={`${classNames.button.base} border-blue-500`} onClick={() => add('input')}>input</button>
            <button className={`${classNames.button.base} border-red-500`} onClick={() => add('button')}>button</button>
          </>
        )
      }

      case identifier?.startsWith('input'): {
        return (
          <>
            <label htmlFor="placeholder">placeholder</label>
            <input type="text" name='placeholder' onChange={e => {
              updateDom(
                identifier,
                config => {
                  config.props.placeholder = e.target.value
                  return config
                }
              )
            }}/>
          </>
        )
      }

          case identifier?.startsWith('button'): {
        return (
          <>
            <label htmlFor="button-text">Button Text</label>
            <input type="text" name='button-text' defaultValue={'submit'} onChange={e => {
              updateDom(identifier, config => {
                config.children = e.target.value
                return config
              })
            }}/>

            <label htmlFor="action">action</label>
            <select name='action' onChange={e => {
              updateDom(identifier, (config, domConfig) => {
                config.props.onClick = e => {
                  e.preventDefault()

                  // extract to helper function
                  const text = domConfig.children.find(({id}) => 'input.0-form.0').props.value
                  create({
                    text
                  })
                }
                return config
              })
            }}>
              <option value=''>select action</option>
              <option value="create">create entry</option>
            </select>
          </>
        )
      }

      default: {
        return (
          <>
            <button className={`${classNames.button.base} border-blue-500`} onClick={() => add('save')}>save data</button>
            <button className={`${classNames.button.base} border-green-500`} onClick={() => add('retreive')}>retreive data</button>
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

const ElementsList = () => {
  const {dom, updateDom, setSelectionIdentifier, selectionIdentifier} = useContext(ComponentContext)

  const getSelector = (config) => {
    const baseElement = config.id.split('.')[0]
    return (
      <Fragment key={config.id}>
        <span 
          className={`cursor-pointer grid grid-flow-col items-center ${classNames.selection.hover} ${selectionIdentifier === config.id ? classNames.selection.selected : ''}`} 
          onClick={() => setSelectionIdentifier(config.id)}
          onMouseEnter={() => {
            updateDom(config.id, conf => {
              conf.props.className = `${conf.props.className || ''} ${classNames.selection.border}`
              return config
            })
          }}
          onMouseLeave={() => {
            updateDom(config.id, conf => {
              conf.props.className = conf.props.className.replace(classNames.selection.border, '')
              return conf
            })
          }}
        >
          <span className={`inline-block w-10 h-2 ${classNames?.[baseElement]?.border}`}></span>
          <p className="">{baseElement}</p>
          <span onClick={(e) => {
            e.stopPropagation()
            updateDom(config.id, null, {delete: true})
          }} >d</span>
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

  if(!dom.id) return null

  const createNode = (domConfig) => {
    const newConfig = {...domConfig}

    newConfig.props = {
      ...newConfig.props,
      key: newConfig.id
    }
    if(newConfig?.id?.startsWith('form')) {
      newConfig.node = Form
    }
    
    if(newConfig?.id?.startsWith('input')) {
      newConfig.node = Input
    }

    if(newConfig?.id?.startsWith('button')) {
      newConfig.node = Button
    }

    // find alternate solution to override classname other than !important
    if(newConfig?.id === selectionIdentifier) {
      newConfig.props = {
        ...newConfig.props,
        className: `${newConfig.props?.className || ''} ${classNames.selection.border}`
      }
    }

    if(newConfig?.children) {
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
      <ElementsList/>
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
      }, 500)
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