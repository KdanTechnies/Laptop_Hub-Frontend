"use client"
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { 
  Trash2, 
  CreditCard, 
  Laptop, 
  Loader2, 
  ShieldCheck, 
  ArrowRight,
  ShoppingBag
} from 'lucide-react';
import { toast } from 'sonner';

export default function CartPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchCart = async () => {
    try {
      const res = await api.get('/cart');
      setItems(res.data);
    } catch (err) {
      toast.error("Failed to sync cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const deleteItem = async (id: number) => {
    try {
      await api.delete(`/cart/${id}`);
      toast.info("Item removed");
      fetchCart();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const calculateTotal = () => {
    return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  const handlePaystackPayment = async () => {
    setIsProcessing(true);
    try {
      // 1. Initialize payment on backend
      const res = await api.post('/pay/initialize');
      
      // 2. Paystack returns 'authorization_url'
      if (res.data.status && res.data.data.authorization_url) {
        toast.success("Secure checkout initialized...");
        // Redirect to Paystack Gateway
        window.location.href = res.data.data.authorization_url;
      } else {
        throw new Error("Initialization failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not connect to Paystack. Try again later.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return (
    <div className="flex h-[70vh] items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
    </div>
  );

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-600 p-2 rounded-xl text-white">
          <ShoppingBag className="h-6 w-6" />
        </div>
        <h2 className="text-3xl font-black tracking-tight text-slate-900">
          Your Cart <span className="text-blue-600">({items.length})</span>
        </h2>
      </div>
      
      {items.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[2.5rem] shadow-sm border-2 border-dashed border-slate-200">
          <Laptop className="h-20 w-20 text-slate-200 mx-auto mb-6" />
          <p className="text-slate-500 text-xl font-medium mb-8">Your shopping cart is empty</p>
          <Button onClick={() => window.location.href = '/'} className="bg-blue-600 h-12 px-8 rounded-full font-bold">
            Continue Shopping
          </Button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-10">
          {/* --- ITEM LIST --- */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => (
              <div key={item.item_id} className="group flex items-center gap-6 p-5 border-2 border-transparent bg-white rounded-3xl shadow-sm hover:border-blue-100 hover:shadow-md transition-all">
                {/* Product Image Fallback */}
                <div className="h-24 w-24 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden border">
                   <Laptop className="h-10 w-10 text-slate-300" />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-black text-xl text-slate-900 group-hover:text-blue-600 transition-colors">
                    {item.product_name}
                  </h3>
                  <div className="flex items-center gap-4 mt-1">
                    <p className="text-blue-600 font-black text-lg">₦{item.price.toLocaleString()}</p>
                    <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">QTY: {item.quantity}</span>
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  className="text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all" 
                  size="icon" 
                  onClick={() => deleteItem(item.item_id)}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>

          {/* --- ORDER SUMMARY --- */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 p-8 border-none rounded-[2.5rem] bg-white shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
              <h3 className="text-2xl font-black text-slate-900 mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>Subtotal</span>
                  <span>₦{calculateTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>Shipping</span>
                  <span className="text-green-600 font-bold uppercase text-xs">Free</span>
                </div>
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>Tax (VAT)</span>
                  <span>Included</span>
                </div>
                <div className="border-t pt-4 flex justify-between text-2xl font-black text-slate-900">
                  <span>Total</span>
                  <span>₦{calculateTotal().toLocaleString()}</span>
                </div>
              </div>

              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 h-16 text-lg font-black rounded-2xl shadow-xl shadow-blue-100 transition-all active:scale-95 flex items-center justify-center gap-3" 
                onClick={handlePaystackPayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    <CreditCard className="h-6 w-6" /> Pay with Paystack
                  </>
                )}
              </Button>

              <div className="mt-6 flex items-center justify-center gap-2 text-slate-400">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Secured by Paystack AES-256</span>
              </div>
              
              {/* Payment Support Icons */}
              <div className="mt-8 pt-6 border-t flex justify-center gap-4 opacity-30 grayscale hover:grayscale-0 transition-all">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/Mastercard-logo.svg" className="h-5 w-auto" alt="Mastercard" />
                 <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4 w-auto" alt="Visa" />
                 <img src="https://upload.wikimedia.org/wikipedia/commons/4/4b/Verve_Logo.svg" className="h-5 w-auto" alt="Verve" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}