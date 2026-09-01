import express from 'express'
import fs from 'node:fs/promises'
import path from 'node:path'

const isProduction = process.env.NODE_ENV === 'production'
const PORT = process.env.PORT || 8000
const BASE = process.env.BASE || '/'
const APP_PATH = path.resolve('app')

const templateHtml = isProduction
  ? await fs.readFile(`./dist/client/index.html`, 'utf-8')
  : ''

const app = express()

let vite
if (!isProduction) {
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
    if (!isProduction) {
      template = await fs.readFile(`.${BASE}/index.html`, 'utf-8')
      template = await vite.transformIndexHtml(url, template)
      render = (await vite.ssrLoadModule(`${APP_PATH}/index-server.jsx`)).render
    } else {
      if(url.includes('assets')) {
        res.sendFile(url, {
          root: './dist/client'
        })
        return
      } else {
        template = templateHtml
        render = (await import('./dist/server/index-server.js')).render
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