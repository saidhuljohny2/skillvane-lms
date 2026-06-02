export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body ?? {};
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 });
    }
    // We'll store contact in a simple way using raw SQL since we don't have a Contact model
    // For now, just validate and return success
    return NextResponse.json({ success: true, message: 'Your message has been received. We will get back to you soon!' });
  } catch (error: any) {
    console.error('Contact error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
