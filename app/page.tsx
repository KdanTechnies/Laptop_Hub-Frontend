"use client"
import { useEffect, useState, Suspense } from 'react'; // Added Suspense
import { useAuth } from '@/store/useStore';
import PublicStore from '@/components/PublicStore';
import AuthenticatedStore from '@/components/AuthenticatedStore';
import { Loader2, Laptop } from 'lucide-react';

/**
 * Traffic Control Component:
 * Decides whether to show the Marketing Landing Page or the User Dashboard.
 */
function TrafficController() {
  const { token } = useAuth();
  return token ? <AuthenticatedStore /> : <PublicStore />;
}

export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false);

  // Next.js Hydration Fix
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Professional Branded Loader (EMMY CORE OS)
  if (!isMounted) {
    return (
      <div className="flex h-[100vh] w-full flex-col items-center justify-center bg-white">
        <div className="relative flex items-center justify-center">
          <div className="absolute h-24 w-24 animate-spin rounded-full border-4 border-blue-600 border-t-transparent opacity-10"></div>
          <div className="relative flex h-16 w-16 animate-pulse items-center justify-center rounded-[1.5rem] bg-slate-950 shadow-2xl shadow-blue-500/20">
            <Laptop className="h-8 w-8 text-white" />
          </div>
        </div>
        
        <div className="mt-12 flex flex-col items-center gap-2">
          <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-900">
            EMMY CORE <span className="text-blue-600">OS</span>
          </h2>
          <div className="flex items-center gap-2">
            <Loader2 className="h-3 w-3 animate-spin text-slate-300" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Initializing Secure Workspace...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    /**
     * CRITICAL VERCEL FIX: 
     * Wrapped in Suspense because the child components use 'useSearchParams'.
     * This allows Next.js to finish the build process successfully.
     */
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 opacity-20" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Loading Node Data...</p>
        </div>
      </div>
    }>
      <div className="transition-all duration-700 ease-in-out">
        <TrafficController />
      </div>
    </Suspense>
  );
}