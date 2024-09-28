import Advertiser from '../models/advertiserModel.js'; // Use ES module import

export const createUser = async (req, res) => {
   const { username, email, password, website, hotline } = req.body;
   try {
      const user = await Advertiser.create({ username, email, password, website, hotline });
      res.status(200).json(user);
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
};

export const updateUser = async (req, res) => {
   const {username} = req.params;
   try{
      const updatedUser = await Advertiser.findOneAndUpdate(
         { username },        
         req.body,         
         { new: true, runValidators: true }          
       );
       if (!updatedUser){
         res.status(400).json({error:error.message});
       }
      res.status(200).json(updatedUser);
   }catch(error){
      res.status(400).json({error:error.message});
   }
};

export const getUsers = async (req, res) => {
   try {
      const users = await Advertiser.find({});
      res.status(200).json(users);
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
};
