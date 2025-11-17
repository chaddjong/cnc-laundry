'use client';

import React, { useState } from 'react';
import { pricing } from '@/data/pricing';
import SuccessModal from './SuccessModal';
import { createOrder } from '@/services/orders';

// shadcn components (jika terpakai)
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface LaundryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedService: string;
}

function generateOrderId() {
  const prefix = 'A';
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${random}`;
}

export default function LaundryFormModal({
  isOpen,
  onClose,
  selectedService,
}: LaundryFormModalProps) {
  // jika modal tidak dibuka, komponen akan unmount jadi initializer ini dipakai setiap mount
  const [formData, setFormData] = useState(() => ({
    name: '',
    phone: '',
    address: '',
    serviceType: selectedService || (pricing[0]?.name ?? ''),
    deliveryDate: null as Date | null,
    deliveryTime: '',
    pickupMethod: 'Pickup', // default
    note: '',
    pembayaran: 'QRIS',
  }));

  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  if (!isOpen) return null; // unmount saat ditutup — memastikan inisialisasi ulang saat dibuka

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, deliveryDate: date ?? null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newOrderId = generateOrderId();
    setOrderId(newOrderId);

    const payload = {
      ...formData,
      orderId: newOrderId,
      status: 'Received', // default
    };

    try {
      await createOrder(payload);
      console.log('Order saved:', payload);
      setShowSuccess(true);
    } catch (error) {
      console.error('Error saving order:', error);
      alert('Terjadi kesalahan server. Coba lagi.');
    }
  };

  const closeSuccessModal = () => {
    setShowSuccess(false);
    onClose();
    // tidak perlu reset manual karena saat modal ditutup komponen unmount → next mount akan inisialisasi ulang
  };

  return (
    <>
      {/* MAIN FORM */}
      <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center p-4 overflow-y-auto">
        {/* MODAL BOX */}
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-md relative max-h-[90vh] flex flex-col">
          {/* CLOSE BUTTON */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl z-10"
          >
            ✕
          </button>

          {/* HEADER */}
          <h3 className="text-xl font-semibold text-center p-5 pb-3">
            Form Pemesanan Laundry
          </h3>

          {/* FORM (scrollable) */}
          <form
            onSubmit={handleSubmit}
            className="px-6 pb-6 space-y-4 overflow-y-auto"
          >
            {/* Nama */}
            <div>
              <label className="block text-sm font-medium mb-1">Nama</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            {/* Telepon */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Nomor Telepon
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            {/* Alamat */}
            <div>
              <label className="block text-sm font-medium mb-1">Alamat</label>
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            {/* Jenis Layanan */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Jenis Layanan
              </label>
              <select
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              >
                {pricing.map((p, i) => (
                  <option key={i} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Pickup Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Metode Pengambilan
              </label>
              <select
                name="pickupMethod"
                value={formData.pickupMethod}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="Pickup">Dijemput Kurir</option>
                <option value="Drop-off">Antar ke Laundry</option>
              </select>
            </div>

            {/*Metode Bayar */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Metode Pembayaran
              </label>
              <select
                name="pembayaran"
                value={formData.pembayaran || ''}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg"
                required
              >
                <option value="qris">QRIS</option>
                <option value="tunai">Tunai</option>
                <option value="transfer">Transfer</option>
              </select>
            </div>

            {/* Tanggal Pengantaran */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Tanggal Pengantaran
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    {formData.deliveryDate
                      ? format(formData.deliveryDate, 'dd MMM yyyy')
                      : 'Pilih tanggal'}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.deliveryDate ?? undefined}
                    onSelect={handleDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Jam Pengantaran */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Jam Pengantaran
              </label>
              <input
                type="time"
                name="deliveryTime"
                required
                value={formData.deliveryTime}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg py-2"
            >
              Kirim Pesanan
            </button>
          </form>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccess}
        onClose={closeSuccessModal}
        orderId={orderId}
      />
    </>
  );
}
