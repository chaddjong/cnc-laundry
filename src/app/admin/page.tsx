'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { listenOrders, updateOrder } from '@/services/orders';
import { uploadOrderImage } from '@/services/uploadImage';
import Image from 'next/image';

// ===============================
// Firestore Return Type (Record)
// ===============================
export type OrderRecord = {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  serviceType?: string;
  deliveryDate?: string | null;
  deliveryTime?: string | null;
  pickupMethod?: string;
  price?: number | null;
  status?: string;
  note?: string;
  orderId?: string;
  beratLaundry?: number;
  createdAt?: { seconds: number; nanoseconds: number };
} & Record<string, any>;

const statusOptions = [
  'pending',
  'received',
  'payment process',
  'washing',
  'drying',
  'ready for delivery',
  'delivered',
];

const statusColorMap: Record<string, string> = {
  received: 'bg-gray-400',
  'payment process': 'bg-blue-400',
  washing: 'bg-yellow-400',
  drying: 'bg-orange-400',
  'ready for delivery': 'bg-green-400',
  delivered: 'bg-emerald-600',
};

function formatNumber(value = '') {
  return String(value)
    .replace(/\D/g, '')
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export default function AdminPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);

  const [weightInput, setWeightInput] = useState<string>('');
  const [weightValue, setWeightValue] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: '',
    address: '',
    deliveryDate: '',
    deliveryTime: '',
    pickupMethod: 'home',
    serviceType: '',
    price: '',
    status: statusOptions[0],
    note: '',
    pembayaran: '',
    imageFile: null as File | null,
  });

  // ===== FILTER STATE =====
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [dateSort, setDateSort] = useState<'asc' | 'desc' | null>(null);

  useEffect(() => {
    const unsub = listenOrders((data) => {
      setOrders(data as OrderRecord[]);
    });
    return () => unsub();
  }, []);

  // ===== Filtered & Sorted Orders =====
  const filteredOrders = orders
    .filter((order) => {
      if (filterStatus !== 'all' && order.status !== filterStatus) return false;
      return true;
    })
    .sort((a, b) => {
      if (!dateSort) return 0;
      const dateA = a.deliveryDate ? new Date(a.deliveryDate).getTime() : 0;
      const dateB = b.deliveryDate ? new Date(b.deliveryDate).getTime() : 0;
      return dateSort === 'asc' ? dateA - dateB : dateB - dateA;
    });

  const openPanel = (order: OrderRecord) => {
    setSelectedOrder(order);

    setForm({
      name: order.name || '',
      address: order.address || '',
      deliveryDate: order.deliveryDate || '',
      deliveryTime: order.deliveryTime || '',
      pickupMethod: order.pickupMethod || 'home',
      serviceType: order.serviceType || '',
      price:
        order.price !== undefined && order.price !== null
          ? formatNumber(String(order.price))
          : '',
      status: order.status || statusOptions[0],
      note: order.note || '',
      pembayaran: order.pembayaran || '',
      imageFile: null,
    });

    setIsPanelOpen(true);
    setTimeout(() => setPanelVisible(true), 10);
  };

  const closePanel = () => {
    setPanelVisible(false);
    setTimeout(() => {
      setIsPanelOpen(false);
      setSelectedOrder(null);
      setForm({
        name: '',
        address: '',
        deliveryDate: '',
        deliveryTime: '',
        pickupMethod: 'home',
        serviceType: '',
        price: '',
        status: statusOptions[0],
        note: '',
        pembayaran: '',
        imageFile: null,
      });
    }, 300);
  };

  const handleChange = <K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange('price', formatNumber(e.target.value));
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/[^0-9.,]/g, '');
    setWeightInput(value);
    const normalized = value.replace(',', '.');
    const num = parseFloat(normalized);
    setWeightValue(!isNaN(num) ? num : null);
  };

  const saveChanges = async () => {
    if (!selectedOrder) return;

    const normalizedPrice =
      form.price !== ''
        ? parseInt(form.price.replace(/\./g, ''), 10) || 0
        : null;

    const updatePayload: any = {
      name: form.name,
      address: form.address,
      deliveryDate: form.deliveryDate || null,
      deliveryTime: form.deliveryTime || null,
      pickupMethod: form.pickupMethod,
      serviceType: form.serviceType,
      status: form.status,
      note: form.note,
      pembayaran: form.pembayaran || null,
      ...(normalizedPrice !== null ? { price: normalizedPrice } : {}),
      ...(weightValue !== null ? { beratLaundry: weightValue } : {}),
    };

    try {
      // Upload ke Supabase Storage
      if (form.imageFile) {
        const imageUrl = await uploadOrderImage(
          selectedOrder.id,
          form.imageFile
        );

        if (!imageUrl) {
          alert('Gagal upload gambar');
          return;
        }

        updatePayload.imageUrl = imageUrl;
      }

      if (
        ['qris', 'transfer'].includes(form.pembayaran) &&
        form.status === 'payment process'
      ) {
        const res = await fetch('/api/create-qris', {
          method: 'POST',
          body: JSON.stringify({
            orderId: selectedOrder.orderId,
            amount: normalizedPrice,
            customer: {
              first_name: selectedOrder.customerName,
              email: selectedOrder.customerEmail,
              phone: selectedOrder.customerPhone,
            },
          }),
        });

        const data = await res.json();

        const updatePayloadPayment: any = {};
        updatePayloadPayment.payment_link_url = data.payment_link_url; // <<< ambil dari payment_url
        updatePayloadPayment.qr_url = data.qr_url;

        // Simpan ke Firestore
        await updateOrder(selectedOrder.id, updatePayloadPayment);
      }

      await updateOrder(selectedOrder.id, updatePayload);
      closePanel();
    } catch (err) {
      console.error('Failed to update order', err);
      alert('Gagal menyimpan perubahan');
    }
  };

  return (
    <div className="w-full mx-auto py-10 lg:px-10 px-4 relative">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
        <h2 className="text-xl font-semibold">Orders</h2>

        {/* FILTERS */}
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Status</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <div className="flex gap-2 mt-2 sm:mt-0">
            <button
              className={`px-3 py-2 rounded-lg border ${
                dateSort === 'asc' ? 'bg-blue-600 text-white' : ''
              }`}
              onClick={() => setDateSort('asc')}
            >
              Ascending
            </button>
            <button
              className={`px-3 py-2 rounded-lg border ${
                dateSort === 'desc' ? 'bg-blue-600 text-white' : ''
              }`}
              onClick={() => setDateSort('desc')}
            >
              Descending
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredOrders.map((order) => {
          const status = (order.status || '').toLowerCase();
          const colorClass = statusColorMap[status] || 'bg-gray-400';

          return (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow p-5 flex flex-col justify-between"
            >
              <div className="flex justify-between items-start">
                <span className="text-sm text-gray-500">
                  {order.orderId || order.id}
                </span>
                <span
                  className={`text-xs text-white px-3 py-1 rounded-full ${colorClass}`}
                >
                  {order.status || '-'}
                </span>
              </div>

              <p className="text-xs text-gray-400 mt-1">
                {order.deliveryDate ||
                  (order.createdAt
                    ? new Date(
                        order.createdAt.seconds * 1000
                      ).toLocaleDateString()
                    : '')}
              </p>

              <h3 className="text-lg font-semibold mt-2">
                {order.name || '-'}
              </h3>

              <p className="text-gray-600 text-sm">
                {order.serviceType || '-'}
              </p>

              {order.pembayaran && (
                <p className="text-sm text-purple-600 font-medium mt-1">
                  Pembayaran: {order.pembayaran.toUpperCase()}
                </p>
              )}

              <p className="text-gray-600 text-sm">
                {order.beratLaundry || '-'} kg
              </p>

              <p className="text-gray-800 font-semibold mt-1">
                Rp
                {order.price !== undefined && order.price !== null
                  ? formatNumber(String(order.price))
                  : '-'}
              </p>

              {order.buktiBayar && (
                <Image
                  src={order.buktiBayar}
                  alt="Bukti pembayaran"
                  className="w-full h-32 object-cover rounded-lg border mt-3"
                  width={300}
                  height={300}
                />
              )}

              <button
                onClick={() => openPanel(order)}
                className="text-blue-600 text-sm font-medium mt-3 hover:underline"
              >
                Update
              </button>
            </div>
          );
        })}
      </div>

      {/* PANEL UPDATE ORDER */}
      {isPanelOpen && (
        <>
          <div
            onClick={closePanel}
            className={`fixed inset-0 z-40 bg-black/40 backdrop-blur transition-opacity ${
              panelVisible ? 'opacity-100' : 'opacity-0'
            }`}
          />
          {/* ------------------------------------------------------------------------------------------- */}
          <div
            className={`fixed inset-y-0 right-0 w-full sm:w-[420px] bg-white shadow-xl z-50 p-6 overflow-y-auto transform transition-transform duration-300 ${
              panelVisible ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Update Order</h2>
              <button onClick={closePanel}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* FORM FIELDS */}
              <div>
                <label className="text-sm font-medium">Client Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Delivery Date</label>
                <input
                  type="date"
                  value={form.deliveryDate}
                  onChange={(e) => handleChange('deliveryDate', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Delivery Time</label>
                <input
                  type="time"
                  value={form.deliveryTime}
                  onChange={(e) => handleChange('deliveryTime', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Pickup Method</label>
                <select
                  value={form.pickupMethod}
                  onChange={(e) => handleChange('pickupMethod', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                >
                  <option value="Ambil di rumah">Ambil di rumah</option>
                  <option value="Antar ke Laundry">Antar ke laundry</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Service Type</label>
                <input
                  type="text"
                  value={form.serviceType}
                  onChange={(e) => handleChange('serviceType', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Price</label>
                <input
                  type="text"
                  value={form.price}
                  onChange={handlePriceChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                >
                  {statusOptions.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Metode Pembayaran</label>
                <select
                  value={form.pembayaran}
                  onChange={(e) => handleChange('pembayaran', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                >
                  <option value="qris">QRIS</option>
                  <option value="tunai">Tunai</option>
                  <option value="transfer">Transfer</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Berat Laundry (kg)
                </label>
                <input
                  type="text"
                  placeholder="Masukkan berat ..."
                  value={weightInput}
                  onChange={handleWeightChange}
                  className="mt-1 block w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Note</label>
                <textarea
                  rows={3}
                  value={form.note}
                  onChange={(e) => handleChange('note', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleChange('imageFile', e.target.files?.[0] ?? null)
                  }
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />

                {selectedOrder?.imageUrl && (
                  <Image
                    src={selectedOrder.imageUrl}
                    alt="Order Image"
                    width={500}
                    height={500}
                    className="w-full h-32 object-cover rounded-lg mt-2 border"
                  />
                )}
              </div>

              <button
                onClick={saveChanges}
                className="w-full bg-blue-600 text-white py-2 rounded-lg mt-4"
              >
                Save Changes
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
