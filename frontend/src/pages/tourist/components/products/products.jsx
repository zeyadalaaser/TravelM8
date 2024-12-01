import { Card, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stars } from "@/components/Stars";
import { Button } from "@/components/ui/button"
import axios from 'axios';
import { ShareButton } from "@/components/ui/share-button";
import AnimatedLikeButton from "./like";
import { useEffect, useState } from "react";
import { getWishlist } from "../../api/apiService";

export default function Products({ products, currency, token}) {
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      setWishlist((await getWishlist(token?.token)).map(p => p._id));
    }
    fetchWishlist();
  }, []);

  // const handlePurchase = async (product) => {
  //   if (!token?.decodedToken?.userId) {
  //     alert("Tourist ID is required.")
  //     return
  //   }

  //   const quantity = 1;

  //   try {
  //     const response = await axios.post('http://localhost:5001/api/purchases', {
  //       productId: product._id,
  //       touristId: token?.decodedToken?.userId,
  //       quantity,
  //     });

  //     console.log("product id:", response.data.purchase.productId);
  //     alert('Purchase successful!');

  //   } catch (error) {
  //     console.error("Error purchasing product:", error.response ? error.response.data : error.message);
  //     alert("Failed to purchase product.");
  //   }
  // };

  const fetchCart = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/tourists/cart', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCart(response.data.cart || []);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      setCart([]);
    }
  };

  const addToCart = async (productId) => {
    try {
      await axios.post(`http://localhost:5001/api/tourists/cart/${productId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchCart();
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.length > 0 ? (
        products.map((product) => (
        <Card key={product._id} className="flex flex-col h-full overflow-hidden">
          <div className="relative group ">
            <img
              src={product.image || "https://via.placeholder.com/300"}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex items-end"
              style={{
                background: `linear-gradient(180deg, 
                  rgba(0,0,0,0) 0%, 
                  rgba(0,0,0,0.7) 100%)`
              }}
            >
              <div className="flex items-center w-full justify-between">
                <span className="text-white font-medium text-base truncate">{product.name}</span>
                <AnimatedLikeButton
                  liked={wishlist.includes(product._id)}
                  productId={product._id}
                  token={token?.token}
                />
              </div>
            </div>
          </div>

          <div className="flex-grow  p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold truncate">{product.name}</h3>
              <ShareButton id={product._id} name="product" />
            </div>
            <div className="flex items-center mb-2">
              <Stars rating={product.averageRating || 0} />
              <span className="ml-2 text-sm text-muted-foreground">
                {product.totalRatings || 0} reviews
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
              {product.description || "No description available"}
            </p>
            <div className="flex items-center mb-2">
              <span className="text-sm font-semibold mr-2">Seller:</span>
              <Badge variant="secondary">
                {product.seller?.name || "Unknown Seller"}
              </Badge>
            </div>
          </div>

          <div className="p-4 border-t mt-auto">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">
                {currency} {(product.price * 1).toFixed(2)}
              </span>
              <div className="flex space-x-2">
              <Button 
                variant="outline" 
                className="bg-emerald-800 hover:bg-emerald-700 hover:text-white text-white rounded-full"
                size="sm" 
                onClick={() => addToCart(product._id)}
              >
                Add to Cart
              </Button>
              </div>
            </div>
          </div>
        </Card>

        ))
      ) : (
        <p className="col-span-3 text-center">No products available.</p>
      )}
    </div>
  )
}

