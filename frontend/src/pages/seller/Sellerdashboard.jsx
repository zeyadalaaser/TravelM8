import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { getMyProducts } from './api/apiService'; // Assuming this is the correct import
import { Card, CardContent, CardHeader, CardTitle,   CardDescription,   CardFooter,} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Calendar, Users, Settings, Plus,Map } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import AddProductForm from "../seller/components/AddProductForm"; // Assuming AddProductForm is in the same folder
import Logout from "@/hooks/logOut.jsx";
import Header from "@/components/navbarDashboard.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "react-router-dom"; 
import ProductCard from "../seller/components/ProductCard";
import ProductDetailCard from "../seller/components/ProductDetailsCard";
import SalesReport from './components/SalesReport.jsx';
import axios from 'axios';
import { SearchBar } from "./components/filters/search";
import { PriceFilter } from "./components/filters/price-filter";
import Footer from "@/components/Footer.jsx";
import { Pencil, Trash2, ShoppingCart, Eye } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const SellerDashboard = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [editProductData, setEditProductData] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("products");
  const [reportData, setReportData] = useState([]);

  const fetchReport = async () => {
    setLoading(true);
    setError("");
    try {
      const endpoint ="http://localhost:5001/api/ordersReport";
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
       // params: { year, month, day },
      });
      setReportData(response.data?.data || []); // Ensure it's always an array
      console.log(response.data?.data);
    } catch (err) {
      console.error(`Error fetching products report:`,err);
      setError(err.response?.data?.message || "Failed to fetch report");
    } finally {
      setLoading(false);
    }
  };


  const toggleArchiveStatus = async (id, product) => {
    try {
      const isArchived = product?.archived;
      const newStatus = !product?.archived;
      setProducts((prevProducts) =>
        prevProducts.map((item) =>
          item._id === id ? { ...item, archived: newStatus } : item
        )
      );
      await fetch(
        `http://localhost:5001/api/products/${id}/${
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
          product._id === id
            ? { ...product, archived: !isArchived }
            : product
        )
      );
      console.log("Archive status updated successfully");
    } catch (error) {
      console.error("Error updating archive status:", error);
    }
  };

   

  useEffect(() => {
    
      fetchReport();
  
  }, [token ]);
  console.log(reportData);

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
      toast("Deleted Product", {
        description: "Your product has been successfully deleted.",
      });
    } catch (error) {
      setError(error.message);
      toast.error("Error", {
        description: "Failed to delete product. Please try again."
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
      toast("Success", {
        description: "Product created successfully!",
        duration: 3000,
      });
    } catch (error) {
      toast.error("Error", {
        description: error.message || "Failed to create the product.",
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
        toast("Success", {
          description: "Product updated successfully!",
          duration: 3000,
        });
      } catch (error) {
        toast.error("Error", {
          description: error.message || "Failed to update the product.",
          duration: 3000,
        });
      }
    }
  };

   const handleCardClick = (product) => {
   
      console.log("Product clicked:", product); 
      setSelectedProduct(product);  
      console.log("Selected Product after setting:", selectedProduct);
      setIsDetailModalOpen(true);
    
  }; 



  const closeModal = () => {
    setIsDetailModalOpen(false);
    setSelectedProduct(null);
  };

  useEffect(() => {
    if (!token) return;
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000); 

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
    <div className="flex h-screen bg-gray-100">
      <main className="flex-1 overflow-y-auto">
        <Header name="Seller Name" type="Seller" editProfile="/sellerProfile" />
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {/* Key Statistics Cards */}
            <Card >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Products
                </CardTitle>
                <Map className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{products?.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Products
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                {products?.filter((product) => !product.archived).length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                $
                    {reportData.length > 0
                      ? reportData
                          .reduce((total, item) => total + item.revenue, 0)
                          .toFixed(2)
                      : "0.00"}
                </div>
              </CardContent>
            </Card>
          </div>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <div className="flex mb-10 justify-between items-center">
              <TabsList>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="sales">Sales Report</TabsTrigger>
              </TabsList>
          {/* Add Product Button */}
          <Dialog open={isAddProductModalOpen} onOpenChange={setIsAddProductModalOpen}>
            <DialogTrigger asChild>
                    <Button  variant="primary">
                    <Plus className="mr-2 h-4 w-4" /> Add Product
                  </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <AddProductForm onSubmit={handleCreateProduct} />
            </DialogContent>
          </Dialog>
          
         </div> 
         <TabsContent value="sales" className="space-y-4">
          <SalesReport/>
          </TabsContent>
          <TabsContent value="products" className="space-y-4">
         
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
          <SearchBar />
          <PriceFilter />         

          <div className="flex gap-6 w-full">
 
          <div className="grid grid-cols-1  md:grid-cols-3 lg:grid-cols-3 gap-6 flex-grow">
            {loading ? (
              <p>Loading products...</p>
            ) : products.length === 0 ? (
              <p>No products found.</p>
            ) : (
              products.map((product) => (
            <Card
                className="mb-6 flex flex-col h-full"
                key={product._id}
              >
                <div className="flex-grow p-4">
                  <div className="justify-self-end">
                    {product.archived ? (
                      <Badge className="bg-red-600">Archived</Badge>
                    ) : (
                      <Badge className="bg-green-600">Unarchived</Badge>
                    )}
                  </div>

                  <CardHeader>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover rounded-t-lg"
                    />
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription>
                      {product.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-4">
                    <div className="flex flex-col text-sm text-gray-500 mb-4">
                      <div className="flex items-center mb-3">
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        <span>Sold: {product.sales}</span>
                      </div>
                      <div>
                        <span>In stock: {product.quantity}</span>
                      </div>
                    </div>
                    <div className="text-lg font-semibold mb-4">
                      Price: ${product.price.toFixed(2)}
                    </div>
                  </CardContent>
                </div>

                <CardFooter className="flex flex-col mt-auto space-y-2 p-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={product.archived}
                      onCheckedChange={() =>
                        toggleArchiveStatus(product._id, product)
                      }
                    />
                    <Label>
                      {product.archived ? "Archived" : "Unarchived"}
                    </Label>
                  </div>
                  <div className="flex justify-between space-x-4">
                    {/* Edit Button */}
                    <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit
                    </Button>

                    {/* Delete Button */}
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(product._id)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardFooter>
              </Card>
              ))
            )}
            </div>
          </div>
          <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
              <DialogTrigger asChild>
                <Button className="mt-4" style={{ display: "none" }}>
                  Edit Product
                </Button>
              </DialogTrigger>
              <DialogContent>
                {selectedProduct ? (
                  <ProductDetailCard product={selectedProduct} onClose={closeModal} />
                ) : (
                  <div>Loading...</div>
                )}
              </DialogContent>
            </Dialog>
          </TabsContent>  
         </Tabs>
  
        </div>
        <div className='mt-12'>
        <Footer />
        </div>

      </main>
    </div>
  );
};

export default SellerDashboard;





















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