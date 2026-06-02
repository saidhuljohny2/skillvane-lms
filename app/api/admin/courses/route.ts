export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const courses = await prisma.course.findMany({
      include: {
        topics: { orderBy: { sortOrder: 'asc' } },
        _count: { select: { enrollments: true } },
      },
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json(courses);
  } catch (error: any) {
    console.error('Admin fetch courses error:', error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}
