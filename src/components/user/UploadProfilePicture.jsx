import React, { useState } from 'react';
import axios from 'axios';
import useAuthStore from '../../stores/authStore';
import uploadprofilebutton from '../../assets/uploadprofile.gif'
import LoadinguploadProfile from '../loading/LoadingUpload-userProfile'

const UploadProfilePicture = ({ onUpdateAvatar }) => {
    const [avatar, setAvatar] = useState(null);
    const token = useAuthStore(state => state.token);
    const [loadingUploadProfilePic, setLoadingUploadProfilePic] = useState(false); // นำกลับมาใช้งาน

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setAvatar(file);
    };

    const handleUpload = async () => {
        if (!avatar) {
            console.log('กรุณาเลือกไฟล์');
            return;
        }

        const formData = new FormData();
        formData.append('avatar', avatar);
        setLoadingUploadProfilePic(true) // แสดงสถานะการโหลดเมื่อเริ่มอัปโหลด
        try {
            const response = await axios.post('http://localhost:8001/user/uploadprofilepic', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            });

            console.log('อัปโหลดสำเร็จ:', response.data);
            onUpdateAvatar(response.data.avatarUrl); // ส่ง URL ของรูปภาพใหม่กลับไปยัง Avatar
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการอัปโหลด:', error);
        } finally {
            setLoadingUploadProfilePic(false); // ปิดสถานะการโหลดเมื่อทำเสร็จ
        }
    };

    if (loadingUploadProfilePic) {
        return <LoadinguploadProfile />; // จะแสดง Loading Component สำหรับการอัปโหลด
    }

    return (
        <div className="flex flex-col">
            <input type="file" accept="image/*" onChange={handleFileChange} className='flex justify-center items-center' />
            <div onClick={handleUpload}
                className="bg-white text-white p-2 rounded mt-2 cursor-pointer flex justify-center items-center" >
                <img src={uploadprofilebutton} alt="uploadprofilebutton" className='w-24 hover:scale-110 transform transition-transform duration-300' />
            </div>
        </div>
    );
};

export default UploadProfilePicture;
