import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';

export default function PaymentDetail() {
    const { orderId, paymentId } = useParams();
    const [payment, setPayment] = useState(null);
    const [error, setError] = useState(null);
    const token = useAuthStore(state => state.token);

    // ฟังก์ชันดึงข้อมูลการชำระเงิน
    const fetchPaymentDetail = async () => {
        try {
            const response = await axios.get(`http://localhost:8001/payment/order/${orderId}/payment/${paymentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data) {
                setPayment(response.data);
            } else {
                throw new Error('No data received');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    // useEffect สำหรับดึงข้อมูลการชำระเงินเมื่อคอมโพเนนต์ถูก mount
    useEffect(() => {
        fetchPaymentDetail(); // เรียกใช้ฟังก์ชันครั้งแรก
    }, [orderId, paymentId, token]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="flex flex-col items-center p-6 min-h-screen w-full bg-gray-200">
            <h1
                className="text-left text-4xl font-bold mb-6 text-gray-600 font-sans mt-5"
                style={{ fontFamily: 'Pacifico, cursive' }}
            >
                Payment Detail
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 w-full max-w-6xl">
                <div className="col-span-1 w-full">
                    <table className="table-auto w-full bg-white shadow-lg rounded-lg">
                        <thead>
                            <tr className="bg-gradient-to-r from-gray-400 to-gray-500 text-white">
                                <th className="text-center py-2">Payment ID</th>
                                <th className="text-center py-2">Order ID</th>
                                <th className="text-center py-2">Status</th>
                                <th className="text-center py-2">Payment Method</th>
                                <th className="text-center py-2">Created At</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-300">
                            {payment ? (
                                <tr className="hover:bg-gray-200 transition duration-300">
                                    <td className="text-center align-middle py-4">{payment.id}</td>
                                    <td className="text-center align-middle py-4">{payment.orderId}</td>
                                    <td className="text-center align-middle py-4">
                                        <span className={`py-1 px-2 rounded ${payment.status === 'PAID' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td className="text-center align-middle py-4">{payment.payment_method}</td>
                                    <td className="text-center align-middle py-4">{new Date(payment.createdAt).toLocaleString()}</td>
                                </tr>
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">No payment details available.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* แสดงรูปสลิปที่อัปโหลด */}
                    {payment && payment.imgPayment && (
                        <div className="mt-8 text-center">
                            <h2 className="text-xl font-bold" style={{ fontFamily: 'Pacifico, cursive' }}>Slip Image</h2>
                            <img
                                src={payment.imgPayment}
                                alt="Payment Slip"
                                className="w-1/2 h-auto mt-4 rounded shadow-md mx-auto"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}








