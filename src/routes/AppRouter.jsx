

import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import App from '../App'

import HomePage from '../components/HomePage'
import LoginPage from '../components/LoginPage'
import RegisterPage from '../components/RegisterPage'
import Resetpassword from '../components/Resetpassword'
import CartPage from '../components/Cart'
import AddProduct from '../pages/AddProduct'
import ShopProduct from '../components/ShopProduct'
import AdminLayout from '../adminlayouts/AdminLayout'
import AdminDashboard from '../pages/AdminDashboard'
import AdminProductManage from '../pages/AdminProductManage'
import Unauthorization from './Unauthorization'
import ProtectRoute from '../routes/ProtectRoute'
import PageNotFound from '../components/user/PageNotFound'
import UserOrder from '../components/user/UserOrder'
import UserManageMent from '../components/admin/UserManageMent'
import Payment from '../components/user/Payment'
import PaymentDetail from '../components/user/PaymentDetail'
import HistoryShop from '../components/user/HistoryShop'
import AdminManagePayment from '../components/admin/AdminManagePayment'
import AdminManageOrder from '../components/admin/AdminManageOrder'


const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,  // Layout หลักที่มี Header และ Outlet สำหรับแสดงเนื้อหาตามเส้นทางย่อย
        children: [
            { index: true, element: <HomePage /> },  // หน้าแรก
            { path: 'shopproduct', element: <ShopProduct /> },
            { path: 'login', element: <LoginPage /> },  // หน้า Login
            { path: 'register', element: <RegisterPage /> },  // หน้า Register
            { path: 'reset-password/:token', element: <Resetpassword /> },  // หน้า Reset Password
            { path: 'pagenotfound', element: <PageNotFound /> },

            { path: 'unauthorization', element: <Unauthorization /> },
            { path: '*', element: <PageNotFound /> },  // Redirect ไปหน้าไม่พบถ้าเส้นทางไม่ตรงกับที่กำหนด
        ],
    },
    {
        path: '/user',
        element: <ProtectRoute element={<App />} allow={["USER"]} />,  // ProtectRoute สำหรับผู้ใช้ปกติ
        children: [
            { index: true, element: <HomePage /> },
            { path: 'shopproduct', element: <ShopProduct /> },
            { path: 'cart', element: <CartPage /> },
            { path: 'history', element: <HistoryShop /> },
            { path: 'order/:orderId', element: <UserOrder /> },
            { path: 'order/:orderId/payment', element: <Payment /> },
            { path: 'order/:orderId/payment/:paymentId', element: <PaymentDetail /> },
            { path: 'unauthorization', element: <Unauthorization /> },
            { path: '*', element: <PageNotFound /> },
        ],
    },
    {
        path: '/admin',
        element: <ProtectRoute element={<AdminLayout />} allow={["ADMIN"]} />,  // ProtectRoute สำหรับแอดมิน
        children: [
            { index: true, element: <AdminDashboard /> },
            { path: 'create-product', element: <AddProduct /> },  // หน้าเพิ่มสินค้า
            { path: 'manage-products', element: <AdminProductManage /> },
            { path: 'manage-user', element: <UserManageMent /> },  // หน้าจัดการสมาชิกและแอดมิน
            { path: 'manage-order', element: <AdminManageOrder /> },
            { path: 'manage-payment', element: <AdminManagePayment /> },
            { path: 'unauthorization', element: <Unauthorization /> },
            { path: '*', element: <PageNotFound /> },
        ],
    },
]);

const AppRouter = () => {
    return (
        <RouterProvider router={router} />
    );
};

export default AppRouter;






















