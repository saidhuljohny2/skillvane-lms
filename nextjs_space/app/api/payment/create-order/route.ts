export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { razorpay } from '@/lib/razorpay';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Please login to purchase' }, { status: 401 });
    }
    const { courseId } = await req.json();
    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }
    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: (session.user as any).id, courseId } },
    });
    if (existingEnrollment) {
      return NextResponse.json({ error: 'You are already enrolled in this course' }, { status: 400 });
    }
    const order = await razorpay.orders.create({
      amount: course.price * 100,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        courseId: course.id,
        userId: (session.user as any).id,
        courseName: course.title,
      },
    });
    await prisma.payment.create({
      data: {
        userId: (session.user as any).id,
        courseId: course.id,
        amount: course.price,
        razorpayOrderId: order.id,
        status: 'PENDING',
      },
    });
    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      courseName: course.title,
    });
  } catch (error: any) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
