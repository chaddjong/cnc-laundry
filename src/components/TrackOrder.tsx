'use client';

import React, { useState } from 'react';
import { getOrderById } from '@/services/orders';
import { uploadPaymentProof } from '@/services/uploadImage';
import { updateOrder } from '@/services/orders';
import Image from 'next/image';
import {
  CheckCircle,
  Droplet,
  Factory,
  Package,
  Truck,
  XCircle,
} from 'lucide-react';

export default function TrackOrder() {
  const [orderIdInput, setOrderIdInput] = useState('');
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const statusList = [
    'received',
    'payment process',
    'washing',
    'drying',
    'ready for delivery',
    'delivered',
  ];

  const iconMap: Record<string, React.ReactNode> = {
    received: <CheckCircle size={22} className="text-green-500" />,
    'payment process': <Truck size={22} className="text-green-500" />,
    washing: <CheckCircle size={22} className="text-blue-500" />,
    drying: <Droplet size={22} className="text-blue-500" />,
    'ready for delivery': <Factory size={22} className="text-gray-400" />,
    delivered: <Package size={22} className="text-gray-400" />,
  };

  function formatNumber(value = '') {
    return String(value)
      .replace(/\D/g, '')
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  const handleUploadProof = async () => {
    if (!paymentFile || !order) return alert('Please select an image');

    setUploading(true);

    try {
      const url = await uploadPaymentProof(order.orderId, paymentFile);

      if (url) {
        await updateOrder(order.id, { buktiBayar: url });

        alert('Bukti bayar berhasil diupload!');
        setOrder({ ...order, buktiBayar: url }); // update UI tanpa reload
      }
    } catch (err) {
      console.error(err);
      alert('Gagal upload bukti bayar');
    }

    setUploading(false);
  };

  const trackOrder = async () => {
    if (!orderIdInput.trim()) return;

    setLoading(true);
    setNotFound(false);

    const data = await getOrderById(orderIdInput.trim());

    if (!data) {
      setOrder(null);
      setNotFound(true);
    } else {
      setOrder(data);
    }

    setLoading(false);
  };

  return (
    <section id="track-order" className="py-20 bg-[#E0F7FA]">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-2">
          Track Your Order
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Enter your order ID to see the real-time status of your laundry.
        </p>

        <div className="flex justify-center mb-10">
          <input
            type="text"
            placeholder="Enter your Order ID"
            value={orderIdInput}
            onChange={(e) => setOrderIdInput(e.target.value)}
            className="w-72 md:w-96 px-5 py-3 rounded-full border border-gray-300 focus:outline-none bg-white"
          />
          <button
            onClick={trackOrder}
            className="ml-3 px-6 py-3 bg-green-400 text-white rounded-full font-medium hover:bg-green-500"
          >
            {loading ? 'Loading...' : 'Track'}
          </button>
        </div>

        {/* NOT FOUND */}
        {notFound && (
          <div className="text-center text-red-500 font-medium">
            <XCircle className="w-6 h-6 inline-block mr-2" />
            Order not found
          </div>
        )}

        {/* ORDER CARD */}
        {order && (
          <div className="bg-white rounded-xl shadow p-6 mt-10">
            {/* TITLE */}
            <h3 className="text-2xl font-bold mb-6">
              Order ID: <span className="text-blue-600">{order.orderId}</span>
            </h3>

            {/* CARD GRID: RESPONSIVE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* LEFT: ORDER DETAILS */}
              <div className="border rounded-xl p-6 shadow-sm bg-[#F9FAFB]">
                <h4 className="text-xl font-semibold mb-4">Order Details</h4>

                <div className="space-y-2 text-gray-700">
                  <p>
                    <span className="font-medium">Name</span>{' '}
                    <span className="float-right font-semibold">
                      {order.name}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Service</span>{' '}
                    <span className="float-right">{order.serviceType}</span>
                  </p>
                  <p>
                    <span className="font-medium">Pickup Method</span>{' '}
                    <span className="float-right">{order.pickupMethod}</span>
                  </p>
                  <p>
                    <span className="font-medium">Payment Method</span>{' '}
                    <span className="float-right">{order.pembayaran}</span>
                  </p>
                  <p>
                    <span className="font-medium">Price</span>{' '}
                    <span className="float-right">
                      Rp {order.price ? formatNumber(String(order.price)) : '-'}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Delivery</span>{' '}
                    <span className="float-right">
                      {order.deliveryDate} {order.deliveryTime}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Note</span>{' '}
                    <span className="float-right">{order.note || '-'}</span>
                  </p>

                  {/* IMAGE URL (Laundry Photo) */}
                  {order.imageUrl && (
                    <div className="mt-4">
                      <p className="font-medium mb-2">Laundry Photo:</p>
                      <Image
                        src={order.imageUrl}
                        alt="Laundry Image"
                        width={200}
                        height={200}
                        className="rounded-lg border"
                      />
                    </div>
                  )}
                </div>

                {/* QRIS */}
                {order.qr_url && order.status === 'payment process' && (
                  <div className="mt-6">
                    <p className="font-medium mb-2">Scan to Pay (QRIS):</p>
                    <Image
                      src={order.qr_url}
                      alt="QRIS"
                      className="w-48 h-48 border rounded-lg"
                      width={200}
                      height={200}
                    />
                  </div>
                )}

                {/* Payment Link */}
                {order.payment_link_url &&
                  order.status === 'payment process' && (
                    <div className="mt-4">
                      <a
                        href={order.payment_link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        Link Pembayaran
                      </a>
                    </div>
                  )}
              </div>

              {/* RIGHT: UPLOAD BUKTI BAYAR */}
              <div className="border rounded-xl p-6 shadow-sm bg-[#F9FAFB]">
                <h4 className="text-xl font-semibold mb-4">
                  Upload Bukti Pembayaran
                </h4>

                {order.buktiBayar ? (
                  <div>
                    <p className="text-green-600 font-medium mb-3">
                      Bukti bayar sudah diupload:
                    </p>

                    <Image
                      src={order.buktiBayar}
                      alt="Bukti Bayar"
                      width={200}
                      height={200}
                      className="rounded-lg border mb-4"
                    />
                  </div>
                ) : (
                  <p className="text-gray-600 mb-3">Belum ada bukti bayar.</p>
                )}

                {/* FILE INPUT */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPaymentFile(e.target.files?.[0] || null)}
                  className="w-full border rounded-lg p-2 mb-4"
                />

                {/* BUTTON */}
                <button
                  onClick={handleUploadProof}
                  disabled={uploading}
                  className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  {uploading ? 'Uploading...' : 'Upload Bukti Bayar'}
                </button>
              </div>
            </div>

            {/* ORDER PROGRESS */}
            <div className="mt-10">
              <h4 className="font-semibold mb-3 text-xl">Order Progress</h4>

              {(() => {
                const active = statusList.find(
                  (s) => order.status?.toLowerCase() === s.toLowerCase()
                );

                if (!active)
                  return <p className="text-gray-500">No status available</p>;

                return (
                  <div className="py-4 px-4 bg-blue-50 rounded-lg flex justify-between items-center shadow-sm">
                    <span className="font-medium text-blue-600 text-lg capitalize">
                      {active}
                    </span>
                    <div className="text-blue-600">{iconMap[active]}</div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
