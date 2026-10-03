import { createContext, useContext, useState } from 'react'

import { GLOBAL_CONTEXT_INITIAL_VALUE } from './constants.js'
import useLocalStorage from './useLocalStorage.js'

const GlobalContext = createContext(GLOBAL_CONTEXT_INITIAL_VALUE)

export const GlobalContextProvider = ({ children }) => {
  const { get, set } = useLocalStorage('published')
  const dbcomponents = get('components') || []
  const dbpages = get('pages') || []

  const [value, setValue] = useState(() => (dbcomponents.length > 0 || dbpages.length > 0) ? {
    ...GLOBAL_CONTEXT_INITIAL_VALUE,
    components: dbcomponents,
    pages: dbpages
  } : GLOBAL_CONTEXT_INITIAL_VALUE)

  const {
    pages,
    components,
    dom,
    selectedId,
  } = value

  const setSelectionIdentifier = (identifier) => {
    setValue(prevValue => ({
      ...prevValue,
      selectedId: identifier
    }))
  }

  const updateDom = (...args) => {
        // update base node
        if(args.length === 1) {
          const [updatedDomCb] = args

          setValue(prevValue => ({
            ...prevValue,
            dom: updatedDomCb(prevValue.dom)
          }))
        }

        // update nested node
        if(args.length >= 2) {
          const [configId, updateConfigCb, options] = args

          setValue(prevValue => {
            const newValue = { ...prevValue }

            const dom = newValue.dom
            const [_, parentId] = configId.split('-')

            if(dom.id === configId) {
              if(options?.delete === true) {
                newValue.dom = {}
              } else {
                newValue.dom = updateConfigCb(dom, dom)
              }
            } else if (parentId && parentId === dom.id) {
              if(options?.delete === true) {
                newValue.dom.children = dom.children.filter(childConfig => childConfig.id !== configId)
              } else {
                newValue.dom.children = dom.children.map(childConfig => {
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
      }

  const addItem = (item, type) => {
    setValue(prevValue => {
      const prevItems = get(type) || []
      const newItems = [...prevItems, item]
      
      set(type, newItems)
      return {
        ...prevValue,
        dom: undefined,
        selectedId: undefined,
        [type]: newItems
      }
    })
  }

  const updateItem = (item, type) => {
    setValue(prevValue => {
      const prevItems = get(type)
      const newItems = prevItems.map(i => {
        if(i.name === item.name) return item
        return i
      })
      
      set(type, newItems)
      return {
        ...prevValue,
        [type]: newItems
      }
    })
  }

  const deleteItem = (item, type) => {
    setValue(prevValue => {
      const prevItems = get(type)
      const newItems = prevItems.filter(i => {
        return i.name !== item.name
      })
      
      set(type, newItems)
      return {
        ...prevValue,
        [type]: newItems
      }
    })
  }

  const addPage = page => {
    addItem(page, 'pages')
  }

  const updatePage = page => {
    updateItem(page, 'pages')
  }

  const deletePage = page => {
    deleteItem(page, 'pages')
  }

  const addComponent = component => {
    addItem(component, 'components')
  }

  const updateComponent = component => {
    updateItem(component, 'components')
  }

  const deleteComponent = component => {
    deleteItem(component, 'components')
  }

  return (
    <GlobalContext value={{
      pages,
      components,
      dom,
      selectionIdentifier: selectedId,

      setSelectionIdentifier,

      addPage,
      updatePage,
      deletePage,
      addComponent,
      updateComponent,
      deleteComponent,

      updateDom,
      getConfig: (id) => {
        const [_, parentId] = id.split('-')
        if(dom?.id === id) {
          return dom
        } else if(parentId && parentId === dom?.id) {
          return dom.children.find(childConfig => childConfig.id === id)
        }
      },
    }}>
      {children}
    </GlobalContext>
  )
}

export default () => {
  const context = useContext(GlobalContext)
  if(!context) throw new Error('this hook can only used inside of corresponding provider component')
  return context
}