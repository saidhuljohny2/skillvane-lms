import { prisma } from '@/lib/prisma';
import { HomeClient } from './_components/home-client';

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let courses: any[] = [];
  try {
    courses = await prisma.course.findMany({
      where: { isPublished: true },
      include: { topics: { orderBy: { sortOrder: 'asc' } }, _count: { select: { enrollments: true } } },
      orderBy: { sortOrder: 'asc' },
    });
  } catch (e: any) {
    console.error('Failed to fetch courses:', e);
  }
  return <HomeClient courses={JSON.parse(JSON.stringify(courses ?? []))} />;
}
