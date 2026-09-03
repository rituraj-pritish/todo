import express from 'express'
import path from 'node:path'

const PORT = process.env.PORT 
const BASE = process.env.BASE_PATH
const APP_PATH = path.resolve(process.env.VIEW_DIRECTORY || BASE)
const BUILD_DIRECTORY = process.env.BUILD_DIRECTORY

const IS_DEVELOPMENT_ENVIRONMENT = !['production'].includes(process.env.NODE_ENV) 
const SSR_SERVER_PATH = `./${BUILD_DIRECTORY}/server/index-server.js`

const app = express()

let vite
if (IS_DEVELOPMENT_ENVIRONMENT) {
  const { createServer } = await import('vite')
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base: BASE,
  })
  app.use(vite.middlewares)
} 

app.use(async (req, res) => {
  try {
    let render
    if (IS_DEVELOPMENT_ENVIRONMENT) {
      render = (await vite.ssrLoadModule(`${APP_PATH}/index-server.jsx`)).render
    } else {
      render = (await import(SSR_SERVER_PATH)).render
    }
      
    render(res)
  } catch (e) {
    vite?.ssrFixStacktrace(e)
    console.log('err', e.stack)
    res.status(500).end(e.stack)
  }
})

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`)
})

export default app