import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuthStore from '../../stores/authStore';
import { motion } from 'framer-motion';
import AdminMangeOrderDetailModal from './AdminMangeOrderDetailModal';
import { DeleteUserBin } from '../../icons';
const URL = import.meta.env.VITE_API_URL

export default function AdminManageOrder() {
    const [orders, setOrders] = useState([]);
    const token = useAuthStore(state => state.token);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchOrders = async () => { //จากตารางออเดอถึงชื่อโปรดัก
        try {
            const response = await axios.get(`${URL}/admin/manage-orders`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(response.data.orders);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axios.patch(`${URL}/admin/manage-orders/${orderId}`, {
                status: newStatus
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchOrders()


        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };

    const handleDeleteOrder = async (orderId) => {
        try {
            await axios.delete(`${URL}/admin/manage-orders/${orderId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            fetchOrders()


        } catch (error) {
            console.error("Error deleting order:", error);
        }
    };

    //modal
    const openOrderDetails = (order) => {
        console.log(order); //เปิดออเดอที่กด มี cartItem สินค้า
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);//เซ็ทเพื่อไม่ให้มีข้อมูลคำสั่งซื้อเก่าติดอยู่เมื่อเปิดโมดัลใหม่
    };

    return (
        <div className="flex flex-col pl-6 min-h-screen w-full bg-gray-200">
            <h1 className="text-left text-4xl font-bold mb-6 text-gray-600 font-sans mt-5" style={{ fontFamily: 'Pacifico, cursive' }}>
                Manage Orders
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                <div className="col-span-1">
                    <table className="table-auto w-full bg-white shadow-lg rounded-lg">
                        <thead>
                            <tr className="bg-gradient-to-r from-gray-400 to-gray-500 text-white">
                                <th className="text-center py-2">User ID</th>
                                <th className="text-center py-2">Email</th>
                                <th className="text-center py-2">Order ID</th>
                                <th className="text-center py-2">Total Price</th>
                                <th className="text-center py-2">View Product</th>
                                <th className="text-center py-2">Order Status</th>
                                <th className="text-center py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, index) => (
                                <motion.tr
                                    key={order.id}
                                    //framermotion stagger 
                                    initial={{ opacity: 0, y: 20 }} //ตอนเริ่มเลื่อนขึ้นมา 20 พิกเซล
                                    animate={{ opacity: 1, y: 0 }} //อนิเมชันเคลื่อนที่ไปหลังจากที่มันเริ่ม มองเห็นชัด
                                    exit={{ opacity: 0, y: -20 }} //ออก โปร่งลบออก
                                    transition={{ duration: 0.3, delay: index * 0.1 }} //อนิเมชั่น 0.3วิ  แถวแรก 0วิ แถว2 0.1 ไปเรื่อยๆ
                                    className="hover:bg-gray-200 transition duration-300"
                                >
                                    <td className="text-center align-middle">{order.userId}</td>
                                    <td className="text-center align-middle">{order.shoppingCart.user.email}</td>
                                    <td className="text-center align-middle">{order.id}</td>
                                    <td className="text-center align-middle">{Number(order.totalPrice).toLocaleString()} บาท</td>
                                    <td className="text-center align-middle">
                                        <button
                                            onClick={() => openOrderDetails(order)} //ส่งorderไปโมดัล
                                            className="text-blue-600 btn"
                                        >
                                            View
                                        </button>
                                    </td>

                                    <td className="text-center align-middle">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            className="border rounded p-1"
                                        >
                                            <option value="PENDING">PENDING</option>
                                            <option value="CONFIRMED">CONFIRMED</option>
                                            <option value="CANCELLED">CANCELLED</option>
                                        </select>
                                    </td>
                                    <td className="text-center align-middle">
                                        <button onClick={() => handleDeleteOrder(order.id)} className="text-red-600 hover:text-red-800 transition duration-300 ml-4">
                                            <DeleteUserBin size={25} className="cursor-pointer hover:scale-110 transform transition-transform duration-300" />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal สำหรับแสดงรายละเอียดสินค้า */}
            {isModalOpen && selectedOrder && ( //เปิดโมดัล
                <AdminMangeOrderDetailModal
                    slipUrl={selectedOrder.slipUrl}
                    products={selectedOrder.shoppingCart.cartItems} //รายการสินค้าที่อยู่ในคำสั่งซื้อ
                    onClose={closeModal}
                />
            )}

        </div>
    );
}






