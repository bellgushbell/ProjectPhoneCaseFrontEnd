import { Bar } from 'react-chartjs-2'; // นำเข้า `Bar` chart จาก react-chartjs-2 เพื่อนำมาใช้ในการแสดงกราฟแท่ง
import { useEffect, useState } from 'react'; // นำเข้า hooks `useEffect` และ `useState` จาก React เพื่อจัดการ state และเรียก API เมื่อ component เริ่มทำงาน
import axios from 'axios'; // นำเข้า axios เพื่อใช้ในการเรียก API
import useAuthStore from '../stores/authStore'; // นำเข้า `useAuthStore` จาก authStore เพื่อเข้าถึง token สำหรับการ authenticate
import { Chart, registerables } from 'chart.js'; // นำเข้า Chart และ modules ที่จำเป็นจาก chart.js
import { motion } from 'framer-motion'; // นำเข้า `motion` จาก framer-motion เพื่อทำแอนิเมชันให้กับ component

// ลงทะเบียน modules ของ Chart.js เพื่อให้สามารถใช้ features ที่ต้องการได้
Chart.register(...registerables);

const AdminDashboard = () => {
    const token = useAuthStore(state => state.token); // ดึง token จาก authStore เพื่อใช้ในการ authenticate API requests
    const [monthlySalesData, setMonthlySalesData] = useState({ labels: [], datasets: [], orderIds: [] }); // สร้าง state สำหรับข้อมูลยอดขายรายเดือน
    const [bestSellingProducts, setBestSellingProducts] = useState([]); // สร้าง state สำหรับข้อมูลสินค้าที่ขายดีที่สุด
    const [popularPaymentMethods, setPopularPaymentMethods] = useState({ labels: [], datasets: [] }); // สร้าง state สำหรับข้อมูลวิธีการชำระเงินยอดนิยม
    const [nonCheckedOutCarts, setNonCheckedOutCarts] = useState([]); // สร้าง state สำหรับข้อมูลตะกร้าที่ยังไม่ได้เช็คเอาท์

    // ใช้ useEffect เพื่อเรียกข้อมูลจาก API เมื่อ component ถูก mount
    useEffect(() => {
        const fetchSalesData = async () => {
            try {
                // เรียก API เพื่อดึงข้อมูลยอดขาย
                const response = await axios.get('http://localhost:8001/dashboard/sales', {
                    headers: { Authorization: `Bearer ${token}` } // ส่ง token ใน headers เพื่อ authenticate
                });
                const salesData = response.data;

                // สร้าง labels และ data สำหรับกราฟจากข้อมูลที่ได้จาก API
                const labels = salesData.map(item => new Date(item.createdAt).toLocaleString('default', { month: 'long' })); // ดึงเดือนจากวันที่
                const data = salesData.map(item => item.totalPrice); // เก็บยอดขาย
                const orderIds = salesData.map(item => item.orderIds); // เก็บ orderIds

                // ตั้งค่า monthlySalesData ด้วยข้อมูลที่ดึงมา
                setMonthlySalesData({
                    labels: labels, // ตั้งค่า labels เป็นชื่อเดือน
                    datasets: [{
                        label: 'ยอดขาย',
                        data: data, // ข้อมูลยอดขาย
                        backgroundColor: 'rgba(75, 192, 192, 0.2)', // สีพื้นหลังของกราฟ
                        borderColor: 'rgba(75, 192, 192, 1)', // สีเส้นขอบของกราฟ
                        borderWidth: 1,
                    }],
                    orderIds: orderIds.flat(), // รวม orderIds ให้เป็น array เดียว
                });
            } catch (error) {
                console.error(error); // จัดการข้อผิดพลาด
            }
        };

        // ฟังก์ชันสำหรับดึงข้อมูลสินค้าที่ขายดีที่สุด
        const fetchBestSellingProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8001/dashboard/best-selling-products', {
                    headers: { Authorization: `Bearer ${token}` } // ส่ง token ใน headers เพื่อ authenticate
                });
                setBestSellingProducts(response.data); // ตั้งค่า state ของสินค้าที่ขายดีที่สุด
            } catch (error) {
                console.error(error); // จัดการข้อผิดพลาด
            }
        };

        // ฟังก์ชันสำหรับดึงข้อมูลวิธีการชำระเงินยอดนิยม
        const fetchPaymentMethodsData = async () => {
            try {
                const response = await axios.get('http://localhost:8001/dashboard/popular-payment-methods', {
                    headers: { Authorization: `Bearer ${token}` } // ส่ง token ใน headers เพื่อ authenticate
                });
                setPopularPaymentMethods({
                    labels: response.data.map(item => item.payment_method), // สร้าง labels เป็นชื่อวิธีการชำระเงิน
                    datasets: [{
                        label: 'วิธีการชำระเงิน',
                        data: response.data.map(item => item._count.payment_method), // จำนวนการใช้แต่ละวิธีการชำระเงิน
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                        ],
                        borderWidth: 1,
                    }],
                });
            } catch (error) {
                console.error(error); // จัดการข้อผิดพลาด
            }
        };

        // ฟังก์ชันสำหรับดึงข้อมูลตะกร้าสินค้าที่ยังไม่ได้เช็คเอาท์
        const fetchNonCheckedOutCarts = async () => {
            try {
                const response = await axios.get('http://localhost:8001/dashboard/non-checked-out-carts', {
                    headers: { Authorization: `Bearer ${token}` } // ส่ง token ใน headers เพื่อ authenticate
                });
                setNonCheckedOutCarts(response.data); // ตั้งค่า state ของตะกร้าสินค้าที่ยังไม่ได้เช็คเอาท์
            } catch (error) {
                console.error(error); // จัดการข้อผิดพลาด
            }
        };

        // เรียกใช้ฟังก์ชันทั้งหมดเพื่อดึงข้อมูล
        fetchSalesData();
        fetchBestSellingProducts();
        fetchPaymentMethodsData();
        fetchNonCheckedOutCarts();
    }, [token]); // เมื่อ token เปลี่ยนจะเรียกข้อมูลใหม่

    // ตั้งค่า options สำหรับกราฟ
    const options = {
        plugins: {
            tooltip: {
                callbacks: {
                    title: (tooltipItems) => {
                        const index = tooltipItems[0].dataIndex; // ดึง index ของข้อมูลจาก tooltip
                        const orderId = monthlySalesData.orderIds[index]; // ดึง orderId ที่เกี่ยวข้องกับข้อมูลนั้น
                        return `Order ID: ${orderId}`; // แสดง Order ID ใน tooltip
                    },
                    label: (tooltipItem) => {
                        const salesTotal = Number(tooltipItem.raw).toLocaleString(); // ยอดขายรวม
                        return `ยอดขายรวม: ${salesTotal}`; // แสดงยอดขายรวมใน tooltip
                    },
                },
            },
        },
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 text-gray-600 tex-5xl" style={{ fontFamily: 'Pacifico, cursive' }}>Admin DashBoard </h1>

            {/* แสดงข้อมูลยอดขาย */}
            {monthlySalesData.labels.length > 0 && (
                <motion.div
                    className="mb-6 p-4 bg-white rounded shadow-md"
                    initial={{ opacity: 0 }} // เริ่มต้นด้วยความโปร่งใส 0
                    animate={{ opacity: 1 }} // แอนิเมทไปที่ความโปร่งใส 1
                    transition={{ duration: 0.5 }} // ระยะเวลาแอนิเมชัน 0.5 วินาที
                >
                    <h2 className="text-xl font-semibold mb-2 text-teal-600">รายงานยอดขายรายเดือน</h2>
                    <Bar data={monthlySalesData} options={options} /> {/* แสดงกราฟยอดขาย */}
                </motion.div>
            )}

            {/* แสดงสินค้าที่ขายดีที่สุด */}
            {bestSellingProducts.length > 0 && (
                <motion.div
                    className="mb-6 p-4 bg-white rounded shadow-md"
                    initial={{ opacity: 0 }} // เริ่มต้นด้วยความโปร่งใส 0
                    animate={{ opacity: 1 }} // แอนิเมทไปที่ความโปร่งใส 1
                    transition={{ duration: 0.5 }} // ระยะเวลาแอนิเมชัน 0.5 วินาที
                >
                    <h2 className="text-xl font-semibold mb-2 text-teal-600">สินค้าที่ขายดีที่สุด</h2>
                    <ul className="list-disc pl-5">
                        {bestSellingProducts.map(product => (
                            <li key={product.id} className="mb-1 text-gray-700">
                                {product.name}: {product.price} บาท, จำนวนที่ขาย: {product.amount}
                            </li>
                        ))}
                    </ul>
                </motion.div>
            )}

            {/* แสดงวิธีการชำระเงินยอดนิยม */}
            {popularPaymentMethods.labels.length > 0 && (
                <motion.div
                    className="mb-6 p-4 bg-white rounded shadow-md"
                    initial={{ opacity: 0 }} // เริ่มต้นด้วยความโปร่งใส 0
                    animate={{ opacity: 1 }} // แอนิเมทไปที่ความโปร่งใส 1
                    transition={{ duration: 0.5 }} // ระยะเวลาแอนิเมชัน 0.5 วินาที
                >
                    <h2 className="text-xl font-semibold mb-2 text-teal-600">วิธีการชำระเงินยอดนิยม</h2>
                    <Bar data={popularPaymentMethods} /> {/* แสดงกราฟวิธีการชำระเงิน */}
                </motion.div>
            )}

            {/* แสดงรายการตะกร้าสินค้าที่ยังไม่ได้เช็คเอาท์ */}
            {nonCheckedOutCarts.length > 0 && (
                <motion.div
                    className="mb-6 p-4 bg-white rounded shadow-md"
                    initial={{ opacity: 0 }} // เริ่มต้นด้วยความโปร่งใส 0
                    animate={{ opacity: 1 }} // แอนิเมทไปที่ความโปร่งใส 1
                    transition={{ duration: 0.5 }} // ระยะเวลาแอนิเมชัน 0.5 วินาที
                >
                    <h2 className="text-xl font-semibold mb-2 text-teal-600">ตะกร้าสินค้าที่ยังไม่ได้เช็คเอาท์</h2>
                    <ul className="list-disc pl-5">
                        {nonCheckedOutCarts.map(cart => (
                            <li key={cart.id} className="mb-1 text-gray-700">
                                Cart ID: {cart.id}, User ID: {cart.user?.id}  {/* แสดง Cart ID และ User ID */}
                            </li>
                        ))}
                    </ul>
                </motion.div>
            )}
        </div>
    );
};

export default AdminDashboard;
