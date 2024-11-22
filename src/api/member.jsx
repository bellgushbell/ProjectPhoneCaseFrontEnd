import axios from 'axios'




export const listMember = (token) => (
    axios.get("http://localhost:8001/member/member", {
        headers: {
            Authorization: `Bearer ${token}`
        }

    })

)

export const removeMember = (token, id) => {
    return axios.delete("http://localhost:8001/member/member/" + id, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}


export const UpdateRolemember = (token, id, form) => {
    return axios.patch("http://localhost:8001/member/member/" + id, form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })


}
