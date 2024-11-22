import React from 'react'
import TableMember from './TableMember'
import useAuthStore from '../../stores/authStore';

export default function UserManageMent() {

    const user = useAuthStore(state => state.user);
    return (

        <div className='flex flex-col gap-4 rounded-sm border border-gray-200 pl-4 shadow-md min-h-screen' style={{ backgroundImage: 'url(https://image.slidesdocs.com/responsive-images/background/blue-pastel-abstract-texture-gradient-backdrop-for-wallpapers-and-patterns-powerpoint-background_2ea76d0737__960_540.jpg)', backgroundSize: 'cover' }}>
            <TableMember currentUser={user} />
        </div>
    )
}
