import React, { useEffect, useState } from 'react'
import useUserStore from '../stores/authStore'
import { Navigate } from 'react-router-dom'
import { CurrentUser } from '../components/Currentuser'
import Loading from '../components/loading/Loading-login'


const ProtectRoute = ({ element, allow }) => {
    const [isAllowed, setIsAllowed] = useState(null)


    const token = useUserStore((state) => state.token)
    // const user = useUserStore((state) => state.user)
    // console.log('token from Protectroute', token)
    // console.log('role from Protectroute', user.user.role)

    useEffect(() => {
        checkRole()
    }, [])

    const checkRole = async () => {

        try {
            const resp = await CurrentUser(token)
            // console.log(resp)
            const role = resp.data.member.role
            console.log('role from backend', role)

            if (allow.includes(role)) {
                setIsAllowed(true)
            } else {
                console.log(err)
                setIsAllowed(false)
            }

        } catch (err) {
            console.log(err)
            setIsAllowed(false)
        }
    }
    if (isAllowed === null) {
        return <Loading /> //ทำloading 1 จังหวะเฉยๆ zzz
    }

    if (!isAllowed) {
        return <Navigate to={'/unauthorization'} />
    }



    return element

}

export default ProtectRoute
