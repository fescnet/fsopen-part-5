import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null
const setToken = newToken => {  token = `bearer ${newToken}` }

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (id, object) => {
  const config = {
    headers: { Authorization: token },
  }
  const formattedObj = { ...object, user: object.user.id }
  const response = await axios.put(`${baseUrl}/${id}`, formattedObj, config)
  return response.data
}

const deleteOne = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response
}

export default {
  getAll,
  create,
  setToken,
  update,
  deleteOne
}
