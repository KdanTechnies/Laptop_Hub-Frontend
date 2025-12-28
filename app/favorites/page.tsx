"use client"
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Laptop, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);

  const fetchFavorites = async () => {
    try {
      const res = await api.get('/favorites');
      setFavorites(res.data);
    } catch (err) {
      toast.error("Could not load favorites");
    }
  };

  useEffect(() => { fetchFavorites(); }, []);

  const addToCart = async (id: number) => {
    try {
      await api.post(`/cart/${id}`);
      toast.success("Added to cart!");
    } catch (err) {
      toast.error("Failed to add to cart");
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-8">My Wishlist</h2>
      {favorites.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed">
          <p className="text-muted-foreground">You haven't favorited any laptops yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((product) => (
            <Card key={product.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="h-40 bg-slate-100 flex items-center justify-center">
                <Laptop className="h-16 w-16 text-slate-400" />
              </CardHeader>
              <CardContent className="pt-4">
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">{product.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <span className="font-bold text-lg">${product.price}</span>
                <Button size="sm" onClick={() => addToCart(product.id)}>
                   <ShoppingCart className="h-4 w-4 mr-2" /> Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}