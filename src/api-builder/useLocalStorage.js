export default (key) => {
    if(!key) throw new Error('argument "key" is required')

    const get = (idx) => {
        return getAll()[idx]
    }

    const getAll = () => {
        const collection = localStorage.getItem(key)
        return collection ? JSON.parse(collection): []
    }

    const create = data => {
        localStorage.setItem(key, JSON.stringify([...getAll(), data]))
    }

    const update = (idx, data) => {
        const newValue = getAll()
        const record = newValue[idx]
        newValue[idx] = {
            ...record,
            ...data
        }
        localStorage.setItem(key, JSON.stringify(newValue))
    }

    const del = (idx) => {
        localStorage.setItem(key, JSON.stringify(getAll().filter((_, index) => index !== idx)))
    }

    return {
        get,
        getAll,
        create,
        update,
        del
    }
}