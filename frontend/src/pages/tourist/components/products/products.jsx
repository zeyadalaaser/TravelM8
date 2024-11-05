// products.jsx
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stars } from "../stars";

export default function Products({ products, currency, exchangeRate }) {
  return (
    <div className="space-y-4">
      {products.length > 0 ? (
        products.map((product, index) => (
          <Card key={index}>
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/3">
                <img
                  src={product.image || "https://via.placeholder.com/150"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-full md:w-2/3 p-4">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <div className="flex items-center mb-2">
                  <Stars rating={product.averageRating || 0} />
                  <span className="ml-2 text-sm text-gray-600">
                    {product.totalRatings || 0} reviews
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {product.description || "No description available"}
                </p>
                <div className="flex items-center mb-2">
                  <span className="text-sm font-semibold mr-2">Seller:</span>
                  <Badge variant="outline">
                    {product.seller?.name || "Unknown Seller"}
                  </Badge>
                </div>
                <div className="text-xl font-bold">
                  {(product.price * 1).toFixed(2)} {currency}
                </div>
                <div className="flex justify-end">
                  <button
                    className="bg-black text-white font-semibold py-2 px-4 rounded hover:bg-gray-800"
                    onClick={() => handlePurchase(product)}
                  >
                    Purchase
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))
      ) : (
        <p>No products available</p>
      )}
    </div>
  );
}

// Function to handle purchase logic
const handlePurchase = (product) => {
  console.log(`Purchasing: ${product.name}`);
};
