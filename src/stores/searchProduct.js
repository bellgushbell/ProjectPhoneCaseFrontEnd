import { create } from 'zustand';
const useSearchStore = create((set) => ({
    searchQuery: '', // สร้างสถานะเริ่มต้นสำหรับ searchQuery


    setSearchQuery: (query) => set({ searchQuery: query }), //ใช้เพื่อเปลี่ยนค่า searchQuery ใน store เป็นค่าที่ผู้ใช้ป้อน
}));

export default useSearchStore;