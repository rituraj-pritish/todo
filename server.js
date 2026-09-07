import express from 'express'
import fs from 'node:fs'
import { renderToString } from 'react-dom/server'
import { createElement } from 'react'
import { BUILD_DIR, BUILD_LOADING_FILE, INDEX_HTML_PATH, IS_DEVELOPMENT_ENVIRONMENT, PORT, VIEW_SRC } from './constants.js'

import {
    getTodos,
    completeTodo,
    deleteTodo,
    addTodo
} from './db.js'

const app = express()

if(IS_DEVELOPMENT_ENVIRONMENT) {
    fs.watch(VIEW_SRC, {recursive: true}, (_, filename) => {
        if(filename) {
            import('./build.js')
        }
    })
}

const apiRouter = express.Router()

apiRouter.use(express.json())

const getSessionIdFromCookie = (req) => {
    const sessionCookie = req.headers.cookie.split('; ')
            .find(cookie => cookie.startsWith('session_id'))
        
    if(!sessionCookie)
        res.status(500).end()

    const session_id = sessionCookie.replace('session_id=', '')

    if(!sessionCookie)
            res.status(500).end()

    return session_id.toString()
}

apiRouter.route('/todos')
    .get(async (req, res) => {
        const session_id = getSessionIdFromCookie(req)

        const todos = await getTodos({session_id})
        res.send({
            data: todos
        })
    })
    .post(async (req, res) => {
        const {title} = req.body
        const session_id = getSessionIdFromCookie(req)

        await addTodo({
            session_id,
            title: title
        })
    })

apiRouter.route('/todos/:id')
    .put(async (req, res) => {
        await completeTodo()
    })
    .delete(async (req, res) => {
        await deleteTodo()
    })

app.use('/api/', apiRouter)

app.use(`/${BUILD_DIR}`, (req, res) => {
    res.sendFile(req.url.replace(`/${BUILD_DIR}`, ''), {
        root: 'dist'
    })
})

app.use('/', async (req, res, next) => {
    if(req.url.startsWith('/api')) {
        next('route')
    } else {
        const Loading = await import(`./${BUILD_DIR}/${BUILD_LOADING_FILE}`)

        // make part of build process, and move to dist folder
        fs.readFile(INDEX_HTML_PATH, (err, html) => {
            if(err) throw err;

            const loadingHTML = renderToString(createElement(Loading.default))

            html = html.toString()
                .replace("--ROOT--", loadingHTML)
                .replace("<script>\"--SCRIPT--\"</script>", '<script type="module" src="dist/view.js"></script>')
                .replace("--HREF--", "dist/view.css")

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