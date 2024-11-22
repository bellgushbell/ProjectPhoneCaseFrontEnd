import React, { useEffect, useState } from 'react';
import AddPicture from '../components/AddPicture';
import axios from 'axios';
import { toast } from 'react-toastify';
import useAuthStore from '../stores/authStore';
import LoadingAddproduct from '../components/loading/Loading-uploadfile';

import AddproductButton from '../assets/addproductbutton.gif'

import bgaddproduct from '../assets/gradientbg5.gif'

const URL = import.meta.env.VITE_API_URL
export default function AddProduct() {
    const [loadingAddproduct, setloadingAddproduct] = useState(false);
    const token = useAuthStore(state => state.token);
    const [categories, setCategories] = useState([]);

    const [file, setFile] = useState(null);
    const [input, setInput] = useState({
        name: "",
        price: "",
        categoryId: "",
        description: "",
        stock: ""
    });

    // console.log('firstacascsacsacasc')
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${URL}/admin/categories`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCategories(response.data);
            } catch (err) {
                console.error("Error fetching categories:", err);
            } finally {
                setloadingAddproduct(false);
            }
        };
        fetchCategories();
    }, [token]);

    const hdlChange = (e) => {
        setInput(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const hdlSubmit = async (e) => {
        e.preventDefault();

        try {
            setloadingAddproduct(true);

            const body = new FormData();
            body.append('name', input.name);
            body.append('price', input.price);
            body.append('categoryId', input.categoryId);
            body.append('description', input.description);
            body.append('stock', input.stock);
            if (file) {
                body.append('image', file);
            }

            const rs = await axios.post(`${URL}/admin/create-product`, body, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Create Product Success📥");
        } catch (err) {
            const errMsg = err?.response?.data?.error || err.message;
            console.log(errMsg);
        } finally {
            setloadingAddproduct(false);
        }
    };

    if (loadingAddproduct) {
        return <LoadingAddproduct />;
    }

    return (
        <div
            className="flex flex-col justify-center min-h-screen w-full bg-gray-500 items-center gap-5"
            style={{
                backgroundImage: `url(${bgaddproduct})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <p className='text-gray-800 text-3xl' style={{ fontFamily: 'Pacifico, cursive' }}>Add Product Management</p>
            <form className="flex flex-col justify-center items-center gap-5" onSubmit={hdlSubmit}>
                <input name="name" value={input.name} onChange={hdlChange}
                    type="text"
                    placeholder="Name"
                    className="input input-bordered input-info w-full max-w-xs" />


                <input name="price" value={input.price} onChange={hdlChange}
                    type="text"
                    placeholder="Price"
                    className="input input-bordered input-info w-full max-w-xs" />


                <AddPicture file={file} setFile={setFile} />

                <select name="categoryId" value={input.categoryId} onChange={hdlChange}
                    className="flex select select-bordered select-info w-full max-w-xs">
                    <option value="" disabled>Select a category</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.categoryName}</option>
                    ))}
                </select>

                <input name="description" value={input.description} onChange={hdlChange}
                    type="text"
                    placeholder="Description"
                    className="flex input input-bordered input-info w-full max-w-xs" />


                <input name="stock" value={input.stock} onChange={hdlChange}
                    type="text"
                    placeholder="Stock"
                    className="flex input input-bordered input-info w-full max-w-xs" />


                <button type="submit" className="flex items-center justify-center w-24 h-20 hover:scale-110 transform transition-transform duration-300 mb-5">
                    <img src={AddproductButton} alt="Add Product" className="w-full h-auto" />
                </button>
            </form>
        </div>
    );
}





