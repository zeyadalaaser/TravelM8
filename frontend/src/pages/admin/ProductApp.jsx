// App.jsx
import React, { useState } from 'react';
import ProductForm from './ProductForm';
import ProductList from './ProductList';


const ProductApp = () => {
  const [editingProduct, setEditingProduct] = useState(null);

  const handleProductSaved = () => {
    setEditingProduct(null);
  };

  const handleEdit = (product) => {
    setEditingProduct(product._id);
  };

  return (
    <div>
      <h1>Product Management</h1>
      <ProductForm productId={editingProduct} onProductSaved={handleProductSaved} />
      <ProductList onEdit={handleEdit} />
    </div>
  );
};

export default ProductApp;
