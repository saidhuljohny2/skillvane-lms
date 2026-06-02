'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CourseCard } from '@/components/course-card';
import { FadeIn, SlideIn, Stagger, StaggerItem } from '@/components/ui/animate';
import { Cloud, Database, Code, Award, BookOpen, ArrowRight } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1500;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref} className="font-mono text-3xl font-bold text-primary">{count?.toLocaleString?.('en-IN') ?? '0'}{suffix}</span>;
}

export function HomeClient({ courses }: { courses: any[] }) {
  const safeCourses = courses ?? [];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 py-16 sm:py-24">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <SlideIn from="left">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <Cloud className="w-4 h-4" />
                  GCP Data Engineering Academy
                </div>
                <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
                  Master <span className="text-primary">GCP Data Engineering</span> with Industry Experts
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  SkillVane IT Academy offers comprehensive GCP Data Engineering courses with live sessions, 
                  hands-on projects, and placement assistance. Start your cloud career today.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/courses">
                    <Button size="lg" className="gap-2">
                      <BookOpen className="w-4 h-4" /> Explore Courses
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button size="lg" variant="outline" className="gap-2">
                      Get Started <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </SlideIn>
            <SlideIn from="right">
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-xl bg-muted">
                <Image
                  src="https://cdn.abacus.ai/images/cfcceaf5-b26d-4e14-b82b-e09d2a634b19.png"
                  alt="SkillVane IT Academy - GCP Data Engineering Training"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </SlideIn>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <AnimatedCounter target={500} suffix="+" />
                <p className="text-sm text-muted-foreground mt-1">Students Trained</p>
              </div>
              <div>
                <AnimatedCounter target={safeCourses?.length || 5} suffix="" />
                <p className="text-sm text-muted-foreground mt-1">Expert Courses</p>
              </div>
              <div>
                <AnimatedCounter target={95} suffix="%" />
                <p className="text-sm text-muted-foreground mt-1">Satisfaction Rate</p>
              </div>
              <div>
                <AnimatedCounter target={3} suffix="" />
                <p className="text-sm text-muted-foreground mt-1">Months to Job-Ready</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Courses */}
      <section className="py-16 sm:py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl font-bold tracking-tight">Our Courses</h2>
              <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
                From beginner to advanced, our GCP Data Engineering courses cover everything you need.
              </p>
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
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>Courses coming soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl font-bold tracking-tight">Why Choose SkillVane?</h2>
            </div>
          </FadeIn>
          <Stagger staggerDelay={0.1}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: <Cloud className="w-6 h-6" />, title: 'Live Sessions', desc: 'Daily live interactive classes with industry experts' },
                { icon: <Database className="w-6 h-6" />, title: 'Real Projects', desc: 'Hands-on projects using real-world GCP data pipelines' },
                { icon: <Code className="w-6 h-6" />, title: 'Recordings Access', desc: 'Lifetime access to all session recordings and notes' },
                { icon: <Award className="w-6 h-6" />, title: 'Resume Help', desc: 'Professional resume assistance and placement guidance' },
              ]?.map?.((f: any, i: number) => (
                <StaggerItem key={i}>
                  <div className="bg-background rounded-xl p-6 shadow-md hover:shadow-lg transition-all text-center space-y-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mx-auto">
                      {f?.icon}
                    </div>
                    <h3 className="font-display font-semibold">{f?.title ?? ''}</h3>
                    <p className="text-sm text-muted-foreground">{f?.desc ?? ''}</p>
                  </div>
                </StaggerItem>
              )) ?? null}
            </div>
          </Stagger>
        </div>
      </section>
    </div>
  );
}
