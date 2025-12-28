"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/store/useStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  Laptop, 
  LockKeyhole, 
  User, 
  Loader2, 
  ArrowRight, 
  ShieldCheck,
  Eye,      // Added for toggle
  EyeOff    // Added for toggle
} from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Visibility State
  const [isLoading, setIsLoading] = useState(false);
  const { setToken } = useAuth();
  const router = useRouter();

  const parseJwt = (token: string) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      
      const res = await api.post('/token', formData);
      const token = res.data.access_token;
      
      setToken(token);
      const decoded = parseJwt(token);
      
      toast.success("Authentication successful!");

      if (decoded?.is_admin) {
        router.push('/admin');
      } else {
        router.push('/');
      }
      
    } catch (err: any) {
      setIsLoading(false); 
      const errorMsg = err.response?.data?.detail || "Invalid username or password";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] overflow-hidden bg-white">
      {/* --- LEFT SIDE: THE FORM --- */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-12 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          <div className="flex justify-center lg:justify-start mb-8">
            <div className="rounded-2xl bg-blue-600 p-3 lg:hidden shadow-lg shadow-blue-200">
              <Laptop className="h-8 w-8 text-white" />
            </div>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
              Secure Login
            </h1>
            <p className="mt-2 text-slate-500 font-medium">
              Enter your credentials to access your workspace.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <User className="h-3 w-3" /> Username
              </label>
              <Input 
                placeholder="Enter username" 
                className="h-12 border-slate-200 focus:ring-blue-600 rounded-xl bg-slate-50/50"
                onChange={(e) => setUsername(e.target.value)} 
                required 
              />
            </div>
            
            {/* Password Field with Toggle */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <LockKeyhole className="h-3 w-3" /> Password
                </label>
                <Link href="#" className="text-[10px] font-black uppercase text-blue-600 hover:text-blue-500 transition-colors">
                  Forgot?
                </Link>
              </div>
              
              <div className="relative group">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="h-12 border-slate-200 focus:ring-blue-600 rounded-xl bg-slate-50/50 pr-12 transition-all"
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-all"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-100 active:scale-95"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Sign In <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-10 text-center text-sm text-slate-500 font-medium">
            New to the Hub?{" "}
            <Link href="/register" className="font-black text-blue-600 hover:text-blue-500 hover:underline underline-offset-4 transition-all">
              Create account
            </Link>
          </div>
        </div>
      </div>

      {/* --- RIGHT SIDE: PREMIUM BRANDING --- */}
      <div className="hidden w-1/2 lg:block relative bg-slate-950">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
        <div className="absolute top-[20%] right-[10%] h-[400px] w-[400px] rounded-full bg-blue-600/20 blur-[100px]"></div>

        <div className="relative flex h-full flex-col items-start justify-center p-20 text-white">
          <div className="mb-12 flex items-center gap-3">
            <div className="rounded-xl bg-blue-600 p-2.5">
              <Laptop className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase">LAPTOP HUB</span>
          </div>

          <blockquote className="space-y-6">
            <p className="text-4xl font-medium leading-tight tracking-tight text-slate-100 italic">
              &quot;The hardware you choose today defines the speed of your innovation tomorrow.&quot;
            </p>
            <footer className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-400 flex items-center justify-center font-black">
                KOD
              </div>
              <div>
                <p className="font-bold text-white text-lg">Kalu Onuka Daniel</p>
                <p className="text-blue-400 text-sm font-medium uppercase tracking-widest">Lead Developer @ Synapse</p>
              </div>
            </footer>
          </blockquote>

          <div className="mt-20 flex items-center gap-8 border-t border-slate-800 pt-10 w-full">
            <div className="flex flex-col">
              <span className="text-3xl font-black">99.9%</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Uptime</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-black">24/7</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Support</span>
            </div>
            <div className="flex flex-col">
              <span className="flex items-center gap-2 text-3xl font-black">
                <ShieldCheck className="h-6 w-6 text-blue-500" /> Secure
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}