import axios from 'axios'


const URL = import.meta.env.VITE_API_URL

export const listMember = (token) => (
    axios.get(`${URL}/member/member`, {
        headers: {
            Authorization: `Bearer ${token}`
        }

    })

)

export const removeMember = (token, id) => {
    return axios.delete(`${URL}/member/member/` + id, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}


export const UpdateRolemember = (token, id, form) => {
    return axios.patch(`${URL}/member/member/` + id, form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })


}
