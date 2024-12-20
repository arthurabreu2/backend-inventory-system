import api from './client'

export async function loginUser(username, password) {
    const response = await api.post('/auth/', { username, password })
    return response.data
}

export async function registerUser(username, email, password) {
    const response = await api.post('/register/', { username, email, password })
    return response.data
}
