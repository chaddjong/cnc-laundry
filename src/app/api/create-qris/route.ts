import { NextResponse } from 'next/server';

// Fungsi untuk memastikan customer_details valid
function buildCustomerDetails(customer?: any) {
  return {
    first_name:
      (customer?.first_name && customer.first_name.trim()) || 'Customer',
    last_name: (customer?.last_name && customer.last_name.trim()) || 'Buyer',
    email: (customer?.email && customer.email.trim()) || 'customer@example.com',
    phone: (customer?.phone && customer.phone.trim()) || '08123456789',
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let { orderId, amount, customer } = body;

    if (!amount)
      return NextResponse.json({ error: 'Amount required' }, { status: 400 });

    if (!orderId) orderId = `ORDER-${Date.now()}`;
    if (amount < 1000)
      return NextResponse.json(
        { error: 'Amount must be at least 1000 IDR' },
        { status: 400 }
      );

    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const baseUrl =
      process.env.MIDTRANS_BASE_URL || 'https://api.sandbox.midtrans.com';

    if (!serverKey)
      return NextResponse.json(
        { error: 'Missing MIDTRANS_SERVER_KEY' },
        { status: 500 }
      );

    const auth = Buffer.from(serverKey + ':').toString('base64');

    const customerDetails = buildCustomerDetails(customer);

    console.log('📤 Creating Payment Link with:', {
      orderId,
      amount,
      customerDetails,
    });

    const response = await fetch(`${baseUrl}/v1/payment-links`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        transaction_details: { order_id: orderId, gross_amount: amount },
        customer_details: customerDetails,
        enabled_payments: ['qris', 'gopay', 'shopeepay', 'bank_transfer'],
      }),
    });

    const result = await response.json();
    console.log('📥 Midtrans Response:', result);

    if (!response.ok)
      return NextResponse.json(result, { status: response.status });

    const qrUrl =
      result.actions?.find((a: any) => a.name === 'generate-qr-code')?.url ||
      null;

    const paymentLink = result.payment_url || null;

    return NextResponse.json({
      payment_link_url: paymentLink,
      qr_url: qrUrl,
      transaction_id: result.id,
      status: result.status_code,
    });
  } catch (err) {
    console.error('❌ Internal error:', err);
    return NextResponse.json(
      { error: 'Internal error', details: String(err) },
      { status: 500 }
    );
  }
}
