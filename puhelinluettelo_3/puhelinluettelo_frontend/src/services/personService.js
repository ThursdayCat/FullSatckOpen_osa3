import axios from 'axios'

const baseUrl = '/api/persons'

const getAll = () => {
    return axios.get(baseUrl).then(response => response.data)
}

const createNew = (newObject) => {
    return axios.post(baseUrl, newObject).then(response => response.data)
}

const update = (id, newObject) => {
    return axios.put(`${baseUrl}/${id}`, newObject).then(response => response.data)

}

const deleteObject = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
}

export default { getAll, createNew, update, deleteObject}