'use client';

import React, { useState } from 'react';
import { pricing } from '@/data/pricing';
import SuccessModal from './SuccessModal';
import { createOrder } from '@/services/orders';
import { OrderData } from '@/services/orders';

// shadcn components
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
  const [formData, setFormData] = useState(() => ({
    name: '',
    phone: '',
    address: '',
    serviceType: selectedService || (pricing[0]?.name ?? ''),
    deliveryDate: null as Date | null,
    deliveryTime: '',
    pickupMethod: 'Pickup',
    pembayaran: 'qris', // harus lowercase karena union type
    beratLaundry: '', // input string dulu → convert saat submit
  }));

  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  if (!isOpen) return null;

  // replaces comma with dot in beratLaundry
  const handleBeratChange = (value: string) => {
    const normalized = value.replace(',', '.');
    setFormData((prev) => ({ ...prev, beratLaundry: normalized }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'beratLaundry') {
      handleBeratChange(value);
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, deliveryDate: date ?? null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newOrderId = generateOrderId();
    setOrderId(newOrderId);

    const beratNumber =
      formData.beratLaundry.trim() === ''
        ? null
        : Number(formData.beratLaundry);

    const payload: OrderData = {
      orderId: newOrderId,
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      serviceType: formData.serviceType,
      deliveryDate: formData.deliveryDate,
      deliveryTime: formData.deliveryTime,
      status: 'pending',
      note: '',
      pembayaran: formData.pembayaran as 'qris' | 'tunai' | 'transfer',
      imageUrl: '',
      beratLaundry: beratNumber ?? undefined,
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
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-md relative max-h-[90vh] flex flex-col">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl z-10"
          >
            ✕
          </button>

          <h3 className="text-xl font-semibold text-center p-5 pb-3">
            Form Pemesanan Laundry
          </h3>

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

            {/* Berat Laundry */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Berat Laundry (kg)
              </label>
              <input
                type="text"
                name="beratLaundry"
                placeholder="7.22"
                value={formData.beratLaundry}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Gunakan koma atau titik — otomatis menjadi titik.
              </p>
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
              <label className="block text-sm font-medium mb-1">
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
                value={formData.pembayaran}
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
