"use client"
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/store/useStore';
import { toast } from 'sonner';
import { Loader2, ShieldCheck } from 'lucide-react';

/**
 * INTERNAL LOGIC COMPONENT
 * This component handles the actual extraction of the token and redirection.
 * It is separated so it can be wrapped in a Suspense boundary to fix the build error.
 */
function AuthCallbackHandler() {
  const searchParams = useSearchParams();
  const { setToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 1. Extract the secure token passed from the Backend (FastAPI)
    const token = searchParams.get('token');

    if (token) {
      // 2. Synchronize session with global store & localStorage
      setToken(token); 
      toast.success("Security Handshake Complete. Welcome back!");
      
      // 3. Authorized redirect to the core dashboard
      router.push('/'); 
    } else {
      toast.error("Handshake failed. Protocol requires manual authentication.");
      router.push('/login');
    }
  }, [searchParams, setToken, router]);

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* High-end animated security loader */}
      <div className="relative flex items-center justify-center">
        <div className="absolute h-24 w-24 animate-spin rounded-full border-4 border-blue-600 border-t-transparent opacity-20"></div>
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>

      <div className="text-center animate-pulse">
        <h1 className="text-xl font-black uppercase tracking-[0.4em] text-white mb-2">
          Verifying Identity
        </h1>
        <div className="flex items-center justify-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
          <ShieldCheck className="h-4 w-4 text-blue-500" />
          <span>Securing Node Connection...</span>
        </div>
      </div>
    </div>
  );
}

/**
 * MAIN PAGE EXPORT
 * Wrapped in Suspense to satisfy Vercel's build requirements.
 */
export default function AuthCallbackPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-950">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 opacity-20" />
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest mt-4">
            Loading Auth Module...
          </p>
        </div>
      }>
        <AuthCallbackHandler />
      </Suspense>
    </div>
  );
}