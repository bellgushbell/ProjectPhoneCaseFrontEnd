

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'


const useCartStore = create(persist((set, get) => ({
    cartItems: [], // เก็บสินค้าทั้งหมดในตะกร้า
    cartCount: 0,  // จำนวนสินค้าที่ไม่ซ้ำกันในตะกร้า

    // ฟังก์ชันนี้ใช้เพื่อตั้งค่าจำนวนสินค้าที่ไม่ซ้ำกันในตะกร้าสินค้าโดยการเปลี่ยน cartCount ตาม productListLength ที่ส่งเข้ามา
    countaddToCart: (productListLength) => set({
        cartCount: productListLength // ตั้งค่า cartCount ให้เท่ากับจำนวนสินค้าที่ไม่ซ้ำกัน
    }),


    countresetCart: () => set({
        cartItems: [],
        cartCount: 0  // รีเซ็ตจำนวนสินค้าในตะกร้า
    }),//ฟังก์ชันนี้จะถูกเรียกใช้เมื่อคุณต้องการเคลียร์ตะกร้าทั้งหมด เช่น หลังจากทำการเช็คเอาท์เสร็จหรือเมื่อผู้ใช้ต้องการลบสินค้าทั้งหมดจากตะกร้า

    // ฟังก์ชันลบสินค้าออกจากตะกร้า
    countdelCart: (productId) => set((state) => {
        const updatedItems = state.cartItems.filter(item => item.productId !== productId);
        //ลบสินค้าที่ระบุ(productId) ออกจากตะกร้า โดยกรองสินค้าที่มี productId ตรงกับที่ต้องการลบออกจาก cartItems
        return {
            cartItems: updatedItems,
            cartCount: updatedItems.length  // อัปเดตจำนวนสินค้าที่เหลืออยู่
        };
    }),

}), {
    name: 'cartstate',
    storage: createJSONStorage(() => localStorage)
}));


export default useCartStore











// import { create } from 'zustand'
// import { createJSONStorage, persist } from 'zustand/middleware'


// const useCartStore = create(persist((set, get) => ({
//     cartItems: [], // เก็บสินค้าทั้งหมดในตะกร้า
//     cartCount: 0,  // จำนวนสินค้าที่ไม่ซ้ำกันในตะกร้า

//     // ฟังก์ชันเพิ่มสินค้าลงตะกร้า
//     countaddToCart: (productListLength) => set({
//         cartCount: productListLength // ตั้งค่า cartCount ให้เท่ากับจำนวนสินค้าที่ไม่ซ้ำกัน
//     }),

//     // ฟังก์ชันรีเซ็ตตะกร้า
//     countresetCart: () => set({
//         cartItems: [],
//         cartCount: 0  // รีเซ็ตจำนวนสินค้าในตะกร้า
//     }),

//     // ฟังก์ชันลบสินค้าออกจากตะกร้า
//     countdelCart: (productId) => set((state) => {
//         const updatedItems = state.cartItems.filter(item => item.productId !== productId);

//         return {
//             cartItems: updatedItems,
//             cartCount: updatedItems.length  // อัปเดตจำนวนสินค้าที่ไม่ซ้ำกัน
//         };
//     }),

// }), {
//     name: 'cartstate',
//     storage: createJSONStorage(() => localStorage) // เก็บ state ใน localStorage
// }));


// export default useCartStore








