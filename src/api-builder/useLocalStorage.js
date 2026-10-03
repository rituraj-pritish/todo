export default (dbKey) => {
  if(!dbKey) throw new Error('argument "db key" is required')

  const getDb = () => {
    return JSON.parse(localStorage.getItem(dbKey)) || {}
  }

  const get = (key) => {
    const db = getDb()
    return db[key]
  }

  const set = (key, data) => {
    const db = getDb()
    db[key] = data
    localStorage.setItem(dbKey, JSON.stringify(db))
  }

  const del = (key) => {
    const db = JSON.parse(localStorage.getItem(dbKey))
    delete db[key] 
    localStorage.setItem(dbKey, JSON.stringify(db))
  }

  return {
    get,
    set,
    del
  }
}