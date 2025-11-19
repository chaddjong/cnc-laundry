import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let { orderId, amount } = body;

    if (!amount)
      return NextResponse.json({ error: 'Amount required' }, { status: 400 });
    if (!orderId) orderId = `ORDER-${Date.now()}`; // pastikan unik

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

    const response = await fetch(`${baseUrl}/v2/charge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        payment_type: 'qris',
        transaction_details: { order_id: orderId, gross_amount: amount },
      }),
    });

    const result = await response.json();

    if (!response.ok)
      return NextResponse.json(result, { status: response.status });

    const qrUrl =
      result.actions?.find((a) => a.name === 'generate-qr-code')?.url || null;

    return NextResponse.json({
      qr_url: qrUrl,
      transaction_id: result.transaction_id,
      status: result.status_code,
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal error', details: String(err) },
      { status: 500 }
    );
  }
}
