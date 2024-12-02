import Tourist from '../models/touristModel.js';
import { checkUniqueUsernameEmail } from "../helpers/signupHelper.js";
import Product from '../models/productModel.js';
import mongoose from "mongoose";


export const createTourist = async (req, res) => {
  //add a new Tourist to the database with 
  const { username, name, email, password, mobileNumber, nationality, dob, occupation } = req.body;
  const isNotUnique = await checkUniqueUsernameEmail(username, email);

  if (isNotUnique) {
    return res.status(400).json({ message: 'Username or email is already in use.' });
  }
  try {

    const tourist = await Tourist.create({ username, name, email, password, mobileNumber, nationality, dob, occupation });
    res.status(200).json({ id: tourist.id, ...tourist.toObject() });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}



export const updateTouristProfile = async (req, res) => {
  const userId = req.user.userId;
  try {
    if (req.body.password) {
      req.body.password = await hashPassword(req.body.password);
    }
    const updatedTourist = await Tourist.findByIdAndUpdate(
      userId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedTourist) {
      res.status(400).json({ error: error.message });
    }
    res.status(200).json(updatedTourist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updatePreferences = async (req, res) => {
  const userId = req.user.userId;
  const { preferences } = req.body;

  if (!Array.isArray(preferences)) {
    return res.status(400).json({ error: 'Invalid preferences format. Expected an array.' });
}

try {
  const updatedTourist = await Tourist.findByIdAndUpdate(
      userId,
      { preferences }, // Assuming preferences is a field in the schema
      { new: true, runValidators: true }
  );

  if (!updatedTourist) {
      return res.status(404).json({ error: 'Tourist not found.' });
  }

  res.status(200).json(updatedTourist);
} catch (error) {
  res.status(400).json({ error: error.message });
}
};

export const getUserPreferences = async (req, res) => {
  const userId = req.user.userId;
  try {
    // Fetch the tourist's preferences
    const tourist = await Tourist.findById(userId).select('preferences'); // Only select preferences field
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    // Return the preferences (tags the user has selected)
    res.status(200).json({
      preferences: tourist.preferences,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTourists = async (req, res) => {
  //retrieve all users from the database
  try {
    const Tourists = await Tourist.find({});
    res.status(200).json(Tourists);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const getMyProfile = async (req, res) => {
  const userId = req.user.userId;
  try {
    const touristInfo = await Tourist.findById(userId);
    res.status(200).json(touristInfo);
  } catch (error) {
    res.status(400).json({ message: "could not fetch account information" });
  }
}


export const updatePoints = async (userId, amountPaid) => {
  try {
    // Find the tourist by userId
    const tourist = await Tourist.findById(userId);
    if (!tourist) {
      throw new Error('Tourist not found');
    }

    let pointsEarned;
    // Calculate points based on loyalty points and amount paid
    if (tourist.loyaltyPoints <= 100000) {
      pointsEarned = amountPaid * 0.5;
    } else if (tourist.loyaltyPoints <= 500000) {
      pointsEarned = amountPaid * 1;
    } else {
      pointsEarned = amountPaid * 1.5;
    }

    // Update loyalty points
    tourist.loyaltyPoints += pointsEarned;

    // Update badge level based on new loyalty points
    if (tourist.loyaltyPoints <= 100000) {
      tourist.badgeLevel = 'Level 1';
    } else if (tourist.loyaltyPoints <= 500000) {
      tourist.badgeLevel = 'Level 2';
    } else {
      tourist.badgeLevel = 'Level 3';
    }

    // Save the tourist with the updated points and badge level
    await tourist.save();
    return { "points": pointsEarned, "current": tourist.loyaltyPoints };  // Return the updated tourist object
  } catch (error) {
    throw new Error(`Error processing payment: ${error.message}`); // Rethrow error for further handling
  }
};

export const redeemPoints = async (req, res) => {
  const userId = req.user.userId;
  const { amount } = req.body;

  console.log("Received amount:", amount);

  try {
    const pointsToRedeem = Number(amount); 
    if (isNaN(pointsToRedeem) || pointsToRedeem <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid number of points to redeem' });
    }

    const tourist = await Tourist.findById(userId);
    if (!tourist) {
      return res.status(404).json({ success: false, message: 'Tourist not found' });
    }

    if (pointsToRedeem > tourist.loyaltyPoints) {
      return res.status(400).json({ success: false, message: 'Not enough points to redeem' });
    }

    const cashEarned = pointsToRedeem / 100; // 100 points = $1
    const newWalletBalance = tourist.wallet + cashEarned;

    // Update loyalty points
    const newLoyaltyPoints = tourist.loyaltyPoints - pointsToRedeem;

    // Determine new level based on the remaining loyalty points
    let newLevel = "Level 1";
    if (newLoyaltyPoints >= 500000) {
      newLevel = "Level 3";
    } else if (newLoyaltyPoints >= 100000) {
      newLevel = "Level 2";
    }

    // Update the tourist's data in the database
    const updatedTourist = await Tourist.findByIdAndUpdate(
      userId,
      {
        wallet: newWalletBalance,
        loyaltyPoints: newLoyaltyPoints,
        badgeLevel: newLevel  // Update the level
      },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedTourist);
  } catch (error) {
    console.error("Error during points redemption:", error);
    res.status(500).json({ success: false, message: `Error redeeming points: ${error.message}` });
  }
};



export const addToCart = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { productId } = req.params; // Item details from request body

    const user = await Tourist.findById(userId).populate("cart.productId");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.quantity < 1) {
      return res.status(400).json({
        message: `Product is out of stock`,
      });
    }
    const existingItem = user.cart.find(item => item.productId && item.productId._id.toString() === productId);
    if (existingItem) {
      existingItem.quantity += 1;
      existingItem.price = product.price * existingItem.quantity;
      // product.quantity -= 1;
    }

    else {
      user.cart.push({ productId, price: product.price });
      // product.quantity -= 1;
    }
    await product.save();
    await user.save();
    res.status(200).json({ message: "Item added to cart", cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: "Failed to add item to cart", error });
  }
};

export const updateCartItemQuantity = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { productId } = req.params; // Product details from request params
    const { quantity } = req.body; // New quantity from request body

    const user = await Tourist.findById(userId).populate("cart.productId");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.quantity < 1 && quantity > 0) {
      return res.status(400).json({
        message: `Product is out of stock`,
      });
    }

    const existingItem = user.cart.find(item => item.productId._id.toString() === productId);

    if (existingItem) {
      if (quantity === 0) {
        // If the quantity is set to 0, remove the item from the cart
        user.cart = user.cart.filter(
          (item) => item.productId._id.toString() !== productId
        );
      } else {
        // Update the quantity of the existing item
        existingItem.quantity = quantity;
        existingItem.price = product.price * quantity;
      }
    } else {
      // If the item doesn't exist in the cart, you could add it with the specified quantity
      if (quantity > 0) {
        user.cart.push({ productId, price: product.price, quantity });
      } else {
        return res.status(400).json({ message: "Quantity must be greater than zero" });
      }
    }
    await product.save();
    await user.save();

    res.status(200).json({ message: "Cart updated", cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: "Failed to update item in cart", error });
  }
};


export const decrementQuantity = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { productId } = req.params; // Item details from request body

    const user = await Tourist.findById(userId).populate("cart.productId");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const existingItem = user.cart.find(item => item.productId._id.toString() === productId);
    if (existingItem) {
      if (existingItem.quantity - 1 < 1) {
        // product.quantity += 1;
        user.cart = user.cart.filter(
          (item) => item.productId._id.toString() !== productId
        );
      }
      else {
        existingItem.quantity -= 1;
        existingItem.price = product.price * existingItem.quantity;
        // product.quantity += 1;
      }
    }

    await product.save();
    await user.save();
    res.status(200).json({ message: "Item quantity decremented", cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: "Failed to decrement quantity of item in cart", error });
  }
};


export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { productId } = req.params;

    const user = await Tourist.findById(userId).populate("cart.productId");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const existingItem = user.cart.find(item => item.productId._id.toString() === productId);
    // product.quantity += existingItem.quantity;
    user.cart = user.cart.filter(
      (item) => item.productId._id.toString() !== productId
    );
    await product.save();
    await user.save();
    res.status(200).json({ message: "Item removed from cart", cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove item from cart", error });
  }
};

// Clear the cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const user = await Tourist.findById(userId).populate("cart.productId");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // user.cart.map(item => )
    user.cart = []; // Clear all items in the cart
    await user.save();

    res.status(200).json({ message: "Cart cleared", cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: "Failed to clear cart", error });
  }
};


