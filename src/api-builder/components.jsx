import { Fragment, useContext } from "react"
import { ComponentContext } from "./App"
import { classNames } from "./constants"

export const Input = (props) => {
  return (
    <input {...props} 
      className={`${props.className} px-2 ${classNames.input.border}`}
    />
  )
}

export const Form = (props) => {
  return (
    <form 
      {...props}
      className={`p-2 ${classNames.form.border} ${props.className || ''}`}
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

export const Data = props => {
  return (
    <div {...props} className={`${props.className || ''} p-2 ${classNames.data.border}`}>
      {props.children}
    </div>
  )
}

export const Text = props => {
  return (
    <div {...props} className={`${props.className || ''} p-2 ${classNames.text.border}`}>
      <p>{props.children}</p>
    </div>
  )
}

export const ComponentList = ({ onSelect }) => {
  const { published, deletePublished } = useContext(ComponentContext)

  return (
    <div className="hover:bg-purple-300">
      {published.map((component, idx) => (
        <div key={idx.toString()} onClick={() => onSelect(component)}>
          <p>
            {component.name || 'no-name'}
          </p>
          <span onClick={(e) => {
            e.stopPropagation()
            deletePublished(idx)}
          } >d</span>
        </div>
      ))}
    </div>
  )
}

export const ElementsList = ({
  selectionIdentifier,
  filter = {
    type: ''
  },
  onClick = (id) => {}
}) => {
  const { dom, updateDom } = useContext(ComponentContext)

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
            updateDom(config.id, null, { delete: true })
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