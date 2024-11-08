import Product from '../models/productModel.js';
import Purchase from '../models/purchaseModel.js';
import mongoose from "mongoose";

export const purchaseProduct = async (req, res) => {
  const { productId, touristId, quantity } = req.body;


  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    
    product.quantity -= quantity;
    product.sales += quantity; 
    await product.save();

    const purchase = new Purchase({
      productId,
      touristId,
      quantity,
    });
    await purchase.save();

    res.status(200).json({ message: 'Purchase successful', purchase });
  } catch (error) {
    console.error("Error processing purchase:", error);
    res.status(500).json({ message: 'Server error' });
  }
};
export const getPurchasesByTourist = async (req, res) => {
    const { touristId } = req.params;
  
    try {
      const purchases = await Purchase.find({ touristId }).populate('productId', 'name price');
  
      if (purchases.length === 0) {
        return res.status(404).json({ message: 'No purchases found for this tourist' });
      }
  
      res.status(200).json({ purchases });
    } catch (error) {
      console.error("Error fetching purchases:", error);
      res.status(500).json({ message: 'Server error' });
    }
  };


export const deletePurchase = async (req, res) => {
  const { purchaseId} = req.params;

  try {
      const result = await Purchase.findByIdAndDelete(purchaseId);
      if (!result) {
          return res.status(404).json({ message: "Purchase not found" });
      }
      res.status(200).json({ message: "Purchase deleted successfully" });
  } catch (error) {
      console.error("Error deleting purchase:", error);
      res.status(500).json({ message: "Server error" });
  }
};
