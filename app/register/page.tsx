"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Link from 'next/link';
import { 
  Laptop, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Loader2,
  Eye,
  EyeOff,
  UserPlus,
  Mail
} from 'lucide-react';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // --- MANUAL REGISTRATION ---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/register', { username, password });
      toast.success("Account created! Please login.");
      router.push('/login');
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Registration failed.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // --- REAL SOCIAL LOGIN HANDLER ---
  const handleSocialLogin = (provider: string) => {
    toast.loading(`Redirecting to ${provider} secure login...`);
    // Redirects the browser to the FastAPI OAuth endpoint
    window.location.href = `http://127.0.0.1:8000/auth/login/${provider.toLowerCase()}`;
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] overflow-hidden bg-white">
      {/* --- LEFT SIDE: THE FORM --- */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-12 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          
          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
              Join the Hub
            </h1>
            <p className="mt-2 text-slate-500 font-medium">
              The professional choice for premium hardware.
            </p>
          </div>

          {/* --- SOCIAL BUTTONS (NOW REAL) --- */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Button 
              variant="outline" 
              className="rounded-xl h-12 font-bold border-slate-200 hover:bg-slate-50 transition-all active:scale-95"
              onClick={() => handleSocialLogin('Google')}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </Button>
            <Button 
              variant="outline" 
              className="rounded-xl h-12 font-bold border-slate-200 hover:bg-slate-50 transition-all active:scale-95"
              onClick={() => handleSocialLogin('Yahoo')}
            >
              <span className="mr-2 font-black text-purple-700 text-lg">!</span>
              Yahoo
            </Button>
          </div>

          <Button 
              variant="outline" 
              className="w-full rounded-xl h-12 font-bold border-slate-200 mb-6 hover:bg-slate-50"
              onClick={() => document.getElementById('username-input')?.focus()}
            >
              <Mail className="mr-2 h-4 w-4 text-slate-500" />
              Continue with Email
          </Button>

          {/* --- DIVIDER --- */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 font-black text-slate-400 tracking-widest">OR USE CREDENTIALS</span>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Username</label>
              <Input 
                id="username-input"
                placeholder="daniel_dev" 
                className="h-12 border-slate-200 focus:ring-blue-600 rounded-xl bg-slate-50/50"
                onChange={(e) => setUsername(e.target.value)} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Password</label>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="h-12 border-slate-200 focus:ring-blue-600 rounded-xl bg-slate-50/50 pr-12"
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-blue-600 transition-all"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-100 active:scale-95"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Create Account <UserPlus className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-10 text-center text-sm text-slate-500 font-medium">
            Already a member?{" "}
            <Link href="/login" className="font-black text-blue-600 hover:underline underline-offset-4 transition-all">
              Sign in here
            </Link>
          </div>
        </div>
      </div>

      {/* --- RIGHT SIDE: BRANDING/MARKETING --- */}
      <div className="hidden w-1/2 lg:block relative bg-slate-950">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
        <div className="absolute top-[20%] right-[10%] h-[400px] w-[400px] rounded-full bg-blue-600/20 blur-[100px]"></div>

        <div className="relative flex h-full flex-col items-start justify-center p-20 text-white">
          <div className="mb-12 flex items-center gap-3">
            <div className="rounded-xl bg-blue-600 p-2.5 shadow-lg">
              <Laptop className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase">EMMY LAPTOP HUB</span>
          </div>

          <h2 className="mb-10 text-5xl font-black leading-tight tracking-tight">
            The world&apos;s best <br /> 
            workstations are <br />
            <span className="text-blue-500">just a click away.</span>
          </h2>

          <div className="space-y-8">
            <div className="flex items-start gap-5 group">
              <div className="mt-1 rounded-full bg-blue-500/10 p-2 group-hover:bg-blue-500/20 transition-colors">
                <CheckCircle2 className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h4 className="font-black text-sm uppercase tracking-widest">Global SSO Support</h4>
                <p className="text-sm text-slate-400 font-medium">Fast-track your registration using Google or Yahoo accounts.</p>
              </div>
            </div>

            <div className="flex items-start gap-5 group">
              <div className="mt-1 rounded-full bg-blue-500/10 p-2 group-hover:bg-blue-500/20 transition-colors">
                <Zap className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h4 className="font-black text-sm uppercase tracking-widest">Express Checkout</h4>
                <p className="text-sm text-slate-400 font-medium">Save your details for lightning-fast purchases on new releases.</p>
              </div>
            </div>

            <div className="flex items-start gap-5 group">
              <div className="mt-1 rounded-full bg-blue-500/10 p-2 group-hover:bg-blue-500/20 transition-colors">
                <ShieldCheck className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h4 className="font-black text-sm uppercase tracking-widest">256-bit Encryption</h4>
                <p className="text-sm text-slate-400 font-medium">Your data and transactions are protected by military-grade security.</p>
              </div>
            </div>
          </div>

          <div className="mt-20 flex items-center gap-4 border-t border-slate-800 pt-10 w-full">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 w-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-black uppercase">
                  U{i}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 font-bold italic tracking-wide">
              Join 10,000+ developers already using Emmy Laptop Hub.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}