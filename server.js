import express from 'express'
import fs from 'node:fs/promises'
import path from 'node:path'

const PORT = process.env.PORT 
const BASE = process.env.BASE_PATH
const APP_PATH = path.resolve(process.env.VIEW_DIRECTORY || BASE)
const BUILD_DIRECTORY = process.env.BUILD_DIRECTORY

const IS_DEVELOPMENT_ENVIRONMENT = !['production'].includes(process.env.NODE_ENV) 
const TEMPLATE_PATH = `./${BUILD_DIRECTORY}/client/index.html`
const SSR_SERVER_PATH = `./${BUILD_DIRECTORY}/server/index-server.js`

const templateHtml = IS_DEVELOPMENT_ENVIRONMENT
  ? ''
  : await fs.readFile(TEMPLATE_PATH, 'utf-8')

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

app.use('*all', async (req, res) => {
  try {
    const url = req.originalUrl.replace(BASE, '')

    let template
    let render
    if (IS_DEVELOPMENT_ENVIRONMENT) {
      template = await fs.readFile(`.${BASE}/index.html`, 'utf-8')
      template = await vite.transformIndexHtml(url, template)
      render = (await vite.ssrLoadModule(`${APP_PATH}/index-server.jsx`)).render
    } else {
      if(url.includes('assets')) {
        res.sendFile(url, {
          root: `./${BUILD_DIRECTORY}/client`,
        })
        return
      } else {
        template = templateHtml
        render = (await import(SSR_SERVER_PATH)).render
      }
    }
      
    const rendered = await render(url)

    const html = template
    .replace(`<!--app-head-->`, rendered.head ?? '')
    .replace(`<!--app-html-->`, rendered.html ?? '')

    res.status(200)
      .set({ 'Content-Type': 'text/html' })
      .send(html)
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