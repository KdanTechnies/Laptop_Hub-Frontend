"use client"
import { useEffect, useState } from 'react';
import { useAuth } from '@/store/useStore';
import PublicStore from '@/components/PublicStore';
import AuthenticatedStore from '@/components/AuthenticatedStore';
import { Loader2, Laptop } from 'lucide-react';

export default function HomePage() {
  const { token } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  // Next.js Hydration Fix:
  // Ensures localStorage and auth state are only accessed on the client.
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Professional Branded Loader
  // This shows briefly while Next.js determines if the user is logged in.
  if (!isMounted) {
    return (
      <div className="flex h-[100vh] w-full flex-col items-center justify-center bg-white">
        <div className="relative flex items-center justify-center">
          {/* Outer spinning ring */}
          <div className="absolute h-20 w-20 animate-spin rounded-full border-4 border-blue-600 border-t-transparent opacity-20"></div>
          
          {/* Inner pulsating logo */}
          <div className="relative flex h-14 w-14 animate-pulse items-center justify-center rounded-2xl bg-blue-600 shadow-xl shadow-blue-200">
            <Laptop className="h-8 w-8 text-white" />
          </div>
        </div>
        
        <div className="mt-10 flex flex-col items-center gap-2">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">
            Laptop Hub <span className="text-blue-600">OS</span>
          </h2>
          <div className="flex items-center gap-2">
            <Loader2 className="h-3 w-3 animate-spin text-slate-300" />
            <p className="text-[11px] font-bold text-slate-400">Initializing Workspace...</p>
          </div>
        </div>
      </div>
    );
  }

  // Final Traffic Control: 
  // If a JWT token exists, render the Dashboard Store.
  // Otherwise, render the Marketing Landing Page.
  return (
    <div className="transition-all duration-500 ease-in-out">
      {token ? <AuthenticatedStore /> : <PublicStore />}
    </div>
  );
}