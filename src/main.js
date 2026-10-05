import './hot-reload'
import useLocalStorage from './useLocalStorage'

const {get, set} = useLocalStorage('db')

const ELEMENTS = {
  COMPONENT: 'component',
  INPUT: 'input',
  BUTTON: 'button',
  TEXT: 'text'
}

const classes = {
  [ELEMENTS.BUTTON]: {
    base: 'px-4 py-1 rounded-sm cursor-pointer border',
    colors: 'border-amber-700 hover:bg-amber-200',
    bg: 'bg-amber-100',
    selected: 'bg-amber-200'
  },
  [ELEMENTS.COMPONENT]: {
    colors: 'border-slate-700 hover:bg-slate-200',
    selected: 'bg-slate-200'
  },
  [ELEMENTS.INPUT]: {
    base: 'border rounded-sm px-2 h-[34px]',
    colors: 'border-blue-700 hover:bg-blue-200',
    bg: 'bg-blue-100',
    selected: 'bg-blue-200'
  },
  [ELEMENTS.TEXT]: {
    colors: 'border-teal-700 hover:bg-teal-200'
  },
}

let selected

const getSelectedType = () => {
  return selected.split('.')[0]
}

const getElementTypeById = id => {
  return id?.split('.')[0]
}

const getElement = id => {
  return document.getElementById(id)
}

const createButton = (options) => {
  const button = document.createElement('button')
  button.innerText = options.text
  button.setAttribute('class', `${classes[ELEMENTS.BUTTON].base} ${options.class}`)

  for(const attribute in options) {
    if(!['text', 'class'].includes(attribute)) {
      button[attribute] = options[attribute]
    } 
  }

  return button
}

const createElementListItem = (type, element, options) => {
  const item = document.createElement('div')
  item.id = element?.id + '.item'
  item.setAttribute('class', `cursor-pointer mt-2 ${classes[ELEMENTS.INPUT].base} ${classes[type].colors}`)
  item.classList.remove('h-[34px]')
  item.innerHTML = `<p>${type}</p>`

  const placeholderLabel = document.createElement('label')
  placeholderLabel.textContent = 'placeholder'
  placeholderLabel.setAttribute('class', 'mr-2')
  const placeholder = document.createElement('input')
  placeholder.setAttribute('class', `${classes[ELEMENTS.INPUT].base}`)
  placeholder.oninput = (e) => {
    element.placeholder = e.target.value
  }

  const textLabel = document.createElement('label')
  textLabel.textContent = 'button text'
  textLabel.setAttribute('class', 'mr-2')
  const buttonText = document.createElement('input')
  buttonText.setAttribute('class', `${classes[ELEMENTS.INPUT].base}`)
  buttonText.oninput = (e) => {
    element.textContent = e.target.value
  }

  if(element) {
    item.onmouseenter = () => {
      element.classList.add(classes[type].bg)
    }
    item.onmouseleave = () => {
      element.classList.remove(classes[type].bg)
    }
  }

  item.onclick = () => {
    options.innerHTML = ''

    if(type === ELEMENTS.COMPONENT) {
      renderComponentOptions()
    }
    
    if(type === ELEMENTS.INPUT) {
      options.appendChild(placeholderLabel)
      options.appendChild(placeholder)
    }

    if(type === ELEMENTS.BUTTON) {
      options.appendChild(textLabel)
      options.appendChild(buttonText)
    }

    if(selected) {
      const selectedType = getSelectedType()
      document.getElementById(selected).classList.remove(classes[selectedType].selected)
      document.getElementById(selected + '.item').classList.remove(classes[selectedType].selected)
    }

    if(element) {
      selected = element.id
      element.classList.add(classes[type].selected)
      item.classList.add(classes[type].selected)
    }
  }

  return item
}


const root = getElement('root')
root.innerHTML = '<section id="section" style="height: 100vh;"></section>'

const section = getElement('section')
section.setAttribute('class', 'flex flex-col')

