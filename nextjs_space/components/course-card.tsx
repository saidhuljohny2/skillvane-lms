'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, BookOpen, IndianRupee, Video, Laptop } from 'lucide-react';
import { HoverLift } from '@/components/ui/animate';

const typeLabels: Record<string, string> = {
  LIVE_BATCH: 'Live Batch',
  RECORDINGS: 'Recordings',
  SELF_PACED: 'Self-Paced',
  PROJECT: 'Project',
};

const typeIcons: Record<string, React.ReactNode> = {
  LIVE_BATCH: <Video className="w-3.5 h-3.5" />,
  RECORDINGS: <Laptop className="w-3.5 h-3.5" />,
  SELF_PACED: <BookOpen className="w-3.5 h-3.5" />,
  PROJECT: <BookOpen className="w-3.5 h-3.5" />,
};

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    slug: string;
    description: string;
    price: number;
    originalPrice: number | null;
    duration: string | null;
    courseType: string;
    imageUrl: string | null;
    features: string[];
    topics?: any[];
  };
}

export function CourseCard({ course }: CourseCardProps) {
  const topicCount = course?.topics?.length ?? 0;

  return (
    <HoverLift>
      <Link href={`/courses/${course?.slug ?? course?.id}`}>
        <Card className="overflow-hidden h-full border-0 shadow-md hover:shadow-xl transition-all duration-300 group">
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
                <GraduationCapIcon />
              </div>
            )}
            <div className="absolute top-3 left-3">
              <Badge variant="secondary" className="gap-1 bg-white/90 dark:bg-background/90 backdrop-blur-sm text-xs font-medium">
                {typeIcons[course?.courseType ?? 'SELF_PACED']}
                {typeLabels[course?.courseType ?? 'SELF_PACED'] ?? 'Course'}
              </Badge>
            </div>
          </div>
          <CardContent className="p-5 space-y-3">
            <h3 className="font-display font-semibold text-lg tracking-tight line-clamp-2 group-hover:text-primary transition-colors">
              {course?.title ?? 'Untitled Course'}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {course?.description ?? ''}
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {course?.duration && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {course.duration}
                </span>
              )}
              {topicCount > 0 && (
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" /> {topicCount} topics
                </span>
              )}
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-primary flex items-center">
                  <IndianRupee className="w-4 h-4" />{(course?.price ?? 0)?.toLocaleString?.('en-IN') ?? '0'}
                </span>
                {(course?.originalPrice ?? 0) > (course?.price ?? 0) && (
                  <span className="text-sm text-muted-foreground line-through flex items-center">
                    <IndianRupee className="w-3 h-3" />{(course?.originalPrice ?? 0)?.toLocaleString?.('en-IN') ?? '0'}
                  </span>
                )}
              </div>
              <Button size="sm" variant="outline" className="text-xs">
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      </Link>
    </HoverLift>
  );
}

function GraduationCapIcon() {
  return (
    <svg className="w-16 h-16 text-primary/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
    </svg>
  );
}
