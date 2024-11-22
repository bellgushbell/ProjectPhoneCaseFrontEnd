

import React from 'react';
import logo from '../assets/Logo PTCASE 2.gif';
import { useNavigate, Link } from 'react-router-dom';
import useCartStore from '../stores/cartStore';
import { CartIcon, DropdownArrow } from '../icons';
import useAuthStore from '../stores/authStore';
import useSearchStore from '../stores/searchProduct';
import logoutbutton from '../assets/logoutbuttonrounded.gif';
import carticon from '../assets/cartshop.gif';
import Avatar from './Avatar';
import { motion } from 'framer-motion'; // นำเข้า motion

const Header = () => {
    const navigate = useNavigate();
    const logout = useAuthStore(state => state.actionLogout);
    const cartCount = useCartStore(state => state.cartCount);
    const user = useAuthStore(state => state.user);
    const { searchQuery, setSearchQuery } = useSearchStore();
    const token = useAuthStore(state => state.token)

    const hdlLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleUpdateAvatar = (newAvatarUrl) => {
        useAuthStore.setState((state) => ({
            user: {
                ...state.user,
                profileImage: newAvatarUrl,
            }
        }));
    };
    const hdlHomepageGuestUser = () => {
        if (token == null) {
            navigate("/")
        } else {
            navigate("/user")
        }
    }
    const hdlShoppageGuestUser = () => {
        if (token == null) {
            navigate("/shopproduct")
        } else {
            navigate("/user/shopproduct")
        }
    }

    return (
        <motion.header
            className="h-30 flex w-full items-center px-1 justify-between bg-gradient-to-r from-gray-500 to-gray-300 fixed top-0 z-20 shadow-lg"
            initial={{ opacity: 0, y: -20 }} // เริ่มต้นที่ความโปร่งใส 0 และเลื่อนขึ้น
            animate={{ opacity: 1, y: 0 }} // เคลื่อนที่กลับสู่ตำแหน่งเริ่มต้น
            transition={{ duration: 0.5 }} // เวลาในการเคลื่อนไหว
        >
            <motion.div className="flex items-center ml-5">
                <button onClick={hdlHomepageGuestUser}>
                    <motion.img src={logo} alt="PT CASE" className="h-20"
                        initial={{ scale: 0.9 }} // เริ่มต้นที่การขยาย 90%
                        whileHover={{ scale: 1.05 }} // ขยายเมื่อ hover
                        transition={{ type: 'spring', stiffness: 300 }} />
                </button>
            </motion.div>

            <nav className="flex items-center space-x-6">
                <button onClick={hdlShoppageGuestUser} className="text-3xl font-semibold text-white hover:text-blue-300 transition duration-300">SHOP</button>
                {token && (
                    <Link to='/user/history' className="text-3xl font-semibold text-white hover:text-blue-300 transition duration-300">HISTORY</Link>
                )}
            </nav>

            <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="p-2 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            />

            <div className="flex items-center space-x-6 mr-10">
                {user && (
                    <div className="flex flex-col items-center justify-center text-white">
                        <div className="relative flex items-center">
                            <span className="absolute -top-1 right-0 h-7 w-6 bg-gray-700 text-white text-center rounded-full text-xl font-crimson">
                                {cartCount}
                            </span>
                            <img
                                style={{
                                    display: 'inline-block',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s ease-in-out',
                                }}
                                onClick={() => navigate('/user/cart')}
                                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-6px)')}
                                onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
                                src={carticon}
                                alt="carticon"
                                className="w-24 h-18 flex items-center"

                            />
                        </div>
                    </div>
                )}

                {user ? (
                    <div className="flex justify-between items-center w-full">
                        <div className="flex flex-col items-center">
                            <span className="font-crimson">{user.firstName} {user.lastName}</span>
                            <span className="font-crimson">{user.email}</span>

                            <div
                                onClick={hdlLogout}
                                style={{
                                    display: 'inline-block',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s ease-in-out',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-3px)')}
                                onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
                            >
                                <img
                                    src={logoutbutton}
                                    alt="Logout"
                                    className="w-25 h-7 flex items-center mb-1"
                                />
                            </div>
                        </div>

                        <div className="flex items-center ml-2">
                            <Avatar
                                imgSrc={user.profileImage}
                                token={user.token} // หรือจัดการ token ตามที่คุณใช้
                                onUpdateAvatar={handleUpdateAvatar} // ส่งฟังก์ชันไปยัง Avatar
                            />
                            <DropdownArrow className="absolute bottom-2 right-10 w-4" />
                        </div>
                    </div>
                ) : (
                    <div className='flex items-center justify-center'>
                        <button onClick={() => navigate('/login')} className="btn btn-primary mx-2">Login</button>
                        <button onClick={() => navigate('/register')} className="btn btn-neutral">Sign Up</button>
                    </div>
                )}
            </div>
        </motion.header>
    );
};

export default Header;





