import axios from 'axios'

const API_BASE = 'http://localhost:8000'

export const api = {
  upload: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return axios.post(`${API_BASE}/upload`, formData)
  },
  processYoutube: (url) => {
    return axios.post(`${API_BASE}/youtube`, { url })
  },
  getStatus: (id) => {
    return axios.get(`${API_BASE}/status/${id}`)
  }
}
