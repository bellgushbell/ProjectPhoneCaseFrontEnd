import axios from 'axios'

export const register = (form) => {
    return axios.post('http://localhost:8001/auth/register', form)
}

export const Login = (form) => {
    return axios.post('http://localhost:8001/auth/login', form)
}

export const currentuser = (token) => {
    return axios.post('http://localhost:8001/auth/current-user', {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

