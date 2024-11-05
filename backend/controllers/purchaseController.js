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

    // Deduct the purchased quantity
    product.quantity -= quantity;
    await product.save();

    // Record the purchase
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
      const purchases = await Purchase.find({ touristId }).populate('productId');
  
      if (purchases.length === 0) {
        return res.status(404).json({ message: 'No purchases found for this tourist' });
      }
  
      res.status(200).json({ purchases });
    } catch (error) {
      console.error("Error fetching purchases:", error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  // In your purchases controller
async function rateProduct(req, res) {
    const { purchaseId } = req.params;
    const { rating, comment } = req.body;

    try {
        const purchase = await Purchase.findById(purchaseId);
        if (!purchase) {
            return res.status(404).json({ message: "Purchase not found" });
        }

        purchase.rating = rating;
        purchase.comment = comment;

        await purchase.save();
        return res.status(200).json({ message: "Rating submitted successfully", purchase });
    } catch (error) {
        console.error("Error rating product:", error);
        return res.status(500).json({ message: "Error rating product" });
    }
}
