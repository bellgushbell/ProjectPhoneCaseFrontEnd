import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import useAuthStore from '../stores/authStore';
const URL = import.meta.env.VITE_API_URL

export default function ForgotPasswordModal() {
    const [input, setInput] = useState({
        email: ""
    });
    const setEmailForReset = useAuthStore((state) => state.setEmailForReset);

    const handleForgotPasswordEmail = (e) => {
        setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleModalEmailSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${URL}/auth/forgot-password`, { email: input.email });
            setEmailForReset(input.email); // บันทึกอีเมลใน store
            toast.success("Email sent successfully 📧");
        } catch (err) {
            toast.error("Error sending email");
        }
    };

    return (
        <div className="flex items-center">
            <p className="mr-1">Please Insert Email: </p>
            <input
                onChange={handleForgotPasswordEmail}
                name="email"
                value={input.email}
                type="text"
                placeholder="Type here"
                className="input input-bordered input-primary w-[300px] max-w-xs h-12"
            />
            <button onClick={handleModalEmailSubmit} className="btn btn-active btn-primary ml-2 mr-2 h-8">
                Send Email
            </button>
        </div>
    );
}

