import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, amount } = body;

    if (!orderId || !amount) {
      return NextResponse.json(
        { error: 'orderId & amount required' },
        { status: 400 }
      );
    }

    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const baseUrl = process.env.MIDTRANS_BASE_URL;

    if (!serverKey) {
      return NextResponse.json(
        { error: 'Missing MIDTRANS_SERVER_KEY' },
        { status: 500 }
      );
    }

    // Encode Server Key (Basic Auth)
    const auth = Buffer.from(serverKey + ':').toString('base64');

    const response = await fetch(`${baseUrl}/v2/charge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        payment_type: 'qris',
        transaction_details: {
          order_id: orderId,
          gross_amount: amount,
        },
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.log('Midtrans Error:', result);
      return NextResponse.json(result, { status: 500 });
    }

    // Return QRIS
    return NextResponse.json({
      qr_string: result.qris?.qr_string || result.actions?.[0]?.url,
      qr_url: result.actions?.[0]?.url,
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
