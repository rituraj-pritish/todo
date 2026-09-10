import express from 'express'
import fs from 'node:fs'
import { renderToString } from 'react-dom/server'
import { createElement } from 'react'
import {serveBuildDir} from '../serve.js'

import { API_BUILDER_DIR, BUILD_DIR, BUILD_LOADING_FILE, BUILD_PAGE_FILE, HTML_PATH, IS_DEVELOPMENT_ENVIRONMENT, PORT, SOURCE_DIR } from '../constants.js'

import apiBuilder from './api-builder/index.js'

const app = express()

await serveBuildDir()

app.use(`/${API_BUILDER_DIR}`, apiBuilder)

app.use(`/${BUILD_DIR}`, (req, res) => {
    res.sendFile(req.url.replace(`/${BUILD_DIR}`, ''), {
        root: 'dist'
    })
})

const APPLICATION_TITLE = 'todo'

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

app.use('/', async (req, res, next) => {
    if(req.url.startsWith('/api') || req.url.startsWith(`/${API_BUILDER_DIR}`)) {
        next('router')
    } else {
        const Loading = await import(`../${BUILD_DIR}/${BUILD_LOADING_FILE}`)

        // make part of build process, and move to dist folder
        fs.readFile(HTML_PATH, (err, html) => {
            if(err) throw err;

            const loadingHTML = renderToString(createElement(Loading.default))

            html = html.toString()
                .replace('FRAGILE', APPLICATION_TITLE)
                .replace("--ROOT--", loadingHTML)
                .replace("<script>\"--SCRIPT--\"</script>", `<script type="module" src="${BUILD_DIR}/${BUILD_PAGE_FILE}"></script>`)
                .replace("--HREF--", `${BUILD_DIR}/${BUILD_PAGE_FILE}`)

             const sessionCookie = req.headers.cookie?.split('; ')
                ?.find(cookie => cookie.startsWith('session_id'))
            
            if(!sessionCookie) {
                const id = Date.now()
                res.cookie('session_id', id)
            }
            
            res.send(html)
        })
    }
})

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`)
})