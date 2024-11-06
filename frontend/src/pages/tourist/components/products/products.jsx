import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stars } from "../stars";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Products({ products, currency, exchangeRate, touristId }) {
const navigate = useNavigate();

const handlePurchase = async (product) => {
  const quantity = 1; 

  try {
    const response = await axios.post('http://localhost:5001/api/purchases', {
      productId: product._id,
      touristId: touristId, 
      quantity,
    });

    console.log("product id:", response.data.purchase.productId);
    console.log("id el zeftx2: ", touristId);

    alert('Purchase successful!');
    const viewPurchased = window.confirm(
      "Do you want to view purchased products or continue shopping?"
    );

    if (viewPurchased) {
      console.log("Id el zeft: ", touristId);
      navigate(`/products-purchased`); 
       }
  } catch (error) {
    console.error("Error purchasing product:", error.response ? error.response.data : error.message);
    alert("Failed to purchase product.");
  }
};



  return (
    <div className="space-y-4">
      {products.map((product, index) => (
        <Card key={index}>
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/3">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full md:w-2/3 p-4">
              <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
              <div className="flex items-center mb-2">
                <Stars rating={product.averageRating} />
                <span className="ml-2 text-sm text-gray-600">
                  {product.totalRatings} reviews
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {product.description}
              </p>
              <div className="flex items-center mb-2">
                <span className="text-sm font-semibold mr-2">Seller:</span>
                <Badge variant="outline">{product.seller?.name}</Badge>
              </div>
              <div className="text-xl font-bold">
                {(product.price * exchangeRate).toFixed(2)} {currency}
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
      ))}
    </div>
  );
}
