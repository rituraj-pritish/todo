const PRODUCTION_NODE_ENV = 'production'
export const IS_DEVELOPMENT_ENVIRONMENT = ![PRODUCTION_NODE_ENV].includes(process.env.NODE_ENV)

export const PORT = 8000
export const BUILD_DIR = 'dist'
export const SOURCE_DIR = 'src'
export const LOADING_FILE = 'index.loading.jsx'
export const PAGE_FILE = 'index.jsx'
export const HTML_FILE = 'index.html'
export const CSS_FILE = 'index.css'
export const HTML_PATH = `${SOURCE_DIR}/${HTML_FILE}`

export const getBuildFile = file => {
    if(typeof file !== 'string') throw new Error('argument should be a string, file path')
    return file.slice(0, file.length - 1)
}

export const BUILD_PAGE_FILE = getBuildFile(PAGE_FILE)
export const BUILD_LOADING_FILE = getBuildFile(LOADING_FILE)

export const PGUSER = 'postgres'
export const PGPASSWORD = 'password'
export const PGHOST = 'localhost'
export const PGPORT = 5432

export const API_BUILDER_DIR = 'api-builder'