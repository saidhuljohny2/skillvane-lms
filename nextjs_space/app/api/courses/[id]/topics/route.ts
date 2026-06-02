export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await req.json();
    const topic = await prisma.courseTopic.create({
      data: {
        courseId: params?.id,
        title: body?.title ?? '',
        description: body?.description ?? '',
        videoUrl: body?.videoUrl ?? '',
        notesUrl: body?.notesUrl ?? '',
        sortOrder: parseInt(body?.sortOrder ?? '0'),
        isPreview: body?.isPreview ?? false,
      },
    });
    return NextResponse.json(topic, { status: 201 });
  } catch (error: any) {
    console.error('Create topic error:', error);
    return NextResponse.json({ error: 'Failed to create topic' }, { status: 500 });
  }
}
