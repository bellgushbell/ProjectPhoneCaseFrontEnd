import React from 'react';
import { useNavigate } from 'react-router-dom';
import unauthwarn from '../assets/unauthorize.gif'
const UnauthorizedPage = () => {
    const navigate = useNavigate();

    const goBack = () => {
        navigate("/");
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 w-screen">
            <div className="bg-white shadow-lg rounded-lg p-10 max-w-lg text-center flex flex-col justify-center items-center">


                <h2 className="text-3xl font-bold mb-5 text-red-500 ">
                    401 Unauthorized Access</h2>
                <img src={unauthwarn} alt="unauth" className='h-[400px]'></img>
                <p className="text-gray-600 mb-8 font-semibold">
                    Sorry, you don't have permission to access this page.
                </p>

                <button
                    onClick={goBack}
                    className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                >
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default UnauthorizedPage;
