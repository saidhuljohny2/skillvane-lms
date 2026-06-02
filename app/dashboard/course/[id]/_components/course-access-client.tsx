'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FadeIn, SlideIn } from '@/components/ui/animate';
import { Video, FileText, ExternalLink, BookOpen, ArrowLeft, Loader2, Lock, Play } from 'lucide-react';
import { toast } from 'sonner';

export function CourseAccessClient({ courseId }: { courseId: string }) {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
      return;
    }
    if (status === 'authenticated' && courseId) {
      Promise.all([
        fetch(`/api/courses/${courseId}`).then((r) => r.json()),
        fetch('/api/enrollments').then((r) => r.json()),
      ])
        .then(([courseData, enrollmentData]: any[]) => {
          setCourse(courseData);
          const enrolled = (enrollmentData ?? [])?.some?.((e: any) => e?.courseId === courseId);
          setIsEnrolled(!!enrolled);
          if (!enrolled) {
            toast.error('You are not enrolled in this course');
          }
          // Auto-select first topic
          if (courseData?.topics?.[0]) {
            setActiveTopic(courseData.topics[0].id);
          }
        })
        .catch(() => toast.error('Failed to load course'))
        .finally(() => setLoading(false));
    }
  }, [status, courseId, router]);

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isEnrolled) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-20 text-center">
        <Lock className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
        <h2 className="font-display text-xl font-semibold mb-2">Access Denied</h2>
        <p className="text-muted-foreground mb-6">You need to enroll in this course to access the content.</p>
        <Link href={`/courses/${course?.slug ?? courseId}`}>
          <Button>View Course Details</Button>
        </Link>
      </div>
    );
  }

  const topics = course?.topics ?? [];
  const currentTopic = topics?.find?.((t: any) => t?.id === activeTopic) ?? topics?.[0];

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
      <FadeIn>
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">{course?.title ?? 'Course'}</h1>
            <p className="text-sm text-muted-foreground">{topics?.length ?? 0} topics</p>
          </div>
        </div>
      </FadeIn>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Topic List - Sidebar */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <SlideIn from="left">
            <Card className="shadow-md">
              <CardContent className="p-4">
                <h3 className="font-display font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wider">Course Topics</h3>
                <div className="space-y-1">
                  {topics?.map?.((topic: any, i: number) => (
                    <button
                      key={topic?.id ?? i}
                      onClick={() => setActiveTopic(topic?.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all text-sm flex items-start gap-3 ${
                        activeTopic === topic?.id
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'hover:bg-muted text-foreground'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 font-mono ${
                        activeTopic === topic?.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                        {i + 1}
                      </span>
                      <span className="line-clamp-2">{topic?.title ?? 'Topic'}</span>
                    </button>
                  )) ?? null}
                </div>
              </CardContent>
            </Card>
          </SlideIn>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2 order-1 lg:order-2">
          <SlideIn from="right">
            {currentTopic ? (
              <Card className="shadow-md">
                <CardContent className="p-6 space-y-5">
                  <div>
                    <Badge variant="secondary" className="mb-3">Topic {(topics?.findIndex?.((t: any) => t?.id === currentTopic?.id) ?? 0) + 1}</Badge>
                    <h2 className="font-display text-xl font-semibold">{currentTopic?.title ?? 'Topic'}</h2>
                    {currentTopic?.description && (
                      <p className="text-muted-foreground mt-2">{currentTopic.description}</p>
                    )}
                  </div>

                  {/* Video Link */}
                  {currentTopic?.videoUrl ? (
                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm flex items-center gap-2">
                        <Video className="w-4 h-4 text-primary" /> Video Recording
                      </h3>
                      <a
                        href={currentTopic.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors flex items-center justify-between group">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                              <Play className="w-5 h-5 text-red-500" />
                            </div>
                            <div>
                              <p className="font-medium text-sm group-hover:text-primary transition-colors">Watch Recording</p>
                              <p className="text-xs text-muted-foreground">Opens in Google Drive</p>
                            </div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </a>
                    </div>
                  ) : (
                    <div className="border rounded-lg p-4 bg-muted/30 text-center">
                      <Video className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Video will be available soon</p>
                    </div>
                  )}

                  {/* Notes Link */}
                  {currentTopic?.notesUrl && (
                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" /> Course Notes
                      </h3>
                      <a
                        href={currentTopic.notesUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors flex items-center justify-between group">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                              <FileText className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                              <p className="font-medium text-sm group-hover:text-primary transition-colors">View Notes</p>
                              <p className="text-xs text-muted-foreground">Download or view online</p>
                            </div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-md">
                <CardContent className="p-6 text-center py-16">
                  <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">No topics available yet. Check back soon!</p>
                </CardContent>
              </Card>
            )}
          </SlideIn>
        </div>
      </div>
    </div>
  );
}
