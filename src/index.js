import fs from 'node:fs/promises'
import express from 'express'

import { BUILD_DIR, CSS_FILE, HTML_PATH, IS_DEVELOPMENT_ENVIRONMENT, LOADING_FILE, PAGE_FILE, PORT, SOURCE_DIR } from '../constants.js'
import { serveBuildDir } from '../serve.js'

const app = express()

await serveBuildDir()

if(IS_DEVELOPMENT_ENVIRONMENT) {
  app.get('/api/re-load', async (req, res) => {
    try {
      res.set({
        'content-type': 'text/event-stream',
        'connection': 'keep-alive',
        'Cache-Control': 'no-cache',
      })

      res.on('close', () => {
        res.end()
      })

      res.write('re-load', 'utf-8')   
    } catch (error) {
      res.send(error.message)
    }
  })
}

app.use(`/${BUILD_DIR}`, (req, res) => {
  res.sendFile(req.url.replace(`/${BUILD_DIR}`, ''), {
    root: BUILD_DIR
  })
})

app.use('/', async (req, res, next) => {
  if(req.url.startsWith('/api/')) {
    next('route')
  } else {
    const loadingFilePath = `${SOURCE_DIR}/${LOADING_FILE}`

    // todo
    // prepare html file while building

    let html = await fs.readFile(HTML_PATH, 'utf-8')

    try {
      await fs.access(loadingFilePath, fs.constants.F_OK)
      const loadingHTML = await fs.readFile(loadingFilePath, 'utf-8')

      html = html.toString()
        .replace("--ROOT--", loadingHTML)
    } catch {
      html = html.toString()
        .replace("--ROOT--", '')
    }

    const cssFilePath = `${BUILD_DIR}/${CSS_FILE}`
    try {
      await fs.access(cssFilePath, fs.constants.F_OK)
      
      html = html
        .replace("--HREF--", cssFilePath)
    } catch {
      html = html
        .replace(/<link[^>]*>[\s\S]*?/gi, '') 
    }

    const jsFilePath = `${BUILD_DIR}/${PAGE_FILE}`
    html = html
      .replace("<script>\"--SCRIPT--\"</script>", `<script type="module" src="${jsFilePath}"></script>`)
    
    res.send(html)
  }
})

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`)
})