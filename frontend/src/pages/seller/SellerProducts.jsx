// SellerProducts.js
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'; // Adjust the path if necessary
import { Button } from '../../components/ui/button'; // Import your button component

export default function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch products for the seller
/*   useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products/myProducts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Add token if required
          },
        });

        if (!response.ok) {
          throw new Error('Error fetching products');
        }

        const data = await response.json();
        setProducts(data.Places); // Use the correct response structure
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); */



  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Update the URL to use getAllProducts endpoint
        const response = await fetch('http://localhost:5001/api/products', {
          method: 'GET',
/*           headers: {
            // Include any necessary headers, e.g., Authorization
            'Authorization': `Bearer YOUR_JWT_TOKEN`, // Replace with actual token if needed
          }, */
        });

        // Check for a successful response
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setProducts(data.data); // Adjust according to the actual response structure
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);



  // Handle product deletion
  const handleDelete = async (productId) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Add token if required
        },
      });

      if (!response.ok) {
        throw new Error('Error deleting product');
      }

      // Update the state to remove the deleted product from the list
      setProducts(products.filter((product) => product._id !== productId));
    } catch (error) {
      setError(error.message);
    }
  };

  // Handle product editing (You can customize this based on your modal or form structure)
  const handleEdit = (productId) => {
    // Logic to open a modal or navigate to the edit page
    console.log(`Edit product with ID: ${productId}`);
  };

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>{`Error: ${error}`}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4">Your Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map((product) => (
          <Card key={product._id} className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover mb-2"
              />
              <p className="font-bold">{`Price: EGP ${product.price.toFixed(2)}`}</p>
              <p className="mb-2">{product.description}</p>
              <p className="font-semibold">{`Seller ID: ${product.sellerId}`}</p>
              {/* Optional Rating and Reviews */}
              <Button className="mt-2" onClick={() => handleEdit(product._id)}>
                Edit
              </Button>
              <Button
                className="mt-2 ml-2"
                variant="destructive"
                onClick={() => handleDelete(product._id)}
              >
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
