import { useEffect, useState } from "react";
import { getWishlist } from "../api/apiService";
import ProductCard from "./products/product-card";

export function Wishlist({ token }) {
    const [products, setProducts] = useState([]);
    useEffect(() => {
        getWishlist(token).then(setProducts);
    }, []);

    return (
        <div className="container p-4 bg-background">
            <h1 className="text-2xl font-bold mb-6">Wishlist</h1>
            <div className="grid grid-cols-3 gap-3">
                {products.map((product) => (
                    <ProductCard product={product} token={token} />
                ))}
            </div>
        </div>
    );
}