"use client"
import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Laptop, ArrowRight, ShieldCheck, Truck, Zap, Star, SearchX, 
  Filter, ArrowLeftRight, Clock, HelpCircle, Sparkles, Monitor, 
  Briefcase, Rocket, Facebook, Twitter, Instagram, Mail, Loader2
} from 'lucide-react';
import Link from 'next/link';

export default function PublicStore() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Newest Arrivals"); // Functional Sort State
  const router = useRouter();

  // --- SEARCH LOGIC ---
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('search')?.toLowerCase() || "";

  const categories = [
    { name: "All", icon: <Sparkles className="h-4 w-4" /> },
    { name: "Workstations", icon: <Monitor className="h-4 w-4" /> },
    { name: "Business", icon: <Briefcase className="h-4 w-4" /> },
    { name: "Gaming", icon: <Zap className="h-4 w-4" /> },
    { name: "Ultra-portable", icon: <Rocket className="h-4 w-4" /> },
  ];

  useEffect(() => {
    api.get('/products').then(res => {
      setProducts(res.data);
      setLoading(false);
    });
  }, []);

  // --- COMPOSITE LOGIC: FILTERING + SORTING ---
  const processedProducts = useMemo(() => {
    // 1. Filtering
    let result = products.filter((p: any) => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm) || 
                           p.description.toLowerCase().includes(searchTerm);
      const matchesCategory = activeCategory === "All" || 
                             p.description.toLowerCase().includes(activeCategory.toLowerCase());
      return matchesSearch && matchesCategory;
    });

    // 2. Sorting
    if (sortBy === "Price: Low to High") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "Most Powerful") {
      result.sort((a, b) => b.price - a.price); // Price as proxy for power
    } else if (sortBy === "Newest Arrivals") {
      result.sort((a, b) => b.id - a.id); // Higher ID = Newest
    }

    return result;
  }, [products, searchTerm, activeCategory, sortBy]);

  const calculateDiscount = (price: number, oldPrice: number | null) => {
    if (!oldPrice || oldPrice <= price) return null;
    return Math.round(((oldPrice - price) / oldPrice) * 100);
  };

  return (
    <div className="bg-white selection:bg-blue-100 selection:text-blue-900">
      
      {/* --- 1. HERO SECTION --- */}
      <section className="relative pt-24 pb-32 lg:pt-32 lg:pb-48 bg-slate-950 text-white overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-8 bg-blue-600/10 text-blue-400 border-blue-500/20 px-4 py-1.5 rounded-full animate-pulse uppercase tracking-[0.2em] text-[10px] font-bold">
              Flash Sales Begins From: 18th Jan - 3rd Feb
            </Badge>
            <h1 className="text-6xl md:text-8xl lg:text-[110px] font-black tracking-tighter mb-8 leading-[0.85] animate-in fade-in slide-in-from-bottom-4 duration-700">
              BEYOND <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-400 italic">FAST.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-slate-400 text-lg lg:text-xl mb-12 font-medium leading-relaxed">
              We stock the hardware other retailers can’t handle. Emmy Core provides high-bandwidth workstations configured for zero-throttling performance. Local 24-month support included.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 font-bold px-10 h-16 rounded-2xl text-lg shadow-2xl shadow-blue-500/20 w-full sm:w-auto">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none bg-[radial-gradient(circle_at_2px_2px,_rgba(255,255,255,0.05)_1px,_transparent_0)] bg-[length:40px_40px]"></div>
      </section>

      {/* --- 2. TRUST STRIP --- */}
      <div className="relative -mt-12 z-20">
        <div className="container mx-auto px-4">
          <div className="bg-white border shadow-2xl rounded-3xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 justify-center md:justify-start">
               <div className="bg-blue-50 p-3 rounded-2xl"><Truck className="h-6 w-6 text-blue-600" /></div>
               <div><p className="text-xs font-black uppercase tracking-widest text-slate-400">Shipping</p><p className="font-bold text-slate-900">Next-Day Hub Delivery</p></div>
            </div>
            <div className="flex items-center gap-4 justify-center border-y md:border-y-0 md:border-x py-6 md:py-0">
               <div className="bg-blue-50 p-3 rounded-2xl"><ShieldCheck className="h-6 w-6 text-blue-600" /></div>
               <div><p className="text-xs font-black uppercase tracking-widest text-slate-400">Reliability</p><p className="font-bold text-slate-900">2-Year Local Warranty</p></div>
            </div>
            <div className="flex items-center gap-4 justify-center md:justify-end">
               <div className="bg-blue-50 p-3 rounded-2xl"><Zap className="h-6 w-6 text-blue-600" /></div>
               <div><p className="text-xs font-black uppercase tracking-widest text-slate-400">Assistance</p><p className="font-bold text-slate-900">24/7 Expert Support</p></div>
            </div>
          </div>
        </div>
      </div>

      {/* --- 3. CATEGORIES & FUNCTIONAL SORT --- */}
      <section className="pt-24 container mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
           <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
             {categories.map((cat) => (
               <Button 
                key={cat.name}
                variant={activeCategory === cat.name ? "default" : "outline"}
                className={`rounded-full px-6 font-bold flex items-center gap-2 transition-all ${activeCategory === cat.name ? 'bg-blue-600 shadow-lg shadow-blue-200' : 'text-slate-500 border-slate-200'}`}
                onClick={() => setActiveCategory(cat.name)}
               >
                 {cat.icon} {cat.name}
               </Button>
             ))}
           </div>

           {/* --- FUNCTIONAL SORT SELECT --- */}
           <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Filter className="h-3 w-3" /> Sort By
              </span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer text-sm"
              >
                <option value="Newest Arrivals">Newest Arrivals</option>
                <option value="Price: Low to High">Price: Low to High</option>
                <option value="Most Powerful">Most Powerful</option>
              </select>
           </div>
        </div>

        {/* --- 4. PRODUCT GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 min-h-[400px]">
            {loading ? (
              [1,2,3,4,5,6].map(i => <div key={i} className="h-[500px] bg-slate-50 rounded-[3rem] animate-pulse" />)
            ) : processedProducts.length > 0 ? (
              processedProducts.map((product: any) => {
                 const discount = calculateDiscount(product.price, product.old_price);
                 return (
                    <Card key={product.id} className="group border-none shadow-xl shadow-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 rounded-[2.5rem] overflow-hidden bg-white animate-in fade-in zoom-in-95">
                       <div className="h-72 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                          {product.image_url ? (
                             <img src={product.image_url} alt={product.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          ) : ( <Laptop className="h-24 w-24 text-slate-200" /> )}
                          {discount && <div className="absolute top-6 left-6 bg-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">SAVE {discount}%</div>}
                          <button className="absolute bottom-6 right-6 p-3 bg-white/80 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-600 hover:text-white shadow-sm" title="Compare Specs">
                            <ArrowLeftRight className="h-4 w-4" />
                          </button>
                       </div>
                       <CardHeader className="pt-8">
                          <div className="flex items-center gap-2 mb-2">
                             {[1,2,3,4,5].map(i => <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />)}
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Verified Logic (4.9)</span>
                          </div>
                          <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">{product.name}</CardTitle>
                          <p className="text-slate-400 text-sm font-medium line-clamp-2 mt-2 leading-relaxed">{product.description}</p>
                       </CardHeader>
                       <CardContent className="pb-8">
                          <div className="flex items-baseline gap-3">
                             <span className="text-3xl font-black text-slate-900">₦{product.price.toLocaleString()}</span>
                             {product.old_price && <span className="text-lg font-bold text-slate-300 line-through">₦{product.old_price.toLocaleString()}</span>}
                          </div>
                       </CardContent>
                       <CardFooter className="p-0 border-t bg-slate-50/50">
                          <Link href="/login" className="w-full">
                             <Button variant="ghost" className="w-full h-16 rounded-none text-blue-600 font-black uppercase tracking-widest text-xs hover:bg-blue-600 hover:text-white transition-all">
                                Authenticate & Deploy <ArrowRight className="ml-2 h-4 w-4" />
                             </Button>
                          </Link>
                       </CardFooter>
                    </Card>
                 );
              })
            ) : (
              <div className="col-span-full py-32 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 animate-in fade-in slide-in-from-top-4">
                  <SearchX className="h-20 w-20 text-slate-200 mx-auto mb-6" />
                  <h3 className="text-2xl font-black text-slate-900 uppercase">No Matches Found</h3>
                  <p className="text-slate-500 font-medium mt-2 max-w-sm mx-auto">Try adjusting your filters or search terms to find available hardware.</p>
                  <Button variant="link" onClick={() => {setActiveCategory("All"); router.push('/');}} className="text-blue-600 font-bold mt-4 uppercase text-xs tracking-widest">Clear All Filters</Button>
              </div>
            )}
        </div>
      </section>

      {/* --- 5. FLASH SALE BANNER --- */}
      <section className="container mx-auto px-4 py-24">
        <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 rounded-[3.5rem] p-8 md:p-20 text-white relative overflow-hidden shadow-2xl shadow-blue-900/20">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-6 text-blue-300">
                <Clock className="h-5 w-5 animate-pulse" />
                <span className="font-black uppercase tracking-[0.4em] text-[10px]">Strategic Stock Deployment</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-none">UP TO 35% OFF <br/> <span className="text-blue-400">CORE i9</span> SYSTEMS</h2>
              <p className="text-blue-100 font-medium text-lg lg:text-xl mb-10 leading-relaxed">Maximize your R&D output with enterprise-grade hardware. Inventory is limited. Deployment expires in 48 hours.</p>
              <Link href="/register"><Button className="bg-white text-blue-900 hover:bg-blue-50 font-black px-12 h-16 rounded-2xl text-lg shadow-xl">CLAIM DEPLOYMENT</Button></Link>
            </div>
            <div className="hidden lg:block relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full"></div>
              <Laptop className="h-80 w-80 relative z-10 rotate-12 drop-shadow-2xl text-blue-200/20" />
            </div>
          </div>
          <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 pointer-events-none"></div>
        </div>
      </section>

      {/* --- 6. SOCIAL PROOF --- */}
      <section className="bg-slate-50 py-32 border-y border-slate-100">
        <div className="container mx-auto px-4">
           <div className="text-center mb-20">
              <Badge className="bg-slate-200 text-slate-600 mb-4 border-none font-bold uppercase tracking-widest text-[9px]">The Professional Choice</Badge>
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-4 text-slate-900">Verified Deployment Reviews</h2>
              <p className="text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">The primary hardware partner for West Africa&apos;s most advanced technical laboratories.</p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { name: "Chidi Okafor", role: "CTO @ FintechHub", text: "Emmy Core is the only local supplier that delivers actual peak-performance machines. No throttling, no excuses." },
                { name: "Sarah Jenkins", role: "Lead Architect", text: "The 24-month local warranty is a game changer. Knowing I have local experts for a $3,000 machine is peace of mind." },
                { name: "Mustapha Yusuf", role: "Senior Dev", text: "Fastest deployment I've seen. Ordered an RTX workstation in Lagos and it was in my lab the next morning." }
              ].map((t, i) => (
                <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white hover:border-blue-100 transition-all group">
                  <div className="flex gap-1 mb-6 text-yellow-400 group-hover:scale-105 transition-transform"><Star className="h-4 w-4 fill-current"/><Star className="h-4 w-4 fill-current"/><Star className="h-4 w-4 fill-current"/><Star className="h-4 w-4 fill-current"/><Star className="h-4 w-4 fill-current"/></div>
                  <p className="text-slate-600 italic font-medium mb-8 leading-relaxed">&quot;{t.text}&quot;</p>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-200">{t.name[0]}</div>
                    <div><p className="font-black text-slate-900 text-sm tracking-tight">{t.name}</p><p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{t.role}</p></div>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* --- 7. FAQ SECTION --- */}
      <section className="container mx-auto px-4 py-32">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center mb-20">
            <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter mb-4">Hardware FAQ</h2>
            <div className="h-1.5 w-20 bg-blue-600 rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
            {[
              { q: "Are these laptops factory new?", a: "Absolutely. Every unit is factory-sealed and verified with the manufacturer's original security tape and warranty." },
              { q: "Do you ship to Abuja and PH?", a: "Yes. We operate a private logistics network offering 24-hour express delivery to major Nigerian technical hubs." },
              { q: "What covers the 2-year warranty?", a: "It covers all logic board failures, display defects, and battery health. Repairs are handled by our local certified labs." },
              { q: "Can I request custom RAM?", a: "Most workstations support custom configurations. Contact our Hub support for specialized high-bandwidth memory upgrades." }
            ].map((faq, i) => (
              <div key={i} className="group p-6 rounded-3xl bg-white hover:bg-slate-50 transition-colors">
                <h4 className="font-black text-lg mb-3 flex items-center gap-3 text-slate-900 tracking-tight">
                  <HelpCircle className="h-5 w-5 text-blue-600" /> {faq.q}
                </h4>
                <p className="text-slate-500 font-medium leading-relaxed pl-8">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 8. NEWSLETTER --- */}
      <section className="container mx-auto px-4 py-24">
        <div className="bg-slate-950 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter">Join the Core <span className="text-blue-600">Insider</span></h2>
            <p className="text-slate-400 font-medium text-lg lg:text-xl mb-12">Get priority access to restricted inventory drops and exclusive seasonal hardware credits.</p>
            <form className="flex flex-col sm:flex-row gap-4">
              <Input placeholder="Enter corporate email address" className="h-16 bg-white/5 border-white/10 text-white rounded-2xl px-8 focus:ring-blue-600 text-lg" />
              <Button className="h-16 px-12 rounded-2xl bg-blue-600 hover:bg-blue-700 font-black uppercase tracking-widest shadow-xl shadow-blue-500/20">SUBSCRIBE</Button>
            </form>
          </div>
          {/* Subtle Decorative Gradient */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -mr-48 -mt-48"></div>
        </div>
      </section>

      {/* --- 9. FOOTER --- */}
      <footer className="bg-white border-t pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-16 mb-32">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-blue-600 p-2.5 rounded-xl"><Laptop className="h-7 w-7 text-white" /></div>
                <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase italic">EMMY<span className="text-blue-600">CORE</span></span>
              </div>
              <p className="text-slate-500 font-medium max-w-sm mb-10 leading-relaxed">The global standard for high-performance workstations and localized technical mastery. Engineered for the 1%.</p>
              <div className="flex gap-5">
                <Link href="#" className="p-3 bg-slate-100 rounded-2xl hover:bg-blue-600 hover:text-white transition-all"><Facebook className="h-5 w-5"/></Link>
                <Link href="#" className="p-3 bg-slate-100 rounded-2xl hover:bg-blue-600 hover:text-white transition-all"><Twitter className="h-5 w-5"/></Link>
                <Link href="#" className="p-3 bg-slate-100 rounded-2xl hover:bg-blue-600 hover:text-white transition-all"><Instagram className="h-5 w-5"/></Link>
              </div>
            </div>
            <div>
              <h5 className="font-black text-xs uppercase tracking-[0.2em] text-slate-900 mb-8">Marketplace</h5>
              <ul className="space-y-5 text-sm font-bold text-slate-400 uppercase tracking-widest">
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Workstations</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Gaming Labs</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Enterprise</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-black text-xs uppercase tracking-[0.2em] text-slate-900 mb-8">Support</h5>
              <ul className="space-y-5 text-sm font-bold text-slate-400 uppercase tracking-widest">
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Shipping Hub</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Local Warranty</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Expert Help</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-black text-xs uppercase tracking-[0.2em] text-slate-900 mb-8">Company</h5>
              <ul className="space-y-5 text-sm font-bold text-slate-400 uppercase tracking-widest">
                <li><Link href="#" className="hover:text-blue-600 transition-colors">About Hub</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Contact Labs</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Legal Core</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-16 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-slate-400 text-[10px] font-black tracking-[0.3em] uppercase">© 2026 EMMY CORE HARDWARE. BUILT BY SYNAPSE.</p>
            <div className="flex gap-8 text-[10px] font-black text-slate-300 uppercase tracking-widest">
               <span>Lagos Hub</span>
               <span>Abuja Hub</span>
               <span>Port Harcourt Hub</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}