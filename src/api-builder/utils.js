import { CHILD_SEPARATOR, SELECTION_SEPARATOR } from "./constants"

export const isChild = config => {
  return config?.id?.includes(CHILD_SEPARATOR)
}

export const getRootId = config => {
  const id = config.id
  return id?.split(CHILD_SEPARATOR)[id.split(CHILD_SEPARATOR).length - 1]
}

export const getElementId = id => {
  return id?.split(SELECTION_SEPARATOR)?.[0]
}

export const getSelectorType = id => {
  return id?.split(SELECTION_SEPARATOR)?.[1]?.split(CHILD_SEPARATOR)?.[0]
}

export const getSelectorComponent = id => {
  return id?.split(SELECTION_SEPARATOR)?.[1]?.split(CHILD_SEPARATOR)?.[1]
}