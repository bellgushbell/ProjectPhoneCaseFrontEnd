import axios from 'axios';



export const CurrentUser = async (token) => {


    return await axios.post('http://localhost:8001/auth/current-user', {}, {  // ส่ง data เป็น {} ว่างๆ ถ้าไม่ต้องส่งข้อมูล
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
};
