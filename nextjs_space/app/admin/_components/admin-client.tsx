'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FadeIn } from '@/components/ui/animate';
import { BookOpen, Users, CreditCard, BarChart3, Loader2, Shield } from 'lucide-react';
import { AdminCoursesTab } from './admin-courses-tab';
import { AdminStudentsTab } from './admin-students-tab';
import { AdminTransactionsTab } from './admin-transactions-tab';

export function AdminClient() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
      return;
    }
    if (status === 'authenticated') {
      if ((session?.user as any)?.role !== 'ADMIN') {
        router.replace('/dashboard');
        return;
      }
      fetch('/api/admin/stats')
        .then((r) => r.json())
        .then((d: any) => setStats(d))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [status, session, router]);

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if ((session?.user as any)?.role !== 'ADMIN') return null;

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
      <FadeIn>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage courses, students, and transactions</p>
          </div>
        </div>
      </FadeIn>

      {/* Stats */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono">{stats?.totalStudents ?? 0}</p>
                <p className="text-xs text-muted-foreground">Students</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono">{stats?.totalCourses ?? 0}</p>
                <p className="text-xs text-muted-foreground">Courses</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono">{stats?.totalEnrollments ?? 0}</p>
                <p className="text-xs text-muted-foreground">Enrollments</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono">₹{((stats?.totalRevenue ?? 0) as number)?.toLocaleString?.('en-IN') ?? '0'}</p>
                <p className="text-xs text-muted-foreground">Revenue</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </FadeIn>

      <FadeIn delay={0.2}>
        <Tabs defaultValue="courses" className="space-y-4">
          <TabsList>
            <TabsTrigger value="courses" className="gap-2"><BookOpen className="w-4 h-4" /> Courses</TabsTrigger>
            <TabsTrigger value="students" className="gap-2"><Users className="w-4 h-4" /> Students</TabsTrigger>
            <TabsTrigger value="transactions" className="gap-2"><CreditCard className="w-4 h-4" /> Transactions</TabsTrigger>
          </TabsList>
          <TabsContent value="courses"><AdminCoursesTab /></TabsContent>
          <TabsContent value="students"><AdminStudentsTab /></TabsContent>
          <TabsContent value="transactions"><AdminTransactionsTab /></TabsContent>
        </Tabs>
      </FadeIn>
    </div>
  );
}
