import { CHILD_SEPARATOR } from "./constants"

export const isChild = config => {
  return config?.id?.includes(CHILD_SEPARATOR)
}

export const getRootId = config => {
  const id = config.id
  return id.split(CHILD_SEPARATOR)[id.split(CHILD_SEPARATOR).length - 1]
}