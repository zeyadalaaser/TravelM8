import { useEffect, useState } from "react";
import { getWishlist } from "../../api/apiService";
import ProductCard from "./product-card";

export default function Products({ products, currency, token }) {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!token)
        return;
      
      setWishlist((await getWishlist(token?.token)).map(p => p._id));
    }
    fetchWishlist();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard product={product} currency={currency} token={token?.token} liked={wishlist.includes(product._id)} />
        ))
      ) : (
        <p className="col-span-3 text-center">No products available.</p>
      )}
    </div>
  )
}

