'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { RazorpayButton } from '@/components/razorpay-button';
import { FadeIn, SlideIn } from '@/components/ui/animate';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Clock, BookOpen, IndianRupee, Video, CheckCircle, Laptop, FileText } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const typeLabels: Record<string, string> = {
  LIVE_BATCH: 'Live Batch',
  RECORDINGS: 'Recordings',
  SELF_PACED: 'Self-Paced',
  PROJECT: 'Project',
};

export function CourseDetailClient({ course }: { course: any }) {
  const { data: session } = useSession() || {};
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!session?.user) {
      setChecking(false);
      return;
    }
    fetch('/api/enrollments')
      .then((res) => res.json())
      .then((data: any) => {
        const enrolled = (data ?? [])?.some?.((e: any) => e?.courseId === course?.id);
        setIsEnrolled(!!enrolled);
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, [session, course?.id]);

  const topics = course?.topics ?? [];
  const features = course?.features ?? [];

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <SlideIn from="left">
            <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg bg-muted">
              {course?.imageUrl ? (
                <Image
                  src={course.imageUrl}
                  alt={course?.title ?? 'Course'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 66vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                  <BookOpen className="w-20 h-20 text-primary/30" />
                </div>
              )}
            </div>
          </SlideIn>

          <FadeIn>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="gap-1">
                  {typeLabels[course?.courseType ?? ''] ?? 'Course'}
                </Badge>
                {course?.duration && (
                  <Badge variant="outline" className="gap-1">
                    <Clock className="w-3 h-3" /> {course.duration}
                  </Badge>
                )}
                <Badge variant="outline" className="gap-1">
                  <BookOpen className="w-3 h-3" /> {topics?.length ?? 0} topics
                </Badge>
              </div>
              <h1 className="font-display text-3xl font-bold tracking-tight">{course?.title ?? 'Course'}</h1>
              <p className="text-muted-foreground leading-relaxed">{course?.description ?? ''}</p>
              {course?.longDescription && (
                <p className="text-muted-foreground leading-relaxed">{course.longDescription}</p>
              )}
            </div>
          </FadeIn>

          {/* Features */}
          {features?.length > 0 && (
            <FadeIn delay={0.1}>
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-display text-xl font-semibold mb-4">What You Get</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {features?.map?.((f: string, i: number) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{f}</span>
                      </div>
                    )) ?? null}
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          )}

          {/* Curriculum */}
          {topics?.length > 0 && (
            <FadeIn delay={0.2}>
              <div>
                <h2 className="font-display text-xl font-semibold mb-4">Course Curriculum</h2>
                <Accordion type="single" collapsible className="space-y-2">
                  {topics?.map?.((topic: any, i: number) => (
                    <AccordionItem key={topic?.id ?? i} value={topic?.id ?? String(i)} className="border rounded-lg px-4">
                      <AccordionTrigger className="text-sm font-medium hover:no-underline">
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-mono text-primary flex-shrink-0">
                            {i + 1}
                          </span>
                          {topic?.title ?? 'Topic'}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-4">
                        <p className="text-sm text-muted-foreground mb-2">{topic?.description ?? 'Content will be available after enrollment.'}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {topic?.videoUrl && (
                            <span className="flex items-center gap-1">
                              <Video className="w-3 h-3" /> Video available
                            </span>
                          )}
                          {topic?.notesUrl && (
                            <span className="flex items-center gap-1">
                              <FileText className="w-3 h-3" /> Notes available
                            </span>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )) ?? null}
                </Accordion>
              </div>
            </FadeIn>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <SlideIn from="right">
            <Card className="sticky top-24 shadow-lg">
              <CardContent className="p-6 space-y-5">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold flex items-center">
                    <IndianRupee className="w-6 h-6" />{(course?.price ?? 0)?.toLocaleString?.('en-IN') ?? '0'}
                  </span>
                  {(course?.originalPrice ?? 0) > (course?.price ?? 0) && (
                    <span className="text-lg text-muted-foreground line-through flex items-center">
                      <IndianRupee className="w-4 h-4" />{(course?.originalPrice ?? 0)?.toLocaleString?.('en-IN') ?? '0'}
                    </span>
                  )}
                </div>

                {course?.schedule && (
                  <div className="p-3 bg-muted/50 rounded-lg text-sm">
                    <div className="flex items-center gap-2 font-medium mb-1">
                      <Laptop className="w-4 h-4 text-primary" /> Schedule
                    </div>
                    <p className="text-muted-foreground">{course.schedule}</p>
                  </div>
                )}

                {checking ? (
                  <div className="w-full h-12 bg-muted animate-pulse rounded-lg" />
                ) : isEnrolled ? (
                  <Link href={`/dashboard/course/${course?.id}`}>
                    <Button className="w-full gap-2" size="lg" variant="outline">
                      <Video className="w-4 h-4" /> Go to Course
                    </Button>
                  </Link>
                ) : (
                  <RazorpayButton
                    courseId={course?.id ?? ''}
                    courseName={course?.title ?? ''}
                    price={course?.price ?? 0}
                  />
                )}

                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Instant access after payment</p>
                  <p className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Lifetime recording access</p>
                  <p className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Topic-wise video content</p>
                </div>
              </CardContent>
            </Card>
          </SlideIn>
        </div>
      </div>
    </div>
  );
}
