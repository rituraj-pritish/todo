export const colors = {
  form: {
    border: 'border-orange-300',
  },
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
  data: {
    border: 'border-green-300'
  },
  list: {
    border: 'border-indigo-300'
  },
  text: {
    border: 'border-gray-300'
  }
}

export const classNames = {
  form: {
    border: `border border-dashed ${colors.form.border}`
  },
  data: {
    border: `border border-dashed ${colors.data.border}`
  },
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

export const COMPONENT_CONTEXT_VALUE = {
  published: [],
  component: {
    name: '',
    dom: {

    },
    endpoint: {

    },
  },
  selectionIdentifier: null
}