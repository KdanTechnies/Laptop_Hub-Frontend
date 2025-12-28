"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { 
  PackagePlus, Trash2, Laptop, LayoutList, 
  Image as ImageIcon, Video, Loader2, ShieldAlert
} from 'lucide-react';

export default function AdminDashboard() {
  const { token, isAdmin } = useAuth();
  const router = useRouter();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({ 
    name: '', 
    description: '', 
    price: '', 
    old_price: '', 
    stock: '', 
    image_url: '', 
    video_url: '' 
  });

  // --- SECURITY GUARD ---
  // If the user isn't an admin, kick them out before the page even renders
  useEffect(() => {
    // Only run check if the store has finished hydrating/initializing
    const checkAuth = () => {
      if (!token) {
        router.push('/login');
        return;
      }
      if (!isAdmin) {
        toast.error("Access Denied: Admin privileges required");
        router.push('/');
        return;
      }
      fetchProducts();
    };

    checkAuth();
  }, [token, isAdmin, router]);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // DATA SANITIZATION: Ensure correct types for the Backend
      const payload = { 
        name: form.name,
        description: form.description,
        price: parseFloat(form.price.toString()) || 0,
        old_price: form.old_price ? parseFloat(form.old_price.toString()) : null,
        stock: parseInt(form.stock.toString()) || 0,
        image_url: form.image_url.trim() === "" ? null : form.image_url,
        video_url: form.video_url.trim() === "" ? null : form.video_url
      };
      
      await api.post('/admin/products', payload);
      toast.success("Laptop successfully deployed to marketplace!");
      
      setForm({ name: '', description: '', price: '', old_price: '', stock: '', image_url: '', video_url: '' });
      fetchProducts();
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Action failed";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteProduct = async (id: number) => {
    if(!confirm("Are you sure? This will permanently remove the item.")) return;
    try {
      await api.delete(`/admin/products/${id}`);
      toast.info("Product removed");
      fetchProducts();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  // Prevent UI flickering while checking security
  if (!token || !isAdmin) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-50">
        <ShieldAlert className="h-12 w-12 text-red-500 mb-4" />
        <p className="font-bold text-slate-900 text-lg">Verifying Admin Clearance...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 min-h-screen bg-[#fafafa]">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 p-2.5 rounded-xl shadow-lg">
            <LayoutList className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Control Center</h1>
            <p className="text-sm text-slate-500 font-bold">Invenotry & Stock Management</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* --- FORM SECTION --- */}
        <Card className="lg:col-span-4 h-fit border-none shadow-2xl rounded-[2rem] overflow-hidden">
          <CardHeader className="bg-blue-600 text-white p-6">
            <CardTitle className="flex items-center gap-2 text-lg font-black uppercase tracking-widest">
              <PackagePlus className="h-5 w-5" /> Deploy Item
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400">Model Name</label>
                <Input value={form.name} className="h-12 border-none bg-slate-50 rounded-xl" onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Razer Blade 16" required />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400">Description</label>
                <textarea 
                  className="w-full min-h-[80px] p-3 text-sm rounded-xl border-none bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={form.description} 
                  onChange={e => setForm({...form, description: e.target.value})} 
                  placeholder="Specs: Core i9, 32GB RAM..." 
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Price ($)</label>
                  <Input type="number" className="h-12 border-none bg-slate-50 rounded-xl" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Old Price</label>
                  <Input type="number" className="h-12 border-none bg-slate-50 rounded-xl" value={form.old_price} onChange={e => setForm({...form, old_price: e.target.value})} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400">Stock Units</label>
                <Input type="number" className="h-12 border-none bg-slate-50 rounded-xl" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} required />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1">
                  <ImageIcon className="h-3 w-3" /> Image Link
                </label>
                <Input value={form.image_url} className="h-12 border-none bg-slate-50 rounded-xl" onChange={e => setForm({...form, image_url: e.target.value})} placeholder="Direct image address" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1">
                  <Video className="h-3 w-3" /> Video Link
                </label>
                <Input value={form.video_url} className="h-12 border-none bg-slate-50 rounded-xl" onChange={e => setForm({...form, video_url: e.target.value})} placeholder="Showcase URL" />
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-100 mt-4 transition-all active:scale-95"
              >
                {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : "Publish Item"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* --- LIST SECTION --- */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-[2rem] border shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="p-6 text-[10px] font-black uppercase text-slate-500">Inventory Item</th>
                  <th className="p-6 text-[10px] font-black uppercase text-slate-500">Valuation</th>
                  <th className="p-6 text-[10px] font-black uppercase text-slate-500 text-center">Status</th>
                  <th className="p-6 text-[10px] font-black uppercase text-slate-500 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan={4} className="py-20 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" /></td></tr>
                ) : products.map((p: any) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden border">
                          {p.image_url ? (
                            <img src={p.image_url} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <Laptop className="h-5 w-5 text-slate-300" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">{p.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{p.stock} Units Left</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="font-black text-blue-600 text-lg">${p.price.toLocaleString()}</span>
                    </td>
                    <td className="p-6 text-center">
                      <div className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {p.stock > 0 ? 'READY' : 'DEPLETED'}
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <Button variant="ghost" size="icon" onClick={() => deleteProduct(p.id)} className="text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}