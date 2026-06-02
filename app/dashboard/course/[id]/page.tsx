import { CourseAccessClient } from './_components/course-access-client';

export const dynamic = "force-dynamic";

export default function CourseAccessPage({ params }: { params: { id: string } }) {
  return <CourseAccessClient courseId={params?.id ?? ''} />;
}
