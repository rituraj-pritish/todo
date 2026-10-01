import { createElement, useContext } from "react"

import { Button, Data, ElementsList, Form, Input, Text } from "./components"
import { ComponentContext } from "./App"
import { classNames } from "./constants"

export default () => {
  const { dom, setSelectionIdentifier, selectionIdentifier } = useContext(ComponentContext)

  if(!dom.id) return null

  const createNode = (domConfig) => {
    const newConfig = { ...domConfig }

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
    <div className="grid grid-flow-col grid" style={{ height: '50vh' }}>
      <div className="p-2 col-span-20">
        {createNode(dom)}
      </div>
      <ElementsList selectionIdentifier={selectionIdentifier} onClick={setSelectionIdentifier}/>
    </div>
  )
}