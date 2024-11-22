import React, { useState } from 'react';
import camerapic from '../assets/camera login register.jpg';
import bgloginform from '../assets/bg login 1-1.jpg';
import bglogincontainer from '../assets/bg login 1.png';
import logo from '../assets/Logo PTCASE 2.gif';
import ForgotPasswordModal from '../pages/ForgotPasswordModal';
import useAuthStore from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import LoadingLogin from './loading/Loading-login';
import { motion } from 'framer-motion'; // นำเข้า motion
import { validateLogin } from '../utills/validator';

const LoginPage = () => {
    const navigate = useNavigate();
    const [formErrors, setFormErrors] = useState({});

    // Javascript
    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    // Zustand
    const actionLogin = useAuthStore((state) => state.actionLogin);
    const loadingLogin = useAuthStore((state) => state.loadingLogin);

    const hdlOnChange = (e) => {
        console.log(e.target.name, e.target.value);
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const hdlSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log(form);

        //  validate with Joi
        const error = validateLogin(form);
        if (error) {
            return setFormErrors(error);
        }

        //zustand
        const role = await actionLogin(form);
        console.log(role);

        if (role) {
            roleRedirect(role);
        }

        setFormErrors({});
    };

    const roleRedirect = (role) => {
        console.log(role);
        if (role === 'ADMIN') {
            // Redirect
            navigate('/admin');
        } else {
            // Redirect
            navigate('/user');
        }
    };

    const goToRegister = (e) => {
        e.preventDefault();
        navigate('/register');
    };

    if (loadingLogin) {
        return <LoadingLogin />;
    }

    return (
        <div className="flex justify-center items-center min-h-screen w-full" style={{
            backgroundImage: `url(${bglogincontainer})`
        }}>
            {/* โลโก้ */}
            <div
                className="absolute top-3 left-1 w-[300px] h-[120px] bg-contain bg-no-repeat"
                style={{
                    backgroundImage: `url(${logo})`
                }}
            ></div>

            {/* คอนเทนเนอร์ของฟอร์มล็อกอิน */}
            <motion.form
                onSubmit={hdlSubmit}
                className="p-10 rounded-[60px] shadow-lg w-96 h-[600px] space-y-6 bg-contain bg-center"
                style={{ backgroundImage: `url(${bgloginform})` }}
                initial={{ opacity: 0, scale: 0.8 }} // เริ่มต้นที่ขนาดเล็กและโปร่งใส
                animate={{ opacity: 1, scale: 1 }} // เคลื่อนไหวไปที่ขนาดปกติและโปร่งใสเต็มที่
                transition={{ duration: 0.5 }} // ใช้เวลา 0.5 วินาทีในการเคลื่อนไหว
            >
                <div className="flex items-center space-x-4 ">
                    <div className="w-20 h-20 bg-contain bg-center border border-black rounded-3xl" style={{ backgroundImage: `url(${camerapic})` }}>
                    </div>

                    <h1 className="text-6xl font-bold mb-6 mt-3" style={{ fontFamily: 'Pacifico, cursive' }}>Login</h1>
                </div>
                <p className="h-[10px] text-center font-bold font-crimson text-[20px]" style={{ fontFamily: 'Crimson Text, serif' }}>Email</p>
                <input onChange={hdlOnChange} name="email" type="text" placeholder="Email" className="input input-bordered w-full mb-4 bg-gray-800 text-white font-light h-10" />
                <span className="text-red-800 text-xs">{formErrors.email}</span>
                <p className="h-[10px] text-center font-bold font-crimson  text-[20px]" >Password</p>
                <input onChange={hdlOnChange} name="password" type="password" placeholder="Password" className="input input-bordered w-full mb-4 bg-gray-800 text-white font-light h-10" />
                <span className="text-red-800 text-xs">{formErrors.password}</span>

                {/* forgot password */}
                <div className="flex justify-end w-full">
                    <button
                        className="shadow-lg"
                        type="button" // ไม่ส่งข้อมูลฟอร์ม
                        onClick={() => document.getElementById('forgotpassword-modal').showModal()}
                    >
                        Forgot Password?
                    </button>
                </div>
                <dialog id="forgotpassword-modal" className="modal">
                    <div className="modal-box ">
                        <button
                            type="button"
                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                            onClick={e => e.target.closest('dialog').close()}
                        >
                            ✕
                        </button>
                        <ForgotPasswordModal />
                    </div>
                </dialog>

                <div className="flex flex-col items-center space-y-4">
                    <motion.button
                        className="btn btn-neutral w-[170px] font-bold bg-black rounded-3xl font-crimson"
                        whileHover={{ scale: 1.05 }} // ขยายขนาดเมื่อโฮเวอร์
                        whileTap={{ scale: 0.95 }} // ลดขนาดเมื่อคลิก
                    >
                        Log In
                    </motion.button>
                    <motion.button
                        onClick={goToRegister}
                        className="flex btn btn-neutral w-[170px] font-bold bg-[#484848] rounded-3xl font-crimson"
                        whileHover={{ scale: 1.05 }} // ขยายขนาดเมื่อโฮเวอร์
                        whileTap={{ scale: 0.95 }} // ลดขนาดเมื่อคลิก
                    >
                        Sign Up
                    </motion.button>
                </div>
            </motion.form>
        </div>
    );
};

export default LoginPage;


