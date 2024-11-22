import React from 'react';
import AdminSideBar from '../components/admin/AdminSideBar';
import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
    return (
        <div className='flex min-h-screen w-screen bg-gradient-to-r from-gray-200 to-gray-400 overflow-hidden'>
            <AdminSideBar />

            <div className='flex-1 min-h-screen overflow-auto'>
                <Outlet />
            </div>
        </div>
    );
}
