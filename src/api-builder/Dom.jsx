import { createElement } from "react"

import { Button, List, ElementsList, Input, Text, Container } from "./components"
import { classNames, colors, ELEMENT_TYPES } from "./constants"
import useGlobalContext from "./useGlobalContext"
import { isChild } from "./utils"

const elementComponents = {
  'input': Input,
  'button': Button,
  'text': Text
}

export default () => {
  const { dom, setSelectionIdentifier, selectionIdentifier, updateDom } = useGlobalContext()

  const createNode = (domConfig) => {
    const newConfig = { ...domConfig }

    newConfig.props = {
      ...newConfig.props,
      key: newConfig.id
    }

    const child = isChild(newConfig)
    const elementType = newConfig?.id?.split('.')[0]
    newConfig.node = elementComponents[elementType] || Container

    // find alternate solution to override classname other than !important
    if(newConfig?.id === selectionIdentifier && child) {
      newConfig.props = {
        ...newConfig.props,
        className: `${newConfig.props?.className} ${classNames.selection.border}`
      }
    }

    if(newConfig?.children) {
      if(Array.isArray(newConfig.children)) {
        newConfig.children = newConfig.children.map(childConfig => {
          return createNode(childConfig)
        })
      }
    }

    if(!newConfig.node && !child) return null

    return createElement(newConfig.node, newConfig.props, newConfig.children)
  }

  return (
    <div className="grid grid-flow-col grid" style={{ height: '50vh' }}>
      <div className={`p-2 border-r ${colors.theme.border}`}>
        <List type={ELEMENT_TYPES.COMPONENT} onSelect={(comp) => {
          updateDom(() => comp)
        }
        }
        />
      </div>
      <div className="p-2 col-span-20">
        {dom?.id && createNode(dom)}
      </div>
      <ElementsList 
        dom={dom}
        selectionIdentifier={selectionIdentifier} 
        onClick={id => {
          setSelectionIdentifier(id)
        }}/>
    </div>
  )
}