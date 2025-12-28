"use client"
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'; // Added for search functionality
import api from '@/lib/api';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { 
  Laptop, 
  Heart, 
  ShoppingCart, 
  LayoutDashboard, 
  History, 
  Star, 
  Zap,
  Package,
  ArrowUpRight,
  PlayCircle,
  TrendingDown,
  SearchX // Icon for no results
} from 'lucide-react';

export default function AuthenticatedStore() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- SEARCH LOGIC ---
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('search')?.toLowerCase() || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data);
      } catch (err) {
        toast.error("Connection error: Failed to sync marketplace");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter products based on search term (name or description)
  const filteredProducts = products.filter((p: any) => 
    p.name.toLowerCase().includes(searchTerm) || 
    p.description.toLowerCase().includes(searchTerm)
  );

  const getDiscount = (price: number, oldPrice: number | null) => {
    if (!oldPrice || oldPrice <= price) return null;
    return Math.round(((oldPrice - price) / oldPrice) * 100);
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* --- DASHBOARD SIDEBAR --- */}
      <aside className="hidden lg:flex w-72 flex-col border-r bg-white p-6 sticky top-20 h-[calc(100vh-80px)]">
        <div className="space-y-8">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Main Terminal</p>
            <nav className="space-y-1.5">
              <Button variant="secondary" className="w-full justify-start gap-3 bg-blue-600 text-white hover:bg-blue-700 border-none shadow-md shadow-blue-100">
                <LayoutDashboard className="h-4 w-4" /> Marketplace
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all">
                <History className="h-4 w-4" /> My Orders
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all">
                <Star className="h-4 w-4" /> Recommended
              </Button>
            </nav>
          </div>
          
          <div className="pt-8">
            <div className="rounded-3xl bg-slate-950 p-6 text-white relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 h-24 w-24 bg-blue-600/20 rounded-full blur-2xl group-hover:bg-blue-600/40 transition-all"></div>
              <p className="text-[10px] font-bold text-blue-400 mb-1 tracking-widest uppercase">Member Perks</p>
              <p className="text-sm font-semibold mb-4 leading-snug">24/7 Priority support is active for your account.</p>
              <Button size="sm" className="w-full bg-white text-slate-950 hover:bg-slate-200 font-bold rounded-xl shadow-lg">
                View Benefits <ArrowUpRight className="ml-2 h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none px-3 mb-3 font-bold">
              {searchTerm ? `Searching: "${searchTerm}"` : "Marketplace Live"}
            </Badge>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Available Inventory</h1>
            <p className="text-slate-500 font-medium mt-1">
              {searchTerm 
                ? `Showing ${filteredProducts.length} results for your search.` 
                : "Configure and deploy your next workstation."
              }
            </p>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" className="rounded-xl border-slate-200 font-bold">Support</Button>
             <Button className="rounded-xl bg-slate-900 font-bold px-6">New Releases</Button>
          </div>
        </header>

        {/* Quick Stats Dashboard */}
        {!searchTerm && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
            {[
                { label: "Inventory", value: "Verified", icon: Package, color: "blue" },
                { label: "Active Cart", value: "Encrypted", icon: ShoppingCart, color: "green" },
                { label: "Saved Labs", value: "Cloud Sync", icon: Heart, color: "pink" }
            ].map((stat, idx) => (
                <div key={idx} className="bg-white p-6 rounded-[2rem] border shadow-sm hover:shadow-md transition-all flex items-center gap-5">
                <div className={`h-14 w-14 bg-${stat.color}-50 rounded-2xl flex items-center justify-center text-${stat.color}-600`}>
                    <stat.icon className="h-7 w-7" />
                </div>
                <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">{stat.label}</p>
                    <p className="text-xl font-black text-slate-900 leading-tight">{stat.value}</p>
                </div>
                </div>
            ))}
            </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {loading ? (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white border rounded-[2rem] p-6 flex gap-6 animate-pulse">
                <div className="h-32 w-32 bg-slate-100 rounded-2xl shrink-0" />
                <div className="flex-1 space-y-4 py-2">
                  <div className="h-6 bg-slate-100 rounded w-3/4" />
                  <div className="h-4 bg-slate-100 rounded w-1/2" />
                  <div className="h-10 bg-slate-100 rounded-xl mt-4" />
                </div>
              </div>
            ))
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product: any) => {
              const discount = getDiscount(product.price, product.old_price);
              
              return (
                <div key={product.id} className="group bg-white border-2 border-transparent hover:border-blue-100 rounded-[2.5rem] p-6 flex flex-col sm:flex-row gap-8 hover:shadow-2xl transition-all duration-500 relative animate-in fade-in zoom-in-95">
                  
                  {/* Image Container */}
                  <div className="h-44 w-full sm:h-44 sm:w-44 bg-slate-50 rounded-[2rem] flex items-center justify-center shrink-0 group-hover:bg-blue-50 transition-all duration-500 overflow-hidden relative">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                    ) : (
                      <Laptop className="h-16 w-16 text-slate-300 group-hover:text-blue-500 transition-all duration-500" />
                    )}
                    
                    {product.video_url && (
                      <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm p-1 rounded-full shadow-sm">
                        <PlayCircle className="h-4 w-4 text-blue-600" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div className="space-y-1">
                           {discount && (
                             <Badge className="bg-blue-50 text-blue-700 border-none text-[10px] font-black h-5 mb-1">
                               <TrendingDown className="h-3 w-3 mr-1" /> {discount}% OFF
                             </Badge>
                           )}
                           <h3 className="font-black text-2xl text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                            {product.name}
                           </h3>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-2xl text-slate-900">
                            ₦{product.price.toLocaleString()}
                          </p>
                          {product.old_price && (
                            <p className="text-sm font-bold text-slate-300 line-through decoration-slate-300/50">
                              ₦{product.old_price.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2 mt-2">
                        {product.description}
                      </p>
                    </div>

                    <div className="flex gap-3 mt-8">
                      <Button 
                        className="flex-1 bg-slate-900 hover:bg-blue-600 transition-all font-black uppercase tracking-widest h-14 rounded-2xl active:scale-95 text-xs shadow-xl shadow-slate-200 hover:shadow-blue-200" 
                        onClick={() => api.post(`/cart/${product.id}`).then(() => toast.success("Deployment added to cart"))}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Configure & Buy
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="rounded-2xl h-14 w-14 border-slate-200 hover:text-pink-600 hover:bg-pink-50 transition-all" 
                        onClick={() => api.post(`/favorites/${product.id}`).then(() => toast.success("Saved to laboratory"))}
                      >
                        <Heart className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            // --- NO RESULTS STATE ---
            <div className="col-span-full flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 animate-in fade-in zoom-in-95">
              <div className="bg-slate-50 p-6 rounded-full mb-6">
                <SearchX className="h-12 w-12 text-slate-300" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">No hardware found</h2>
              <p className="text-slate-500 font-medium mt-2">
                We couldn&apos;t find any results for <span className="text-blue-600 font-bold">&quot;{searchTerm}&quot;</span>
              </p>
              <Button 
                variant="outline" 
                className="mt-8 rounded-xl font-bold"
                onClick={() => window.location.href = '/'}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}