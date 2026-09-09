import fs from 'node:fs/promises'
import express from 'express'

import { API_BUILDER_DIR, BUILD_DIR, BUILD_LOADING_FILE, HTML_PATH } from '../../constants.js'

const router = express.Router()

router.use('/', async (req, res, next) => {
  if(req.url.startsWith('/api/')) {
    next('route')
  } else {
    const loadingFilePath = `${BUILD_DIR}/${API_BUILDER_DIR}/${BUILD_LOADING_FILE}`

    // todo
    // prepare html file while building

    let html
    try {
      html = await fs.readFile(HTML_PATH, 'utf-8')
    } catch (error) {
      throw error
    }

    let Loading
    try {
      await fs.access(loadingFilePath, fs.constants.F_OK)
      Loading = await import(loadingFilePath)

      const loadingHTML = renderToString(createElement(Loading.default))
      html = html.toString()
        .replace("--ROOT--", loadingHTML)
    } catch (error) {
      html = html.toString()
        .replace("--ROOT--", '')
    }

    const cssFilePath = `${BUILD_DIR}/${API_BUILDER_DIR}/index.css`
    try {
      await fs.access(cssFilePath, fs.constants.F_OK)
      
      html = html
        .replace("--HREF--", cssFilePath)
    } catch (error) {
      html = html
      .replace(/<link[^>]*>[\s\S]*?/gi, '') 
    }

    const jsFilePath = `${BUILD_DIR}/${API_BUILDER_DIR}/index.js`
    html = html
        .replace("<script>\"--SCRIPT--\"</script>", `<script type="module" src="${jsFilePath}"></script>`)
    
    res.send(html)
  }
})

router.route('/api/database')
  .post(async (req, res) => {
    fs.writeFile(`${'server'}/db.js`, 'export default {}', err => {
      if(err) throw err;

      res.status(200).send({})
    })
  })

export default router