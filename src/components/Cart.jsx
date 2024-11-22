

import React, { useState, useEffect } from "react";
import axios from "axios";

import useCartStore from "../stores/cartStore";
import useAuthStore from "../stores/authStore";
import { Navigate, useNavigate } from "react-router-dom";
import LoadingDelCart from "./loading/Loading-deletecart"
import Loading from './loading/Loading';
import LoadingCheckout from './loading/Loading-checkOutclick'
import checkoutGif from '../assets/checkout2.gif';
import Swal from 'sweetalert2';
import { toast } from "react-toastify";

function CartPage() {
    const [cartItems, setCartItems] = useState([]);

    const [error, setError] = useState(null);
    const [loadingDelCart, setLoadingDelCart] = useState(false)
    const [loadingCart, setLoadingCart] = useState(false);
    const [loadingCheckout, setLoadingCheckout] = useState(false);

    const navigate = useNavigate()

    const token = useAuthStore(state => state.token);
    const countaddToCart = useCartStore(state => state.countaddToCart);
    const countresetCart = useCartStore(state => state.countresetCart);
    const countdelCart = useCartStore(state => state.countdelCart)


    const fetchCartItems = async () => { //ตารางCartItems
        try {

            const response = await axios.get('http://localhost:8001/cart', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const items = response.data.cartItems;
            // console.log(items)
            setCartItems(items); //อัพเดท state cartItems

            // อัปเดต cartCount โยนitems.length ของ
            countaddToCart(items.length);


        } catch (err) {
            setError("เกิดข้อผิดพลาดในการดึงข้อมูลตะกร้า");

        } finally {
            setLoadingCart(false); // สิ้นสุดการโหลด
        }
    };


    // เรียกใช้ fetchCartItems เมื่อ component ถูก mount
    useEffect(() => {
        fetchCartItems();
    }, []);


    const removeItem = async (id) => {
        const swalWithBootstrapButtons = Swal.mixin({ //สร้างอินสแตนซ์ของ SweetAlert2
            customClass: { //กำหนดคลา่สเอง
                confirmButton: "btn btn-success", // ปุ่ม Delete เป็นสีเขียว
                cancelButton: "btn btn-danger" // ปุ่ม Cancel เป็นสีแดง
            },
            buttonsStyling: false //ปิดสไตล์ CSS ที่กำหนดไว้ให้กับปุ่มใน popup เพรราะเรากำหนดเอง
        });

        swalWithBootstrapButtons.fire({ //alert
            title: "Delete?",
            text: "Are you sure to delete this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true, //สลับตำแหน่งปุ่มpop up
            willOpen: () => {
                // ตั้งค่าพื้นหลังแบบ inline
                const popup = document.querySelector('.swal2-popup');
                popup.style.background = 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)'; // ไล่สีพื้นหลัง
                popup.style.color = 'white'; // สีข้อความ
                popup.style.padding = '20px'; // เพิ่ม padding

                // ตั้งค่าให้ปุ่ม Cancel เป็นสีแดง
                const cancelButton = document.querySelector('.swal2-cancel');
                cancelButton.style.backgroundColor = '#dc2626'; // สีแดง
                cancelButton.style.borderColor = '#dc2626'; // สีแดง
                cancelButton.style.color = 'white'; // สีข้อความ
                cancelButton.style.marginRight = '10px'; // เพิ่มระยะห่าง

                // เปลี่ยนสีไอคอนให้เป็นสีแดง
                const icon = document.querySelector('.swal2-icon'); // เลือกไอคอนทั้งหมด
                if (icon) {
                    icon.style.backgroundColor = '#dc2626'; // เปลี่ยนสีพื้นหลังของไอคอนเป็นสีแดง
                    icon.style.borderColor = '#dc2626'; // เปลี่ยนสีขอบของไอคอนเป็นสีแดง
                }
            }
        }).then(async (result) => {
            if (result.isConfirmed) { // ถ้าผู้ใช้กดยืนยัน
                try {

                    await axios.delete(`http://localhost:8001/cart/${id}`, { // ส่งคำขอลบไปยัง API
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setCartItems(cartItems.filter((item) => item.productId !== id))  // อัปเดต cartItems โดยกรองรายการที่ถูกลบออก

                    countdelCart(id)  // อัปเดตจำนวนรายการที่ถูกลบในตะกร้า
                    fetchCartItems() // ดึงข้อมูลตะกร้าใหม่


                } catch (err) {
                    console.error("Error removing item:", err.message);
                } finally {
                    setLoadingDelCart(false);
                }
            }
        });
    };



    const updateQuantity = async (productId, amount) => { //เมื่อมีการคลิกปุ่ม "+" หรือ "-"เพื่อเพิ่มหรือลดจำนวนสินค้าในตะกร้า
        const updatedItems = cartItems.map(item => {
            if (item.productId === productId) {
                const newAmount = item.amount + amount;
                return { ...item, amount: newAmount > 0 ? newAmount : 1 }; // ป้องกันจำนวนไม่ให้ลดต่ำกว่า 1 เอาnewAmountใส่amount
            }
            return item;
        });

        setCartItems(updatedItems); //เซ้ทCartItems ที่อัพเดทเพิ่มลดแล้ว

        // ส่ง request ไปที่ backend เพื่ออัปเดตในฐานข้อมูลด้วย
        try {

            await axios.patch(`http://localhost:8001/cart/${productId}`, { amount }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (err) {
            const errMsg = err?.response?.data?.error || err.message
            console.log(errMsg)
        } finally {
            setLoadingCart(false); // สิ้นสุดการโหลด
        }
    };

    const onCheckOutClick = async () => { //เมื่อกดcheckout button
        try {
            setLoadingCheckout(true);
            await new Promise(resolve => setTimeout(resolve, 500));
            const saveorder = await axios.post(`http://localhost:8001/order/save`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log(saveorder.data)
            // หลังจากที่คำสั่งซื้อสำเร็จ เราจะนำ orderSummary มาแสดง
            const { orderSummary } = saveorder.data;



            localStorage.setItem('orderSummary', JSON.stringify(orderSummary));// เก็บข้อมูล orderSummary ใน localStorage
            fetchCartItems();
            console.log(orderSummary.orderId);
            toast.success("สั่งซื้อสินค้าสำเร็จ!");
            countresetCart(); //รีตระกร้า
            navigate(`/user/order/${orderSummary.orderId}`); //ใช้orderId ที่ได้จาก orderSummary.orderId ของ saveorder.data
        } catch (err) {
            const errMsg = err?.response?.data?.message || err.message; // ใช้ .message เพื่อดึงข้อความผิดพลาด
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: errMsg, // แสดงข้อความผิดพลาดที่ backend ส่งมา // ตั้งเช็คstockไว้ ถ้าstockหมด
            });

            console.log(errMsg);
        } finally {
            setLoadingCheckout(false); // สิ้นสุดการโหลด
        }
    };



    const OnContinueShopping = () => {
        navigate('/user/shopproduct')
    }

    const totalAmount = cartItems.reduce((total, item) => total + item.price * item.amount, 0); //โดยค่าเริ่มต้น total จะเริ่มต้นที่ 0

    // console.log(cartItems, totalAmount)


    if (loadingDelCart) {
        return <LoadingDelCart />;
    }

    if (loadingCart) {
        return <Loading />;
    }
    if (loadingCheckout) {
        return <LoadingCheckout />;
    }

    return (
        <div className="flex flex-col p-6 min-h-screen w-full bg-gray-200">
            <h1 className="text-left text-4xl font-bold mb-6 text-gray-600 font-sans mt-5" style={{ fontFamily: 'Pacifico, cursive' }}>Shopping Cart</h1>
            <div className="flex justify-start mb-8">
                <button
                    onClick={OnContinueShopping}
                    className="btn btn-outline w-32 bg-gray-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 shadow-lg hover:shadow-xl"
                >
                    Continue Shopping
                </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="col-span-2">
                    <table className="table-auto w-full bg-white shadow-lg rounded-lg">
                        <thead>
                            <tr className="bg-gradient-to-r from-gray-400 to-gray-500 text-white">
                                <th className="text-center py-2"></th>
                                <th className="text-center py-2">Item</th>
                                <th className="text-center py-2">Name</th>
                                <th className="text-center py-2">Unit Price</th>
                                <th className="text-center py-2">Amount</th>
                                <th className="text-center py-2">Total</th>
                                <th className="text-center py-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item) => (
                                <tr key={item.productId} className="hover:bg-gray-200 transition duration-300">
                                    <td></td>
                                    <td>
                                        <div className="flex justify-center items-center h-full">
                                            <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-contain object-center" />
                                        </div>
                                    </td>
                                    <td className="text-center align-middle">{item.name}</td>
                                    <td className="text-center align-middle">{Number(item.price).toLocaleString()} บาท</td>
                                    <td>
                                        <div className="flex items-center justify-center">
                                            <button
                                                onClick={() => updateQuantity(item.productId, -1)}
                                                disabled={item.amount <= 1}
                                                className="px-2 py-1 border rounded-lg text-black hover:bg-gray-100 transition duration-300"
                                            >
                                                -
                                            </button>
                                            <span className="mx-2">{item.amount}</span>
                                            <button
                                                onClick={() => updateQuantity(item.productId, 1)}
                                                className="px-2 py-1 border rounded-lg text-black hover:bg-gray-100 transition duration-300"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </td>
                                    <td className="text-center align-middle">{Number(item.price * item.amount).toLocaleString()} บาท</td>
                                    <td>
                                        <button
                                            onClick={() => removeItem(item.productId)}
                                            className="text-red-600 hover:text-red-800 transition duration-300"
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-6 bg-white shadow-lg rounded-lg w-[450px] h-[300px]">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Order Summary</h2>
                    <div className="border-t border-gray-400 mt-4 pt-4">
                        <p className="text-2xl font-bold text-indigo-600">Total: {totalAmount.toLocaleString()} บาท</p>
                    </div>
                    <div className="flex justify-center items-center mt-10">
                        <div
                            onClick={onCheckOutClick}
                            className="cursor-pointer border rounded-lg w-48 h-15 flex justify-center items-center transition transform hover:translate-y-[-5px] hover:scale-105 shadow-tilted shadow-tilted-hover"
                        >
                            <img
                                src={checkoutGif}
                                alt="Checkout"
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );





}

export default CartPage;






