import mongoose from 'mongoose';
import Product from '../models/productModel.js';


export const createProduct = async (req, res) => {
  try {
    const { Name, Image, Price, Quantity, Description, Seller, Rating, Reviews } = req.body;

    const newProduct = new Product({
      Name,
      Image,
      Price,
      Quantity,
      Description,
      Seller,
      Rating,
      Reviews
    });

    
    const savedProduct = await newProduct.save();

  
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params; // Get the product ID from the request parameters

    // Find the product by ID and remove it
    const deletedProduct = await Product.findByIdAndDelete(id);

    // If no product found, return a 404 error
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Return a success message
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}); 
    res.status(200).json({success : true , data: products}); 
  } catch (error) {
    console.log("error in ftching products:", error.message);
    res.status(500).json({ message: error.message }); 
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params; 
    const updateData = req.body; 

    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).json({success: false , message:"Product not found; invalid"});
    }


    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document with updated data 
      runValidators: true // Validate the data against the schema
    });

    //law mafeesh product
    //if (!updatedProduct) {
      //return res.status(404).json({ message: 'Product not found' });
    //}

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

