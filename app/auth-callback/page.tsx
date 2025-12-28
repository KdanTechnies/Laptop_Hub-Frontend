"use client"
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/store/useStore';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const searchParams = useSearchParams();
  const { setToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setToken(token); // Save to Store & LocalStorage
      toast.success("Welcome back! Social login successful.");
      router.push('/'); // Send them to the store
    } else {
      toast.error("Social login failed. Please try again.");
      router.push('/login');
    }
  }, [searchParams, setToken, router]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-950 text-white">
      <Loader2 className="h-10 w-10 animate-spin text-blue-500 mb-4" />
      <h1 className="text-xl font-black uppercase tracking-widest">Verifying Identity...</h1>
      <p className="text-slate-400 text-sm mt-2">Securing your Emmy Hub session.</p>
    </div>
  );
}