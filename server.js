import express from 'express'
import fs from 'node:fs'
import { renderToString } from 'react-dom/server'
import { createElement } from 'react'
import { BUILD_DIR, BUILD_LOADING_FILE, INDEX_HTML_PATH, IS_DEVELOPMENT_ENVIRONMENT, PORT, VIEW_SRC } from './constants.js'

const app = express()

if(IS_DEVELOPMENT_ENVIRONMENT) {
    fs.watch(VIEW_SRC, {recursive: true}, (_, filename) => {
        if(filename) {
            import('./build.js')
        }
    })
}

app.use(`/${BUILD_DIR}`, (req, res) => {
    //handle  only for js file
    // if(!IS_DEVELOPMENT_ENVIRONMENT) {
    //     res.set({
    //         'Content-Encoding': 'gzip',
    //         'Content-Type': 'application/javascript'
    //     })
    // }
    console.log('static', req.url)
    res.sendFile(req.url.replace(`/${BUILD_DIR}`, '') + (!IS_DEVELOPMENT_ENVIRONMENT ? '.gz' : ''), {
        root: 'dist'
    })
})

app.use('/', async (req, res) => {
    console.log('use', req.url)

    const Loading = await import(`./${BUILD_DIR}/${BUILD_LOADING_FILE}`)

    // make part of build process, and move to dist folder
    fs.readFile(INDEX_HTML_PATH, (err, html) => {
        if(err) throw err;

        const loadingHTML = renderToString(createElement(Loading.default))

        html = html.toString()
            .replace("--ROOT--", loadingHTML)
            .replace("<script>\"--SCRIPT--\"</script>", '<script type="module" src="dist/view.js"></script>')
            .replace("--HREF--", "dist/view.css")
        res.send(html)
    })
})

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`)
})