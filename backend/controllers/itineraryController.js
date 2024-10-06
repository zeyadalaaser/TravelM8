import Itinerary from '../models/itineraryModel.js';
import Activity from '../models/activityModel.js';
import historicalPlaces from '../models/historicalPlacesModel.js'
import mongoose from "mongoose";
//create new itinerary 
export const createItinerary = async (req, res) => {
    try {
        const newItinerary = new Itinerary(req.body);  
        await newItinerary.save(); 
        res.status(201).json({
             message: 'Itinerary added successfully', itinerary: newItinerary });  
    } catch (error) {
        res.status(500).json({ 
            message: 'Error adding itinerary', error: error.message });    
    }
};

// read/retrieve all itineraries 
export const readItineraries = async (req, res) => {
    try {
        const { upcoming } = req.query;
        const filters = {};

        if (upcoming === 'true')
            filters['availableSlots.startTime'] = { $gte: new Date() };

        const itineraries = await Itinerary.find(filters).populate('activities').populate(
          'historicalSites').populate("tags").populate("tourGuideId");  
        res.status(200).json(itineraries);  
    } catch (error) {
        res.status(500).json({
             message: 'Error fetching itineraries', error: error.message });   
    }
};

   //TourGuide only
   export const getMyItineraries = async(req, res) => {    
    try{
    const {tourGuideId}=req.body;
    if(!mongoose.Types.ObjectId.isValid(tourGuideId)){
      return res.status(404).json({ message:"Enter a valid id"});
    }
       const itineraries = await Itinerary.find({tourGuideId}).populate('activities').populate(
            'historicalSites').populate("tags").populate("tourGuideId");
        if(itineraries.length==0)
          return  res.status(404).json({message:"no itineraries found"});
        else
          return  res.status(200).json({itineraries});
}catch(error){
       return res.status(400).json({ message: 'Error', error: error.message});
    }
  };

// update an itinerary in the database
export const updateItinerary = async (req, res) => {
    try {
        const { id } = req.params; 
        const updatedItinerary = await Itinerary.findByIdAndUpdate(id, req.body, { new: true }).populate('activities').populate(
          'historicalSites').populate("tags").populate("tourGuideId"); 

        if (!updatedItinerary) {
            return res.status(404).json({
                 message: 'Itinerary not found' });  
        }

        res.status(200).json({ 
            message: 'Itinerary updated successfully', itinerary: updatedItinerary });   
    } catch (error) {
        res.status(500).json({ 
            message: 'Error updating itinerary', error: error.message });  
    }
};
 
export const deleteItinerary = async (req, res) => {

    try {
        const { id } = req.params;  
        const itineraryToBeDeleted = await Itinerary.findById(id);

        if (!itineraryToBeDeleted) {
          return res.status(404).json({ message: 'Itinerary not found' });
        }
        
        let hasBookings = false;   
        const slots = itineraryToBeDeleted.availableSlots;
        console.log(hasBookings);
        for (let i = 0; i < slots.length; i++) {
            console.log('Checking slot:', slots[i]); 
            console.log(slots[i].numberOfBookings);
            if (slots[i].numberOfBookings > 0) {
                hasBookings = true;
                console.log(hasBookings);
                break;   
            }
        }
        
        if (hasBookings) {
            console.log('Itinerary has bookings:', slots);
            return res.status(400).json({ message: 'Cannot delete itinerary with existing bookings' });
        }else{
        const deletedItinerary = await Itinerary.findByIdAndDelete(id);  }

         return res.status(200).json({message: 'Itinerary deleted successfully' }); 
    } catch (error) {
       return res.status(500).json({ 
            message: 'Error deleting itinerary', error: error.message }); 
    }
};


export const filterItineraries = async (req, res) => {
  try {
    const { budget, tags, language, date } = req.query;   

    const query = {};

    if (budget) {
      const budgetArray = budget.split('-').map(Number);  
      if (budgetArray.length === 2) {  
       
          const [min, max] = budgetArray;  
          query.$or = [
            { price: { $lte: min } },    
            { price: { $gte: min, $lte: max } }  
        ];
      }  else if (budgetArray.length === 1) {  
        const [min] = budgetArray; 
        query.price = { $lte: min }; 
    }
      
    }

    
    if (tags) {
      const tagsArray = tags.split(',').map(tag => tag.trim()); // Trim any whitespace
      console.log(tagsArray);
      //query.tags = { $elemMatch: { name: { $in: tagsArray } } };
      
      query.tags=tags;
      console.log(query.tags);

    }

    if (language) {
      query.tourLanguage = language;
    }

     
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999); // Set to end of the day

      query['availableSlots.date'] = {
        $gte: startDate,  
        $lte: endDate,    
      };
    }

    // Fetch filtered itineraries
    const itineraries = await Itinerary.find(query)
      .populate('activities')  
      .populate('historicalSites')  
      .populate('tags').populate("tourGuideId");   
     

    res.status(200).json(itineraries);
  } catch (error) {
    console.error("Error filtering itineraries:", error);
    res.status(500).json({ message: "Server error. Could not filter itineraries." });
  }
};
export const searchItems = async (req, res) => {
  try {
       
      const { name, category, tags } = req.query;
   
      const activityFilter = {};
      const historicalPlacesFilter = {};
      const itineraryFilter = {};
  
      // Name Filtering: Apply to both Activities and Historical Places
      if (name) {
        const regexName = { $regex: name, $options: 'i' }; // Case-insensitive regex for partial match
        activityFilter.name = regexName;
        historicalPlacesFilter.name = regexName;
        itineraryFilter.name = regexName;
      }
  
      // Category Filtering: Apply only to Activities
      if (category) {
        activityFilter.category = category.toLowerCase();    
      }
  
      // Tags Filtering: Apply only to Historical Places and activities
      if (tags) {
        const tagsArray = tags.split(',').map(tag => tag.trim().toLowerCase());
        activityFilter.tags = { $in: tagsArray };
        historicalPlacesFilter.tags = { $in: tagsArray }; // Match any tag in the array
      }
  
      // Perform searches for each collection
      const activities = await Activity.find(activityFilter);
      const historicalPlace = await historicalPlaces.find(historicalPlacesFilter);
      const itineraries = await Itinerary.find(itineraryFilter).populate('activities').populate(
          'historicalSites');
  
      const results = { activities, historicalPlace, itineraries }; // Combine results from both collections
  
      // If no results found, send a 404 response
      if (activities.length === 0 && historicalPlaces.length === 0 && itineraries.length==0) {
        return res.status(404).json({
          success: false,
          message: 'No matching results found for the given criteria',
        });
      }
  
      // Return the combined results
      res.status(200).json({
        success: true,
        message: 'Results fetched successfully',
        results,
      });
    } catch (error) {
      // Handle any server errors
      res.status(500).json({
        success: false,
        message: 'Error occurred while searching',
        error: error.message,
      });
    }
  };