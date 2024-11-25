import mongoose from "mongoose";
import Product from "../models/productModel.js";
import Purchase from "../models/purchaseModel.js";
 

export const purchaseProduct = async (req, res) => {
  const { productId, touristId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    const totalPrice = quantity * product.price
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    product.quantity -= quantity;
    product.sales += quantity;
    await product.save();

    const purchase = new Purchase({
      productId,
      touristId,
      quantity,
      totalPrice
    });
    await purchase.save();

    res.status(200).json({ message: "Purchase successful", purchase });
  } catch (error) {
    console.error("Error processing purchase:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const getPurchasesByTourist = async (req, res) => {
  const { touristId } = req.params;

  try {
    const purchases = await Purchase.find({ touristId }).populate(
      "productId",
      "name price"
    );

    if (purchases.length === 0) {
      return res
        .status(404)
        .json({ message: "No purchases found for this tourist" });
    }

    res.status(200).json({ purchases });
  } catch (error) {
    console.error("Error fetching purchases:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deletePurchase = async (req, res) => {
  const { purchaseId } = req.params;

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

export const totalPurchasedProductsAdmin = async () => {
  
  try {
    const purchases = await Purchase.find({
        status: { $in: ['completed', 'pending'] },
  }).populate("productId");

    let totalPrice = 0;
    purchases.forEach((purchase) => {
      totalPrice += purchase.totalPrice || 0;
    });
    return totalPrice;
  } catch (error) {
    return -1;
  }
  
};

export const totalPurchasedProductsCancelledAdmin = async () => {
  
  try {
    const purchases = await Purchase.find({
        status: 'cancelled'
  }).populate("productId");

    let totalPrice = 0;
    purchases.forEach((purchase) => {
      totalPrice += purchase.totalPrice || 0;
    });
    return totalPrice;
  } catch (error) {
    return -1;
  }
  
};


export const totalPurchasedProductsSeller = async (sellerId) => {
  
  try {
    const purchases = await Purchase.find({
        status: { $in: ['completed', 'pending'] },
  }).populate("productId");

    let totalPrice = 0;
    purchases.forEach((purchase) => {
      if(purchase.productId.sellerId=sellerId)
      totalPrice += purchase.totalPrice || 0;
    });
    return totalPrice;
  } catch (error) {
    return -1;
  }
  
};

export const totalPurchasedProductsCancelledSeller = async (sellerId) => {
  
  try {
    const purchases = await Purchase.find({
        status: 'cancelled'
  }).populate("productId");

    let totalPrice = 0;
    purchases.forEach((purchase) => {
      if(purchase.productId.sellerId=sellerId)
      totalPrice += purchase.totalPrice || 0;
    });
    return totalPrice;
  } catch (error) {
    return -1;
  }
  
};

export const getProductsReport = async (req, res) => {
  try {
    // const  sellerId  = req.user.userId;
    const sellerId =  req.body.id; 
    const {year,day,month}=req.query; 

    const results = await Purchase.aggregate([
      {
        $lookup: {
          from: 'products', // Product collection name
          localField: 'productId', // Field in Purchase to match
          foreignField: '_id', // Field in Product to match
          as: 'productDetails',
        },
      },
      {
        $unwind: '$productDetails', // Flatten the product details array
      },
      {
        $match: {
          'productDetails.sellerId': new mongoose.Types.ObjectId(sellerId), // Match by seller ID
          status: { $in: ['completed', 'pending'] }, // Filter by status
          $expr: {
                $and: [
                  ...(year ? [{ $eq: [{ $year: '$createdAt' }, parseInt(year)] }] : []),
                  ...(month ? [{ $eq: [{ $month: '$createdAt' }, parseInt(month)] }] : []),
                  ...(day ? [{ $eq: [{ $dayOfMonth: '$createdAt' }, parseInt(day)] }] : []),
                ],
              },
        },
      },
      {
        $group: {
          _id: '$productId', // Group by product ID
          productName: { $first: '$productDetails.name' },
          purchaseCount: { $sum: '$quantity' }, // Sum up quantities purchased
          productPrice: { $first: '$productDetails.price' }, // Sum up the total price
        },
      },
      {
        $addFields: {
          revenue: { $multiply: ['$purchaseCount', '$productPrice'] }, // Calculate revenue
        },
      },
      {
        $project: {
          _id: 1, // Include product ID
          name: '$productName', // Include product name
          purchaseCount: 1, // Include purchase count
          revenue: 1 // Include revenue
        },
      },
    ]);

    console.log(results);
    if(results.length == 0)
      return res.status(200).json({message: "No data to show"});
    return res.status(200).json({
      data: results,
      message: "Successfully fetched the products report"
    });
  } catch (error) {
    console.error('Error fetching product report:', error);
    res.status(500).json({ message: 'Failed to fetch product report', error: error.message });
  }
};