export const getCart = async (req, res) => {
  try {
    const userId = req.user?.userId; // Assume user ID is from token/session
    const user = await Tourist.findById(userId).populate("cart.productId");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.cart = user.cart.filter(
      (item) => item.productId && item.productId.archived === false
    );
    user.cart = user.cart.filter(
      (item) => item.productId && item.productId.quantity >= item.quantity
    );
    res.status(200).json({
      message: "Cart details retrieved successfully",
      cart: user.cart,
      totalCartPrice: user.totalCartPrice,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve cart details", error });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const user = await Tourist.findById(userId).populate("wishlist");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.wishlist.filter(p => !p.archived));
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve wishlist", error });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const user = await Tourist.findById(userId);
    if (!user) 
      return res.status(404).json({ message: "User not found" }); // aw not logged in?

    const productId = new mongoose.Types.ObjectId(req.body?.productId);

    const productExists = await Product.exists({ _id: productId });
    if (!productExists) {
      return res.status(404).json({ message: "Product does not exist" });
    }

    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }

    res.status(200).json(user.wishlist);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to add to wishlist", error });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const user = await Tourist.findById(userId);
    if (!user) 
      return res.status(404).json({ message: "User not found" }); // aw not logged in?

    const productId = new mongoose.Types.ObjectId(req.body?.productId);
    user.wishlist = user.wishlist.filter((id) => !id.equals(productId));
    await user.save();

    res.status(200).json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: "Failed to delete from wishlist", error });
  }
};

export const getTouristAddresses = async (req, res) => {
  const touristId = req.user?.userId;  // Ensure you're getting the correct userId from the request

  if (!touristId) {
    return res.status(400).json({ message: 'User not authenticated' });
  }

  try {
    // Use findById instead of find
    const tourist = await Tourist.findById(touristId).select('address');

    if (!tourist) {
      return res.status(404).json({ message: "Tourist doesn't have saved addresses" });
    }

    // Since tourist is a single document, you don't need to map over it
    const addresses = tourist.address;
    return res.status(200).json({ addresses });

  } catch (error) {
    console.error("Error fetching addresses:", error);
    return res.status(500).json({ message: "Failed to retrieve addresses", error: error.message });
  }
};