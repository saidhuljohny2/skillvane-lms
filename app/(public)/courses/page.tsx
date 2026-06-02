import { prisma } from '@/lib/prisma';
import { CoursesClient } from './_components/courses-client';

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  let courses: any[] = [];
  try {
    courses = await prisma.course.findMany({
      where: { isPublished: true },
      include: { topics: { orderBy: { sortOrder: 'asc' } } },
      orderBy: { sortOrder: 'asc' },
    });
  } catch (e: any) {
    console.error('Failed to fetch courses:', e);
  }
  return <CoursesClient courses={JSON.parse(JSON.stringify(courses ?? []))} />;
}
