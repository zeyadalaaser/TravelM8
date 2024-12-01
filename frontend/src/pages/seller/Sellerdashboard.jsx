/*  import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Navbar from "@/components/DashboardsNavBar.jsx";
function Sellerdashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) return; // No token, no need to check

    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

      if (decodedToken.exp < currentTime) {
        localStorage.removeItem("token"); 
        navigate("/"); 
      } else {
        const timeout = setTimeout(() => {
          localStorage.removeItem("token");
          navigate("/");
        }, (decodedToken.exp - currentTime) * 1000);

        return () => clearTimeout(timeout);
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      localStorage.removeItem("token"); 
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <><Navbar /><div style={styles.container}>

      <h1 style={styles.header}>Seller Dashboard</h1>
      <button style={styles.button} onClick={() => navigate('/SellerProducts')}>
        Go to Seller Products
      </button>
      <button style={styles.button} onClick={() => navigate('/SellerProfile')}>
        Go to Seller Profile
      </button>
    </div></>
  );
}


const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
    },
    header: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '20px',
        color: 'black', // Header text color
      },
    button: {
      margin: '10px',
      padding: '10px 20px',
      fontSize: '16px',
      cursor: 'pointer',
      backgroundColor: 'black', // Button background color
      color: 'white',            // Button text color
      border: 'none',            // Removes default border
      borderRadius: '5px',       // Optional: Rounds the corners
    },
  };
export default Sellerdashboard; 

  */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { getMyProducts } from './api/apiService'; // Assuming this is the correct import
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Calendar, Users, Settings } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "./components/useToast";
import AddProductForm from "../seller/components/AddProductForm"; // Assuming AddProductForm is in the same folder
import Logout from "@/hooks/logOut.jsx";
import Header from "@/components/navbarDashboard.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "react-router-dom"; 
import ProductCard from "../seller/components/ProductCard";
const token = localStorage.getItem("token");

const SellerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [editProductData, setEditProductData] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams(location.search);
        const response = await getMyProducts(queryParams); // Fetch actual products
        setProducts(response.products);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location.search]);

  // Handle product deletion
  const handleDelete = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error deleting product");
      }

      setProducts(products.filter((product) => product._id !== productId));
      toast({
        title: "Deleted Product",
        description: "Your product has been successfully deleted.",
      });
    } catch (error) {
      setError(error.message);
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleArchive = async (productId, isArchived) => {
    try {
      await fetch(
        `http://localhost:5001/api/products/${productId}/${
          isArchived ? "unarchive" : "archive"
        }`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setProducts((prev) =>
        prev.map((product) =>
          product._id === productId
            ? { ...product, archived: !isArchived }
            : product
        )
      );
    } catch (error) {
      console.error(
        `Error ${isArchived ? "unarchive" : "archive"} product:`,
        error
      );
    }
  };

  // Handle product editing
  const handleEdit = (product) => {
    setEditProductData(product);
    setIsEditProductModalOpen(true);
  };

  const handleCreateProduct = async (formData) => {
    try {
      const response = await fetch("http://localhost:5001/api/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData, // pass FormData here
      });

      if (!response.ok) {
        throw new Error("Failed to create product");
      }

      const savedProduct = await response.json();
      setProducts((prevProducts) => [...prevProducts, savedProduct]);
      setIsAddProductModalOpen(false);
      toast({
        title: "Success",
        description: "Product created successfully!",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to create the product.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleUpdateProduct = async (formData) => {
    if (editProductData) {
      try {
        const response = await fetch(
          `http://localhost:5001/api/products/${editProductData._id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: formData, // pass FormData here
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update product");
        }

        const updatedProduct = await response.json();
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === updatedProduct._id ? updatedProduct : product
          )
        );
        setIsEditProductModalOpen(false);
        toast({
          title: "Success",
          description: "Product updated successfully!",
          duration: 3000,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to update the product.",
          variant: "destructive",
          duration: 3000,
        });
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 h-full bg-white drop-shadow-xl flex flex-col justify-between">
        <div>
          <div className="p-4">
            <h2 className="text-2xl font-bold text-gray-800">Seller Dashboard</h2>
          </div>
          <nav className="mt-6">
            <button
              className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-200 w-full text-left"
              onClick={() => navigate("/SellerProducts")}
            >
              <Calendar className="mr-3" />
              Products
            </button>
            <button
              className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-200 w-full text-left"
              /* onClick={() => navigate("/SalesReport")} */
            >
              <DollarSign className="mr-3" />
              Sales Report
            </button>
            <button
              className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-200 w-full text-left"
              /* onClick={() => navigate("/Settings")} */
            >
              <Settings className="mr-3" />
              Settings
            </button>
          </nav>
        </div>
        <div className="p-4">
          <Logout />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Header name="Seller Name" type="Seller" editProfile="/sellerProfile" />

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            {/* Key Statistics Cards */}
            <Card>
              <CardHeader>
                <CardTitle>Total Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{products.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Active Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {products.filter((product) => !product.archived).length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0 USD</div> {/* Update with real sales data */}
              </CardContent>
            </Card>
          </div>

          {/* Add Product Button */}
          <Dialog open={isAddProductModalOpen} onOpenChange={setIsAddProductModalOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4">Add New Product</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <AddProductForm onSubmit={handleCreateProduct} />
            </DialogContent>
          </Dialog>

          {/* Edit Product Modal */}
          <Dialog open={isEditProductModalOpen} onOpenChange={setIsEditProductModalOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4" style={{ display: "none" }}>
                Edit Product
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Product</DialogTitle>
              </DialogHeader>
              <AddProductForm onSubmit={handleUpdateProduct} initialData={editProductData} />
            </DialogContent>
          </Dialog>

          {/* Product List */}
{/*           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading ? (
              <p>Loading products...</p>
            ) : products.length === 0 ? (
              <p>No products found.</p>
            ) : (
              products.map((product) => (
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
                    <p className="font-bold">{`Price: USD ${parseFloat(product.price).toFixed(2)}`}</p>
                    <p className="mb-2">{product.description}</p>
                    <p className="mb-2">{`Sold: ${product.sales}`}</p>
                    <p className="mb-2">{`Remaining stock: ${product.quantity}`}</p>
                    <Button className="mt-2 ml-2" onClick={() => handleEdit(product)}>
                      Edit
                    </Button>
                    <Button
                  className="mt-2 ml-2"
                  onClick={() => toggleArchive(product._id, product.archived)}
                >
                  {product.archived ? "Unarchive" : "Archive"}
                </Button>
                    <Button className="mt-2 ml-2" onClick={() => handleDelete(product._id)}>
                      Delete
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div> */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {loading ? (
    <p>Loading products...</p>
  ) : products.length === 0 ? (
    <p>No products found.</p>
  ) : (
    products.map((product) => (
      <ProductCard
        key={product._id}
        product={product}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleArchive={toggleArchive}
      />
    ))
  )}
</div>


        </div>
      </main>
    </div>
  );
};

export default SellerDashboard;
