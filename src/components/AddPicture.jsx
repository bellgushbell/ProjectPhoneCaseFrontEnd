import React from 'react';
import { AddPictureIcon } from '../icons';

export default function AddPicture(props) {
    const { file, setFile } = props;

    const hdlFileChange = (e) => {
        if (e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    return (
        <div className="flex flex-col p-2 border rounded-lg">
            <div className="bg-slate-100 hover:bg-slate-200 min-h-40 max-w-[600px] rounded-lg relative cursor-pointer"
                onClick={() => document.getElementById('input-file').click()}>

                <input
                    type="file"
                    className='opacity-0'
                    id='input-file'
                    onChange={hdlFileChange}
                />

                {file && ( //แสดงตัวอย่างของไฟล์รูปภาพ
                    <img
                        src={URL.createObjectURL(file)} //สร้าง URL ชั่วคราวสำหรับไฟล์
                        style={{ maxWidth: '100%', maxHeight: '400px' }}
                        className='h-100 block mx-auto'
                    />
                )}

                <p className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                    {!file && <AddPictureIcon className='w-10 opacity-70' />}
                </p>
            </div>
        </div>
    );
}
