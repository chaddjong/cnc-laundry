'use client';

import React, { useState } from 'react';

type FormState = {
  name: string;
  phone: string;
  address: string;
  service: string;
  notes: string;
  delivery: 'delivery' | 'pickup';
};

export default function OrderForm() {
  const [form, setForm] = useState<FormState>({
    name: '',
    phone: '',
    address: '',
    service: 'Wash & Fold per Kg',
    notes: '',
    delivery: 'delivery',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function onChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validate(f: FormState) {
    if (!f.name.trim()) return 'Name is required';
    if (!f.phone.trim()) return 'Phone number is required';
    if (!f.address.trim()) return 'Address is required';
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validationError = validate(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      // contoh fetch ke backend (uncomment saat endpoint siap)
      // const res = await fetch('/api/orders', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(form)
      // })
      // if (!res.ok) throw new Error('Failed to submit order')
      // const data = await res.json()
      // setSuccess(`Order submitted — kode: ${data.orderId}`)

      // sementara (static/demo):
      console.log('Order payload:', form);
      setSuccess(
        'Order submitted (demo). Saat endpoint siap, payload akan dikirim ke backend.'
      );
      setForm({
        name: '',
        phone: '',
        address: '',
        service: 'Wash & Fold per Kg',
        notes: '',
        delivery: 'delivery',
      });
    } catch (err: any) {
      setError(err?.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-20 bg-white rounded-xl shadow-lg" id="order-form">
      <div className="max-w-2xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-8">Order Form</h2>

        <form className="space-y-6" onSubmit={onSubmit} noValidate>
          {error && (
            <div
              role="alert"
              className="text-sm text-red-600 bg-red-50 p-3 rounded"
            >
              {error}
            </div>
          )}
          {success && (
            <div
              role="status"
              className="text-sm text-green-700 bg-green-50 p-3 rounded"
            >
              {success}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={onChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="John Doe"
              required
              aria-required="true"
            />
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="phone">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              value={form.phone}
              onChange={onChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="+62 812 3456 7890"
              inputMode="tel"
              required
              aria-required="true"
            />
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="address">
              Address
            </label>
            <textarea
              id="address"
              name="address"
              value={form.address}
              onChange={onChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              rows={3}
              placeholder="123 Main St, City"
              required
              aria-required="true"
            />
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="service">
              Service Type
            </label>
            <select
              id="service"
              name="service"
              value={form.service}
              onChange={onChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option>Wash &amp; Fold per Kg</option>
              <option>Wash &amp; Iron</option>
              <option>Express Service</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="notes">
              Notes (Optional)
            </label>
            <input
              id="notes"
              name="notes"
              value={form.notes}
              onChange={onChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="e.g., delicate items"
            />
          </div>

          <fieldset>
            <legend className="block text-sm font-medium">
              Delivery Option
            </legend>
            <div className="mt-2 space-y-2">
              <div className="flex items-center">
                <input
                  id="delivery"
                  name="delivery"
                  type="radio"
                  value="delivery"
                  checked={form.delivery === 'delivery'}
                  onChange={onChange as any}
                  className="h-4 w-4 text-primary border-gray-300"
                />
                <label
                  className="ml-3 block text-sm font-medium"
                  htmlFor="delivery"
                >
                  Delivery
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="pickup"
                  name="delivery"
                  type="radio"
                  value="pickup"
                  checked={form.delivery === 'pickup'}
                  onChange={onChange as any}
                  className="h-4 w-4 text-primary border-gray-300"
                />
                <label
                  className="ml-3 block text-sm font-medium"
                  htmlFor="pickup"
                >
                  Pickup at Store
                </label>
              </div>
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full text-white bg-primary font-bold disabled:opacity-60"
            aria-busy={loading}
          >
            {loading ? 'Submitting...' : 'Submit Order'}
          </button>
        </form>
      </div>
    </section>
  );
}
