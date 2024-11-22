import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import useAuthStore from '../../stores/authStore';
import { listMember, removeMember, UpdateRolemember } from '../../api/member';
import { DeleteUserBin } from '../../icons';
import { toast } from 'react-toastify';

export default function TableMember({ currentUser }) {
    const [member, setMember] = useState([]);
    const token = useAuthStore(state => state.token);

    const getAllMember = async () => {
        try {
            const resp = await listMember(token);
            setMember(resp.data);
            console.log(resp.data);
        } catch (err) {
            const errMsg = err?.response?.data?.error || err.message;
            console.log(errMsg);
        }
    };

    useEffect(() => {
        getAllMember();
    }, []);

    const hdlUpdatemember = async (e, id) => {
        const role = e.target.value;
        console.log({ role });
        try {
            const resp = await UpdateRolemember(token, id, { role });
            console.log(resp);
            toast.success(resp.data.message);
        } catch (err) {
            const errMsg = err?.response?.data?.error || err.message;
            console.log(errMsg);
        }
    };

    const hdlRemoveMember = async (id) => {
        console.log(id);
        try {
            const resp = await removeMember(token, id);
            console.log(resp);
            getAllMember();
        } catch (err) {
            const errMsg = err?.response?.data?.error || err.message;
            console.log(errMsg);
        }
    };

    return (
        <div className="overflow-x-auto p-2">
            <h1 className="text-left text-4xl font-bold mb-6 text-gray-600 font-sans mt-5" style={{ fontFamily: 'Pacifico, cursive' }}>
                Manage User
            </h1>
            <table className="table-auto w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg shadow-md">
                <thead>
                    <tr className="bg-gray-600 text-white">
                        <th scope='col' className="py-2">No.</th>
                        <th scope='col' className="py-2">Email</th>
                        <th scope='col' className="py-2">Role</th>
                        <th scope='col' className="py-2">Actions</th>
                    </tr>
                </thead>
                <tbody className='text-center'>
                    {member
                        .filter(item => item.id !== currentUser.id) // Filter out the current user
                        .map((item, index) => (
                            <motion.tr
                                key={item.id} // ใช้ item.id แทน index เพื่อให้มั่นใจว่าคีย์ไม่ซ้ำกัน
                                className="hover:bg-gray-300 transition duration-300"
                                initial={{ opacity: 0, y: -10 }} // ตั้งค่าตอนเริ่มต้น
                                animate={{ opacity: 1, y: 0 }} // ตั้งค่าการเคลื่อนไหว
                                exit={{ opacity: 0, y: 10 }} // ตั้งค่าการออก
                                transition={{ duration: 0.2 }} // ตั้งค่าความเร็ว
                            >
                                <td scope='row' className="py-2">{index + 1}</td>
                                <td scope='row' className="py-2">{item.email}</td>

                                <td scope='row' className="py-2">
                                    <select
                                        onChange={(e) => hdlUpdatemember(e, item.id)}
                                        defaultValue={item.role}
                                        className="border border-gray-400 rounded p-1 bg-white"
                                    >
                                        <option value="ADMIN">ADMIN</option>
                                        <option value="USER">USER</option>
                                    </select>
                                </td>

                                <td scope='row' className="py-2">
                                    <p
                                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}
                                        onClick={() => hdlRemoveMember(item.id)} // Allow removing other members
                                    >
                                        <DeleteUserBin size={25} className="cursor-pointer hover:scale-110 transform transition-transform duration-300 mb-5" />
                                    </p>
                                </td>
                            </motion.tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}


// import React, { useEffect, useState } from 'react';
// import useAuthStore from '../../stores/authStore';
// import { listMember, removeMember, UpdateRolemember } from '../../api/member';
// import { DeleteUserBin } from '../../icons';
// import { toast } from 'react-toastify';

// export default function TableMember({ currentUser }) {
//     const [member, setMember] = useState([]);
//     const token = useAuthStore(state => state.token);

//     const getAllMember = async () => {
//         try {
//             const resp = await listMember(token);
//             setMember(resp.data);
//             console.log(resp.data);
//         } catch (err) {
//             const errMsg = err?.response?.data?.error || err.message;
//             console.log(errMsg);
//         }
//     };

//     useEffect(() => {
//         getAllMember();
//     }, []);

//     const hdlUpdatemember = async (e, id) => {
//         const role = e.target.value;
//         console.log({ role });
//         try {
//             const resp = await UpdateRolemember(token, id, { role });
//             console.log(resp);
//             toast.success(resp.data.message);
//         } catch (err) {
//             const errMsg = err?.response?.data?.error || err.message;
//             console.log(errMsg);
//         }
//     };

//     const hdlRemoveMember = async (id) => {
//         console.log(id);
//         try {
//             const resp = await removeMember(token, id);
//             console.log(resp);
//             getAllMember();
//         } catch (err) {
//             const errMsg = err?.response?.data?.error || err.message;
//             console.log(errMsg);
//         }
//     };

//     return (
//         <div>
//             <table className="table-auto h-full w-full rounded-lg bg-gradient-to-b from-violet-600 to-gray-300">
//                 <thead>
//                     <tr>
//                         <th scope='col'>No.</th>
//                         <th scope='col'>Email</th>
//                         <th scope='col'>Role</th>
//                         <th scope='col'>Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody className='text-center'>
//                     {member
//                         .filter(item => item.id !== currentUser.id) // Filter out the current user
//                         .map((item, index) => (
//                             <tr key={index}>
//                                 <td scope='row'>{index + 1}</td>
//                                 <td scope='row'>{item.email}</td>

//                                 <td scope='row'>
//                                     <select
//                                         onChange={(e) => hdlUpdatemember(e, item.id)}
//                                         defaultValue={item.role}
//                                     >
//                                         <option>ADMIN</option>
//                                         <option>USER</option>
//                                     </select>
//                                 </td>

//                                 <td scope='row'>
//                                     <p
//                                         style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100' }}
//                                         onClick={() => hdlRemoveMember(item.id)} // Allow removing other members
//                                     >
//                                         <DeleteUserBin size={25} />
//                                     </p>
//                                 </td>
//                             </tr>
//                         ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// }
