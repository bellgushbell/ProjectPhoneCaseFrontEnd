import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ViewOrderDetailModal from './ViewOrderDetailModal';
import useAuthStore from '../../stores/authStore';
import '../../utills/orderpageCSS.css'; // import CSS styles ที่เราสร้างขึ้น
import viewButton from '../../assets/viewbutton.gif';
import cancelButton from '../../assets/ordercancelbutton.gif';
import confirmButton from '../../assets/confirmorder.gif';
import { useNavigate } from 'react-router-dom';
import LoadingConfirm from '../loading/Loading-confirmOrder'
import Loading from '../loading/Loading'
import useCartStore from '../../stores/cartStore';

const OrderInfo = () => {
    const [orderSummary, setOrderSummary] = useState(null);
    const token = useAuthStore(state => state.token);
    const [loadingConfirmOrder, setLoadingConfirmOrder] = useState(false);
    const [loading, setLoading] = useState(false)
    const resetCartCount = useCartStore(state => state.countresetCart);
    const navigate = useNavigate();

    //ทดสอบยิง อยากรู้orderId
    useEffect(() => {
        const fetchOrderId = async () => {
            try {
                const response = await axios.get('http://localhost:8001/order/getorderidlastest', {
                    headers: { Authorization: `Bearer ${token}` }
                });


                console.log(response.data.orderId) //ได้ออเดอไอดีมา
            } catch (error) {
                console.error('Error fetching order ID:', error);
            }
            finally {
                setLoading(false)
            }
        };

        fetchOrderId();
    }, []);


    useEffect(() => {
        const storedOrderSummary = localStorage.getItem('orderSummary'); //ดึงข้อมูลจากorderSummaryใน localStorage
        if (storedOrderSummary) {
            setOrderSummary(JSON.parse(storedOrderSummary)); // ตั้งค่าset useState orderSummary จาก localStorage แปลงข้อมูลจาก JSON string กลับเป็น JavaScript object
        }
    }, []);



    // console.log(orderId);  // ตรวจสอบค่า orderId


    const handleConfirmOrder = async () => {
        try {
            setLoadingConfirmOrder(true)
            await new Promise(resolve => setTimeout(resolve, 800));
            // ตรวจสอบว่า orderId เป็นตัวเลขหรือไม่
            const validOrderId = orderSummary.orderId;  // ใช้ orderSummary.orderId แทน
            //validate
            if (!validOrderId || typeof validOrderId !== 'number') {
                console.error('Invalid orderId:', validOrderId);
                return;
            }

            // ส่ง PATCH request ไปยังเซิร์ฟเวอร์
            const confirmOrderResponse = await axios.patch(`http://localhost:8001/order/confirmorder/${validOrderId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(confirmOrderResponse);

            // หากยืนยันคำสั่งซื้อสำเร็จ
            if (confirmOrderResponse?.data?.orderId) {
                const confirmedOrderId = confirmOrderResponse.data.orderId;

                // ใช้ navigate เพื่อไปยังหน้า Payment และส่ง orderId
                navigate(`/user/order/${confirmedOrderId}/payment/`); //path 
            }
        } catch (err) {
            const errMsg = err?.response?.data?.error || err.message;
            console.log(errMsg);
        }
        finally {
            setLoadingConfirmOrder(false)
        }
    }

    const handleCancelOrder = async () => {
        try {
            const response = await axios.patch(`http://localhost:8001/order/cancelorder`, { //ส้ง body orderIdไป 
                orderId: orderSummary.orderId,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(response);
            resetCartCount();
            navigate('/user/shopproduct'); //ถ้าผู้ใช้กดแคทเซิลออเดอกลับไปหน้าช้อปปิ้งต่อ ยังไม่ลบแค่เปลี่ยนสถานะออเดอเป็นCANCELLED
        } catch (err) {
            const errMsg = err?.response?.data?.error || err.message;
            console.log(errMsg);
        }
        finally {
            setLoading(false)
        }
    };

    if (loadingConfirmOrder) {
        return <LoadingConfirm />;
    }
    if (loading) {
        return <Loading />;
    }


    return (
        <div className="flex justify-center items-center min-h-screen w-screen bg-gradient-to-r from-gray-200 to-gray-500 p-10">
            <div className="border-gradient max-w-lg w-full p-10 transition-all duration-300 ease-in-out hover:shadow-2xl">
                <div className="inner-card">
                    <h2 className="text-5xl font-bold text-center mb-6 text-gray-600 " style={{ fontFamily: 'Pacifico, cursive' }}>Order Summary</h2>

                    {/* ตรวจสอบว่า orderSummary มีค่าอยู่หรือไม่ */}
                    {!orderSummary ? (
                        <p className="text-center text-gray-500">กำลังโหลดข้อมูลคำสั่งซื้อ...</p>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b pb-2">
                                <span className="text-gray-600 font-semibold">Order ID:</span>
                                <span className="font-bold text-blue-500">{orderSummary.orderId}</span>
                            </div>
                            <div className="flex justify-between items-center border-b pb-2">
                                <span className="text-gray-600 font-semibold">Order Status:</span>
                                <span className="font-bold text-yellow-500">{orderSummary.status}</span>
                            </div>
                            <div className="flex justify-between items-center border-b pb-2">
                                <span className="text-gray-600 font-semibold">Total Price:</span>
                                <span className="font-bold text-green-600">{orderSummary.totalPrice.toLocaleString()} บาท</span>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-center space-x-4 mt-6">
                        <button
                            className="button-container bg-white text-white rounded-md shadow transition"
                            type="button"
                            onClick={() => document.getElementById('vieworderdetail-modal').showModal()}
                        >
                            <img
                                src={viewButton}
                                alt="viewbutton"
                                className="w-full h-full object-contain"
                            />
                        </button>

                        <dialog id="vieworderdetail-modal" className="modal">
                            <div
                                className="modal-box"
                                style={{ width: '80%', maxWidth: '800px', padding: '20px' }}
                            >
                                <button
                                    type="button"
                                    className="btn btn-sm btn-circle btn-ghost absolute right-0 top-0"
                                    onClick={e => e.target.closest('dialog').close()}
                                >
                                    ✕
                                </button>
                                {/* ส่ง orderSummary ไปยัง ViewOrderdetail */}
                                <ViewOrderDetailModal orderSummary={orderSummary} />
                            </div>
                        </dialog>

                        <div
                            onClick={handleCancelOrder}
                            className="button-container"
                        >
                            <img
                                src={cancelButton}
                                alt="Cancel Order"
                                className="w-full h-full object-contain"
                            />
                        </div>

                        <div
                            onClick={handleConfirmOrder}
                            className="button-container"
                        >
                            <img
                                src={confirmButton}
                                alt="Confirm Order"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default OrderInfo;
