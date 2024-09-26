import Product from '../models/productModel.js';

// Controller function to create a new product
export const createProduct = async (req, res) => {
  try {
    const { Name, Image, Price, Quantity, Description, Seller, Rating, Reviews } = req.body;

    // Create a new Product instance
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
