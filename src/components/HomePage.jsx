import React from 'react';
import { motion } from 'framer-motion'; // นำเข้า framer-motion
import bannerShop1 from '../assets/animated-gif-col1.gif';
import bannerShop2 from '../assets/animated-gif-2.gif';
import bannerShop3 from '../assets/animated-gif-3.gif';
import bannerShop4 from '../assets/animated-gif-4.gif';
import RecommendedProducts from './RecommendProduct';
import Recommendpicbanner from '../assets/Recommend.gif'

import bggradient from '../assets/gradientbg.gif'

import bggradient4 from '../assets/gradientbg4.gif'

import useAuthStore from '../stores/authStore';


const HomePage = () => {

    const token = useAuthStore(state => state.token);

    return (
        <div className="bg-gray-200 min-h-screen ">
            <div className="bg-gray-900 h-[430px] w-full "
                style={{
                    backgroundImage: `url(${bggradient})`, // ใช้ bggradient ที่นำเข้า
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    borderRadius: '5px',
                }}
            >
                {/* Container หลัก */}
                <div className="flex justify-between items-center h-[450px] bg-left bg-cover">
                    <motion.div
                        className="flex flex-col items-center h-[400px] w-[20%] justify-center bg-cover gap-5 pl-10"
                        initial={{ opacity: 0, x: -100 }} // เริ่มต้นที่ความโปร่งใส 0 และเลื่อนมาจากซ้าย
                        animate={{ opacity: 1, x: 0 }} // แสดงให้เห็นเมื่อความโปร่งใสเป็น 1
                        transition={{ duration: 0.5 }} // ใช้เวลา 0.5 วินาทีในการเคลื่อนไหว
                    >
                        <h1 className="text-center text-xl font-bold text-white font-crimson">Stylish and Durable Cases to Protect Your Phone</h1>
                        <h1 className="text-center text-xl font-bold text-white font-crimson">Designed for Everyday Use Tough for Any Situation</h1>
                        <h1 className="text-center text-xl font-bold text-white font-crimson">Phone Cases Designed Just for You!!</h1>
                    </motion.div>

                    <motion.div
                        className="flex h-[400px] w-[20%] justify-center bg-cover"
                        style={{ backgroundImage: `url(${bannerShop1})` }}
                        initial={{ scale: 0.9 }} // เริ่มต้นที่การขยาย 90%
                        whileHover={{ scale: 1.05 }} // ขยายเมื่อ hover
                        transition={{ type: 'spring', stiffness: 300 }} // ใช้ spring effect
                    ></motion.div>

                    <motion.div
                        className="flex h-[400px] w-[20%] justify-center bg-cover"
                        style={{ backgroundImage: `url(${bannerShop2})` }}
                        initial={{ scale: 0.9 }} // เริ่มต้นที่การขยาย 90%
                        whileHover={{ scale: 1.05 }} // ขยายเมื่อ hover
                        transition={{ type: 'spring', stiffness: 300 }} // ใช้ spring effect
                    ></motion.div>

                    <motion.div
                        className="flex h-[400px] w-[20%] justify-center bg-cover"
                        style={{ backgroundImage: `url(${bannerShop3})` }}
                        initial={{ scale: 0.9 }} // เริ่มต้นที่การขยาย 90%
                        whileHover={{ scale: 1.05 }} // ขยายเมื่อ hover
                        transition={{ type: 'spring', stiffness: 300 }} // ใช้ spring effect
                    ></motion.div>

                    <motion.div
                        className="flex h-[400px] w-[20%] justify-center bg-cover"
                        style={{ backgroundImage: `url(${bannerShop4})` }}
                        initial={{ scale: 0.9 }} // เริ่มต้นที่การขยาย 90%
                        whileHover={{ scale: 1.05 }} // ขยายเมื่อ hover
                        transition={{ type: 'spring', stiffness: 300 }} // ใช้ spring effect
                    ></motion.div>
                </div>
            </div>

            <div className="relative flex flex-col justify-start items-center  px-6 w-screen h-[700px]" style={{
                backgroundImage: `url(${bggradient4})`, // ใช้ bggradient ที่นำเข้า
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}>
                <motion.h2
                    className="text-6xl font-bold  text-center bg-gradient-to-r from-gray-500 to-gray-200 text-transparent bg-clip-text flex items-center justify-center mt-5 mb-5"
                    style={{ fontFamily: 'Pacifico, cursive' }}
                    initial={{ opacity: 0, y: -50 }} // เริ่มต้นที่ความโปร่งใส 0 และยกขึ้น
                    animate={{ opacity: 1, y: 0 }} // แสดงให้เห็นเมื่อความโปร่งใสเป็น 1
                    transition={{ duration: 0.5 }} // ใช้เวลา 0.5 วินาทีในการเคลื่อนไหว
                >

                    Recommend
                </motion.h2>
                {token && (
                    <img src={Recommendpicbanner} alt='recommend' className='absolute z-10 left-8 w-28 mt-20 ml-1 mb-10' />
                    //recommend sticker
                )}
                <RecommendedProducts />
            </div>



        </div>
    );
};

export default HomePage;

