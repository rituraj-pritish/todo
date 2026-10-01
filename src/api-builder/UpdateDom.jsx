import { Fragment, useContext, useEffect, useRef } from 'react'

import useLocalStorage from './useLocalStorage'
import { ComponentList, ElementsList } from './components'
import { ComponentContext } from './App'

export default () => {
  const { getConfig, published, publishComponent, updateComponent, updateDom, selectionIdentifier, dom, name, fields, setComponent, setFields } = useContext(ComponentContext)

  const nameRef = useRef()

  useEffect(() => {
    nameRef.current.value = name
  }, [dom?.id])

  const { create } = useLocalStorage('db')

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
        const { placeholder } = getConfig(identifier).props
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
        console.log('con', config)
        if(!config) return null
        const { children, endpoint } = config
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
                      filter={{ type: 'input' }} 
                      onClick={id => {
                        updateDom(identifier, config => {
                          config.endpoint.fields = {
                            [id]: true
                          }

                          config.props.onClick = e => {
                            e.preventDefault()

                            const { props } = getConfig()
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