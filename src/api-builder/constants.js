export const colors = {
  input: {
    border: 'border-blue-300'
  },
  button: {
    border: 'border-red-300'
  },
  selection: {
    hover: 'bg-purple-300',
    border: 'border-purple-400',
    selected: 'bg-purple-500'
  },
  list: {
    border: 'border-indigo-300'
  },
  text: {
    border: 'border-gray-300'
  },
  theme: {
    border: 'border-purple-500'
  }
}

export const classNames = {
  input: {
    border: `border ${colors.input.border}`
  },
  button: {
    base: 'cursor-pointer px-4 py-2',
    border: 'border border-red-300'
  },
  selection: {
    hover: 'hover:bg-purple-300',
    border: '!border-2 !border-purple-400',
    selected: 'bg-purple-500',
  },
  list: {
    border: `border ${colors.list.border}`
  },
  text: {
    border: `border ${colors.text.border}`
  }
}

export const GLOBAL_CONTEXT_INITIAL_VALUE = {
  pages: [],
  components: [],
  dom: undefined,
  selectedId: undefined
}

export const ELEMENT_TYPES = {
  PAGE: 'page',
  COMPONENT: 'component',
  CONTAINER: 'container',
  
  INPUT: 'input',
  BUTTON: 'button',

  TEXT: 'text'
}

export const CHILD_SEPARATOR = '-'
export const SELECTION_SEPARATOR = '|'