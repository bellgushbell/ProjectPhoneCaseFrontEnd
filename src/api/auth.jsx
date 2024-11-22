import axios from 'axios'
const URL = import.meta.env.VITE_API_URL
export const register = (form) => {
    return axios.post(`${URL}/auth/register`, form)
}

export const Login = (form) => {
    return axios.post(`${URL}/auth/login`, form)
}

export const currentuser = (token) => {
    return axios.post(`${URL}/auth/current-user`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

