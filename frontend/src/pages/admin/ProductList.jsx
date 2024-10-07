// ProductList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductList = ({ onEdit }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get('/api/products');
      setProducts(response.data.data);
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    await axios.delete(`/api/products/${id}`);
    setProducts(products.filter((product) => product._id !== id));
  };

  return (
    <div>
      <h2>Products</h2>
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
