"use client"
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'; // Added for search detection
import api from '@/lib/api';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Laptop, ArrowRight, ShieldCheck, Truck, Zap, Star, SearchX } from 'lucide-react';
import Link from 'next/link';

export default function PublicStore() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- SEARCH LOGIC ---
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('search')?.toLowerCase() || "";

  useEffect(() => {
    api.get('/products').then(res => {
      setProducts(res.data);
      setLoading(false);
    });
  }, []);

  // Filter products based on search term
  const filteredProducts = products.filter((p: any) => 
    p.name.toLowerCase().includes(searchTerm) || 
    p.description.toLowerCase().includes(searchTerm)
  );

  // Helper function to calculate discount percentage
  const calculateDiscount = (price: number, oldPrice: number | null) => {
    if (!oldPrice || oldPrice <= price) return null;
    const discount = ((oldPrice - price) / oldPrice) * 100;
    return Math.round(discount);
  };

  return (
    <div className="bg-white">
      {/* --- HERO SECTION (Always visible) --- */}
      <section className="py-20 lg:py-32 bg-slate-950 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <Badge className="mb-6 bg-blue-600 hover:bg-blue-600 border-none px-4 py-1 animate-bounce uppercase tracking-widest text-[10px] font-black">
            Global Tech Hub
          </Badge>
          <h1 className="text-5xl lg:text-8xl font-black tracking-tighter mb-8 leading-tight">
            ENGINEERED FOR <br /> 
            <span className="text-blue-500 underline decoration-blue-500/30 italic">PRECISION.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-400 text-lg lg:text-xl mb-10 font-medium">
            The ultimate destination for professional-grade laptops. Join 10,000+ developers and creators who trust our curated workstations.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 font-bold px-10 h-16 rounded-full text-lg shadow-2xl shadow-blue-500/40 transition-all hover:scale-105">
                Create Account <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent -z-0"></div>
      </section>

      {/* --- TRUST FEATURES STRIP --- */}
      <div className="border-y bg-slate-50/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="flex items-center gap-5 justify-center group">
              <div className="bg-white p-3 rounded-2xl shadow-sm group-hover:bg-blue-600 transition-colors">
                <Truck className="h-6 w-6 text-blue-600 group-hover:text-white" />
              </div>
              <div className="text-sm font-black text-slate-800 uppercase tracking-tight">Free Worldwide <br/> Express</div>
           </div>
           <div className="flex items-center gap-5 justify-center group border-x border-slate-200">
              <div className="bg-white p-3 rounded-2xl shadow-sm group-hover:bg-blue-600 transition-colors">
                <ShieldCheck className="h-6 w-6 text-blue-600 group-hover:text-white" />
              </div>
              <div className="text-sm font-black text-slate-800 uppercase tracking-tight">2-Year Official <br/> Warranty</div>
           </div>
           <div className="flex items-center gap-5 justify-center group">
              <div className="bg-white p-3 rounded-2xl shadow-sm group-hover:bg-blue-600 transition-colors">
                <Zap className="h-6 w-6 text-blue-600 group-hover:text-white" />
              </div>
              <div className="text-sm font-black text-slate-800 uppercase tracking-tight">24/7 Priority <br/> Tech Support</div>
           </div>
        </div>
      </div>

      {/* --- SEARCH-AWARE PRODUCT GRID --- */}
      <section className="container mx-auto px-4 py-24 scroll-mt-20" id="catalog">
         <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                {searchTerm ? `Results for "${searchTerm}"` : "Featured Hardware"}
              </h2>
              <p className="text-slate-500 font-medium text-lg">
                {searchTerm 
                  ? `We found ${filteredProducts.length} machines matching your criteria.` 
                  : "Pro-grade machines hand-picked for performance."}
              </p>
            </div>
            {!searchTerm && (
              <Link href="/login" className="text-blue-600 font-bold hover:underline flex items-center gap-2">
                 View all 50+ models <ArrowRight className="h-4 w-4" />
              </Link>
            )}
         </div>

         {/* Grid Logic */}
         {filteredProducts.length > 0 ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredProducts.slice(0, 6).map((product: any) => {
                 const discount = calculateDiscount(product.price, product.old_price);
                 
                 return (
                    <Card key={product.id} className="group border-none shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 rounded-[2.5rem] overflow-hidden bg-white">
                       <div className="h-72 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                          {product.image_url ? (
                             <img 
                                src={product.image_url} 
                                alt={product.name} 
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                             />
                          ) : (
                             <Laptop className="h-24 w-24 text-slate-300 group-hover:text-blue-200 transition-colors" />
                          )}
                          
                          {discount && (
                             <div className="absolute top-6 left-6 bg-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">
                                SAVE {discount}%
                             </div>
                          )}
                          
                          <div className="absolute top-6 right-6 flex gap-1">
                            {[1,2,3,4,5].map((i) => <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />)}
                          </div>
                       </div>

                       <CardHeader className="pt-8">
                          <CardTitle className="text-2xl font-black text-slate-900 leading-none">
                             {product.name}
                          </CardTitle>
                          <p className="text-slate-400 text-sm font-medium line-clamp-2 mt-2">
                             {product.description}
                          </p>
                       </CardHeader>

                       <CardContent className="pb-8">
                          <div className="flex items-baseline gap-3">
                             <span className="text-3xl font-black text-slate-900">
                                ₦{product.price.toLocaleString()}
                             </span>
                             {product.old_price && (
                                <span className="text-lg font-bold text-slate-300 line-through decoration-slate-300/50">
                                   ₦{product.old_price.toLocaleString()}
                                </span>
                             )}
                          </div>
                       </CardContent>

                       <CardFooter className="p-0 border-t">
                          <Link href="/login" className="w-full">
                             <Button variant="ghost" className="w-full h-16 rounded-none text-slate-600 hover:text-blue-600 font-bold text-base bg-slate-50/50 hover:bg-blue-50/50 transition-colors">
                                Unlock Specs & Buy <ArrowRight className="ml-2 h-4 w-4" />
                             </Button>
                          </Link>
                       </CardFooter>
                    </Card>
                 );
              })}
           </div>
         ) : !loading && (
           /* --- NO RESULTS FALLBACK --- */
           <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
              <div className="bg-white p-6 rounded-full shadow-sm mb-6">
                <SearchX className="h-12 w-12 text-slate-300" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">No Machines Found</h3>
              <p className="text-slate-500 font-medium mt-2 max-w-sm text-center">
                We couldn&apos;t find any laptops matching <span className="text-blue-600 font-bold">&quot;{searchTerm}&quot;</span>. 
                Try checking the spelling or using a brand name.
              </p>
              <Button 
                variant="outline" 
                className="mt-8 rounded-full font-bold border-slate-300"
                onClick={() => window.location.href = '/'}
              >
                Clear Search
              </Button>
           </div>
         )}
      </section>
    </div>
  );
}