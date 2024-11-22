// Resetpassword.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import useAuthStore from '../stores/authStore';
import { useNavigate, useParams } from 'react-router-dom';

export default function Resetpassword() {
    const email = useAuthStore((state) => state.ResetPasswordEmail);
    const [input, setInput] = useState({
        email: email || "", // ใช้อีเมลจาก store 
        password: "",
        confirmPassword: ""
    });


    const navigate = useNavigate()
    const { token } = useParams()
    console.log(token)
    useEffect(() => {  //check token URL is Match
        const verifyToken = async () => {
            if (!token) {
                navigate('/pagenotfound');
                return;
            }
            try {
                await axios.get(`http://localhost:8001/auth/verify-reset-token/${token}`);
            } catch (error) {
                console.error('Invalid token:', error);
                navigate('/pagenotfound');
            }
        };

        verifyToken();
    }, [token, navigate]);


    useEffect(() => {
        setInput((prev) => ({ ...prev, email })); // อัปเดตอีเมลใน input เมื่อค่าใน store เปลี่ยน
    }, []);

    const handleChange = (e) => {
        setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleResetPasswordSubmit = async (e) => {
        e.preventDefault();
        if (input.password !== input.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }
        try {
            await axios.patch("http://localhost:8001/auth/reset-password", input);
            toast.success("Password reset successful");
        } catch (err) {
            toast.error("Failed to reset password");
        }
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen w-screen mx-auto bg-gradient-to-b from-gray-300 to-gray-100 p-5">
            <form onSubmit={handleResetPasswordSubmit} className="bg-white shadow-md rounded-lg p-8 w-full max-w-md space-y-6">
                <h2 className="text-4xl font-bold text-center text-gray-700" style={{ fontFamily: 'Pacifico, cursive' }}>
                    Reset Your Password
                </h2>

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
                    <input
                        onChange={handleChange}
                        type="text"
                        placeholder="Type here"
                        name="email"
                        value={input.email}
                        className="input input-bordered input-primary w-full border-gray-300 rounded-md p-2"
                        readOnly
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">New Password</label>
                    <input
                        onChange={handleChange}
                        type="password"
                        placeholder="Type here"
                        name="password"
                        value={input.password}
                        className="input input-bordered input-primary w-full border-gray-300 rounded-md p-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Confirm Password</label>
                    <input
                        onChange={handleChange}
                        name="confirmPassword"
                        value={input.confirmPassword}
                        type="password"
                        placeholder="Type here"
                        className="input input-bordered input-primary w-full border-gray-300 rounded-md p-2"
                    />
                </div>

                <button className="btn btn-outline btn-accent w-full mt-4 rounded-md py-2 font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:bg-blue-600 transition">
                    Reset Password
                </button>
            </form>
        </div>
    );
}


