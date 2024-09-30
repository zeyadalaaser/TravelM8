import Advertiser from '../models/advertiserModel.js'; // Use ES module import

export const createAdvertiser = async (req, res) => {
   const { username, email, password, website, hotline } = req.body;
   try {
      const advertiser = await Advertiser.create({ username, email, password, website, hotline });
      res.status(200).json(advertiser);
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
};

export const updateAdvertiser = async (req, res) => {
   const {username} = req.params;
   try{
      const updatedAdvertiser = await Advertiser.findOneAndUpdate(
         { username },        
         req.body,         
         { new: true, runValidators: true }          
       );
       if (!updatedAdvertiser){
         res.status(400).json({error:error.message});
       }
      res.status(200).json(updatedAdvertiser);
   }catch(error){
      res.status(400).json({error:error.message});
   }
};

export const getAdvertisers = async (req, res) => {
   try {
      const advertisers = await Advertiser.find({});
      res.status(200).json(advertisers);
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
};
