import React from 'react';

const ViewHistoryDetail = ({ orderSummary }) => {
    console.log(orderSummary)
    const cartItems = orderSummary?.shoppingCart?.cartItems || []; // ดึงข้อมูลจาก shoppingCart

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">รายละเอียดคำสั่งซื้อ ID {orderSummary?.shoppingCartId}</h2>

            <div className="mb-2">
                <p>Order ID: {orderSummary?.id}</p>
                <p>Total Price: {Number(orderSummary?.totalPrice).toLocaleString()} บาท</p>
                <p>Status: {orderSummary?.status}</p>
                <p>Created At: {new Date(orderSummary?.createdAt).toLocaleString('th-TH')}</p>
            </div>

            <h3 className="text-lg font-bold mb-2">รายการสินค้าในคำสั่งซื้อ</h3>
            {cartItems.length > 0 ? (
                <div className="overflow-x-auto mt-4">
                    <table className="text-center min-w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 p-2">Product ID</th>
                                <th className="border border-gray-300 p-2">Item</th>
                                <th className="border border-gray-300 p-2">Name</th>
                                <th className="border border-gray-300 p-2">Description</th>
                                <th className="border border-gray-300 p-2">Unit Price</th>
                                <th className="border border-gray-300 p-2">Amount</th>
                                <th className="border border-gray-300 p-2">Category</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map(item => (
                                <tr key={item.productId} className="hover:bg-gray-100">
                                    <td className="border border-gray-300 p-2">{item.productId}</td>
                                    <td className="border border-gray-300 p-2">
                                        <img src={item.product?.imageUrl || 'https://via.placeholder.com/64'} alt={item.product?.name} className="w-16 h-16 object-cover" />
                                    </td>
                                    <td className="border border-gray-300 p-2">{item.product?.name}</td>
                                    <td className="border border-gray-300 p-2">{item.product?.description}</td>
                                    <td className="border border-gray-300 p-2">{Number(item.price).toLocaleString()} บาท</td>
                                    <td className="border border-gray-300 p-2">{item.amount}</td>
                                    <td className="border border-gray-300 p-2">{item.product?.category?.categoryName}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div>ยังไม่มีสินค้าในคำสั่งซื้อ</div>
            )}
        </div>
    );
};

export default ViewHistoryDetail;
