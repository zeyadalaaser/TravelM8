import { useEffect, useState } from "react";
import { getWishlist } from "../api/apiService";
import ProductCard from "./products/product-card";

export function Wishlist({ token }) {
    const [products, setProducts] = useState([]);
    useEffect(() => {
        getWishlist(token).then(setProducts);
    }, []);

    return (
        <div className="space-y-4">
            {products.map((product) => (
                <ProductCard product={product} token={token} />
            ))}
        </div>
    );
}