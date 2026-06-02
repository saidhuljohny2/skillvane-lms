'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FadeIn, Stagger, StaggerItem, HoverLift } from '@/components/ui/animate';
import { BookOpen, Video, GraduationCap, ArrowRight, Loader2 } from 'lucide-react';

const typeLabels: Record<string, string> = {
  LIVE_BATCH: 'Live Batch',
  RECORDINGS: 'Recordings',
  SELF_PACED: 'Self-Paced',
  PROJECT: 'Project',
};

export function DashboardClient() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
      return;
    }
    if (status === 'authenticated') {
      fetch('/api/enrollments')
        .then((res) => res.json())
        .then((data: any) => setEnrollments(data ?? []))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [status, router]);

  if (status === 'loading' || (status === 'unauthenticated')) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10">
      <FadeIn>
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Welcome back, {session?.user?.name?.split?.(' ')?.[0] ?? 'Student'}!
          </h1>
          <p className="text-muted-foreground mt-1">Access your enrolled courses and learning materials below.</p>
        </div>
      </FadeIn>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3]?.map?.((i: number) => (
            <div key={i} className="h-64 bg-muted animate-pulse rounded-xl" />
          )) ?? null}
        </div>
      ) : (enrollments?.length ?? 0) === 0 ? (
        <FadeIn>
          <div className="text-center py-20">
            <GraduationCap className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="font-display text-xl font-semibold mb-2">No Courses Yet</h2>
            <p className="text-muted-foreground mb-6">You have not enrolled in any courses. Browse our catalog to get started!</p>
            <Link href="/courses">
              <Button className="gap-2">
                <BookOpen className="w-4 h-4" /> Browse Courses
              </Button>
            </Link>
          </div>
        </FadeIn>
      ) : (
        <Stagger staggerDelay={0.1}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments?.map?.((enrollment: any) => {
              const course = enrollment?.course;
              const topicCount = course?.topics?.length ?? 0;
              return (
                <StaggerItem key={enrollment?.id}>
                  <HoverLift>
                    <Link href={`/dashboard/course/${course?.id}`}>
                      <Card className="overflow-hidden h-full border-0 shadow-md hover:shadow-xl transition-all group">
                        <div className="relative aspect-video bg-muted">
                          {course?.imageUrl ? (
                            <Image
                              src={course.imageUrl}
                              alt={course?.title ?? 'Course'}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              sizes="(max-width: 768px) 100vw, 33vw"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                              <BookOpen className="w-12 h-12 text-primary/30" />
                            </div>
                          )}
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-green-500 text-white">Enrolled</Badge>
                          </div>
                        </div>
                        <CardContent className="p-5 space-y-3">
                          <h3 className="font-display font-semibold text-lg tracking-tight line-clamp-2 group-hover:text-primary transition-colors">
                            {course?.title ?? 'Course'}
                          </h3>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Video className="w-3.5 h-3.5" /> {topicCount} topics
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {typeLabels[course?.courseType ?? ''] ?? 'Course'}
                            </Badge>
                          </div>
                          <Button variant="outline" size="sm" className="w-full gap-2 mt-2">
                            Continue Learning <ArrowRight className="w-3.5 h-3.5" />
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  </HoverLift>
                </StaggerItem>
              );
            }) ?? null}
          </div>
        </Stagger>
      )}
    </div>
  );
}
