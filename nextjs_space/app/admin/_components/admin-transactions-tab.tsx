'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreditCard, Loader2, IndianRupee } from 'lucide-react';

const statusColors: Record<string, string> = {
  SUCCESS: 'bg-green-100 text-green-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
  FAILED: 'bg-red-100 text-red-800',
};

export function AdminTransactionsTab() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/transactions')
      .then((r) => r.json())
      .then((d: any) => setPayments(d ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <Card className="shadow-sm">
      <CardContent className="p-0">
        {(payments?.length ?? 0) === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No transactions yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments?.map?.((p: any) => (
                  <TableRow key={p?.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{p?.user?.name ?? 'N/A'}</p>
                        <p className="text-xs text-muted-foreground">{p?.user?.email ?? ''}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{p?.course?.title ?? 'N/A'}</TableCell>
                    <TableCell className="text-sm font-medium flex items-center gap-0.5">
                      <IndianRupee className="w-3 h-3" />{(p?.amount ?? 0)?.toLocaleString?.('en-IN') ?? '0'}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[p?.status ?? ''] ?? 'bg-gray-100 text-gray-800'}`}>
                        {p?.status ?? 'UNKNOWN'}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {p?.razorpayPaymentId || '-'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {p?.createdAt ? new Date(p.createdAt).toLocaleDateString('en-IN') : 'N/A'}
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
