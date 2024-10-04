import PendingUser from "../models/pendingUserModel";
import { checkUniqueUsernameEmail } from "../helpers/signupHelper.js"; 

export const createPendingUser = async (req,res) => {
    const {username, email, password} = req.body;
    const isNotUnique = await checkUniqueUsernameEmail(username, email);
 
         if (isNotUnique) {
             return res.status(400).json({ message: 'Username or email is already in use.' });
         }
    try{
       const seller = await Seller.create({username,  email, password});
       res.status(200).json(seller);
    }catch(error){
       res.status(400).json({error:error.message});
    }
};

// Controller to accept a pending user
export const acceptPendingUser = async (req, res) => {
    try {
      const userId = req.params.id;
      const type = req.body;
  
      // Find the pending user by ID
      const pendingUser = await PendingUser.findById(userId);
  
      if (!pendingUser) {
        return res.status(404).json({ message: 'Pending user not found' });
      }

      const newUser = {
        username: pendingUser.username,
        email: pendingUser.email,
        password: pendingUser.password,
      };
      
      switch(type){ 
    
          case 'TourGuide':
              result = await TourGuide.create({ ...newUser });
              break;
          case 'Seller':
              result = await Seller.create({ ...newUser });
              break;
          case 'Advertiser':
              result = await Advertiser.create({ ...newUser });
              break;
          default:
              return res.status(400).send('Invalid user type');
      }
  
      // Remove the user from the PendingUser collection
      await PendingUser.findByIdAndDelete(userId);
      return res.json({ message: 'User accepted and added to the main collection' });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Controller to reject a pending user
export const rejectPendingUser = async (req, res) => {
    try {
      const userId = req.params.id;
  
      // Find and delete the user from the pendingUsers collection
      const deletedUser = await PendingUser.findByIdAndDelete(userId);
  
      if (!deletedUser) {
        return res.status(404).json({ message: 'Pending user not found' });
      }
  
      return res.json({ message: 'User rejected and removed from pending users' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Controller to reject a pending user
export const getPendingUsers = async (req, res) => {
    //retrieve all users from the database
    try{
       const pendingUsers = await PendingUser.find({});
       res.status(200).json(pendingUsers);
    }catch(error){
       res.status(400).json({error:error.message});
    }

};

