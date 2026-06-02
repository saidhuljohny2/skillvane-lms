'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthLayout } from '@/components/layouts/auth-layout';
import { Loader2, UserPlus, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form?.name || !form?.email || !form?.password) {
      toast.error('Please fill in all required fields');
      return;
    }
    if ((form?.password?.length ?? 0) < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error ?? 'Signup failed');
        setLoading(false);
        return;
      }
      // Auto login after signup
      await signIn('credentials', {
        email: form?.email ?? '',
        password: form?.password ?? '',
        redirect: true,
        callbackUrl: '/dashboard',
      });
    } catch {
      toast.error('Something went wrong');
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create Account" description="Sign up to start learning">
      <div className="flex justify-center mb-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <GraduationCap className="w-6 h-6 text-primary" />
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={form?.name ?? ''}
            onChange={(e: any) => setForm({ ...(form ?? {}), name: e?.target?.value ?? '' })}
            placeholder="Your full name"
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
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input
            id="phone"
            value={form?.phone ?? ''}
            onChange={(e: any) => setForm({ ...(form ?? {}), phone: e?.target?.value ?? '' })}
            placeholder="Your phone number"
          />
        </div>
        <div>
          <Label htmlFor="password">Password *</Label>
          <Input
            id="password"
            type="password"
            value={form?.password ?? ''}
            onChange={(e: any) => setForm({ ...(form ?? {}), password: e?.target?.value ?? '' })}
            placeholder="Min 6 characters"
            required
          />
        </div>
        <Button type="submit" className="w-full gap-2" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>
      <p className="text-center text-sm text-muted-foreground mt-4">
        Already have an account?{' '}
        <Link href="/login" className="text-primary font-medium hover:underline">Sign In</Link>
      </p>
      <p className="text-center text-sm text-muted-foreground mt-2">
        <Link href="/" className="hover:underline">Back to Home</Link>
      </p>
    </AuthLayout>
  );
}
