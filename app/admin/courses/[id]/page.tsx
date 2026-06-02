import { AdminCourseTopicsClient } from './_components/admin-course-topics-client';

export const dynamic = "force-dynamic";

export default function AdminCourseTopicsPage({ params }: { params: { id: string } }) {
  return <AdminCourseTopicsClient courseId={params?.id ?? ''} />;
}
