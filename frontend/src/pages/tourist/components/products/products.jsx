// products.jsx
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stars } from "@/components/Stars";
import { Button } from "@/components/ui/button"
import axios from 'axios';
import { ShareButton } from "@/components/ui/share-button";
import AnimatedLikeButton from "./like";

export default function Products({ products, currency, exchangeRate, touristId, addToCart }) {
  const handlePurchase = async (product) => {
    if (!touristId) {
      alert("Tourist ID is required.")
      return
    }


    const quantity = 10;

    try {
      const response = await axios.post('http://localhost:5001/api/purchases', {
        productId: product._id,
        touristId: touristId,
        quantity,
      });

      console.log("product id:", response.data.purchase.productId);
      alert('Purchase successful!');

    } catch (error) {
      console.error("Error purchasing product:", error.response ? error.response.data : error.message);
      alert("Failed to purchase product.");
    }
  };


  return (
    <div className="space-y-4">
      {products.length > 0 ? (
        products.map((product) => (
          <Card key={product._id} className="overflow-hidden mx-auto">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/3 relative group">
                <img
                  src={product.image || "https://via.placeholder.com/150"}
                  alt={product.name}
                  className="w-full h-[230px] object-cover"
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 flex items-end"
                  style={{
                    background: `linear-gradient(180deg, 
            rgba(0,0,0,0) 62%, 
            rgba(0,0,0,0.00345888) 63.94%, 
            rgba(0,0,0,0.014204) 65.89%, 
            rgba(0,0,0,0.0326639) 67.83%, 
            rgba(0,0,0,0.0589645) 69.78%, 
            rgba(0,0,0,0.0927099) 71.72%, 
            rgba(0,0,0,0.132754) 73.67%, 
            rgba(0,0,0,0.177076) 75.61%, 
            rgba(0,0,0,0.222924) 77.56%, 
            rgba(0,0,0,0.267246) 79.5%, 
            rgba(0,0,0,0.30729) 81.44%, 
            rgba(0,0,0,0.341035) 83.39%, 
            rgba(0,0,0,0.367336) 85.33%, 
            rgba(0,0,0,0.385796) 87.28%, 
            rgba(0,0,0,0.396541) 89.22%, 
            rgba(0,0,0,0.4) 91.17%)`
                  }}
                >
                  <div className="flex items-center w-full justify-between">
                    <span className="text-white font-medium text-base truncate">{product.name}</span>
                    <AnimatedLikeButton />
                  </div>
                </div>
              </div>
              <div className="w-full md:w-2/3 p-4 flex flex-col justify-between h-[230px]">
                <div>
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                    <ShareButton id={product._id} name="product" />
                  </div>
                  <div className="flex items-center mb-2">
                    <Stars rating={product.averageRating || 0} />
                    <span className="ml-2 text-sm text-muted-foreground">
                      {product.totalRatings || 0} reviews
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {product.description || "No description available"}
                  </p>
                  <div className="flex items-center">
                    <span className="text-sm font-semibold mr-2">Seller:</span>
                    <Badge variant="secondary">
                      {product.seller?.name || "Unknown Seller"}
                    </Badge>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">
                    {currency} {(product.price * 1).toFixed(2)}
                  </span>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => addToCart(product)}>
                      Add to Cart
                    </Button>
                    <Button variant="default" onClick={() => handlePurchase(product)}>
                      Purchase
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))
      ) : (
        <p>No products available.</p>
      )}
    </div>
  )
}

