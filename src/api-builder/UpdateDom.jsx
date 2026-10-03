import useGlobalContext from './useGlobalContext'
import { CHILD_SEPARATOR, classNames, ELEMENT_TYPES } from './constants'
import { getElementId, getRootId } from './utils'

export default () => {
  const { dom, getConfig, addComponent, updateDom, selectionIdentifier, setSelectionIdentifier } = useGlobalContext()

  const add = (type) => {
    if(!dom) {
      updateDom(() => {
        return {
          id: type,
          props: {
            state: {},
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

  const getOptions = (identifier) => {
    switch(true) { 
      case identifier?.startsWith('text'): {
        const config = getConfig(identifier)
        if(!config) return null
        const selectedInput = getConfig(getRootId({ id: identifier })).props.state[identifier]
        return (
          <>
            <button className='border' onClick={() => {
              setSelectionIdentifier(identifier + '|input')
            }}>
              select 
            </button>
            { selectedInput
              ? selectedInput
              : <p>component to list input fields</p>
            }
            
            <label htmlFor='text'>add custom</label>
            <input name='text' onChange={e => {
              updateDom(identifier, config => {
                config.children = e.target.value
                return config
              })
            }} />
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
        const { children } = getConfig(identifier)
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
            <select name='action' value={getConfig(getRootId({ id: identifier }))?.props?.actions?.[identifier]} onChange={e => {
              updateDom(getRootId({ id: identifier }), (config) => {
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
            <label htmlFor='type'>type</label>
            <select name='type' defaultValue='single' onChange={e => {
              updateDom(identifier, config => {
                config.props.type = e.target.value
                return config
              })
            }}>
              <option value='single'>single</option>
              <option value='list'>list</option>
            </select>

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
          {getOptions(getElementId(selectionIdentifier))}
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