const options = document.createElement('div')
options.setAttribute('class', 'p-2')

const dom = document.createElement('div')
dom.setAttribute('class', 'flex h-[100%]')

const preview = document.createElement('div')
preview.setAttribute('class', 'p-2 grow')

const navbar = document.createElement('div')
navbar.setAttribute('class', 'px-2 border-l-2 border-purple-500 h-[100%] flex flex-col')

const elementsList = document.createElement('div')
elementsList.setAttribute('class', 'grow')

const componentsList = document.createElement('div')
componentsList.setAttribute('class', 'grow')
const components = get('components') || []
for(const component of components) {
  const componentItem = document.createElement('div')
  componentItem.innerHTML = `<p>${component.name}</p>`
  componentItem.onclick = () => {
    options.innerHTML = ''
    renderComponentOptions()
    componentName.value = component.name
    preview.innerHTML = component.innerHTML
    
    const item = createElementListItem(ELEMENTS.COMPONENT, null, options)
    elementsList.appendChild(item)
    for(const child of preview.childNodes) {
      const item = createElementListItem(getElementTypeById(child.id), child, options)
      elementsList.appendChild(item)
    }
  }

  componentsList.appendChild(componentItem)
}

const saveComponent = document.createElement('div')
saveComponent.setAttribute('class', 'flex flex-col')

const componentName = document.createElement('input')
componentName.setAttribute('class', 'mb-2 border')
componentName.required = true
const saveComponentBtn = document.createElement('button')
saveComponentBtn.setAttribute('class', 'mb-2 border')
saveComponentBtn.textContent = 'save'

saveComponentBtn.onclick = () => {
  const components = get('components') || []
  set('components', [...components, {
    name: componentName.value,
    innerHTML: preview.innerHTML
  }])
  
  options.innerHTML = ''
  options.appendChild(createComponent)

  preview.innerHTML = ''
  elementsList.innerHTML = ''

  componentName.value = ''
}

saveComponent.appendChild(componentName)
saveComponent.appendChild(saveComponentBtn)

navbar.appendChild(elementsList)
navbar.appendChild(componentsList)
navbar.appendChild(saveComponent)

dom.appendChild(preview)
dom.appendChild(navbar)

const divider = document.createElement('hr')
divider.setAttribute('class', 'border-1 border-purple-500')

section.appendChild(options)

const renderComponentOptions = () => {  
  const addInput = createButton({
    text: 'input',
    class: classes.input.colors,
    onclick: () => {
      const input = document.createElement('input')
      input.id = `input.${preview.children.length}`
      input.setAttribute('class', `${classes[ELEMENTS.INPUT].base}`)
      if(preview.children.length > 0) {
        input.classList.add('ml-4')
      }

      preview.appendChild(input)
      const item = createElementListItem('input', input, options)

      elementsList.appendChild(item)
    }
  })

  const addButton = createButton({
    text: 'button',
    class: classes.button.colors,
    onclick: () => {
      const button = document.createElement('button')
      button.id = `button.${preview.children.length}`
      button.innerHTML = '&nbsp;'
      button.setAttribute('class', `${classes[ELEMENTS.BUTTON].base} h-[34px] min-w-[70px]`)
      if(preview.children.length > 0) {
        button.classList.add('ml-4')
      }

      preview.appendChild(button)
      const item = createElementListItem('button', button, options)
      elementsList.appendChild(item)
    }
  })

  const addText = createButton({
    text: 'text',
    class: classes.text.colors
  })

  options.appendChild(addInput).classList.add('mr-4')
  options.appendChild(addButton).classList.add('mr-4')
  options.appendChild(addText)
}

section.appendChild(divider)  
section.appendChild(dom)

const createComponent = createButton({
  text: 'create component',
  class: classes.component.colors,
  onclick: () => {
    options.removeChild(createComponent)

    const item = createElementListItem(ELEMENTS.COMPONENT, null, options)
    elementsList.appendChild(item)

    renderComponentOptions()
  }
})

options.appendChild(createComponent)