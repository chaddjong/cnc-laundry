'use client';
import React, { useState } from 'react';
import { pricing } from '@/data/pricing';
import LaundryFormModal from './LaundryFormModal';

export default function Pricing() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');

  const handleRowClick = (serviceName: string) => {
    setSelectedService(serviceName);
    setIsModalOpen(true);
  };

  return (
    <section id="pricing" className="py-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">No Hidden Pricing.</h2>
          <p className="text-gray-600">
            Harga kami transparan tanpa biaya tersembunyi. Pilih paket sesuai
            kebutuhan Anda.
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-4 px-6 font-semibold text-sm">Description</th>
                <th className="py-4 px-6 font-semibold text-sm text-center">
                  Harga
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {pricing.map((plan, index) => (
                <tr
                  key={index}
                  onClick={() => handleRowClick(plan.name)}
                  className={`cursor-pointer transition ${
                    plan.recommended
                      ? 'bg-green-50 hover:bg-green-100'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <td className="py-4 px-6 font-medium">{plan.name}</td>
                  <td className="py-4 px-6 text-center font-semibold text-green-600">
                    {plan.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      <LaundryFormModal
        key={selectedService} // <— Tambahkan ini
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedService={selectedService}
      />
    </section>
  );
}
