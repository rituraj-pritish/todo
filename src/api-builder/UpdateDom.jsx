import useGlobalContext from './useGlobalContext'
import { CHILD_SEPARATOR, classNames, ELEMENT_TYPES } from './constants'
import { getRootId } from './utils'

export default () => {
  const { dom, getConfig, addComponent, updateDom, selectionIdentifier, setSelectionIdentifier } = useGlobalContext()

  const add = (type) => {
    if(!dom) {
      updateDom(() => {
        return {
          id: type,
          props: {
            actions: {}
          }
        }
      })
      setSelectionIdentifier(type)
    } else {
      updateDom(selectionIdentifier, config => {
        config.children = [...config.children || [], {
          id: `${type}.${config.children ? config.children.length : 0}${CHILD_SEPARATOR}${selectionIdentifier}`,
          props: {},
          children: type === ELEMENT_TYPES.BUTTON ? 'submit' : undefined
        }]
        return config
      })
    }
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
        const config = getConfig(identifier)
        if(!config) return null
        return (
          <>
            {config.endpoint?.fields ? <p>select element from list</p> : <p>select component to list text fields</p>}
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
        const {children} = getConfig(identifier)
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
            <select name='action' value={getConfig(getRootId({id: identifier}))?.props?.actions?.[identifier]} onChange={e => {
              updateDom(getRootId({id: identifier}), (config) => {
                config.props.actions[identifier] = e.target.value
                return config
              })
            }}>
              <option value=''>select action</option>
              <option value="create">create entry</option>
            </select>
          </>
        )
      }

      case identifier?.endsWith(ELEMENT_TYPES.COMPONENT): {
        return (
          <>
            <button className={classNames.input.border} onClick={() => add(ELEMENT_TYPES.INPUT)}>input</button>
            <button className={classNames.button.border} onClick={() => add(ELEMENT_TYPES.BUTTON)}>button</button>
            <button className={classNames.text.border} onClick={() => add(ELEMENT_TYPES.TEXT)}>text</button>
          </>
        )
      }

      default: 
        return (
          <>
            <button className={`border`} onClick={() => add(ELEMENT_TYPES.COMPONENT)}>create component</button>
            <button className={`border`} onClick={() => add('page')}>compose page</button>
          </>
        )
      
    }
  }

  return (
    <div className="h-full w-full flex">
      <div className="grow flex flex-col">
        <div className="grow grid grid-flow-col items-start gap-4">
          {getOptions(selectionIdentifier)}
        </div>

        {dom?.id && <>
          <input value={dom.props.name} type="text" placeholder="name" onChange={e => {
            updateDom(dom.id, config => {
              config.props.name = e.target.value
              return config
            })
          }}/>
          <button className='border' onClick={() => {
            addComponent(dom)
          }}>save</button>
        </>}
      </div>
    </div>
  )
}