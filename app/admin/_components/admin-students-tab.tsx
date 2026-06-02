'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Loader2 } from 'lucide-react';

export function AdminStudentsTab() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/students')
      .then((r) => r.json())
      .then((d: any) => setStudents(d ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <Card className="shadow-sm">
      <CardContent className="p-0">
        {(students?.length ?? 0) === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No students registered yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Enrolled Courses</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students?.map?.((s: any) => (
                  <TableRow key={s?.id}>
                    <TableCell className="font-medium">{s?.name ?? 'N/A'}</TableCell>
                    <TableCell className="text-sm">{s?.email ?? 'N/A'}</TableCell>
                    <TableCell className="text-sm">{s?.phone || '-'}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {(s?.enrollments ?? [])?.map?.((e: any) => (
                          <Badge key={e?.id} variant="secondary" className="text-xs">
                            {e?.course?.title ?? 'Course'}
                          </Badge>
                        )) ?? <span className="text-xs text-muted-foreground">None</span>}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {s?.createdAt ? new Date(s.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                    </TableCell>
                  </TableRow>
                )) ?? null}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
