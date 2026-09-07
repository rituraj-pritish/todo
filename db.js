import { Pool } from "pg";

import { PGHOST, PGPASSWORD, PGPORT, PGUSER } from "./constants.js";

const pool = new Pool ({
    user: PGUSER,
    password: PGPASSWORD,
    host: PGHOST,
    port: PGPORT 
})

export const getTodos = async ({session_id}) => {
    if(!session_id) throw new Error('argument session_id is undefined')
    const res = await pool.query(`
        select * from todos where session_id = '${session_id}'
    `)
    return res.rows
}

export const addTodo = async ({session_id, title}) => {
    if(!session_id) throw new Error('argument session_id is undefined')
    await pool.query(`
        insert into todos (session_id, title)
        values('${session_id}', '${title}');
    `)
}

export const completeTodo = async ({id}) => {
    if(!session_id) throw new Error('argument id is undefined')
    await pool.query(`
        update todos
        set completed = true
        where id = '${id}'
    `)
}

export const deleteTodo = async ({id}) => {
    if(!session_id) throw new Error('argument id is undefined')
    await pool.query(`
        delete from todos
        where id = '${id}'
    `)
}