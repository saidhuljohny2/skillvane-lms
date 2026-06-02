import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { CourseDetailClient } from './_components/course-detail-client';

export const dynamic = "force-dynamic";

export default async function CourseDetailPage({ params }: { params: { slug: string } }) {
  let course: any = null;
  try {
    course = await prisma.course.findFirst({
      where: { OR: [{ slug: params?.slug }, { id: params?.slug }] },
      include: { topics: { orderBy: { sortOrder: 'asc' } } },
    });
  } catch (e: any) {
    console.error('Failed to fetch course:', e);
  }
  if (!course) notFound();
  return <CourseDetailClient course={JSON.parse(JSON.stringify(course))} />;
}
