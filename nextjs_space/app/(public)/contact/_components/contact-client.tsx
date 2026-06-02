'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Mail, MessageSquare, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { FadeIn } from '@/components/ui/animate';

export function ContactClient() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form?.name || !form?.email || !form?.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data?.message ?? 'Message sent!');
        setSent(true);
      } else {
        toast.error(data?.error ?? 'Failed to send');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
      <FadeIn>
        <div className="text-center max-w-xl mx-auto mb-10">
          <h1 className="font-display text-3xl font-bold tracking-tight">Get in Touch</h1>
          <p className="text-muted-foreground mt-2">Have questions about our courses? We are here to help.</p>
        </div>
      </FadeIn>

      <div className="max-w-lg mx-auto">
        <FadeIn delay={0.1}>
          <Card className="shadow-lg">
            <CardContent className="p-6">
              {sent ? (
                <div className="text-center py-8 space-y-4">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                  <h3 className="font-display text-xl font-semibold">Message Sent!</h3>
                  <p className="text-muted-foreground">We will get back to you shortly.</p>
                  <Button variant="outline" onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}>
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={form?.name ?? ''}
                      onChange={(e: any) => setForm({ ...(form ?? {}), name: e?.target?.value ?? '' })}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form?.email ?? ''}
                      onChange={(e: any) => setForm({ ...(form ?? {}), email: e?.target?.value ?? '' })}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={form?.subject ?? ''}
                      onChange={(e: any) => setForm({ ...(form ?? {}), subject: e?.target?.value ?? '' })}
                      placeholder="What is this about?"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={form?.message ?? ''}
                      onChange={(e: any) => setForm({ ...(form ?? {}), message: e?.target?.value ?? '' })}
                      placeholder="Your message..."
                      rows={5}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full gap-2" disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {loading ? 'Sending...' : 'Send Message'}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-2">Your information is stored securely and will not be shared.</p>
                </form>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  );
}
