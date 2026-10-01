import { createContext, useEffect, useState } from "react"
import useLocalStorage from './useLocalStorage.js'

import ErrorBoundary from "../error-boundary"
import UpdateDom from "./UpdateDom.jsx"
import Dom from "./Dom.jsx"

import { COMPONENT_CONTEXT_VALUE } from "./constants.js"

export const ComponentContext = createContext(COMPONENT_CONTEXT_VALUE)

const ComponentProvider = ({ children }) => {
  const { create, getAll, del, update } = useLocalStorage('components')
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
            const newValue = { ...prevValue }

            const dom = newValue.component.dom
            const [_, parentId] = configId.split('-')

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
        const [_, parentId] = id.split('-')
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

export default () => {
  // remove from production
  useEffect(() => {
    const eventSource = new EventSource('/api/re-load')
    eventSource.onmessage = () => {
      window.location.reload()
    }
    
    let id
    eventSource.onerror = () => {
      // debug ERR_INCOMPLETE_CHUNKED_ENCODING error
      id = setTimeout(() => {
        window.location.reload()
      }, 500)
    }

    return () => {
      clearTimeout(id)
    }
  }, [])

  return (
    <ErrorBoundary>
      <ComponentProvider>
        <section>
          <div className="p-2 flex" style={{ height: '50vh' }}>
            <UpdateDom/>
          </div>
          <hr/>
          <Dom/>
        </section>
      </ComponentProvider>
    </ErrorBoundary>
  )
}