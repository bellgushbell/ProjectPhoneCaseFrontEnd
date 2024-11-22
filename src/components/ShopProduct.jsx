import '../utills/bordercard-color.css';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import useAuthStore from '../stores/authStore';
import useCartStore from '../stores/cartStore';
import { toast } from 'react-toastify';
import useSearchStore from '../stores/searchProduct';
import AddtocartButton from '../assets/addtocartbutton.gif';
import notFoundProduct from '../assets/notFoundProduct.gif';
import backgroundImage from '../assets/พื้นหลังเทาใบไม้.webp';
import { motion } from 'framer-motion';

const ShopProductAll = () => {
    const [data, setData] = useState([]);
    const token = useAuthStore(state => state.token);
    const countaddToCart = useCartStore(state => state.countaddToCart);
    const { searchQuery } = useSearchStore(); // ดึง searchQuery จาก searchStore

    const [cartItems, setCartItems] = useState([]);
    const [animateItemId, setAnimateItemId] = useState(null);
    const [cartPosition, setCartPosition] = useState({ x: 0, y: 0 });
    const cartIconRef = useRef(null); //ตัวแปร ref ที่ใช้เก็บการอ้างอิงถึง DOM element ของไอคอนตะกร้าสินค้า เริ่มต้นเป็น null
    const URL = import.meta.env.VITE_API_URL

    const filteredProducts = data.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
        //ทำใหม่ทุกครั้งที่มีการพิม
    );
    // console.log(filteredProducts)
    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${URL}/product`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setData(response.data.allproduct); //รายการproduct ที่มี categoryName ด้วย
        } catch (err) {
            const errMsg = err?.response?.data?.error || err.message;
            toast.error(errMsg);
        }
    };

    console.log(data)

    const addToCart = async (productId) => {
        console.log(productId) //item id ของสินค้านั้นๆที่ทำการกดloop 
        try {
            setAnimateItemId(productId); //อนิเมชั่นของแต่ละไอดีสินค้าที่ทำการกด
            await new Promise(resolve => setTimeout(resolve, 200)); //หน่วงอนิเมชั่นลอย
            const existingCartItem = cartItems.find(item => item.productId === productId) //ค้นหาเฉพาะcartItemไอเทมที่กดซ้ำ/ที่มีอยู่
            // console.log(existingCartItem) //ถ้ากดไม่ซ้ำ existingCartItem = undefined  // ถ้ากดซ้ำ[{productId: 2, name: 'เคสพาวเวอพัพเกิร์ล', description: '15 15 Pro Max กันกระแทก', imageUrl: 'https://res.cloudinary.com/dvrgra6z8/image/upload/v1729231426/21729231423024_53.01852723639078.png', price: '499', …

            if (existingCartItem) { //ถ้าเป็นตัวที่กดซ้ำ //มีอยู่แล้ว
                updateCartQuantityOnAdd(productId, 1)  //เพิ่มจำนวน
            } else { //ถ้าไม่ใช่ตัวที่กดซ้ำ หรือที่มีอยุ่แล้ว or กดครั้งแรก 
                await axios.post(`${URL}/cart`, { productId, amount: 1 }, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const response = await axios.get(`${URL}/cart`, { //ดึงcartItem มาแสดง
                    headers: { Authorization: `Bearer ${token}` }
                });

                const cartItems = response.data.cartItems;
                console.log('cartItemsResponse', cartItems)
                countaddToCart(cartItems.length); //ส่งความยาวของcartItemในตระกร้า ไปที่ zustand
                setCartItems(cartItems);
            }

            toast.success("🛒เพิ่มเข้าตระกร้าสำเร็จ");
        } catch (err) {
            const errMsg = err?.response?.data?.error || err.message;
            toast.error(errMsg);
        } finally {
            setAnimateItemId(null);
        }
    };

    console.log('cartItemsState', cartItems)
    //การอัปเดตจำนวนสินค้าเกิดขึ้นเมื่อสินค้าที่มีอยู่ในตะกร้าถูกเพิ่มเข้าไปอีกครั้ง 
    const updateCartQuantityOnAdd = async (productId, amount) => { //ไอดีของโปรดักที่กด && จำนวน amount 1 
        console.log(amount)
        const updatedItems = cartItems.map(item => {
            if (item.productId === productId) { //ถ้าสินค้าที่ลูปอยู่มี productId ตรงกับสินค้าที่กดเพิ่มหรือลดจำนวน (productId)
                const newAmount = item.amount + amount; // การบวกจำนวนสินค้าที่มีอยู่แล้ว (item.amount) กับจำนวนที่ต้องการเพิ่มหรือลด (amount)
                return { ...item, amount: newAmount > 0 ? newAmount : 1 };
                // ตรวจสอบว่าnewAmountต้องไม่น้อยกว่า 1: หากผลรวมnewAmount น้อยกว่า 1 จะถูกบังคับให้เป็น 1 (เพราะไม่ต้องการให้สินค้ามีจำนวนที่ต่ำกว่าหนึ่งในตะกร้า)
            }
            return item;
        });

        setCartItems(updatedItems); // รายการสินค้าใหม่ที่มีจำนวนที่ถูกอัปเดตแล้ว 

        try {
            await axios.patch(`${URL}/cart/${productId}`, { amount }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (err) {
            const errMsg = err?.response?.data?.error || err.message;
            console.log(errMsg);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (cartIconRef.current) {
            const rect = cartIconRef.current.getBoundingClientRect();
            setCartPosition({ x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 });
            //ตั้งค่าให้เป็นตำแหน่ง x ของไอคอน (rect.x) บวกกับครึ่งหนึ่งของความกว้าง (rect.width / 2) เพื่อให้ได้ตำแหน่งกลางในแนวนอน
            //ตั้งค่าให้เป็นตำแหน่ง y ของไอคอน (rect.y) บวกกับครึ่งหนึ่งของความสูง (rect.height / 2) เพื่อให้ได้ตำแหน่งกลางในแนวตั้ง
        }
    }, [cartIconRef]);//useEffect นี้จะทำงานเมื่อ cartIconRef มีการเปลี่ยนแปลง

    return (
        <div className='min-h-screen w-screen bg-gray-100 p-20 bg-fixed' style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
        }}>
            <div ref={cartIconRef} className="cart-icon fixed top-5 right-5">
                <img src="path_to_cart_icon" alt="Cart" className="w-10 h-10" />
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-5'>
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 1, scale: 1 }} // กำหนดค่าเริ่มต้นของอนิเมชั่น เช่น ความโปร่งใสและขนาด
                            animate={item.id === animateItemId ? { // ตรวจสอบว่า item.id ตรงกับ animateItemId หรือไม่
                                opacity: 0.1, //ลดความโปร่งใสลง
                                scale: 0.1, //ลดขนาดลง
                                x: index % 4 === 0 ? cartPosition.x + 4000 : // การ์ดที่ 0 (index 0) จะเลื่อนไปทางขวา 
                                    index % 4 === 1 ? cartPosition.x + 1500 : // การ์ดที่ 1 (index 1) จะเลื่อนไปทางขวา 
                                        index % 4 === 2 ? cartPosition.x - 150 : // การ์ดที่ 2 (index 2) จะเลื่อนไปทางซ้าย 
                                            cartPosition.x - 2000, // การ์ดที่ 3 (index 3) จะเลื่อนไปทางซ้าย 

                                y: index % 4 === 0 ? cartPosition.y - 4000 : // การ์ดที่ 0 (index 0) จะเลื่อนไปทางบน 
                                    index % 4 === 1 ? cartPosition.y - 3000 : // การ์ดที่ 1 (index 1) จะเลื่อนไปทางบน 
                                        index % 4 === 2 ? cartPosition.y - 5000 : // การ์ดที่ 2 (index 2) จะเลื่อนไปทางบน 
                                            cartPosition.y - 3000 // การ์ดที่ 3 (index 3) จะเลื่อนไปทางบน 

                            } : { opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }} // กำหนดระยะเวลาในการเปลี่ยนแปลง
                            className='border-gradient'
                            whileHover={{
                                scale: 1.05,  // ขยายขนาดเมื่อวางเมาส์
                                translateY: -10, // ยกขึ้นเล็กน้อย
                                transition: { duration: 0.1 } // ระยะเวลาในการขยายและยกขึ้น
                            }}
                        >
                            <div className='inner-card flex flex-col justify-between h-full p-4'>
                                <div className='w-full h-60 rounded-t-lg overflow-hidden'>
                                    <img src={item.imageUrl} alt={item.name} className='w-full h-full object-contain' />
                                </div>
                                <div className='mt-1 text-lg font-bold'>{item.name}</div>
                                <div className='text-sm mt-1'>ราคา {Number(item.price).toLocaleString()} บาท</div>
                                <div className='text-sm mt-1'>หมวดหมู่: {item.category?.categoryName || 'ไม่ทราบหมวดหมู่'}</div>
                                <div className='text-sm mt-1'>{item.description}</div>

                                {item.stock > 0 ? (
                                    <div className="flex justify-center items-center mt-5 mb-1">
                                        {token &&
                                            <motion.div
                                                onClick={() => addToCart(item.id)}
                                                className="cursor-pointer rounded-full w-40 h-15 flex justify-center items-center transition-transform hover:scale-105"
                                            >
                                                <img
                                                    src={AddtocartButton}
                                                    alt="Checkout"
                                                    className="w-full h-full object-contain"
                                                />
                                            </motion.div>
                                        }
                                    </div>
                                ) : (
                                    <div className="text-red-600 font-bold text-center mt-5">
                                        สินค้าหมด
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className='flex flex-col justify-center items-center min-h-screen w-screen'>
                        <p className='text-center font-bold text-red-500 text-3xl'>ไม่มีผลิตภัณฑ์ในร้านค้า</p>
                        <img src={notFoundProduct} alt="notfoundProduct" className="mb-4" />
                    </div>
                )}
            </div>
        </div>
    );

}

export default ShopProductAll;

























