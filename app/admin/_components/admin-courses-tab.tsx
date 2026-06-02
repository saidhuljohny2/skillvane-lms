'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, BookOpen, Users, Loader2, IndianRupee } from 'lucide-react';
import { toast } from 'sonner';

const courseTypes = [
  { value: 'LIVE_BATCH', label: 'Live Batch' },
  { value: 'RECORDINGS', label: 'Recordings' },
  { value: 'SELF_PACED', label: 'Self-Paced' },
  { value: 'PROJECT', label: 'Project' },
];

export function AdminCoursesTab() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', longDescription: '', price: '', originalPrice: '',
    duration: '', courseType: 'SELF_PACED', schedule: '', features: '', imageUrl: '', sortOrder: '0',
  });

  const fetchCourses = () => {
    setLoading(true);
    fetch('/api/admin/courses')
      .then((r) => r.json())
      .then((d: any) => setCourses(d ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCourses(); }, []);

  const resetForm = () => {
    setForm({ title: '', description: '', longDescription: '', price: '', originalPrice: '', duration: '', courseType: 'SELF_PACED', schedule: '', features: '', imageUrl: '', sortOrder: '0' });
    setEditingCourse(null);
  };

  const openEdit = (course: any) => {
    setEditingCourse(course);
    setForm({
      title: course?.title ?? '',
      description: course?.description ?? '',
      longDescription: course?.longDescription ?? '',
      price: String(course?.price ?? ''),
      originalPrice: String(course?.originalPrice ?? ''),
      duration: course?.duration ?? '',
      courseType: course?.courseType ?? 'SELF_PACED',
      schedule: course?.schedule ?? '',
      features: (course?.features ?? [])?.join?.('\n') ?? '',
      imageUrl: course?.imageUrl ?? '',
      sortOrder: String(course?.sortOrder ?? '0'),
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form?.title || !form?.price) {
      toast.error('Title and price are required');
      return;
    }
    setSaving(true);
    try {
      const body = {
        ...form,
        features: (form?.features ?? '')?.split?.('\n')?.filter?.((f: string) => f?.trim?.()) ?? [],
      };
      const url = editingCourse ? `/api/courses/${editingCourse?.id}` : '/api/courses';
      const method = editingCourse ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        toast.success(editingCourse ? 'Course updated!' : 'Course created!');
        setShowForm(false);
        resetForm();
        fetchCourses();
      } else {
        const data = await res.json();
        toast.error(data?.error ?? 'Failed');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/courses/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Course deleted');
        fetchCourses();
      } else {
        toast.error('Failed to delete');
      }
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Manage Courses</h2>
        <Dialog open={showForm} onOpenChange={(open: boolean) => { setShowForm(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2"><Plus className="w-4 h-4" /> Add Course</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCourse ? 'Edit Course' : 'Add New Course'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Title *</Label>
                <Input value={form?.title ?? ''} onChange={(e: any) => setForm({ ...(form ?? {}), title: e?.target?.value ?? '' })} placeholder="Course title" />
              </div>
              <div>
                <Label>Short Description *</Label>
                <Textarea value={form?.description ?? ''} onChange={(e: any) => setForm({ ...(form ?? {}), description: e?.target?.value ?? '' })} placeholder="Brief description" rows={2} />
              </div>
              <div>
                <Label>Long Description</Label>
                <Textarea value={form?.longDescription ?? ''} onChange={(e: any) => setForm({ ...(form ?? {}), longDescription: e?.target?.value ?? '' })} placeholder="Detailed description" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Price (₹) *</Label>
                  <Input type="number" value={form?.price ?? ''} onChange={(e: any) => setForm({ ...(form ?? {}), price: e?.target?.value ?? '' })} placeholder="6000" />
                </div>
                <div>
                  <Label>Original Price (₹)</Label>
                  <Input type="number" value={form?.originalPrice ?? ''} onChange={(e: any) => setForm({ ...(form ?? {}), originalPrice: e?.target?.value ?? '' })} placeholder="Show strikethrough" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Duration</Label>
                  <Input value={form?.duration ?? ''} onChange={(e: any) => setForm({ ...(form ?? {}), duration: e?.target?.value ?? '' })} placeholder="e.g. 3 months" />
                </div>
                <div>
                  <Label>Course Type</Label>
                  <Select value={form?.courseType ?? 'SELF_PACED'} onValueChange={(val: string) => setForm({ ...(form ?? {}), courseType: val })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {courseTypes?.map?.((t: any) => (
                        <SelectItem key={t?.value} value={t?.value ?? ''}>{t?.label ?? ''}</SelectItem>
                      )) ?? null}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Schedule</Label>
                <Input value={form?.schedule ?? ''} onChange={(e: any) => setForm({ ...(form ?? {}), schedule: e?.target?.value ?? '' })} placeholder="e.g. Mon-Fri, 7:30 AM - 8:30 AM" />
              </div>
              <div>
                <Label>Features (one per line)</Label>
                <Textarea value={form?.features ?? ''} onChange={(e: any) => setForm({ ...(form ?? {}), features: e?.target?.value ?? '' })} placeholder="Daily Recordings\nNotes Provided\nResume Help" rows={4} />
              </div>
              <div>
                <Label>Image URL</Label>
                <Input value={form?.imageUrl ?? ''} onChange={(e: any) => setForm({ ...(form ?? {}), imageUrl: e?.target?.value ?? '' })} placeholder="https://cwe.mitre.org/data/images/CWE-601-Diagram.png" />
              </div>
              <div>
                <Label>Sort Order</Label>
                <Input type="number" value={form?.sortOrder ?? '0'} onChange={(e: any) => setForm({ ...(form ?? {}), sortOrder: e?.target?.value ?? '0' })} />
              </div>
              <Button onClick={handleSave} disabled={saving} className="w-full gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingCourse ? 'Update Course' : 'Create Course'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3]?.map?.((i: number) => <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />) ?? null}
        </div>
      ) : (
        <div className="space-y-3">
          {(courses ?? [])?.map?.((course: any) => (
            <Card key={course?.id} className="shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-sm truncate">{course?.title ?? 'Course'}</h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3" />{(course?.price ?? 0)?.toLocaleString?.('en-IN') ?? '0'}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{course?._count?.enrollments ?? 0} enrolled</span>
                      <Badge variant="outline" className="text-xs">{course?.courseType ?? 'N/A'}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link href={`/admin/courses/${course?.id}`}>
                    <Button variant="outline" size="sm" className="gap-1 text-xs">
                      <BookOpen className="w-3 h-3" /> Topics
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" className="gap-1 text-xs" onClick={() => openEdit(course)}>
                    <Edit className="w-3 h-3" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1 text-xs text-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={() => handleDelete(course?.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )) ?? null}
          {(courses?.length ?? 0) === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No courses yet. Click "Add Course" to create one.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
