import React from 'react';

export default function AdminShowSlipPaymentModal({ slipUrl, onClose }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg relative" style={{ width: '80%', maxWidth: '800px', maxHeight: '90vh', overflow: 'auto' }}>
                <button
                    type="button"
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                    onClick={onClose}
                >
                    ✕
                </button>
                <h2 className="text-lg font-bold mb-4 text-center">Slip Payment</h2>
                <div className="flex items-center justify-center">
                    <img
                        src={slipUrl}
                        alt="Slip"
                        className="max-w-full max-h-full object-contain"
                        style={{ maxHeight: '85vh', width: 'auto' }} // จำกัดความสูงไม่เกิน 85vh และความกว้างอัตโนมัติ
                    />
                </div>
            </div>
        </div>
    );
}
