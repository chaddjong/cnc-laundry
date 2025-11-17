'use client';
import React from 'react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
}

export default function SuccessModal({
  isOpen,
  onClose,
  orderId,
}: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full text-center relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-2 text-green-600">
          Pesanan Berhasil!
        </h2>

        <p className="text-gray-700 mb-4">
          Pesanan Anda telah berhasil dibuat. Silakan tunggu konfirmasi
          selanjutnya dari admin.
        </p>

        <div className="bg-green-100 text-green-700 font-semibold px-4 py-2 rounded-lg inline-block mb-4">
          ID Pesanan: <span className="font-bold">{orderId}</span>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg py-2 font-semibold"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
