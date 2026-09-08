import fs from 'node:fs'
import express from 'express'

import { API_BUILDER_DIR, BUILD_DIR, BUILD_LOADING_FILE, INDEX_HTML_PATH } from '../../constants.js'

const router = express.Router()

router.use('/', async (req, res, next) => {
  if(req.url.startsWith('/api/')) {
    next('route')
  } else {
    const basePath = `./${BUILD_DIR}/${API_BUILDER_DIR}`
    const loadingFilePath = `${basePath}/${BUILD_LOADING_FILE}`
    let loadingFileExists, Loading
    fs.access(loadingFilePath, fs.constants.F_OK, doesNotExist => {
        loadingFileExists = !doesNotExist
    })
    
    if(loadingFileExists) {
        Loading = await import(loadingFilePath)
    }

    fs.readFile(INDEX_HTML_PATH, (err, html) => {
      if(err) throw err;

      if(loadingFileExists) {
          const loadingHTML = renderToString(createElement(Loading.default))
          html = html.toString()
              .replace("--ROOT--", loadingHTML)
      } else {
          html = html.toString()
              .replace("--ROOT--", '')
      }

      const cssFilePath = `${basePath}/index.css`
      let cssFileExists
      fs.access(cssFilePath, fs.constants.F_OK, doesNotExist => {
          cssFileExists = !doesNotExist
      })

      if(cssFileExists) {
          html = html
              .replace("--HREF--", cssFilePath)
      } else {
          html = html
              .replace(/<link[^>]*>[\s\S]*?/gi, '')
              // .replace(CSS_PLACEHOLDER_ELEMENT, '')            
      }

      const jsFilePath = `${basePath}/index.js`
      html = html
          .replace("<script>\"--SCRIPT--\"</script>", `<script type="module" src="${jsFilePath}"></script>`)
      
      res.send(html)
    })
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