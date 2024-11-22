import React from 'react';
import { useNavigate } from 'react-router-dom';
import pagenotfound404 from '../../assets/404.gif'

export default function PageNotFound() {
    const navigate = useNavigate();

    const goHome = () => {
        navigate('/');
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 w-screen">
            <img src={pagenotfound404} alt="unauth" className='h-[400px]'></img>
            <h1 className="text-6xl font-bold text-gray-800">404</h1>
            <p className="text-2xl text-gray-600 mt-4">Oops! Page Not Found</p>
            <p className="text-lg text-gray-500 mt-2">
                The page you are looking for might have been removed or is temporarily unavailable.
            </p>
            <button
                onClick={goHome}
                className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
            >
                Go to Homepage
            </button>
        </div>
    );
}
