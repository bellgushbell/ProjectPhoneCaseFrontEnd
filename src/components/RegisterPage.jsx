import React, { useState } from 'react';
import logo from '../assets/Logo PTCASE 2.gif';
import signupbg from '../assets/bg sign up 1.jpg';
import signupbgContainer from '../assets/sign up bg 2.png';
import camerapic from '../assets/camera login register.jpg';
import validateRegister from '../utills/validator';
import useAuthStore from '../stores/authStore';
import LoadingRegisterComponenet from './loading/Loading-register';
import { motion } from 'framer-motion'; // นำเข้า motion
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const actionRegister = useAuthStore((state) => state.actionRegister);
    const loadingRegister = useAuthStore((state) => state.loadingRegister);
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        confirmPassword: ""
    });

    const [formErrors, setFormErrors] = useState({});

    const hdlOnChange = (e) => {
        // console.log(e.target.name, e.target.value);
        setForm({
            ...form, [e.target.name]: e.target.value
        });
    };

    const hdlSubmit = async (e) => {
        e.preventDefault();

        // console.log(form);

        //  validate with Joi
        const error = validateRegister(form);
        if (error) {
            return setFormErrors(error);
        }

        // Send to back
        actionRegister(form);

        setForm({
            email: "",
            firstName: "",
            lastName: "",
            password: "",
            confirmPassword: ""
        });

        setFormErrors({});
        navigate("/login")
    };

    if (loadingRegister) {
        return <LoadingRegisterComponenet />;
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-contain bg-no-repeat bg-center w-full" style={{
            backgroundImage: `url(${signupbgContainer})`,
            backgroundSize: '100%'
        }}>
            <div
                className="absolute top-3 left-1 w-[300px] h-[120px] bg-contain bg-no-repeat"
                style={{
                    backgroundImage: `url(${logo})`
                }}
            ></div>

            <motion.form
                onSubmit={hdlSubmit}
                className="p-10 rounded-[60px] shadow-lg w-96 h-[650px] space-y-5 bg-contain bg-center"
                style={{ backgroundImage: `url(${signupbg})` }}
                initial={{ opacity: 0, scale: 0.8 }} // เริ่มต้นที่ขนาดเล็กและโปร่งใส
                animate={{ opacity: 1, scale: 1 }} // เคลื่อนไหวไปที่ขนาดปกติและโปร่งใสเต็มที่
                transition={{ duration: 0.5 }} // ใช้เวลา 0.5 วินาทีในการเคลื่อนไหว
            >
                <div className="flex items-center space-x-4 gap-1">
                    <div className="w-20 h-20 bg-contain bg-center border border-black rounded-3xl" style={{ backgroundImage: `url(${camerapic})` }}>
                    </div>
                    <h1 className="flex text-5xl font-bold mb-6 mt-3 justify-center items-start" style={{ fontFamily: 'Pacifico, cursive' }}>SignUp</h1>
                </div>

                <p className="h-[10px] text-center font-bold font-crimson flex items-center justify-center text-[#4B0082]" style={{ fontFamily: 'Crimson Text, serif' }}>Email</p>
                <input onChange={hdlOnChange} name="email" value={form.email} type="text" placeholder="Email" className="pl-4 rounded-md w-full mb-4 bg-gray-800 text-white font-light" />
                <span className="text-red-800 text-xs">{formErrors.email}</span>

                <p className="h-[10px] text-center font-bold font-crimson flex items-center justify-center text-[#4B0082]" style={{ fontFamily: 'Crimson Text, serif' }}>First Name</p>
                <input onChange={hdlOnChange} name="firstName" value={form.firstName} type="text" placeholder="First Name" className="pl-4 rounded-md w-full mb-4 bg-gray-800 text-white font-light" />
                <span className="text-red-800 text-xs">{formErrors.firstName}</span>

                <p className="h-[10px] text-center font-bold font-crimson flex items-center justify-center text-[#4B0082]" style={{ fontFamily: 'Crimson Text, serif' }}>Last Name</p>
                <input onChange={hdlOnChange} name="lastName" value={form.lastName} type="text" placeholder="Last Name" className="pl-4 rounded-md w-full mb-4 bg-gray-800 text-white font-light" />
                <span className="text-red-800 text-xs">{formErrors.lastName}</span>

                <p className="h-[10px] text-center font-bold font-crimson flex items-center justify-center text-[#4B0082]">Password</p>
                <input onChange={hdlOnChange} name="password" value={form.password} type="password" placeholder="Password" className="pl-4 rounded-md w-full mb-4 bg-gray-800 text-white font-light" />
                <span className="text-red-800 text-xs">{formErrors.password}</span>

                <p className="h-[10px] text-center font-bold font-crimson flex items-center justify-center text-[#4B0082]">Confirm Password</p>
                <input onChange={hdlOnChange} name="confirmPassword" value={form.confirmPassword} type="password" placeholder="Confirm Password" className="pl-4 rounded-md w-full mb-4 bg-gray-800 text-white font-light" />
                <span className="text-red-800 text-xs">{formErrors.confirmPassword}</span>

                <div className="flex flex-col items-center space-y-4">
                    <motion.button
                        className="btn btn-neutral w-[170px] font-bold bg-black rounded-3xl font-crimson"
                        whileHover={{ scale: 1.05 }} // ขยายขนาดเมื่อโฮเวอร์
                        whileTap={{ scale: 0.95 }} // ลดขนาดเมื่อคลิก
                        transition={{ type: 'spring', stiffness: 300 }} // สปริงเมื่อคลิก
                    >
                        Sign Up
                    </motion.button>
                </div>
            </motion.form>
        </div>
    );
};

export default RegisterPage;

