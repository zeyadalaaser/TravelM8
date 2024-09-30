import TourGuide from '../models/tourguideModel.js'; 

export const createUser = async(req,res) => {
   //add a new user to the database with 
   const {username,email, password} = req.body;
   try{
      const user = await TourGuide.create({username, email, password});
      res.status(200).json(user);
   }catch(error){
      res.status(400).json({error:error.message});
   }
}


export const updateUser = async (req, res) => {
   const {username} = req.params;
   try{
      const updatedUser = await TourGuide.findOneAndUpdate(
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
       const users = await TourGuide.find({});
       res.status(200).json(users);
    }catch(error){
       res.status(400).json({error:error.message});
    }
 }
 

