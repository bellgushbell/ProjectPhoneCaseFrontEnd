import React, { useState } from 'react';
import defaultAvatar from '../assets/default-avatar.svg';
import UploadProfilePicture from '../components/user/UploadProfilePicture';

const Avatar = ({ token, imgSrc, onUpdateAvatar }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="relative">
            {/* แสดง Avatar */}
            <img
                src={imgSrc || defaultAvatar}
                alt="Avatar"
                className="w-11 h-11 rounded-full cursor-pointer"
                onClick={toggleDropdown}
            />

            {/* Dropdown Menu สำหรับอัปโหลด */}
            {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-300 rounded shadow-lg">
                    {/* ใช้คอมโพเนนต์ UploadProfilePicture */}
                    <UploadProfilePicture token={token} onUpdateAvatar={onUpdateAvatar} />
                </div>
            )}
        </div>
    );
};

export default Avatar;
