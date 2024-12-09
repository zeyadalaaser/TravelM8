import express from 'express';
import { createTourist, updateTouristProfile, getTourists, getMyProfile
,updatePoints,redeemPoints, updatePreferences,addToCart,removeFromCart,clearCart,getCart, getCart2, decrementQuantity, 
getWishlist, updateCartItemQuantity,getUserPreferences, getTouristAddresses,
addToWishlist,
removeFromWishlist} from '../controllers/touristController.js';
import verifyToken from '../services/tokenDecodingService.js';
import { changePasswordTourist } from '../controllers/changePassword.js';


const touristRoute = express.Router();

// Define the routes
touristRoute.post('/tourists', createTourist);              // Create a new user with website, hotline, etc.
touristRoute.put('/tourists/updateMyProfile', verifyToken , updateTouristProfile);        // Update user information by email
touristRoute.get('/tourists', getTourists);                 // Read user by email
touristRoute.get('/tourists/myProfile', verifyToken , getMyProfile);
touristRoute.post("/tourists/changepassword", verifyToken, changePasswordTourist);
touristRoute.put('/updatePoints', verifyToken , updatePoints);
touristRoute.put('/redeemPoints',verifyToken,redeemPoints);
 //touristRoute.put('/redeemPoints/:id',redeemPoints);
 // touristRoute.put('/updatePoints/:id',updatePoints);
touristRoute.put("/tourists/updatePreferences", verifyToken, updatePreferences);
touristRoute.get("/tourists/preferences",verifyToken, getUserPreferences);
touristRoute.post("/tourists/cart/:productId", verifyToken, addToCart);
touristRoute.delete("/tourists/cart/:productId", verifyToken,removeFromCart);
touristRoute.delete("/tourists/cart/decrementItem/:productId",verifyToken,decrementQuantity);
touristRoute.delete("/tourists/cart/clear",verifyToken, clearCart);
touristRoute.get("/tourists/cart",verifyToken, getCart);
touristRoute.get("/tourists/cart2",verifyToken, getCart2);
touristRoute.get("/tourists/wishlist",verifyToken, getWishlist);
touristRoute.post("/tourists/wishlist",verifyToken, addToWishlist);
touristRoute.delete("/tourists/wishlist",verifyToken, removeFromWishlist);
touristRoute.put("/tourists/cart/:productId",verifyToken, updateCartItemQuantity);
touristRoute.get('/tourists/addresses', verifyToken, getTouristAddresses);

export default touristRoute; 