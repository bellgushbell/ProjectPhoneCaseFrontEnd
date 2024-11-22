import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
import logoutbutton from '../../assets/logoutbutton2.gif';

export default function AdminSideBar() {
    const navigate = useNavigate();
    const { user, actionLogout } = useAuthStore();

    const handleLogout = () => {
        actionLogout();
        navigate('/login');
    };

    return (
        <div className='w-52 min-h-screen p-6 bg-gradient-to-b from-gray-700 to-gray-900 shadow-lg '>
            <div className='mb-6 text-white text-center'>
                <h2 className='text-xl font-semibold'>{user?.firstName || 'Guest'}</h2>
                <p className='text-sm'>{user?.email || 'guest@example.com'}</p>
            </div>

            <ul className='space-y-4'>
                <li>
                    <NavLink to="/admin" end className={({ isActive }) => (isActive ? 'text-blue-400 font-bold' : 'text-gray-300 hover:text-blue-400')}>
                        Dashboard
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/manage-user" className={({ isActive }) => (isActive ? 'text-blue-400 font-bold' : 'text-gray-300 hover:text-blue-400')}>
                        Manage User
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/create-product" className={({ isActive }) => (isActive ? 'text-blue-400 font-bold' : 'text-gray-300 hover:text-blue-400')}>
                        Add Product
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/manage-products" className={({ isActive }) => (isActive ? 'text-blue-400 font-bold' : 'text-gray-300 hover:text-blue-400')}>
                        Manage Products
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/manage-order" className={({ isActive }) => (isActive ? 'text-blue-400 font-bold' : 'text-gray-300 hover:text-blue-400')}>
                        Manage Order
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/manage-payment" className={({ isActive }) => (isActive ? 'text-blue-400 font-bold' : 'text-gray-300 hover:text-blue-400')}>
                        Manage Payment
                    </NavLink>
                </li>
            </ul>

            <div className='mt-10 flex justify-center'>
                <div
                    onClick={handleLogout}
                    className="transition-transform duration-200 hover:scale-105 cursor-pointer"
                >
                    <img
                        src={logoutbutton}
                        alt="Logout"
                        className="w-28 object-cover"
                    />
                </div>
            </div>
        </div>
    );
}
