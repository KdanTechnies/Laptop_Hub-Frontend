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
  Filter, ArrowLeftRight, Clock, MessageSquare, ChevronDown,
  CheckCircle, Facebook, Twitter, Instagram, Linkedin, Mail,
  HelpCircle, Sparkles, Monitor, Briefcase, Rocket
} from 'lucide-react';
import Link from 'next/link';

export default function PublicStore() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const router = useRouter();

  // --- SEARCH & FILTER LOGIC ---
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

  const filteredProducts = useMemo(() => {
    return products.filter((p: any) => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm) || p.description.toLowerCase().includes(searchTerm);
      const matchesCategory = activeCategory === "All" || p.description.toLowerCase().includes(activeCategory.toLowerCase());
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, activeCategory]);

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
              Deployment Center: Q1 2026 Inventory
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
              <Button variant="outline" size="lg" className="h-16 px-10 rounded-2xl border-slate-700 text-white hover:bg-slate-900 w-full sm:w-auto font-bold">
                View Specs
              </Button>
            </div>
          </div>
        </div>
        {/* Animated Background Mesh */}
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

      {/* --- 3. CATEGORIES & FILTER --- */}
      <section className="pt-24 container mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
           <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
             {categories.map((cat) => (
               <Button 
                key={cat.name}
                variant={activeCategory === cat.name ? "default" : "outline"}
                className={`rounded-full px-6 font-bold flex items-center gap-2 ${activeCategory === cat.name ? 'bg-blue-600' : 'text-slate-500 border-slate-200'}`}
                onClick={() => setActiveCategory(cat.name)}
               >
                 {cat.icon} {cat.name}
               </Button>
             ))}
           </div>
           <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-slate-400 flex items-center gap-2"><Filter className="h-4 w-4" /> Sort:</span>
              <select className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer">
                <option>Newest Arrivals</option>
                <option>Price: Low to High</option>
                <option>Most Powerful</option>
              </select>
           </div>
        </div>

        {/* --- 4. PRODUCT GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {loading ? (
              [1,2,3,4,5,6].map(i => <div key={i} className="h-[500px] bg-slate-50 rounded-[3rem] animate-pulse" />)
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product: any) => {
                 const discount = calculateDiscount(product.price, product.old_price);
                 return (
                    <Card key={product.id} className="group border-none shadow-xl shadow-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 rounded-[2.5rem] overflow-hidden bg-white">
                       <div className="h-72 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                          {product.image_url ? (
                             <img src={product.image_url} alt={product.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          ) : ( <Laptop className="h-24 w-24 text-slate-200" /> )}
                          {discount && <div className="absolute top-6 left-6 bg-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full">SAVE {discount}%</div>}
                          <button className="absolute bottom-6 right-6 p-3 bg-white/80 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-600 hover:text-white" title="Compare">
                            <ArrowLeftRight className="h-4 w-4" />
                          </button>
                       </div>
                       <CardHeader className="pt-8">
                          <div className="flex items-center gap-2 mb-2">
                             {[1,2,3,4,5].map(i => <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />)}
                             <span className="text-[10px] font-bold text-slate-400">(4.9/5)</span>
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
                             <Button variant="ghost" className="w-full h-16 rounded-none text-blue-600 font-black uppercase tracking-widest text-xs hover:bg-blue-50 transition-colors">
                                Authenticate & Buy <ArrowRight className="ml-2 h-4 w-4" />
                             </Button>
                          </Link>
                       </CardFooter>
                    </Card>
                 );
              })
            ) : <div className="col-span-full py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed">
                  <SearchX className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-bold text-xl">No match found in current inventory.</p>
                </div>}
        </div>
      </section>

      {/* --- 5. FLASH SALE BANNER --- */}
      <section className="container mx-auto px-4 py-24">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-900 rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-4 text-blue-200">
                <Clock className="h-5 w-5 animate-pulse" />
                <span className="font-black uppercase tracking-[0.3em] text-xs">Limited Time Deployment</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">UP TO 35% OFF <br/> ON CORE i9 SYSTEMS</h2>
              <p className="text-blue-100 font-medium text-lg mb-8">Maximize your R&D output with extreme performance hardware. Offer expires in 48 hours.</p>
              <Link href="/register"><Button className="bg-white text-blue-900 hover:bg-blue-50 font-black px-10 h-14 rounded-xl">CLAIM DEAL</Button></Link>
            </div>
            <div className="hidden lg:block rotate-12 opacity-50">
              <Laptop className="h-64 w-64" />
            </div>
          </div>
          <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12"></div>
        </div>
      </section>

      {/* --- 6. SOCIAL PROOF / TESTIMONIALS --- */}
      <section className="bg-slate-50 py-24">
        <div className="container mx-auto px-4">
           <div className="text-center mb-16">
              <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Verified Deployment Reviews</h2>
              <p className="text-slate-500 font-medium">Primary hardware provider for West Africa&apos;s leading tech labs.</p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Chidi Okafor", role: "CTO @ FintechHub", text: "Emmy Core is the only local supplier that delivers actual peak-performance machines. No throttling, no excuses." },
                { name: "Sarah Jenkins", role: "Lead Architect", text: "The 24-month local warranty is a game changer. Knowing I have local experts for a $3,000 machine is peace of mind." },
                { name: "Mustapha Yusuf", role: "Senior Dev", text: "Fastest deployment I've seen. Ordered an RTX workstation in Lagos and it was in my lab the next morning." }
              ].map((t, i) => (
                <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                  <div className="flex gap-1 mb-4 text-yellow-500"><Star className="h-4 w-4 fill-current"/><Star className="h-4 w-4 fill-current"/><Star className="h-4 w-4 fill-current"/><Star className="h-4 w-4 fill-current"/><Star className="h-4 w-4 fill-current"/></div>
                  <p className="text-slate-600 italic font-medium mb-6">&quot;{t.text}&quot;</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-xs">{t.name[0]}</div>
                    <div><p className="font-bold text-slate-900 text-sm">{t.name}</p><p className="text-xs text-slate-400 font-bold">{t.role}</p></div>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* --- 7. FAQ SECTION --- */}
      <section className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-16 uppercase tracking-tight">Hardware FAQ</h2>
          <div className="space-y-6">
            {[
              { q: "Are these laptops brand new?", a: "Every unit at Emmy Core is factory-sealed and verified with the manufacturer's original warranty." },
              { q: "Do you deliver to Abuja and Port Harcourt?", a: "Yes. We offer nationwide express shipping with real-time GPS tracking on all workstation orders." },
              { q: "Can I upgrade RAM later?", a: "Most of our workstation models support manual expansion. Contact our tech team for compatible modules." }
            ].map((faq, i) => (
              <div key={i} className="border-b border-slate-100 pb-6">
                <h4 className="font-black text-lg mb-2 flex items-center gap-3"><HelpCircle className="h-5 w-5 text-blue-600" /> {faq.q}</h4>
                <p className="text-slate-500 font-medium pl-8">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 8. NEWSLETTER --- */}
      <section className="container mx-auto px-4 py-24">
        <div className="bg-slate-900 rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight">Join the Core <span className="text-blue-500">Insider</span></h2>
            <p className="text-slate-400 font-medium text-lg mb-10">Get instant access to private inventory drops and custom workstation builds.</p>
            <form className="flex flex-col sm:flex-row gap-3">
              <Input placeholder="Enter corporate email" className="h-16 bg-white/5 border-white/10 text-white rounded-2xl px-6 focus:ring-blue-500" />
              <Button className="h-16 px-10 rounded-2xl bg-blue-600 hover:bg-blue-700 font-black">SUBSCRIBE</Button>
            </form>
          </div>
        </div>
      </section>

      {/* --- 9. FOOTER --- */}
      <footer className="bg-white border-t pt-20 pb-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-20">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-blue-600 p-2 rounded-lg"><Laptop className="h-6 w-6 text-white" /></div>
                <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">EMMY<span className="text-blue-600">CORE</span></span>
              </div>
              <p className="text-slate-400 font-medium max-w-xs mb-8">The standard for professional-grade workstations and local technical mastery.</p>
              <div className="flex gap-4">
                <Link href="#" className="p-2 bg-slate-50 rounded-lg hover:text-blue-600 transition-colors"><Facebook className="h-5 w-5"/></Link>
                <Link href="#" className="p-2 bg-slate-50 rounded-lg hover:text-blue-600 transition-colors"><Twitter className="h-5 w-5"/></Link>
                <Link href="#" className="p-2 bg-slate-50 rounded-lg hover:text-blue-600 transition-colors"><Instagram className="h-5 w-5"/></Link>
              </div>
            </div>
            <div>
              <h5 className="font-black text-xs uppercase tracking-widest text-slate-900 mb-6">Marketplace</h5>
              <ul className="space-y-4 text-sm font-bold text-slate-400 uppercase tracking-tight">
                <li><Link href="#" className="hover:text-blue-600">Workstations</Link></li>
                <li><Link href="#" className="hover:text-blue-600">Gaming Labs</Link></li>
                <li><Link href="#" className="hover:text-blue-600">Exchanges</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-black text-xs uppercase tracking-widest text-slate-900 mb-6">Assistance</h5>
              <ul className="space-y-4 text-sm font-bold text-slate-400 uppercase tracking-tight">
                <li><Link href="#" className="hover:text-blue-600">Shipping Policy</Link></li>
                <li><Link href="#" className="hover:text-blue-600">Warranty Check</Link></li>
                <li><Link href="#" className="hover:text-blue-600">Hub Support</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-black text-xs uppercase tracking-widest text-slate-900 mb-6">Company</h5>
              <ul className="space-y-4 text-sm font-bold text-slate-400 uppercase tracking-tight">
                <li><Link href="#" className="hover:text-blue-600">Lagos Hub</Link></li>
                <li><Link href="#" className="hover:text-blue-600">Abuja Hub</Link></li>
                <li><Link href="#" className="hover:text-blue-600">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-10 text-center">
            <p className="text-slate-300 text-xs font-black tracking-widest uppercase">© 2026 EMMY CORE HARDWARE. BUILT BY SYNAPSE.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}