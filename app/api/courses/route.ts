export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      where: { isPublished: true },
      include: { topics: { orderBy: { sortOrder: 'asc' } } },
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json(courses);
  } catch (error: any) {
    console.error('Fetch courses error:', error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await req.json();
    const slug = (body?.title ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const course = await prisma.course.create({
      data: {
        title: body?.title ?? '',
        slug,
        description: body?.description ?? '',
        longDescription: body?.longDescription ?? '',
        price: parseInt(body?.price ?? '0'),
        originalPrice: parseInt(body?.originalPrice ?? '0'),
        duration: body?.duration ?? '',
        courseType: body?.courseType ?? 'SELF_PACED',
        schedule: body?.schedule ?? '',
        features: body?.features ?? [],
        imageUrl: body?.imageUrl ?? '',
        isPublished: body?.isPublished ?? true,
        sortOrder: parseInt(body?.sortOrder ?? '0'),
      },
    });
    return NextResponse.json(course, { status: 201 });
  } catch (error: any) {
    console.error('Create course error:', error);
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
  }
}
