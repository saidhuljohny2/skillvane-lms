'use client';

import { CourseCard } from '@/components/course-card';
import { FadeIn, Stagger, StaggerItem } from '@/components/ui/animate';
import { BookOpen } from 'lucide-react';

export function CoursesClient({ courses }: { courses: any[] }) {
  const safeCourses = courses ?? [];
  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
      <FadeIn>
        <div className="mb-10">
          <h1 className="font-display text-3xl font-bold tracking-tight">All Courses</h1>
          <p className="text-muted-foreground mt-2">Browse our complete collection of GCP Data Engineering courses and projects.</p>
        </div>
      </FadeIn>
      <Stagger staggerDelay={0.1}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeCourses?.map?.((course: any) => (
            <StaggerItem key={course?.id}>
              <CourseCard course={course} />
            </StaggerItem>
          )) ?? null}
        </div>
      </Stagger>
      {safeCourses?.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>No courses available yet.</p>
        </div>
      )}
    </div>
  );
}
