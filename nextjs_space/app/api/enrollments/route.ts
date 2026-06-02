export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: (session.user as any).id },
      include: {
        course: {
          include: { topics: { orderBy: { sortOrder: 'asc' } } },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });
    return NextResponse.json(enrollments);
  } catch (error: any) {
    console.error('Fetch enrollments error:', error);
    return NextResponse.json({ error: 'Failed to fetch enrollments' }, { status: 500 });
  }
}
