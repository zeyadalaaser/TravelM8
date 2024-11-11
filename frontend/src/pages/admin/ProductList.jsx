// ProductList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from "react-router-dom";
import { getProducts } from '../seller/api/apiService';

const ProductList = ({ onEdit }) => {
  const [products, setProducts] = useState([]);
  const location = useLocation();

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     const response = await axios.get('/api/products');
  //     setProducts(response.data.data);
  //   };
  //   fetchProducts();
  // }, []);

  const handleDelete = async (id) => {
    await axios.delete(`/api/products/${id}`);
    setProducts(products.filter((product) => product._id !== id));
  };



//added archive and unarchive toggle to products 

  const archiveProduct = async (productId) => {
    try{
      await fetch(`http://localhost:5001/api/products/${productId}/archive`,{
        method: 'PUT',
        headers:{
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setProducts((prev) => prev.map((product) => product._id === productId ? {...product, archived: true}: product));
    }catch (error){
      console.error('Error archiving product:' , error);
    }
  };

  const unarchiveProduct = async (productId) => {
    try{
      await fetch(`http://localhost:5001/api/products/${productId}/unarchive`,{
        method: 'PUT',
        headers:{
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setProducts((prev) => prev.map((product) => product._id === productId ? {...product, archived: false}: product));
    }catch (error){
      console.error('Error unarchiving product:' , error);
    }
  };



  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4">Your Products</h1>
      <SearchBar />
      <PriceFilter />
      <ul>
        {products.map((product) => (
          <li key={product._id}>
            <h3>{product.name}</h3>
            <img src={product.image} alt={product.name} width={100} />
            <p>Price: ${product.price}</p>
            <p>Quantity: {product.quantity}</p>
            <p>{product.description}</p>
            
            <button onClick={() => onEdit(product)}>Edit</button>
            <button onClick={() => handleDelete(product._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
