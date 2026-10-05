const PRODUCTION_NODE_ENV = 'production'
export const IS_DEVELOPMENT_ENVIRONMENT = ![PRODUCTION_NODE_ENV].includes(process.env.NODE_ENV)

export const PORT = 8000
export const BUILD_DIR = 'dist'
export const SOURCE_DIR = 'src'

export const HTML_FILE = 'index.html'
export const LOADING_FILE = 'index.loading.html'
export const PAGE_FILE = 'main.js'
export const CSS_FILE = 'index.css'

export const HTML_PATH = `${SOURCE_DIR}/${HTML_FILE}`

