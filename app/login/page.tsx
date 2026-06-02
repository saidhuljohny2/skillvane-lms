'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthLayout } from '@/components/layouts/auth-layout';
import { Loader2, LogIn, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form?.email || !form?.password) {
      toast.error('Please enter email and password');
      return;
    }
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        email: form?.email ?? '',
        password: form?.password ?? '',
        redirect: true,
        callbackUrl: '/dashboard',
      });
      if (result?.error) {
        toast.error('Invalid email or password');
        setLoading(false);
      }
    } catch {
      toast.error('Something went wrong');
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back" description="Sign in to access your courses">
      <div className="flex justify-center mb-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <GraduationCap className="w-6 h-6 text-primary" />
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
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
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={form?.password ?? ''}
            onChange={(e: any) => setForm({ ...(form ?? {}), password: e?.target?.value ?? '' })}
            placeholder="Enter your password"
            required
          />
        </div>
        <Button type="submit" className="w-full gap-2" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
      <p className="text-center text-sm text-muted-foreground mt-4">
        New here?{' '}
        <Link href="/signup" className="text-primary font-medium hover:underline">Create an account</Link>
      </p>
      <p className="text-center text-sm text-muted-foreground mt-2">
        <Link href="/" className="hover:underline">Back to Home</Link>
      </p>
    </AuthLayout>
  );
}
