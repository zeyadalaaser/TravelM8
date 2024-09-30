import Seller from '../models/sellerModel.js'; 

export const createSeller = async(req,res) => {
   //add a new user to the database with 
   const {username, name, description, email, password} = req.body;
   try{
      const seller = await Seller.create({username, name, description, email, password});
      res.status(200).json(seller);
   }catch(error){
      res.status(400).json({error:error.message});
   }
}


export const updateSeller = async (req, res) => {
   const {username} = req.params;
   try{
      const updatedSeller = await Seller.findOneAndUpdate(
         { username },        
         req.body,         
         { new: true, runValidators: true }          
       );
       if (!updatedSeller){
         res.status(400).json({error:error.message});
       }
      res.status(200).json(updatedSeller);
   }catch(error){
      res.status(400).json({error:error.message});
   }
};


  export const getSellers = async (req, res) => {
    //retrieve all users from the database
    try{
       const sellers = await Seller.find({});
       res.status(200).json(sellers);
    }catch(error){
       res.status(400).json({error:error.message});
    }
 }
 

