import React, { useEffect, useState } from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // นำเข้าไฟล์ CSS สำหรับ Carousel
import { Carousel } from 'react-responsive-carousel'; // นำเข้าฟังก์ชัน Carousel
import '../utills/recommendProduct.css';
import Loading from './loading/Loading';
import LoadingCart from './loading/Loading-addtocart';

import axios from 'axios';
import useAuthStore from '../stores/authStore';
import useCartStore from '../stores/cartStore';
import AddtocartButton from '../assets/addtocartbutton.gif';

import { toast } from 'react-toastify';
import klaxon from '../assets/recommend2.gif'
const URL = import.meta.env.VITE_API_URL
const RecommendedProducts = () => {
    const token = useAuthStore(state => state.token);
    const [data, setData] = useState([]);
    const [loadingCart, setLoadingCart] = useState(false);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [cartItems, setCartItems] = useState([]);
    const countaddToCart = useCartStore(state => state.countaddToCart);


    const fetchProducts = async () => {
        try {
            setLoadingProducts(true);
            const response = await axios.get(`${URL}/product`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(response.data.allproduct); // ตรวจสอบว่าข้อมูลที่ได้รับมีอยู่จริง
            console.log(response.data);
        } catch (err) {
            const errMsg = err?.response?.data?.error || err.message;
            console.log(errMsg);

        } finally {
            setLoadingProducts(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    if (loadingProducts) {
        return <Loading />; // จะแสดง Loading Component เมื่อกำลังโหลด
    }

    const recommendedProductIds = [6, 5, 4]; // กำหนด ID ของโปรดักที่ต้องการแสดง
    const recommendedProductIds2 = [1, 2, 3]; // กำหนด ID ของโปรดักที่ต้องการแสดง

    const recommendedProducts = data.filter(product =>
        recommendedProductIds.includes(product.id)
    );
    console.log(recommendedProducts);

    const recommendedProducts2 = data.filter(product =>
        recommendedProductIds2.includes(product.id)
    );
    console.log(recommendedProducts2);

    const addToCart = async (productId) => {
        try {
            setLoadingCart(true);
            await new Promise(resolve => setTimeout(resolve, 300));
            const existingCartItem = cartItems.find(item => item.productId === productId);

            if (existingCartItem) { //ถ้ากดซ้ำ
                updateCartQuantityOnAdd(productId, 1);
            } else {
                await axios.post(`${URL}/cart`, { productId, amount: 1 }, {
                    headers: { Authorization: `Bearer ${token}` }
                }); //สร้างแล้ว

                const response = await axios.get(`${URL}/cart`, {
                    headers: { Authorization: `Bearer ${token}` }
                }); //ดึงของในtable cartItem

                const cartItems = response.data.cartItems;
                countaddToCart(cartItems.length); // อัปเดตจำนวนสินค้าที่อยู่ในตะกร้า

                setCartItems(cartItems);
            }

            toast.success("🛒เพิ่มเข้าตระกร้าสำเร็จ");
        } catch (err) {
            const errMsg = err?.response?.data?.error || err.message;
            console.log(errMsg);

        } finally {
            setLoadingCart(false);
        }
    };

    const updateCartQuantityOnAdd = async (productId, amount) => { // ฟังก์ชันสำหรับอัปเดตจำนวนสินค้าหลังจากเพิ่มลงในตะกร้า
        const updatedItems = cartItems.map(item => { // ทำการแมพข้อมูลสินค้าทั้งหมด
            if (item.productId === productId) {  // ถ้าสินค้าเป็นตัวที่ถูกเพิ่ม
                const newAmount = item.amount + amount; // คำนวณจำนวนใหม่ 
                return { ...item, amount: newAmount > 0 ? newAmount : 1 }; // คืนค่าอ็อบเจกต์สินค้าพร้อมจำนวนที่อัปเดต
            }
            return item; // ถ้าไม่ใช่คืนค่าอ็อบเจกต์เดิม
        });

        setCartItems(updatedItems);

        try {
            await axios.patch(`${URL}/cart/${productId}`, { amount }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (err) {
            const errMsg = err?.response?.data?.error || err.message;
            console.log(errMsg);
        }
    };





    return (
        <div className="flex flex-col items-center px-6">
            {!token && (
                <div className="text-center text-5xl mt-1 mb-5 font-bold text-red-500">
                    โปรดล็อกอิน/สมัครสมาชิก เพื่อเยี่ยมชมสินค้า
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">

                {/* Carousel ด้านซ้าย */}
                <div>
                    <Carousel showArrows={true} showThumbs={false} infiniteLoop={true} autoPlay={true} interval={3000} showStatus={false}>
                        {recommendedProducts.map(product => (
                            <div key={product.id} className="w-full h-96 card lg:card-side bg-base-100 shadow-xl p-4 flex">
                                <figure>
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-64 object-cover"
                                    />
                                </figure>
                                <div className="card-body flex flex-col justify-center text-center">
                                    <h2 className="card-title font-crimson">{product.name}</h2>
                                    <p className="text-gray-500">{product.description}</p>
                                    <p className="text-lg font-semibold">{product.price} บาท</p>
                                    <p className="text-sm text-gray-400">หมวดหมู่: {product.category?.categoryName || 'ไม่ทราบหมวดหมู่'}</p>
                                    <div className="card-actions flex justify-center items-center mt-10 mb-1">
                                        {product.stock > 0 ? (
                                            loadingCart ? (
                                                <LoadingCart />
                                            ) : (
                                                token && (
                                                    <div
                                                        onClick={() => addToCart(product.id)}
                                                        className="cursor-pointer rounded-full w-40 h-15 flex justify-center items-center transition transform hover:translate-y-[-5px] hover:scale-105"
                                                    >
                                                        <img
                                                            src={AddtocartButton}
                                                            alt="Checkout"
                                                            className="w-full h-full object-contain"
                                                        />
                                                    </div>
                                                )
                                            )
                                        ) : (
                                            <div className="text-red-600 font-bold text-center mt-5">
                                                สินค้าหมด
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Carousel>
                </div>

                {/* Carousel ด้านขวา */}
                <div>
                    <Carousel showArrows={true} showThumbs={false} infiniteLoop={true} autoPlay={true} interval={3000} showStatus={false}>
                        {recommendedProducts2.map(product => (
                            <div key={product.id} className="w-full h-96 card lg:card-side bg-base-100 shadow-xl p-4 flex">
                                <figure>
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-64 object-cover"
                                    />
                                </figure>
                                <div className="card-body flex flex-col justify-center text-center">
                                    <h2 className="card-title font-crimson">{product.name}</h2>
                                    <p className="text-gray-500">{product.description}</p>
                                    <p className="text-lg font-semibold">{product.price} บาท</p>
                                    <p className="text-sm text-gray-400">หมวดหมู่: {product.category?.categoryName || 'ไม่ทราบหมวดหมู่'}</p>
                                    <div className="card-actions flex justify-center items-center mt-10 mb-1">
                                        {product.stock > 0 ? (
                                            loadingCart ? (
                                                <LoadingCart />
                                            ) : (
                                                token && (
                                                    <div
                                                        onClick={() => addToCart(product.id)}
                                                        className="cursor-pointer rounded-full w-40 h-15 flex justify-center items-center transition transform hover:translate-y-[-5px] hover:scale-105"
                                                    >
                                                        <img
                                                            src={AddtocartButton}
                                                            alt="Checkout"
                                                            className="w-full h-full object-contain"
                                                        />
                                                    </div>
                                                )
                                            )
                                        ) : (
                                            <div className="text-red-600 font-bold text-center mt-5">
                                                สินค้าหมด
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Carousel>

                    <div className="flex w-full items-center justify-end mt-10">
                        <img src={klaxon} alt="klaxon" className="w-16" />
                        <span className="text-white ml-2">Contact Us : gushbellpiriyapong@gmail.com</span>
                    </div>

                </div>
            </div>
        </div>
    );

};

export default RecommendedProducts;




