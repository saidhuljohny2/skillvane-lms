'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Plus, Edit, Trash2, Video, FileText, Loader2, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
import { FadeIn } from '@/components/ui/animate';

export function AdminCourseTopicsClient({ courseId }: { courseId: string }) {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTopic, setEditingTopic] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', videoUrl: '', notesUrl: '', sortOrder: '0', isPreview: false,
  });

  useEffect(() => {
    if (status === 'unauthenticated') { router.replace('/login'); return; }
    if (status === 'authenticated') {
      if ((session?.user as any)?.role !== 'ADMIN') { router.replace('/dashboard'); return; }
      fetchCourse();
    }
  }, [status, session, router, courseId]);

  const fetchCourse = () => {
    setLoading(true);
    fetch(`/api/courses/${courseId}`)
      .then((r) => r.json())
      .then((d: any) => setCourse(d))
      .catch(() => toast.error('Failed to load course'))
      .finally(() => setLoading(false));
  };

  const resetForm = () => {
    setForm({ title: '', description: '', videoUrl: '', notesUrl: '', sortOrder: '0', isPreview: false });
    setEditingTopic(null);
  };

  const openEdit = (topic: any) => {
    setEditingTopic(topic);
    setForm({
      title: topic?.title ?? '',
      description: topic?.description ?? '',
      videoUrl: topic?.videoUrl ?? '',
      notesUrl: topic?.notesUrl ?? '',
      sortOrder: String(topic?.sortOrder ?? '0'),
      isPreview: topic?.isPreview ?? false,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form?.title) { toast.error('Title is required'); return; }
    setSaving(true);
    try {
      const url = editingTopic ? `/api/topics/${editingTopic?.id}` : `/api/courses/${courseId}/topics`;
      const method = editingTopic ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success(editingTopic ? 'Topic updated!' : 'Topic created!');
        setShowForm(false);
        resetForm();
        fetchCourse();
      } else {
        const data = await res.json();
        toast.error(data?.error ?? 'Failed');
      }
    } catch { toast.error('Something went wrong'); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this topic?')) return;
    try {
      const res = await fetch(`/api/topics/${id}`, { method: 'DELETE' });
      if (res.ok) { toast.success('Topic deleted'); fetchCourse(); } else { toast.error('Failed'); }
    } catch { toast.error('Failed'); }
  };

  if (status === 'loading' || loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  const topics = course?.topics ?? [];

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
      <FadeIn>
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="gap-1"><ArrowLeft className="w-4 h-4" /> Back</Button>
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-2xl font-bold tracking-tight">{course?.title ?? 'Course'}</h1>
            <p className="text-sm text-muted-foreground">Manage topics and video links for this course</p>
          </div>
          <Dialog open={showForm} onOpenChange={(open: boolean) => { setShowForm(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2"><Plus className="w-4 h-4" /> Add Topic</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingTopic ? 'Edit Topic' : 'Add New Topic'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label>Title *</Label>
                  <Input value={form?.title ?? ''} onChange={(e: any) => setForm({ ...(form ?? {}), title: e?.target?.value ?? '' })} placeholder="Topic title" />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={form?.description ?? ''} onChange={(e: any) => setForm({ ...(form ?? {}), description: e?.target?.value ?? '' })} placeholder="Topic description" rows={3} />
                </div>
                <div>
                  <Label>Video URL (Google Drive link)</Label>
                  <Input value={form?.videoUrl ?? ''} onChange={(e: any) => setForm({ ...(form ?? {}), videoUrl: e?.target?.value ?? '' })} placeholder="https://drive.google.com/file/d/..." />
                  <p className="text-xs text-muted-foreground mt-1">Paste the Google Drive sharing link for the video recording</p>
                </div>
                <div>
                  <Label>Notes URL (optional)</Label>
                  <Input value={form?.notesUrl ?? ''} onChange={(e: any) => setForm({ ...(form ?? {}), notesUrl: e?.target?.value ?? '' })} placeholder="https://drive.google.com/file/d/..." />
                </div>
                <div>
                  <Label>Sort Order</Label>
                  <Input type="number" value={form?.sortOrder ?? '0'} onChange={(e: any) => setForm({ ...(form ?? {}), sortOrder: e?.target?.value ?? '0' })} />
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={form?.isPreview ?? false} onCheckedChange={(val: boolean) => setForm({ ...(form ?? {}), isPreview: val })} />
                  <Label>Preview topic (visible to non-enrolled students)</Label>
                </div>
                <Button onClick={handleSave} disabled={saving} className="w-full gap-2">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingTopic ? 'Update Topic' : 'Create Topic'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </FadeIn>

      {topics?.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Video className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>No topics yet. Click "Add Topic" to create the first one.</p>
          <p className="text-xs mt-2">Add topics with Google Drive video links for enrolled students to access.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {topics?.map?.((topic: any, i: number) => (
            <Card key={topic?.id ?? i} className="shadow-sm">
              <CardContent className="p-4 flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-mono text-primary flex-shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm">{topic?.title ?? 'Topic'}</h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    {topic?.videoUrl ? (
                      <span className="flex items-center gap-1 text-green-600"><Video className="w-3 h-3" /> Video linked</span>
                    ) : (
                      <span className="flex items-center gap-1 text-orange-500"><Video className="w-3 h-3" /> No video</span>
                    )}
                    {topic?.notesUrl && (
                      <span className="flex items-center gap-1 text-blue-600"><FileText className="w-3 h-3" /> Notes</span>
                    )}
                    {topic?.isPreview && <span className="text-purple-600">Preview</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button variant="outline" size="sm" className="gap-1 text-xs" onClick={() => openEdit(topic)}>
                    <Edit className="w-3 h-3" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1 text-xs text-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={() => handleDelete(topic?.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )) ?? null}
        </div>
      )}

      {/* Instructions Card */}
      <Card className="mt-8 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6 space-y-3">
          <h3 className="font-display font-semibold text-blue-800 dark:text-blue-300">How to Add Video Content</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700 dark:text-blue-400">
            <li>Upload your video recording to Google Drive</li>
            <li>Right-click the file → Share → Set to "Anyone with the link"</li>
            <li>Copy the sharing link</li>
            <li>Click "Edit" on the topic and paste the link in the "Video URL" field</li>
            <li>Students will see a "Watch Recording" button that opens the video in Drive</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
