import { NextResponse } from 'next/server';

export async function GET() {
  console.log('=== API Route Debug ===');
  console.log('Environment variables available:', Object.keys(process.env).filter(key => key.includes('PAYSTACK')));
  
  const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || 'sk_test_90645acfe4d8579ad63d21b3ed9b604540094da8';
  console.log('PAYSTACK_SECRET_KEY exists:', !!PAYSTACK_SECRET_KEY);
  console.log('PAYSTACK_SECRET_KEY length:', PAYSTACK_SECRET_KEY?.length || 0);
  console.log('PAYSTACK_SECRET_KEY starts with sk_:', PAYSTACK_SECRET_KEY?.startsWith('sk_') || false);
  
  if (!PAYSTACK_SECRET_KEY) {
    return NextResponse.json(
      { 
        error: 'Paystack secret key not set',
        message: 'Please create a .env.local file in your project root and add: PAYSTACK_SECRET_KEY=your_secret_key_here'
      },
      { status: 500 }
    );
  }

  try {
    const response = await fetch('https://api.paystack.co/transaction', {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Paystack API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions from Paystack' },
      { status: 500 }
    );
  }
} 