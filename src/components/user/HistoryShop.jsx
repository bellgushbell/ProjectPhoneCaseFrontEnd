import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import useAuthStore from '../../stores/authStore'; // ยังคงใช้ Zustand สำหรับ user และ token
import ViewHistoryDetailModal from './ViewHistoryDetailModal';
import viewbutton from '../../assets/viewhistorybutton2.gif';
import bggradientgray from '../../assets/gradientbg2gray.gif';

const URL = import.meta.env.VITE_API_URL
export default function HistoryShop() {
    const user = useAuthStore(state => state.user);
    const token = useAuthStore(state => state.token);
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        if (user) {
            const fetchPaymentHistory = async () => {
                try {
                    const paymentResponse = await axios.get(`${URL}/history/getpayment/${user.id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setPaymentHistory(paymentResponse.data);
                } catch (error) {
                    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลประวัติการชำระเงิน:', error);
                }
            };

            fetchPaymentHistory(); // ดึงข้อมูลประวัติการชำระเงิน
        }
    }, []);

    const handleViewDetails = (orderId) => {
        fetchOrderDetails(orderId); // เรียก fetchOrderDetails ทันทีเมื่อผู้ใช้กดดูรายละเอียดคำสั่งซื้อ
    };

    const fetchOrderDetails = async (orderId) => {
        try {
            const response = await axios.get(`${URL}/history/getorderdetail/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const orderData = response.data;

            setOrderDetails(orderData); // ตั้งค่ารายละเอียดคำสั่งซื้อเพื่อแสดงในโมดัล
            document.getElementById('vieworderdetail-modal').showModal();
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการดึงรายละเอียดคำสั่งซื้อ:', error);
        }
    };

    return (
        <div className="flex flex-col pl-20 pr-20 pt-5 min-h-screen w-full bg-gray-200" style={{
            backgroundImage: `url(${bggradientgray})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
        }}>
            <h1 className="text-left text-4xl font-bold mb-6 text-gray-600 font-sans mt-5" style={{ fontFamily: 'Pacifico, cursive' }}>Shopping History</h1>

            <table className="table-auto w-full bg-white shadow-lg rounded-lg">
                <thead>
                    <tr className="bg-gradient-to-r from-gray-500 to-gray-800 text-white">
                        <th className="text-center">Payment ID</th>
                        <th className="text-center">Order ID</th>
                        <th className="text-center">Payment Method</th>
                        <th className="text-center">Status</th>
                        <th className="text-center">Created At</th>
                        <th className="text-center">Detail</th>
                    </tr>
                </thead>
                <tbody>
                    {paymentHistory.map((payment, index) => (
                        <motion.tr
                            key={payment.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="hover:bg-gray-200 transition duration-300"
                        >
                            <td className="text-center">{payment.id}</td>
                            <td className="text-center">{payment.orderId}</td>
                            <td className="text-center">{payment.payment_method}</td>
                            <td className="text-center">{payment.status}</td>
                            <td className="text-center">{new Date(payment.createdAt).toLocaleString()}</td>
                            <td className="text-center">
                                <motion.div
                                    onClick={() => handleViewDetails(payment.orderId)}
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.2 }}
                                    style={{
                                        display: 'inline-block',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <img
                                        src={viewbutton}
                                        alt="View Details"
                                        className="w-35 h-24 flex items-center"
                                    />
                                </motion.div>
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>

            {/* โมดัลสำหรับแสดงรายละเอียดคำสั่งซื้อ */}
            <dialog id="vieworderdetail-modal" className="modal">
                <div className="modal-box" style={{ width: '80%', maxWidth: '800px', padding: '20px' }}>
                    <button
                        type="button"
                        className="btn btn-sm btn-circle btn-ghost absolute right-0 top-0"
                        onClick={e => e.target.closest('dialog').close()}
                    >
                        ✕
                    </button>
                    {orderDetails ? (
                        <ViewHistoryDetailModal orderSummary={orderDetails} />
                    ) : (
                        <div>กำลังโหลดรายละเอียดคำสั่งซื้อ...</div>
                    )}
                </div>
            </dialog>
        </div>
    );
}



