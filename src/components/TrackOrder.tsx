'use client';

import React, { useState } from 'react';
import { getOrderById } from '@/services/orders';
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

  const statusList = [
    'received',
    'picked up',
    'washing',
    'drying',
    'ready for delivery',
    'delivered',
  ];

  const iconMap: Record<string, JSX.Element> = {
    received: <CheckCircle size={22} className="text-green-500" />,
    'picked up': <Truck size={22} className="text-green-500" />,
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
            <h3 className="text-xl font-semibold mb-3">
              Order ID: {order.orderId}
            </h3>

            <p>
              <strong>Name:</strong> {order.name}
            </p>
            <p>
              <strong>Service:</strong> {order.serviceType}
            </p>
            <p>
              <strong>Pickup Method:</strong> {order.pickupMethod}
            </p>
            <p>
              <strong>Metode Pembayaran:</strong> {order.pembayaran}
            </p>
            <p>
              <strong>Price:</strong> Rp{' '}
              {order.price ? formatNumber(String(order.price)) : '-'}
            </p>

            <p>
              <strong>Delivery:</strong> {order.deliveryDate}{' '}
              {order.deliveryTime}
            </p>
            <p>
              <strong>Note:</strong> {order.note || '-'}
            </p>

            {order.imageUrl && (
              <Image
                src={order.imageUrl}
                alt="Order Image"
                width={300}
                height={100}
                className="rounded-lg mb-4"
              />
            )}

            <hr className="my-5" />

            <h4 className="font-semibold mb-3">Order Progress</h4>

            {(() => {
              const active = statusList.find(
                (s) => order.status?.toLowerCase() === s.toLowerCase()
              );

              if (!active)
                return <p className="text-gray-500">No status available</p>;

              return (
                <div className="py-4 px-2 bg-blue-50 rounded-lg flex justify-between items-center">
                  <span className="font-medium text-blue-600 capitalize">
                    {active}
                  </span>

                  <div className="pr-4">{iconMap[active]}</div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </section>
  );
}
