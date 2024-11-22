import axios from 'axios';


const URL = import.meta.env.VITE_API_URL
export const CurrentUser = async (token) => {


    return await axios.post(`${URL}/auth/current-user`, {}, {  // ส่ง data เป็น {} ว่างๆ ถ้าไม่ต้องส่งข้อมูล
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
};
