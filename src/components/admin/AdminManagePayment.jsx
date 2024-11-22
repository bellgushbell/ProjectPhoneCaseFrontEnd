import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuthStore from '../../stores/authStore';
import { motion } from 'framer-motion'; // นำเข้า motion
import { DeleteUserBin } from '../../icons';

const URL = import.meta.env.VITE_API_URL
export default function AdminManagePayment() {
    const [payments, setPayments] = useState([]);
    const [selectedSlip, setSelectedSlip] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const token = useAuthStore(state => state.token)


    const fetchPayments = async () => {
        try {
            const response = await axios.get(`${URL}/admin/manage-payments`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPayments(response.data.payments);
        } catch (error) {
            console.error("Error fetching payments:", error);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const handleStatusChange = async (paymentId, newStatus) => {
        try {
            await axios.patch(`${URL}/admin/manage-payments/${paymentId}`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPayments()
        } catch (error) {
            console.error("Error updating payment status:", error);
        }
    };

    const handlePaymentMethodChange = async (paymentId, newMethod) => {
        try {
            await axios.patch(`${URL}/admin/manage-paymentsmethod/${paymentId}`, { payment_method: newMethod }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPayments()
        } catch (error) {
            console.error("Error updating payment method:", error);
        }
    };

    const handleDeletePayment = async (paymentId) => {
        try {
            await axios.delete(`${URL}/admin/manage-payments/${paymentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPayments()
        } catch (error) {
            console.error("Error deleting payment:", error);
        }
    };

    const handleOpenModal = (slipUrl) => {
        console.log("Slip URL:", slipUrl);  //payment.imgPayment
        setSelectedSlip(slipUrl);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedSlip(null);
    };
    console.log(payments)
    return (
        <div className="flex flex-col pl-6 min-h-screen w-full bg-gray-200" style={{ backgroundImage: 'url(https://www.veeforu.com/wp-content/uploads/2022/10/Simple-green-pastel-background.-scaled.jpg)', backgroundSize: 'cover' }}>
            <h1 className="text-left text-4xl font-bold mb-6 text-gray-600 font-sans mt-5" style={{ fontFamily: 'Pacifico, cursive' }}>
                Manage Payments
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                <div className="col-span-1">
                    <table className="table-auto w-full bg-white shadow-lg rounded-lg">
                        <thead>
                            <tr className="bg-gradient-to-r from-gray-400 to-gray-500 text-white">
                                <th className="text-center py-2">User ID</th>
                                <th className="text-center py-2">Email</th>
                                <th className="text-center py-2">Order ID</th>
                                <th className="text-center py-2">Payment ID</th>
                                <th className="text-center py-2">TotalPrice</th>
                                <th className="text-center py-2">Payment Method</th>
                                <th className="text-center py-2">Status</th>
                                <th className="text-center py-2">SlipIMG</th>
                                <th className="text-center py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((payment, index) => (
                                <motion.tr
                                    key={payment.id}
                                    initial={{ opacity: 0, y: 20 }} // เริ่มต้นที่ความโปร่งใส 0 และยกขึ้น
                                    animate={{ opacity: 1, y: 0 }} // สุดท้ายที่ความโปร่งใส 1 และกลับไปที่ตำแหน่งเดิม
                                    exit={{ opacity: 0, y: -20 }} // เมื่อถูกลบให้โปร่งใสและยกขึ้น
                                    transition={{ duration: 0.3, delay: index * 0.1 }} // เพิ่มการหน่วงเวลาเพื่อสร้างเอฟเฟกต์ staggered
                                    className="hover:bg-gray-200 transition duration-300"
                                >
                                    <td className="text-center align-middle">{payment.order.shoppingCart.user.id}</td>
                                    <td className="text-center align-middle">{payment.order.shoppingCart.user.email}</td>
                                    <td className="text-center align-middle">{payment.order.id}</td>
                                    <td className="text-center align-middle">{payment.id}</td>
                                    <td className="text-center align-middle">{Number(payment.order.totalPrice).toLocaleString()} บาท</td>


                                    <td className="text-center align-middle">
                                        <select
                                            value={payment.payment_method}
                                            onChange={(e) => handlePaymentMethodChange(payment.id, e.target.value)}
                                            className="border rounded p-1"
                                        >
                                            <option value="CASH">CASH</option>
                                            <option value="SCAN">SCAN</option>
                                            <option value="BANK">BANK</option>
                                        </select>
                                    </td>

                                    <td className="text-center align-middle">
                                        <select
                                            value={payment.status}
                                            onChange={(e) => handleStatusChange(payment.id, e.target.value)}
                                            className="border rounded p-1"
                                        >
                                            <option value="PENDING">PENDING</option>
                                            <option value="PAID">PAID</option>
                                            <option value="CANCELLED">CANCELLED</option>
                                        </select>
                                    </td>
                                    <td className="text-center align-middle">
                                        <button onClick={() => handleOpenModal(payment.imgPayment)} className="text-blue-600 hover:text-blue-800 transition duration-300">
                                            View Slip
                                        </button>
                                    </td>
                                    <td className="text-center align-middle">
                                        <button
                                            onClick={() => handleDeletePayment(payment.id)}
                                            className="text-red-600 hover:text-red-800 transition duration-300"
                                        >
                                            <DeleteUserBin size={25} className="cursor-pointer hover:scale-110 transform transition-transform duration-300" />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for Slip Image */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="modal-box" style={{ width: '80%', maxWidth: '800px', padding: '20px' }}>
                        <button
                            type="button"
                            className="btn btn-sm btn-circle btn-ghost absolute right-0 top-0"
                            onClick={handleCloseModal}
                        >
                            ✕
                        </button>
                        {selectedSlip ? (
                            selectedSlip === "กำหนดเอง" ? (
                                <p></p>
                            ) : (
                                <img src={selectedSlip} alt="Slip" className="w-full h-auto object-contain" />
                            )
                        ) : (
                            <p className="text-red-500 text-3xl">เพย์เม้นนี้ไม่มีสลิป </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}




// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import useAuthStore from '../../stores/authStore';
// import { motion } from 'framer-motion'; // นำเข้า motion
// import { DeleteUserBin } from '../../icons';

// export default function AdminManagePayment() {
//     const [payments, setPayments] = useState([]);
//     const [selectedSlip, setSelectedSlip] = useState(null);
//     const [isModalOpen, setModalOpen] = useState(false);
//     const token = useAuthStore(state => state.token);

//     useEffect(() => {
//         const fetchPayments = async () => {
//             try {
//                 const response = await axios.get('http://localhost:8001/admin/manage-payments', {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 setPayments(response.data.payments);
//             } catch (error) {
//                 console.error("Error fetching payments:", error);
//             }
//         };

//         fetchPayments();
//     }, [token]);

//     const handleStatusChange = async (paymentId, newStatus) => {
//         try {
//             await axios.patch(`http://localhost:8001/admin/manage-payments/${paymentId}`, { status: newStatus }, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setPayments(prevPayments =>
//                 prevPayments.map(payment =>
//                     payment.id === paymentId ? { ...payment, status: newStatus } : payment
//                 )
//             );
//         } catch (error) {
//             console.error("Error updating payment status:", error);
//         }
//     };

//     const handlePaymentMethodChange = async (paymentId, newMethod) => {
//         try {
//             await axios.patch(`http://localhost:8001/admin/manage-paymentsmethod/${paymentId}`, { payment_method: newMethod }, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setPayments(prevPayments =>
//                 prevPayments.map(payment =>
//                     payment.id === paymentId ? { ...payment, payment_method: newMethod } : payment
//                 )
//             );
//         } catch (error) {
//             console.error("Error updating payment method:", error);
//         }
//     };

//     const handleDeletePayment = async (paymentId) => {
//         try {
//             await axios.delete(`http://localhost:8001/admin/manage-payments/${paymentId}`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setPayments(prevPayments => prevPayments.filter(payment => payment.id !== paymentId));
//         } catch (error) {
//             console.error("Error deleting payment:", error);
//         }
//     };

//     const handleOpenModal = (slipUrl) => {
//         console.log("Slip URL:", slipUrl);
//         setSelectedSlip(slipUrl);
//         setModalOpen(true);
//     };

//     const handleCloseModal = () => {
//         setModalOpen(false);
//         setSelectedSlip(null);
//     };

//     return (
//         <div className="flex flex-col pl-6 min-h-screen w-full bg-gray-200" style={{ backgroundImage: 'url(https://www.veeforu.com/wp-content/uploads/2022/10/Simple-green-pastel-background.-scaled.jpg)', backgroundSize: 'cover' }}>
//             <h1 className="text-left text-4xl font-bold mb-6 text-gray-600 font-sans mt-5" style={{ fontFamily: 'Pacifico, cursive' }}>
//                 Manage Payments
//             </h1>
//             <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
//                 <div className="col-span-1">
//                     <table className="table-auto w-full bg-white shadow-lg rounded-lg">
//                         <thead>
//                             <tr className="bg-gradient-to-r from-gray-400 to-gray-500 text-white">
//                                 <th className="text-center py-2">User ID</th>
//                                 <th className="text-center py-2">Email</th>
//                                 <th className="text-center py-2">Order ID</th>
//                                 <th className="text-center py-2">Payment ID</th>
//                                 <th className="text-center py-2">Payment Method</th>
//                                 <th className="text-center py-2">Status</th>
//                                 <th className="text-center py-2">SlipIMG</th>
//                                 <th className="text-center py-2">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {payments.map((payment, index) => (
//                                 <motion.tr
//                                     key={payment.id}
//                                     initial={{ opacity: 0, y: 20 }} // เริ่มต้นที่ความโปร่งใส 0 และยกขึ้น
//                                     animate={{ opacity: 1, y: 0 }} // สุดท้ายที่ความโปร่งใส 1 และกลับไปที่ตำแหน่งเดิม
//                                     exit={{ opacity: 0, y: -20 }} // เมื่อถูกลบให้โปร่งใสและยกขึ้น
//                                     transition={{ duration: 0.3, delay: index * 0.1 }} // เพิ่มการหน่วงเวลาเพื่อสร้างเอฟเฟกต์ staggered
//                                     className="hover:bg-gray-200 transition duration-300"
//                                 >
//                                     <td className="text-center align-middle">{payment.order.shoppingCart.user.id}</td>
//                                     <td className="text-center align-middle">{payment.order.shoppingCart.user.email}</td>
//                                     <td className="text-center align-middle">{payment.order.id}</td>
//                                     <td className="text-center align-middle">{payment.id}</td>

//                                     <td className="text-center align-middle">
//                                         <select
//                                             value={payment.payment_method}
//                                             onChange={(e) => handlePaymentMethodChange(payment.id, e.target.value)}
//                                             className="border rounded p-1"
//                                         >
//                                             <option value="CASH">CASH</option>
//                                             <option value="SCAN">SCAN</option>
//                                             <option value="BANK">BANK</option>
//                                         </select>
//                                     </td>

//                                     <td className="text-center align-middle">
//                                         <select
//                                             value={payment.status}
//                                             onChange={(e) => handleStatusChange(payment.id, e.target.value)}
//                                             className="border rounded p-1"
//                                         >
//                                             <option value="PENDING">PENDING</option>
//                                             <option value="PAID">PAID</option>
//                                             <option value="CANCELLED">CANCELLED</option>
//                                         </select>
//                                     </td>
//                                     <td className="text-center align-middle">
//                                         <button onClick={() => handleOpenModal(payment.imgPayment)} className="text-blue-600 hover:text-blue-800 transition duration-300">
//                                             View Slip
//                                         </button>
//                                     </td>
//                                     <td className="text-center align-middle">
//                                         <button
//                                             onClick={() => handleDeletePayment(payment.id)}
//                                             className="text-red-600 hover:text-red-800 transition duration-300"
//                                         >
//                                             <DeleteUserBin size={25} className="cursor-pointer hover:scale-110 transform transition-transform duration-300" />
//                                         </button>
//                                     </td>
//                                 </motion.tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>

//             {/* Modal for Slip Image */}
//             {isModalOpen && (
//                 <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//                     <div className="modal-box" style={{ width: '80%', maxWidth: '800px', padding: '20px' }}>
//                         <button
//                             type="button"
//                             className="btn btn-sm btn-circle btn-ghost absolute right-0 top-0"
//                             onClick={handleCloseModal}
//                         >
//                             ✕
//                         </button>
//                         {selectedSlip ? (
//                             selectedSlip === "กำหนดเอง" ? (
//                                 <p></p>
//                             ) : (
//                                 <img src={selectedSlip} alt="Slip" className="w-full h-auto object-contain" />
//                             )
//                         ) : (
//                             <p className="text-red-500 text-3xl">เพย์เม้นนี้ไม่มีสลิป </p>
//                         )}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }




