import { createContext, createElement, Fragment, useContext, useEffect, useRef, useState } from "react"
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
  },
  data: {
    border: 'border-green-300'
  },
    list: {
    border: 'border-indigo-300'
  },
    text: {
    border: 'border-gray-300'
  }
}

const classNames = {
  form: {
    border: `border border-dashed ${colors.form.border}`
  },
  data: {
    border: `border border-dashed ${colors.data.border}`
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
    selected: 'bg-purple-500',
  },
  list: {
    border: `border ${colors.list.border}`
  },
    text: {
    border: `border ${colors.text.border}`
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

const Data = props => {
  return (
    <div {...props} className={`${props.className || ''} p-2 ${classNames.data.border}`}>
      {props.children}
    </div>
  )
}

const Text = props => {
  return (
    <div {...props} className={`${props.className || ''} p-2 ${classNames.text.border}`}>
      <p>{props.children}</p>
    </div>
  )
}

const COMPONENT_CONTEXT_VALUE = {
  published: [],
  component: {
    name: '',
    dom: {

    },
    endpoint: {

    },
  },
  selectionIdentifier: null
}

const ComponentContext = createContext(COMPONENT_CONTEXT_VALUE)

const ComponentProvider = ({children}) => {
  const {create, getAll, del, update} = useLocalStorage('components')
  const [value, setValue] = useState(() => getAll().length > 0 ? {
    ...COMPONENT_CONTEXT_VALUE,
    published: getAll()
  } : COMPONENT_CONTEXT_VALUE)

  const {
    published,
    component,
    selectionIdentifier,
  } = value

  const { dom, endpoint, name } = component

  const setSelectionIdentifier = (identifier) => {
    setValue(prevValue => ({
      ...prevValue,
      selectionIdentifier: identifier
    }))
  }

  return (
    <ComponentContext value={{
      published,
      selectionIdentifier,
      name,
      dom,
      endpoint,
      updateComponent: (newName) => {
        const newComponent = {
          ...component,
          name: newName
        }
        const publishedComponentIndex = published.findIndex(component => component.name === name)
        update(publishedComponentIndex, newComponent)
        setValue(prevValue => ({
          ...prevValue,
          component: newComponent,
          published: getAll()
        }))
      },
      setComponent: (component) => {
        setValue(prevValue => ({
          ...prevValue,
          component
        }))
      },
      deletePublished: idx =>{
        del(idx)
        setValue(prevValue => ({
          ...prevValue,
          published: getAll()
        }))
      },
      publishComponent: (name) => {
        setValue(prevValue => {
          const newComponent = {
            ...prevValue.component, name
          }
          create(newComponent)

          return {
          ...prevValue,
          published: [...prevValue.published, newComponent],
          component: COMPONENT_CONTEXT_VALUE.component
        }})
      },
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
      getConfig: (id) => {
        const [elementId, parentId] = id.split('-')
        if(dom.id === id) {
          return dom
        } else if(parentId && parentId === dom.id) {
          return dom.children.find(childConfig => childConfig.id === id)
        }
      },
      updateEndpoint: updatedEndpoint => {
        setValue(prevValue => ({
          ...prevValue,
          endpoint: updatedEndpoint
        }))
      },
      setSelectionIdentifier,
    }}>
      {children}
    </ComponentContext>
  )
}

const ComponentList = ({onSelect}) => {
  const {published, deletePublished} = useContext(ComponentContext)

  return (
    <div className="hover:bg-purple-300">
      {published.map((component, idx) => (
        <div key={idx.toString()} onClick={() => onSelect(component)}>
          <p>
            {component.name || 'no-name'}
          </p>
          <span onClick={() => deletePublished(idx)} >d</span>
        </div>
      ))}
    </div>
  )
}

const UpdateDom = () => {
  const {getConfig, published, publishComponent, updateComponent, updateDom, selectionIdentifier, dom, name, fields, setComponent, setFields} = useContext(ComponentContext)

  const nameRef = useRef()

  useEffect(() => {
    nameRef.current.value = name
  }, [dom?.id])

  const {create} = useLocalStorage('db')

  const add = (type) => {
    updateDom(prevDom => {
      if(['form', 'data'].includes(type)) {
        return {
          ...prevDom,
          id: `${type}.0`,
          node: {
            [type]: {
              
            }
          },
          props: {

          }
        }
      }

      if(['input', 'button', 'text'].includes(type)) {
        const id = `${type}.${(prevDom.children || []).length + 1}-${selectionIdentifier}`
        return {
          ...prevDom,
          children: (prevDom.children || []).concat({
            id,
            node: {
              [type]: {

              },
            },
                      props:  {
                        onChange:  e => {
                          if(['button'].includes(type)) return undefined

                          updateDom(id, config => {
                            config.props.value = e.target.value
                            return config
                          })
                        }

              },
            children: ['button'].includes(type) ? 'submit' : undefined
          })
        }
      }
    })
  }

  const dataOptions = (
    <>
      <button className={`border-gray-500`} onClick={() => add('text')}>text</button>
    </>
  )

  const getOptions = (identifier) => {
    switch(true) { 
      case identifier?.startsWith('form'): {
        return (
          <>
            <button className={`border-blue-500`} onClick={() => add('input')}>input</button>
            <button className={`border-red-500`} onClick={() => add('button')}>button</button>
          </>
        )
      }

      case identifier?.startsWith('data'): {
        return (
          <>
            {dataOptions}
          </>
        )
      }

      case identifier?.startsWith('text'): {
        return (
          <>
            {!fields && <p>select component to list text fields</p>}
            {fields && fields.length === 0 && <p>component does not contain any fields</p>}
            {fields?.map((field, idx) => (
              <Fragment key={idx.toString()}>
                {field?.props?.name || 'input'}
              </Fragment>
            ))}
          </>
        )
      }

      case identifier?.startsWith('input'): {
        const {placeholder} = getConfig(identifier).props
        return (
          <>
            <label htmlFor="placeholder">placeholder</label>
            <input type="text" name='placeholder' value={placeholder} onChange={e => {
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
        const config = getConfig(identifier)
        if(!config) return null
        const {children, endpoint} = config
        return (
          <>
            <label htmlFor="button-text">Button Text</label>
            <input type="text" name='button-text' value={children} defaultValue={'submit'} onChange={e => {
              updateDom(identifier, config => {
                config.children = e.target.value
                return config
              })
            }}/>

            <label htmlFor="action">action</label>
            <select name='action' onChange={e => {
              updateDom(identifier, (config) => {
                if(e.target.value === 'create') {
                  config.endpoint = {
                    action: 'create',
                  }

                  return config
                }
              })
            }}>
              <option value=''>select action</option>
              <option value="create">create entry</option>
            </select>

            {
              endpoint?.action === 'create'
                ? (
                  <>  
                    <p>select field from list</p>
                    <ElementsList
                      selectionIdentifier={Object.keys(getConfig(identifier).endpoint?.fields || {})}
                      filter={{type: 'input'}} 
                      onClick={id => {
                        updateDom(identifier, config => {
                            config.endpoint.fields = {
                              [id]: true
                            }

                            config.props.onClick = e => {
                              e.preventDefault()

                              const {props} = getConfig()
                              create(props.value)
                            }

                          return config
                        })
                      }}
                    />
                  </>
                ) : null
            }
          </>
        )
      }

      default: 
        return (
          <>
            <button className={`border-blue-500`} onClick={() => add('form')}>save data</button>
            <button className={`border-green-500`} onClick={() => add('data')}>retreive data</button>
          </>
        )
      
    }
  }
  const isEditing = published.find(component => component.name === name)

  return (
    <div className="h-full w-full flex">
    <div className="pr-2 border-r border-black-500">
      <ComponentList onSelect={(comp) => {
        if(selectionIdentifier?.startsWith('text')) {
          setFields(comp.endpoint.fields)
        } else {
          setComponent(comp)}
        }
      }
      />
    </div>
    <div className="pl-2 grow flex flex-col">
    <div className="grow grid grid-flow-col items-start gap-4">
      {getOptions(selectionIdentifier)}
    </div>
      <input ref={nameRef} type="text" placeholder="component name"
      />
      <button onClick={() => {
        if(isEditing) {
          updateComponent(nameRef.current.value)
        } else {
          publishComponent(nameRef.current.value)
          nameRef.current.value = ''
        }
        }}>{isEditing ? 'update' : 'publish'}</button>
    </div>
    </div>
  )
}

const ElementsList = ({
  selectionIdentifier,
  filter = {
  type: ''
},
onClick = (id) => {}
}) => {
  const {dom, updateDom} = useContext(ComponentContext)

  const identifiers = selectionIdentifier && Array.isArray(selectionIdentifier)
    ? selectionIdentifier
    : [selectionIdentifier]

  const getSelector = (config) => {
    const isChildElement = config.id.includes('-')
    if(isChildElement && filter.type && !config.id.startsWith(filter.type)) {
      return null
    }

    const baseElement = config.id.split('.')[0]
    return (
      <Fragment key={config.id}>
        <span 
          className={`cursor-pointer grid grid-flow-col items-center ${classNames.selection.hover} ${identifiers.includes(config.id) ? classNames.selection.selected : ''}`} 
          onClick={() => onClick(config.id)}
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
  const {dom, setSelectionIdentifier, selectionIdentifier} = useContext(ComponentContext)

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

    if(newConfig?.id?.startsWith('data')) {
      newConfig.node = Data
    }

            if(newConfig?.id?.startsWith('text')) {
      newConfig.node = Text
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
        {createNode(dom)}
      </div>
      <ElementsList selectionIdentifier={selectionIdentifier} onClick={setSelectionIdentifier}/>
    </div>
  )
}

export default () => {
  // remove from production
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
          <div className="p-2 flex" style={{height: '50vh'}}>
            <UpdateDom/>
          </div>
          <hr/>
          <Dom/>
        </section>
      </ComponentProvider>
    </ErrorBoundary>
  )
}