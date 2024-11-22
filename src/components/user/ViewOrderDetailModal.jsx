import React, { useEffect, useState } from 'react';
import '../../utills/animationtable.css'; // นำเข้าไฟล์ CSS ภายนอก

export default function ViewOrderDetailModal({ orderSummary }) {

    const [orderItems, setOrderItems] = useState([]);

    // console.log(orderSummary) //รวมมีถึงcategoryName

    useEffect(() => {
        if (orderSummary && orderSummary.products) {
            setOrderItems(orderSummary.products);
        }
    }, [orderSummary]); // เมื่อ orderSummary มีการเปลี่ยนแปลงจะทำงานและอัปเดต orderItems ให้ตรงกับข้อมูลใหม่จาก orderSummary

    // หากไม่มีรายการสินค้าให้แสดงข้อความกำลังโหลด
    if (!orderItems.length) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {/* แสดงข้อมูลคำสั่งซื้อ */}
            <h3 className="text-lg font-bold mb-4">Order ID: {orderSummary.orderId}</h3>
            <h4 className="text-md font-semibold">Total Price: {Number(orderSummary.totalPrice).toLocaleString()} บาท</h4>
            <h4 className="text-md font-semibold">Created At: {new Date(orderSummary.createdAt).toLocaleString('th-TH')}</h4>

            <div className="overflow-x-auto mt-4">
                <table className="text-center animated-table min-w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 p-2">Product ID</th>
                            <th className="border border-gray-300 p-2">Item</th>
                            <th className="border border-gray-300 p-2">Name</th>
                            <th className="border border-gray-300 p-2">Description</th>
                            <th className="border border-gray-300 p-2">Unit Price</th>
                            <th className="border border-gray-300 p-2">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderItems.map(item => (
                            <tr key={item.productId} className="hover:bg-gray-100 animated-row">
                                <td className="border border-gray-300 p-2">{item.productId}</td>
                                <td className="border border-gray-300 p-2">
                                    <img src={item.imageUrl || 'xxx'} alt={item.productName} className="w-16 h-16 object-cover" />
                                </td>
                                <td className="border border-gray-300 p-2">{item.productName}</td>
                                <td className="border border-gray-300 p-2">{item.productDescription}</td>
                                <td className="border border-gray-300 p-2">{Number(item.price).toLocaleString()} บาท</td>
                                <td className="border border-gray-300 p-2">{item.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
