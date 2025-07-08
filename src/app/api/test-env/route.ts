import { NextResponse } from 'next/server';

export async function GET() {
  console.log('=== Test Environment Variables ===');
  console.log('All env vars with PAYSTACK:', Object.keys(process.env).filter(key => key.includes('PAYSTACK')));
  console.log('PAYSTACK_SECRET_KEY value:', process.env.PAYSTACK_SECRET_KEY ? 'EXISTS' : 'MISSING');
  console.log('PAYSTACK_SECRET_KEY length:', process.env.PAYSTACK_SECRET_KEY?.length || 0);
  
  return NextResponse.json({
    message: 'Environment test',
    hasPaystackKey: !!process.env.PAYSTACK_SECRET_KEY,
    keyLength: process.env.PAYSTACK_SECRET_KEY?.length || 0,
    keyStartsWithSk: process.env.PAYSTACK_SECRET_KEY?.startsWith('sk_') || false,
    allEnvVars: Object.keys(process.env).filter(key => key.includes('PAYSTACK'))
  });
} 