'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayButtonProps {
  courseId: string;
  courseName: string;
  price: number;
  className?: string;
}

export function RazorpayButton({ courseId, courseName, price, className }: RazorpayButtonProps) {
  const { data: session } = useSession() || {};
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window?.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document?.head?.appendChild?.(script);
    });
  };

  const handlePayment = async () => {
    if (!session?.user) {
      router.push('/login');
      return;
    }
    setLoading(true);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error('Failed to load payment gateway. Please try again.');
        setLoading(false);
        return;
      }
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error ?? 'Failed to create order');
        setLoading(false);
        return;
      }
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data?.amount,
        currency: data?.currency ?? 'INR',
        name: 'SkillVane IT Academy',
        description: courseName,
        order_id: data?.orderId,
        prefill: {
          name: session?.user?.name ?? '',
          email: session?.user?.email ?? '',
        },
        theme: { color: '#7c3aed' },
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response?.razorpay_order_id,
                razorpay_payment_id: response?.razorpay_payment_id,
                razorpay_signature: response?.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyRes.ok) {
              toast.success('Payment successful! You are now enrolled.');
              router.push('/dashboard');
            } else {
              toast.error(verifyData?.error ?? 'Payment verification failed');
            }
          } catch {
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      setLoading(false);
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={loading}
      className={className ?? 'w-full gap-2'}
      size="lg"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <ShoppingCart className="w-4 h-4" />
      )}
      {loading ? 'Processing...' : `Enroll Now - ₹${(price ?? 0)?.toLocaleString?.('en-IN') ?? '0'}`}
    </Button>
  );
}
