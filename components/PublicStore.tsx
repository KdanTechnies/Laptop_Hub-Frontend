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
  Briefcase, Rocket, Facebook, Twitter, Instagram, Linkedin, Mail, Loader2,
  CheckCircle, MessageSquare, Globe
} from 'lucide-react';
import Link from 'next/link';

export default function PublicStore() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Newest Arrivals");
  const router = useRouter();

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

  const processedProducts = useMemo(() => {
    let result = products.filter((p: any) => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm) || 
                           p.description.toLowerCase().includes(searchTerm);
      const matchesCategory = activeCategory === "All" || 
                             p.description.toLowerCase().includes(activeCategory.toLowerCase());
      return matchesSearch && matchesCategory;
    });

    if (sortBy === "Price: Low to High") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "Most Powerful") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "Newest Arrivals") {
      result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [products, searchTerm, activeCategory, sortBy]);

  const calculateDiscount = (price: number, oldPrice: number | null) => {
    if (!oldPrice || oldPrice <= price) return null;
    return Math.round(((oldPrice - price) / oldPrice) * 100);
  };

  return (
    <div className="bg-white selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      
      {/* --- 1. HERO SECTION --- */}
      <section className="relative pt-24 pb-32 lg:pt-32 lg:pb-48 bg-slate-950 text-white overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <Badge className="mb-8 bg-blue-600/10 text-blue-400 border-blue-500/20 px-4 py-1.5 rounded-full animate-pulse uppercase tracking-[0.2em] text-[10px] font-bold">
            Flash Sales Active: 18th Jan - 3rd Feb
          </Badge>
          <h1 className="text-6xl md:text-8xl lg:text-[110px] font-black tracking-tighter mb-8 leading-[0.85] animate-in fade-in slide-in-from-bottom-4 duration-700">
            BEYOND <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-400 italic">FAST.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-400 text-lg lg:text-xl mb-12 font-medium leading-relaxed">
            High-bandwidth laptops engineered for peak sustained performance. 
            Trusted by West Africa’s leading engineering teams and creative visionaries.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 font-bold px-10 h-16 rounded-2xl text-lg shadow-2xl shadow-blue-500/20 w-full sm:w-auto transition-all hover:scale-105 active:scale-95">
                Account<ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      </section>

      {/* --- 2. LIVE DISPATCH FEED (REAL-TIME SOCIAL PROOF) --- */}
      <section className="bg-white py-6 border-b border-slate-100 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex items-center gap-3 shrink-0">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Live Dispatch Feed</span>
            </div>
            
            <div className="flex-1 overflow-hidden whitespace-nowrap mask-fade-edges">
              <div className="flex gap-12 animate-marquee">
                {[
                  "RTX 4080 Workstation dispatched to Ikeja, Lagos",
                  "MacBook Pro M3 Max delivered to Maitama, Abuja",
                  "Dell Precision 7000 Series sent to Port Harcourt Hub",
                  "ThinkPad X1 Carbon dispatched to Lekki Phase 1",
                  "HP ZBook Fury delivered to University of Ibadan",
                  "Dell Latitude E7074 delivered to Aba",
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-tight">
                    <CheckCircle className="h-4 w-4 text-green-500" /> {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 3. TRUST STRIP --- */}
      <div className="relative -mt-8 z-20">
        <div className="container mx-auto px-4">
          <div className="bg-white border shadow-2xl rounded-[2.5rem] p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-5 justify-center md:justify-start">
               <div className="bg-blue-50 p-4 rounded-2xl"><Truck className="h-6 w-6 text-blue-600" /></div>
               <div><p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Logistics</p><p className="font-black text-slate-900">24hr Lagos Delivery</p></div>
            </div>
            <div className="flex items-center gap-5 justify-center border-y md:border-y-0 md:border-x py-6 md:py-0 border-slate-100">
               <div className="bg-blue-50 p-4 rounded-2xl"><ShieldCheck className="h-6 w-6 text-blue-600" /></div>
               <div><p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Assurance</p><p className="font-black text-slate-900">6-Months Local Warranty</p></div>
            </div>
            <div className="flex items-center gap-5 justify-center md:justify-end">
               <div className="bg-blue-50 p-4 rounded-2xl"><Zap className="h-6 w-6 text-blue-600" /></div>
               <div><p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Support</p><p className="font-black text-slate-900">Expert Remote Help</p></div>
            </div>
          </div>
        </div>
      </div>

      {/* --- 4. CATALOG SECTION --- */}
      <section className="pt-24 container mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
           <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
             {categories.map((cat) => (
               <Button 
                key={cat.name}
                variant={activeCategory === cat.name ? "default" : "outline"}
                className={`rounded-full px-8 h-12 font-black uppercase text-[10px] tracking-widest transition-all ${activeCategory === cat.name ? 'bg-blue-600 shadow-lg shadow-blue-200' : 'text-slate-500 border-slate-200 hover:border-blue-400'}`}
                onClick={() => setActiveCategory(cat.name)}
               >
                 {cat.icon} <span className="ml-2">{cat.name}</span>
               </Button>
             ))}
           </div>

           <div className="flex items-center gap-4 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 self-start lg:self-auto">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <Filter className="h-3 w-3" /> Sort
              </span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent font-black text-slate-900 focus:outline-none cursor-pointer text-xs uppercase tracking-tighter"
              >
                <option value="Newest Arrivals">Newest Arrivals</option>
                <option value="Price: Low to High">Price: Low to High</option>
                <option value="Most Powerful">Most Powerful</option>
              </select>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {loading ? (
              [1,2,3,4,5,6].map(i => <div key={i} className="h-[550px] bg-slate-50 rounded-[3rem] animate-pulse" />)
            ) : processedProducts.length > 0 ? (
              processedProducts.map((product: any) => {
                 const discount = calculateDiscount(product.price, product.old_price);
                 return (
                    <Card key={product.id} className="group border-none shadow-xl shadow-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 rounded-[2.5rem] overflow-hidden bg-white">
                       <div className="h-72 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                          {product.image_url ? (
                             <img src={product.image_url} alt={product.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          ) : ( <Laptop className="h-24 w-24 text-slate-200" /> )}
                          {discount && <div className="absolute top-6 left-6 bg-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">SAVE {discount}%</div>}
                          <button className="absolute bottom-6 right-6 p-4 bg-white/90 backdrop-blur-md rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-600 hover:text-white shadow-xl" title="Compare Hardware">
                            <ArrowLeftRight className="h-4 w-4" />
                          </button>
                       </div>
                       <CardHeader className="pt-8 px-8">
                          <div className="flex items-center gap-2 mb-3">
                             <div className="flex gap-0.5">
                                {[1,2,3,4,5].map(i => <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />)}
                             </div>
                             <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">(4.9)</span>
                          </div>
                          <CardTitle className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{product.name}</CardTitle>
                          <p className="text-slate-400 text-sm font-medium line-clamp-2 mt-3 leading-relaxed">{product.description}</p>
                       </CardHeader>
                       <CardContent className="pb-8 px-8">
                          <div className="flex items-baseline gap-3">
                             <span className="text-3xl font-black text-slate-900">₦{product.price.toLocaleString()}</span>
                             {product.old_price && <span className="text-lg font-bold text-slate-200 line-through decoration-slate-300/50">₦{product.old_price.toLocaleString()}</span>}
                          </div>
                       </CardContent>
                       <CardFooter className="p-0 border-t border-slate-50 bg-slate-50/50">
                          <Link href="/login" className="w-full">
                             <Button variant="ghost" className="w-full h-16 rounded-none text-blue-600 font-black uppercase tracking-widest text-[10px] hover:bg-blue-600 hover:text-white transition-all">
                                ADD TO CART <ArrowRight className="ml-2 h-4 w-4" />
                             </Button>
                          </Link>
                       </CardFooter>
                    </Card>
                 );
              })
            ) : (
              <div className="col-span-full py-32 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                  <SearchX className="h-20 w-20 text-slate-200 mx-auto mb-6" />
                  <h3 className="text-2xl font-black text-slate-900 uppercase">Inventory Check Failed</h3>
                  <p className="text-slate-500 font-medium mt-2 max-w-sm mx-auto tracking-tight">No machines currently match your configuration. Try clearing your filters.</p>
                  <Button variant="link" onClick={() => {setActiveCategory("All"); router.push('/');}} className="text-blue-600 font-black mt-6 uppercase text-[10px] tracking-[0.2em]">Reset Marketplace</Button>
              </div>
            )}
        </div>
      </section>

      {/* --- 5. HARDWARE IN ACTION (LAGOS RTX QUOTE) --- */}
      <section className="container mx-auto px-4 py-32">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="aspect-square bg-slate-950 rounded-[4rem] overflow-hidden group shadow-2xl relative">
              <img 
                src="https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1000&auto=format&fit=crop" 
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000" 
                alt="RTX Workstation"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
              <div className="absolute bottom-12 left-12 right-12">
                  <div className="bg-blue-600 w-fit p-4 rounded-3xl mb-8 shadow-xl shadow-blue-500/40">
                    <MessageSquare className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-4xl font-black text-white leading-[1.1] mb-6 italic tracking-tighter">
                    &quot;Destroy your build times.&apos;Secure the hardware that outpaces your vision. Verified local stock in our hubs—buy today, deploy tomorrow&quot;
                  </h3>
                  <div className="flex items-center gap-4">
                     <div className="h-1 w-10 bg-blue-600"></div>
                     <p className="text-blue-400 font-black uppercase tracking-[0.2em] text-[10px]">Verified Lead Engineer @ Lagos </p>
                  </div>
              </div>
            </div>
          </div>

          <div className="space-y-12">
            <div>
              <Badge className="bg-blue-100 text-blue-700 border-none px-4 py-1 font-black text-[9px] uppercase tracking-widest mb-6">Local Operations</Badge>
              <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase leading-[0.9] mb-8">
                LOCAL STOCK. <br/> <span className="text-blue-600 italic underline decoration-blue-600/20">NO WAIT TIME.</span>
              </h2>
              <p className="text-slate-500 text-xl font-medium leading-relaxed">
                We don’t do "pre-orders" from abroad. Every Laptop listed on our site is physically sitting in our climate-controlled hubs in Lagos, Abuja, and PH. 
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:border-blue-200 transition-colors">
                 <p className="text-5xl font-black text-slate-900 mb-2 tracking-tighter">24h</p>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Laptop<br/>Delivery Service.</p>
              </div>
              <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:border-blue-200 transition-colors">
                 <p className="text-5xl font-black text-slate-900 mb-2 tracking-tighter">100%</p>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Verified Factory <br/> Packaged</p>
              </div>
            </div>
            
            <Button asChild className="h-20 px-12 rounded-3xl bg-slate-950 text-white font-black hover:bg-blue-600 transition-all uppercase tracking-widest shadow-2xl active:scale-95 group">
            <Link href="/register">
              Get A Laptop Today! 
              <Globe className="ml-3 h-5 w-5 group-hover:rotate-12 transition-transform" />
            </Link>
          </Button>
          </div>
        </div>
      </section>

      {/* --- 6. FLASH SALE --- */}
      <section className="container mx-auto px-4 py-24">
        <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 rounded-[4rem] p-10 md:p-24 text-white relative overflow-hidden shadow-[0_0_100px_rgba(37,99,235,0.2)]">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16 text-center lg:text-left">
            <div className="max-w-2xl">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-8 text-blue-300">
                <Clock className="h-6 w-6 animate-pulse" />
                <span className="font-black uppercase tracking-[0.5em] text-[10px]">Flash Sales</span>
              </div>
              <h2 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-none">UP TO 35% OFF <br/> <span className="text-blue-400 italic">CORE i9</span> PROS</h2>
              <p className="text-blue-100 font-medium text-lg lg:text-2xl mb-12 leading-relaxed opacity-80">Stop waiting for shipments from abroad. The raw power you need is already here. High-bandwidth laptops, factory-sealed, and ready for immediate Lagos delivery.</p>
              <Link href="/register">
                <Button className="bg-white text-blue-900 hover:bg-blue-50 font-black px-12 h-18 rounded-2xl text-xl shadow-2xl uppercase tracking-widest">CLAIM</Button>
              </Link>
            </div>
            <div className="hidden lg:block relative group">
              <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full group-hover:bg-blue-500/40 transition-all duration-700"></div>
              <Laptop className="h-[450px] w-[450px] relative z-10 rotate-12 drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)] text-white/5 transition-transform duration-1000 group-hover:rotate-[15deg] group-hover:scale-110" />
            </div>
          </div>
        </div>
      </section>

      {/* --- 7. FAQ --- */}
      <section className="container mx-auto px-4 py-32">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col items-center text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter mb-6 leading-none">Hardware FAQ</h2>
            <div className="h-2 w-24 bg-blue-600 rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            {[
              { q: "Are these laptops factory new?", a: "Every unit is factory-sealed and verified with the manufacturer's original security tape and internal local warranty documentation." },
              { q: "Do you ship outside Lagos?", a: "Yes. We operate a logistics network offering 24-48hr express delivery to Abuja, PH, and all major technical hubs in Nigeria." },
              { q: "How does the warranty work?", a: "It covers all mainboard and display failures. Repairs are handled at our authorized local labs by certified engineers." },
              { q: "Can I request custom RAM?", a: "Absolutely. We specialize in high-bandwidth upgrades. Contact our Hub support for specialized workstation configurations." }
            ].map((faq, i) => (
              <div key={i} className="group p-10 rounded-[2.5rem] bg-slate-50/50 hover:bg-white border border-transparent hover:border-slate-100 transition-all hover:shadow-xl">
                <h4 className="font-black text-xl mb-4 flex items-center gap-4 text-slate-900 tracking-tight leading-tight">
                  <HelpCircle className="h-6 w-6 text-blue-600 shrink-0" /> {faq.q}
                </h4>
                <p className="text-slate-500 font-medium leading-relaxed pl-10 opacity-80">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* --- 9. FOOTER --- */}
      <footer className="bg-white border-t pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-20 mb-40">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-10">
                <div className="bg-blue-600 p-3 rounded-2xl"><Laptop className="h-8 w-8 text-white" /></div>
                <span className="text-3xl font-black tracking-tighter text-slate-900 uppercase italic leading-none">EMMY <span className="text-blue-600">LAPTOPHUB</span></span>
              </div>
              <p className="text-slate-500 font-medium text-lg max-w-sm mb-12 leading-relaxed opacity-70">The global standard for high-performance laptops and localized technical mastery. Engineered for the 1%.</p>
             <div className="flex gap-6">
  {/* Facebook */}
              <Link 
                href="https://facebook.com/emmylaptophub" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Follow Emmy Laptop Hub on Facebook"
                className="p-4 bg-slate-100 rounded-3xl hover:bg-blue-600 hover:text-white transition-all hover:-translate-y-1 shadow-sm group"
              >
                <Facebook className="h-6 w-6" />
              </Link>

              {/* Twitter / X */}
              <Link 
                href="https://twitter.com/emmylaptophub" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Follow Emmy laptophub on X"
                className="p-4 bg-slate-100 rounded-3xl hover:bg-blue-600 hover:text-white transition-all hover:-translate-y-1 shadow-sm group"
              >
                <Twitter className="h-6 w-6" />
              </Link>

              {/* Instagram */}
              <Link 
                href="https://instagram.com/emmylaptophub" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Follow Emmy laptophub on Instagram"
                className="p-4 bg-slate-100 rounded-3xl hover:bg-blue-600 hover:text-white transition-all hover:-translate-y-1 shadow-sm group"
              >
                <Instagram className="h-6 w-6" />
              </Link>

              {/* LinkedIn - Highly recommended for a "Huge Company" vibe */}
              <Link 
                href="https://linkedin.com/company/emmylaptophub" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Follow Emmy laptophub on LinkedIn"
                className="p-4 bg-slate-100 rounded-3xl hover:bg-blue-600 hover:text-white transition-all hover:-translate-y-1 shadow-sm group"
              >
                <Linkedin className="h-6 w-6" />
              </Link>
            </div>
            </div>
            <div>
              <h5 className="font-black text-[10px] uppercase tracking-[0.4em] text-slate-900 mb-10">Marketplace</h5>
              <ul className="space-y-6 text-sm font-black text-slate-400 uppercase tracking-widest">
                <li><Link href="#" className="hover:text-blue-600 transition-all">Workstations</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-all">Gaming Labs</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-all">Enterprise</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-black text-[10px] uppercase tracking-[0.4em] text-slate-900 mb-10">Logistics</h5>
              <ul className="space-y-6 text-sm font-black text-slate-400 uppercase tracking-widest">
                <li><Link href="#" className="hover:text-blue-600 transition-all">Shipping Hub</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-all">Warranty Check</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-all">Hub Support</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-black text-[10px] uppercase tracking-[0.4em] text-slate-900 mb-10">Company</h5>
              <ul className="space-y-6 text-sm font-black text-slate-400 uppercase tracking-widest">
                <li><Link href="#" className="hover:text-blue-600 transition-all">About Hub</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-all">Contact Labs</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-all">Legal Core</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-20 flex flex-col md:flex-row items-center justify-between gap-10">
            <p className="text-slate-400 text-[10px] font-black tracking-[0.5em] uppercase opacity-50">© 2026 EMMY LAPTOP HUB. BUILT BY SYNAPSE.</p>
            <div className="flex flex-wrap justify-center gap-10 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
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