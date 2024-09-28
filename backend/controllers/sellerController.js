import Seller from '../models/sellerModel.js'; 

export const createUser = async(req,res) => {
   //add a new user to the database with 
   const {username, name, description, email, password} = req.body;
   try{
      const user = await Seller.create({username, name, description, email, password});
      res.status(200).json(user);
   }catch(error){
      req.status(400).json({error:error.message});
   }
}


export const updateUser = async (req, res) => {
   const {username} = req.params;
   try{
      const updatedUser = await Seller.findOneAndUpdate(
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
    //retrieve all users from the database
    try{
       const users = await Seller.find({});
       res.status(200).json(users);
    }catch(error){
       req.status(400).json({error:error.message});
    }
 }
 

