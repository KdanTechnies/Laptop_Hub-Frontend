"use client"
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');
  const [status, setStatus] = useState('loading');
  const router = useRouter();

  useEffect(() => {
    if (reference) {
      api.get(`/pay/verify/${reference}`).then(res => {
        if (res.data.status === 'success') {
          setStatus('success');
          toast.success("Payment Received!");
        } else {
          setStatus('failed');
          toast.error("Payment Failed");
        }
      });
    }
  }, [reference]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      {status === 'loading' && <Loader2 className="animate-spin h-10 w-10 text-blue-600" />}
      {status === 'success' && (
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          <h1 className="text-2xl font-bold mt-4">Order Confirmed!</h1>
          <Button onClick={() => router.push('/')} className="mt-4">Back to Store</Button>
        </div>
      )}
    </div>
  );
}