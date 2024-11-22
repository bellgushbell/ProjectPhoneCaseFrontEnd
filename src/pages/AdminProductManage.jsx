import { useState, useEffect } from 'react';
import axios from 'axios';
import useAuthStore from '../stores/authStore';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion'; // Import Framer Motion
import delbutton from '../assets/deleteproduct.gif';
import editbutton from '../assets/editbutton.gif';
import Editloading from '../components/loading/Editloading';
import Loading from '../components/loading/Loading';

const AdminProductManage = () => {
    const token = useAuthStore(state => state.token);
    const [data, setData] = useState([]);
    const [categories, setCategories] = useState([]);

    const [editLoading, setEditLoading] = useState(null); // แก้ไขให้เป็น null เพื่อเก็บ productId ที่กำลังแก้ไข
    const [loading, setLoading] = useState(false);


    const [editMode, setEditMode] = useState(null);  //ไว้เก็บproduct.id

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        categoryId: '',
        description: '',
        stock: '',
        image: null
    });



    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:8001/product", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(response.data.allproduct);
        } catch (err) {
            const errMsg = err?.response?.data?.error || err.message;
            console.log(errMsg);
            toast.error(errMsg);
        } finally {
            setLoading(false); // สิ้นสุดการโหลด
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8001/admin/categories', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCategories(response.data);
        } catch (err) {
            console.error('Error fetching categories:', err);
            toast.error('Error fetching categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const handleEditClick = (product) => {
        setEditMode(product.id);
        setFormData({ //ตั้งค่าเริ่มต้น
            name: product.name,
            price: product.price,
            categoryId: product.categoryId,
            description: product.description,
            stock: product.stock,
            image: null
        });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData, [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                image: file
            });
        } else {
            setFormData({
                ...formData,
                image: null
            });
        }
    };

    const saveEdit = async (productId) => { //เมื่อกดเซฟ
        if (!formData.image && editMode === productId) {
            toast.error("Please select an image to upload.");
            return;
        }

        try {
            setEditLoading(productId);  // ตั้งค่า productId ที่อยู่ในโหมด edit
            await new Promise(resolve => setTimeout(resolve, 500));

            const updatedData = new FormData();
            updatedData.append('name', formData.name);
            updatedData.append('price', formData.price);
            updatedData.append('categoryId', formData.categoryId);
            updatedData.append('description', formData.description);
            updatedData.append('stock', formData.stock);

            if (formData.image) {
                updatedData.append('image', formData.image); // ส่งไฟล์ที่เลือก
            }

            await axios.patch(`http://localhost:8001/admin/edit-products/${productId}`, updatedData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            toast.success("Product updated successfully📲");
            fetchProducts();
            setEditMode(null);
        } catch (err) {
            const errMsg = err?.response?.data?.error || err.message;
            console.log(errMsg);
            toast.error(errMsg);
        } finally {
            setEditLoading(null);  // reset หลังจากบันทึกเสร็จ
        }
    };

    const delProduct = async (productId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            setLoading(true);
            try {
                await axios.delete(`http://localhost:8001/admin/manage-products/${productId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success("Product deleted successfully");
                fetchProducts();
            } catch (err) {
                const errMsg = err?.response?.data?.error || err.message;
                console.log(errMsg);
                toast.error(errMsg);
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-5 min-h-screen bg-fixed'
            style={{ backgroundImage: 'url(https://t3.ftcdn.net/jpg/04/11/97/12/360_F_411971286_2OLZaOZ2U9Nc4PLM0ocdFMaYRN2IpzWh.jpg)', backgroundSize: 'contain' }}>
            {data.map((item, index) => (
                <motion.div
                    key={item.id}
                    className='border-gradient p-4'
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2, duration: 0.5 }}
                    layout
                >
                    <div className='inner-card'>
                        {editLoading === item.id ? (  // แสดง loading เฉพาะการ์ดที่ถูก edit
                            <Editloading />
                        ) : (
                            <>
                                <div className='w-full h-64 flex justify-center items-center'>
                                    <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        className='object-cover w-60 h-60'
                                    />
                                </div>
                                {editMode === item.id ? ( //ตรวจสอบว่าไอเท็มไหนกำลังถูกแก้ไข
                                    <div>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="input input-bordered border-orange-500 input-info w-full max-w-xs"
                                            placeholder="Product Name"
                                        />
                                        <input
                                            type="text"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            className="input input-bordered border-orange-500 input-info w-full max-w-xs"
                                            placeholder="Product Price"
                                        />
                                        <select
                                            name="categoryId"
                                            value={formData.categoryId}
                                            onChange={handleChange}
                                            className="input input-bordered border-orange-500 input-info w-full max-w-xs"
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.categoryName}
                                                </option>
                                            ))}
                                        </select>
                                        <input
                                            type="text"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            className="input input-bordered border-orange-500 input-info w-full max-w-xs"
                                            placeholder="Description"
                                        />
                                        <input
                                            type="text"
                                            name="stock"
                                            value={formData.stock}
                                            onChange={handleChange}
                                            className="input input-bordered border-orange-500 input-info w-full max-w-xs"
                                            placeholder="Stock"
                                        />
                                        <input
                                            type="file"
                                            name="image"
                                            onChange={handleImageChange}
                                            className="input input-bordered border-orange-500 input-info w-full max-w-xs"
                                            accept="image/*"
                                        />
                                        <div className='flex justify-center'>
                                            <button onClick={() => saveEdit(item.id)} className='mt-4 px-4 py-2 mr-7 bg-green-500 text-white rounded'>Save</button>
                                            <button onClick={() => setEditMode(null)} className='mt-4 px-4 py-2 bg-gray-500 text-white rounded'>Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className='mt-2 text-lg font-bold'>{item.name}</div>
                                        <div className='text-sm'>ราคา {item.price} บาท</div>
                                        <div className='text-sm'>หมวดหมู่ : {item.category?.categoryName}</div>
                                        <div className='text-sm'>คำอธิบาย : {item.description}</div>
                                        <div className='text-sm'>Stock : {item.stock}</div>
                                        <motion.div
                                            onClick={() => delProduct(item.id)}
                                            style={{
                                                display: 'inline-block',
                                                cursor: 'pointer',
                                            }}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <img
                                                src={delbutton}
                                                alt=""
                                                className="w-17 h-9 flex items-center"
                                            />
                                        </motion.div>
                                        <motion.div
                                            onClick={() => handleEditClick(item)}
                                            style={{
                                                display: 'inline-block',
                                                cursor: 'pointer',
                                            }}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <img
                                                src={editbutton}
                                                alt=""
                                                className="w-full h-10 flex items-center mt-1 object-cover ml-5"
                                            />
                                        </motion.div>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default AdminProductManage;









