export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const course = await prisma.course.findFirst({
      where: { OR: [{ id: params?.id }, { slug: params?.id }] },
      include: { topics: { orderBy: { sortOrder: 'asc' } } },
    });
    if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    return NextResponse.json(course);
  } catch (error: any) {
    console.error('Fetch course error:', error);
    return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await req.json();
    const data: any = {};
    if (body?.title !== undefined) {
      data.title = body.title;
      data.slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    if (body?.description !== undefined) data.description = body.description;
    if (body?.longDescription !== undefined) data.longDescription = body.longDescription;
    if (body?.price !== undefined) data.price = parseInt(body.price);
    if (body?.originalPrice !== undefined) data.originalPrice = parseInt(body.originalPrice);
    if (body?.duration !== undefined) data.duration = body.duration;
    if (body?.courseType !== undefined) data.courseType = body.courseType;
    if (body?.schedule !== undefined) data.schedule = body.schedule;
    if (body?.features !== undefined) data.features = body.features;
    if (body?.imageUrl !== undefined) data.imageUrl = body.imageUrl;
    if (body?.isPublished !== undefined) data.isPublished = body.isPublished;
    if (body?.sortOrder !== undefined) data.sortOrder = parseInt(body.sortOrder);
    const course = await prisma.course.update({ where: { id: params?.id }, data });
    return NextResponse.json(course);
  } catch (error: any) {
    console.error('Update course error:', error);
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await prisma.course.delete({ where: { id: params?.id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete course error:', error);
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
  }
}
