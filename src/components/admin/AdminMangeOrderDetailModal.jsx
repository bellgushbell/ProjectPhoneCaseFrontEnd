import React from 'react';

export default function AdminMangeOrderDetailModal({ products, onClose }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg relative" style={{ width: '80%', maxWidth: '800px', maxHeight: '90vh', overflow: 'auto' }}>
                <button
                    type="button"
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                    onClick={onClose}
                >
                    ✕
                </button>
                <h2 className="text-lg font-bold mb-4 text-center">Product In Order</h2>

                {/* ตารางแสดงสินค้า */}
                <table className="table-auto w-full bg-white shadow-lg rounded-lg">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="py-2">Product ID</th>
                            <th className="py-2">Product Name</th>
                            <th className="py-2">Image</th>
                            <th className="py-2">Price</th>
                            <th className="py-2">Quantity</th>
                            <th className="py-2">Stock</th> {/* เพิ่มคอลัมน์ใหม่สำหรับ Stock */}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(products) && products.length > 0 ? ( //ตรวจสอบว่าเป็นอเรย์ใหม
                            products.map((item) => (
                                <tr key={item.product.id}>
                                    <td className="text-center">{item.product.id}</td>
                                    <td className="text-center">{item.product.name}</td>
                                    <td className="text-center">
                                        <img src={item.product.imageUrl} alt={item.product.name} className="w-16 h-16 object-contain" />
                                    </td>
                                    <td className="text-center">{Number(item.price).toLocaleString()} บาท</td>
                                    <td className="text-center">{item.amount}</td>
                                    <td className="text-center">{item.product.stock}</td> {/* แสดง Stock ที่นี่ */}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">No products available</td> {/* เปลี่ยนให้ตรงกับจำนวนคอลัมน์ */}
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
