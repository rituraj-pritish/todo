import { Fragment, useState } from "react"
import { classNames, colors, ELEMENT_TYPES } from "./constants"
import useLocalStorage from "./useLocalStorage"
import useGlobalContext from "./useGlobalContext"
import { isChild } from "./utils"

export const Container = props => {
  const { get, set } = useLocalStorage('db')

  const [state, setState] = useState({})

  const children = props.children?.map(child => {
    if(child.key.startsWith(ELEMENT_TYPES.INPUT)) {
      return {
        ...child,
        props: {
          ...child.props,
          onChange: e => {
            setState(prevState => ({
              ...prevState,
              [child.key]: e.target.value
            }))
          }
        }
      }
    }

    if(child.key.startsWith(ELEMENT_TYPES.BUTTON)) {
      return {
        ...child,
        props: {
          ...child.props,
          onClick: e => {
            e.preventDefault()
            if(props.actions[child.key] === 'create') {
              const entries = get(props.name) || []
              set(props.name, [...entries, state])
            }
          }
        }
      }
    }

    return child
  })

  return (
    <div>
      {children}
    </div>
  )
}

export const Input = (props) => {
  return (
    <input {...props} 
      className={`${props.className} px-2 ${classNames.input.border}`}
    />
  )
}

export const Button = props => {
  return (
    <button 
      {...props} 
      className={`${props.className || ''} cursor-pointer ${classNames.button.border}`} 
    />
  )
}

export const Text = props => {
  const { get } = useLocalStorage('db')
  const text = get(props.collectionKey)
  return (
    <p {...props} className={`${props.className} inline-block p-2 ${classNames.text.border}`}>
      {/* <p>{props.children}</p> */}
      {text}
    </p>
  )
}

export const List = ({ type, onSelect }) => {
  const { components, pages, deleteComponent, deletePage } = useGlobalContext()

  const list = type === ELEMENT_TYPES.PAGE ? pages : components
  const deleteItem = type === ELEMENT_TYPES.PAGE ? deletePage : deleteComponent

  return (
    <div>
      {list.map((item) => (
        <div key={item.props.name} className="hover:bg-purple-300" onClick={() => onSelect(item)}>
          <p>
            {item.props.name || 'no-name'}
          </p>
          <span onClick={(e) => {
            e.stopPropagation()
            deleteItem(item)}
          } >d</span>
        </div>
      ))}
    </div>
  )
}

export const ElementsList = ({
  dom,
  selectionIdentifier,
  filter = {
    type: ''
  },
  onClick 
}) => {
  const { updateDom } = useGlobalContext()

  const identifiers = selectionIdentifier && Array.isArray(selectionIdentifier)
    ? selectionIdentifier
    : [selectionIdentifier]

  const getSelector = (config) => {
    const isChildElement = isChild(config)
    if((isChildElement && filter.type && !config.id.startsWith(filter.type))) {
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
            updateDom(config.id, null, { delete: true })
          }} >d</span>
        </span>
        {Array.isArray(config.children) ? config.children.map(childConfig => getSelector(childConfig)) : undefined}
      </Fragment>
    )
  }

  return (
    <div className={`h-full p-2 border-l ${colors.theme.border}`}>
      {dom?.id && getSelector(dom)}
    </div>
  )
}