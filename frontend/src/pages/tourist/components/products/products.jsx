// products.jsx
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stars } from "@/components/Stars";
import { Button } from "@/components/ui/button"
import axios from 'axios';
import { ShareButton } from "@/components/ui/share-button";

export default function Products({ products, currency, exchangeRate, touristId }) {
  const handlePurchase = async (product) => {
    if (!touristId) {
      alert("Tourist ID is required.");
      return;
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
        products.map((product, index) => (
          <Card key={index} className="overflow-hidden mx-auto">
            <div className="flex flex-col md:flex-row h-[230px]">
              <div className="w-full md:w-1/3">
                <img
                  src={product.image || "https://via.placeholder.com/150"}
                  alt={product.name}
                  className="w-full h-full"
                />
              </div>
              <div className="w-full md:w-2/3 p-4 flex flex-col justify-between">
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
                  <div className="flex items-center mb-2">
                    <span className="text-sm font-semibold mr-2">Seller:</span>
                    <Badge variant="secondary">
                      {product.seller?.name || "Unknown Seller"}
                    </Badge>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="text-xl font-bold">
                    {(product.price * 1).toFixed(2)} {currency}
                  </div>
                  <Button variant="default" onClick={() => handlePurchase(product)}>
                    Purchase
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))
      ) : (
        <></>
      )}
    </div>
  );
}


