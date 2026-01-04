"use client"
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, XCircle, ShieldCheck, ArrowRight } from 'lucide-react';

/**
 * INTERNAL HANDLER COMPONENT
 * This component safely uses useSearchParams() inside a Suspense boundary.
 */
function VerifyHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get('reference');
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');

  useEffect(() => {
    if (!reference) {
      setStatus('failed');
      return;
    }

    const verifyPayment = async () => {
      try {
        // Calling your FastAPI backend verify endpoint
        const res = await api.get(`/pay/verify/${reference}`);
        
        if (res.data.status === 'success') {
          setStatus('success');
          toast.success("Transaction Secure. Order Confirmed.");
        } else {
          setStatus('failed');
          toast.error("Verification failed. Please contact support.");
        }
      } catch (err) {
        console.error("Verification error:", err);
        setStatus('failed');
      }
    };

    verifyPayment();
  }, [reference]);

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center gap-6 animate-pulse">
        <div className="relative flex items-center justify-center">
          <div className="absolute h-24 w-24 animate-spin rounded-full border-4 border-blue-600 border-t-transparent opacity-20"></div>
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        </div>
        <div className="text-center">
          <h1 className="text-xl font-black uppercase tracking-[0.3em] text-slate-900 mb-2">Verifying Node</h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
            <ShieldCheck className="h-4 w-4 text-blue-500" /> Secure Handshake In Progress...
          </p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="text-center max-w-md animate-in zoom-in-95 duration-500">
        <div className="bg-green-50 p-8 rounded-[3rem] w-fit mx-auto mb-8 shadow-inner">
          <CheckCircle2 className="h-20 w-20 text-green-500" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-4 leading-none">
          Deployment <br/> <span className="text-blue-600">Confirmed</span>
        </h1>
        <p className="text-slate-500 font-medium mb-10 leading-relaxed">
          Your payment was successful. Your high-performance workstation is being prepared for immediate dispatch from our Lagos Hub.
        </p>
        <Button 
          onClick={() => router.push('/')} 
          className="w-full h-16 bg-slate-950 hover:bg-blue-600 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-2xl active:scale-95 group"
        >
          Return to Terminal <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center max-w-md animate-in zoom-in-95 duration-500">
      <div className="bg-red-50 p-8 rounded-[3rem] w-fit mx-auto mb-8">
        <XCircle className="h-20 w-20 text-red-500" />
      </div>
      <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-4">Verification Error</h1>
      <p className="text-slate-500 font-medium mb-10 leading-relaxed">
        Protocol Error: We could not verify this transaction. If you have been debited, please screenshot your alert and message Hub Support immediately.
      </p>
      <div className="flex flex-col gap-3">
        <Button 
            onClick={() => router.push('/cart')} 
            variant="outline"
            className="w-full h-14 border-2 border-slate-200 font-black rounded-2xl hover:bg-slate-50"
        >
            Back to Secure Cart
        </Button>
        <Button variant="ghost" className="text-slate-400 font-bold text-xs uppercase tracking-widest">
            Contact Support
        </Button>
      </div>
    </div>
  );
}

/**
 * MAIN PAGE EXPORT
 * Wrapped in Suspense to satisfy Vercel / Next.js build requirements.
 */
export default function VerifyPage() {
  return (
    <div className="flex min-h-[85vh] w-full items-center justify-center bg-white px-4">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 opacity-20" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mt-8 animate-pulse">
            Accessing Secure Node...
          </p>
        </div>
      }>
        <VerifyHandler />
      </Suspense>
    </div>
  );
}