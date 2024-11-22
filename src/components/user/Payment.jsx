import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../../stores/authStore';
import { toast } from 'react-toastify';
import Promptpay from '../../assets/Promptpay.jpg';
import Bank from '../../assets/bank.png';
import cash from '../../assets/cash.gif';
import LoadingSendingPay from '../loading/Loading-paymentsending';
import upload1 from '../../assets/upload1.gif';
import { motion, useAnimation } from 'framer-motion';
import slidebarpic from '../../assets/slideright.gif'

const URL = import.meta.env.VITE_API_URL
export default function PaymentForm() {
    const { orderId } = useParams(); // ดึงค่า orderId จาก URL
    const token = useAuthStore(state => state.token);
    const [paymentMethod, setPaymentMethod] = useState('SCAN');
    const [slip, setSlip] = useState(null);
    const navigate = useNavigate();
    const [loadingSendingPayment, setLoadingSendingPayment] = useState(false);
    const controls = useAnimation();
    // const [isCompleted, setIsCompleted] = useState(false); //การเลื่อน



    const handlePaymentMethodChange = (method) => {
        setPaymentMethod(method);
    };

    const handleSlipUpload = (event) => {
        setSlip(event.target.files[0]); // เก็บไฟล์ที่ผู้ใช้เลือกอัปโหลด
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('paymentMethod', paymentMethod);
        formData.append('slip', slip);

        try {
            setLoadingSendingPayment(true);
            await new Promise(resolve => setTimeout(resolve, 400));
            const response = await axios.post(`${URL}/payment/order/${orderId}/payment`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        // 'Content-Type': 'multipart/form-data'
                    }
                }
            );

            const paymentId = response.data.responseData.id; // รับค่า paymentId จาก response
            toast.success("Create Payment Success💸");
            navigate(`/user/order/${orderId}/payment/${paymentId}`); //ส่งไปเป็นurl ในAppRouter

        } catch (err) {
            controls.start({ x: 0 });
            const errMsg = err?.response?.data?.error || err.message;
            console.log(errMsg);
        } finally {
            setLoadingSendingPayment(false);
        }
    };

    if (loadingSendingPayment) {
        return <LoadingSendingPay />;
    }


    const formVariants = {
        hidden: { opacity: 0 }, //สถานะเริ่มต้นของอนิเมชันจะจาง
        visible: { opacity: 1 }, //เป็นสถานะเมื่ออนิเมชันเสร็จสิ้น จะมองเห็นได้
    };

    const handleDragEnd = (event, info) => { //ทำslidebarจุดสุด
        const offset = info.offset.x; //ใช้เพื่อดึงค่าการเลื่อนในแกน x ซึ่งเป็นระยะทางที่ผู้ใช้เลื่อน Slider ไปทางขวาหรือซ้าย
        const sliderWidth = 300; // กำหนดความยาวของ Slider
        if (offset > sliderWidth * 0.8) { //เช็คว่าการเลื่อน (offset) ของ Slider มากกว่า 80% ของความกว้างของ Slider หรือไม่
            // setIsCompleted(true); //ตัวแปรสถานะ isCompleted เป็น true เพื่อบอกว่าเสร็จสิ้นการเลื่อนแล้ว
            handleSubmit(); // submit ฟอร์มทันทีเมื่อเลื่อนขวาสุด
        }
    };

    return (
        <motion.form
            initial="hidden"
            animate="visible"
            variants={formVariants}
            transition={{ duration: 0.5 }}
            className="flex flex-col pt-8 min-h-screen h-[600px] w-[600px] mx-auto p-10  bg-gray-100 rounded-lg shadow-md"
        >
            <h2 className="text-3xl font-semibold mb-6 text-gray-600" style={{ fontFamily: 'Pacifico, cursive' }}>Select Payment Method</h2>
            <div className="flex justify-between mb-6">
                <button
                    type="button"
                    className={`w-1/3 py-2 border ${paymentMethod === 'BANK' ? 'bg-purple-200' : 'bg-white'} text-center`}
                    onClick={() => handlePaymentMethodChange('BANK')}
                >
                    Bank Transfer
                </button>
                <button
                    type="button"
                    className={`w-1/3 py-2 border ${paymentMethod === 'SCAN' ? 'bg-purple-200' : 'bg-white'} text-center`}
                    onClick={() => handlePaymentMethodChange('SCAN')}
                >
                    Prompt Pay
                </button>
                <button
                    type="button"
                    className={`w-1/3 py-2 border ${paymentMethod === 'CASH' ? 'bg-purple-200' : 'bg-white'} text-center`}
                    onClick={() => handlePaymentMethodChange('CASH')}
                >
                    Cash
                </button>
            </div>

            {paymentMethod === 'SCAN' ? (
                <div className="text-center mb-6">
                    <h3 className="text-lg font-medium mb-4">Scan QR Code for Prompt Pay</h3>
                    <div className="inline-block border border-gray-300 p-4">
                        <motion.img
                            src={Promptpay}
                            alt="Prompt Pay QR Code"
                            className="w-48 h-48 object-cover"
                        />
                    </div>
                </div>
            ) : paymentMethod === 'BANK' ? (
                <div className="text-center mb-6 flex justify-center items-center">
                    <motion.img
                        src={Bank}
                        alt="Bank Transfer QR Code"
                        className="w-48 h-60 object-contain"
                    />
                </div>
            ) : (
                <div className="text-center mb-6">
                    <h3 className="text-lg font-medium mb-4">Cash Payment</h3>
                    <div className="inline-block border border-gray-300 p-4">
                        <motion.img
                            src={cash}
                            alt="Cash Payment"
                            className="w-48 h-48"
                        />
                    </div>
                    <p>Please prepare the exact amount of cash.</p>
                </div>
            )}

            {paymentMethod !== 'CASH' && (
                <div className="mb-4">
                    <label htmlFor="slip" className="block text-sm font-medium text-gray-700">
                        <div className="border border-gray-300 bg-gray-200 rounded p-2 flex flex-col items-center cursor-pointer">
                            Upload Payment Slip
                            <img
                                src={upload1}
                                alt="Upload File"
                                className="w-20 h-15 mb-2"
                            />
                            <input
                                type="file"
                                id="slip"
                                name="slip"
                                accept="image/*"
                                onChange={handleSlipUpload}
                                className="block w-full cursor-pointer"
                            />
                        </div>
                    </label>
                </div>
            )}

            <div className="w-full bg-gray-300 rounded-full h-12 ">
                <motion.div
                    className="h-12 bg-purple-500 rounded-full"
                    drag="x" //คุณสมบัติของ Framer Motion เลื่อนแกนxเท่านั้น
                    dragConstraints={{ left: 0, right: 300 }} // จำกัดการเลื่อนของปุ่ม
                    onDragEnd={handleDragEnd}
                    whileTap={{ cursor: 'grabbing' }} // เปลี่ยนcursorเมื่อผู้ใช้กดปุ่ม โดยเคอร์เซอร์จะเปลี่ยนเป็นรูปแบบ "grabbing" ขณะกดปุ่ม ทำให้ผู้ใช้รู้ว่ากำลังทำการเลื่อน
                    style={{ width: '150px' }} // ความกว้างของปุ่ม Slide
                    animate={controls}
                >
                    <div className="h-full flex  items-center justify-center text-white font-semibold">

                        Slide to Pay
                    </div>
                    <img src={slidebarpic} alt="" className='bg-cover w-30' />
                </motion.div>
            </div>
        </motion.form>
    );
}



