"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ShoppingCart, 
  Heart, 
  Laptop, 
  LogOut, 
  LogIn, 
  UserPlus,
  Search,
  X // Added X for clearing search
} from 'lucide-react';
import { useAuth } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Navbar() {
  const { token, logout, isAdmin } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Local state for the input field
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || "");

  // Sync input with URL if it changes (e.g., user hits back button)
  useEffect(() => {
    setSearchQuery(searchParams.get('search') || "");
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery) {
      params.set('search', searchQuery);
    } else {
      params.delete('search');
    }
    // Push the search to the home page store
    router.push(`/?${params.toString()}`);
  };

  const clearSearch = () => {
    setSearchQuery("");
    router.push('/');
  };

  return (
    <TooltipProvider>
      <nav className="sticky top-0 z-50 w-full border-b bg-white/75 backdrop-blur-lg transition-all duration-300">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 lg:px-8">
          
          {/* --- LOGO SECTION --- */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-blue-600 p-2 rounded-xl group-hover:rotate-6 transition-transform duration-300">
              <Laptop className="h-6 w-6 text-white" />
            </div>
            <span className="hidden sm:inline text-xl font-black tracking-tighter text-slate-900 uppercase">
              EMMY LAPTOP<span className="text-blue-600">HUB</span>
            </span>
          </Link>

          {/* --- NAVIGATION LINKS --- */}
          <div className="hidden xl:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-slate-400">
            <Link href="/" className="hover:text-blue-600 transition-colors">Store</Link>
            <Link href="/favorites" className="hover:text-blue-600 transition-colors">Wishlist</Link>
            {isAdmin && <Link href="/admin" className="text-red-500 hover:text-red-600">Console</Link>}
          </div>

          {/* --- SEARCH & ACTIONS --- */}
          <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end max-w-2xl">
            
            {/* Search Bar Form */}
            <form onSubmit={handleSearch} className="relative group flex-1 max-w-sm hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Search models..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 rounded-full py-2.5 pl-11 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white border-transparent focus:border-blue-500/30 transition-all"
              />
              {searchQuery && (
                <button 
                  type="button" 
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded-full"
                >
                  <X className="h-3 w-3 text-slate-500" />
                </button>
              )}
            </form>

            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/favorites">
                    <Button variant="ghost" size="icon" className="rounded-full text-slate-600 hover:bg-blue-50">
                      <Heart className="h-5 w-5" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Wishlist</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/cart">
                    <Button variant="ghost" size="icon" className="relative rounded-full text-slate-600 hover:bg-blue-50">
                      <ShoppingCart className="h-5 w-5" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Cart</TooltipContent>
              </Tooltip>
            </div>

            <div className="h-8 w-[1px] bg-slate-200 mx-1 hidden sm:block" />

            {token ? (
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  onClick={logout}
                  className="rounded-xl border-slate-200 hover:bg-red-50 hover:text-red-600 transition-all font-bold text-xs uppercase tracking-widest"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="hidden sm:block">
                  <Button variant="ghost" className="font-bold text-xs uppercase tracking-widest text-slate-600">
                    Log In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl px-6 shadow-md shadow-blue-100 uppercase text-xs tracking-widest">
                    Join
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </TooltipProvider>
  );
}