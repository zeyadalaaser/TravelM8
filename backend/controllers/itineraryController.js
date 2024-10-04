const Itinerary = require('../models/itineraryModel.js');
const Activity = require('../models/activityModel.js');
const historicalPlaces = require('../models/historicalPlacesModel.js');

//const { default: mongoose } = require('mongoose');

//create new itinerary 
const createItinerary = async (req, res) => {
    try {
        const newItinerary = new Itinerary(req.body); // Create a new instance of the Itinerary model
        await newItinerary.save(); // Save the new itinerary to the database
        res.status(201).json({
             message: 'Itinerary added successfully', itinerary: newItinerary }); // Send a success response
    } catch (error) {
        res.status(500).json({ 
            message: 'Error adding itinerary', error: error.message }); // Send error response if something goes wrong
    }
};

// read/retrieve all itineraries 
const readItineraries = async (req, res) => {
    try {
        const itineraries = await Itinerary.find().populate('activities').populate(
            'historicalSites'); // Fetch all itineraries and populate activities
        res.status(200).json(itineraries); // Send the list of itineraries in the response
    } catch (error) {
        res.status(500).json({
             message: 'Error fetching itineraries', error: error.message }); // Send error response if something goes wrong
    }
};
   //TourGuide only
   export const getMyItineraries = async(req, res) => {    
    let itineraries;
    if(user.type === "TourGuide"){
        itineraries = await Itinerary.find({tourGuideId: user.id}).populate('activities').populate(
            'historicalSites');
        if(itineraries.length == 0)
            res.status(204);
        else
            res.status(200).json({itineraries});
    }else{
        res.status(400).json({message:"enter a valid id"});
    }
  };

// update an itinerary in the database
const updateItinerary = async (req, res) => {
    try {
        const { id } = req.params; // Get itinerary ID from URL parameters
        const updatedItinerary = await Itinerary.findByIdAndUpdate(id, req.body, { new: true }); // Update the itinerary

        if (!updatedItinerary) {
            return res.status(404).json({
                 message: 'Itinerary not found' }); // Handle case where itinerary is not found
        }

        res.status(200).json({ 
            message: 'Itinerary updated successfully', itinerary: updatedItinerary }); // Send success response
    } catch (error) {
        res.status(500).json({ 
            message: 'Error updating itinerary', error: error.message }); // Send error response if something goes wrong
    }
};

// delete an itinerary from the database
const deleteItinerary = async (req, res) => {

    /////////////////////////////////////////////////////////////////////////////////
    ///??????????????????? cannot be deleted if bookings are already made
    /////////////////////////////////////////////////////////////////////////////////

    try {
        const { id } = req.params; // Get itinerary ID from URL parameters
        const deletedItinerary = await Itinerary.findByIdAndDelete(id); // Find the itinerary by ID and delete

        if (!deletedItinerary) {
            return res.status(404).json({
                 message: 'Itinerary not found' }); // Handle case where itinerary is not found
        }

        res.status(200).json({
             message: 'Itinerary deleted successfully' }); // Send success response
    } catch (error) {
        res.status(500).json({ 
            message: 'Error deleting itinerary', error: error.message }); // Send error response if something goes wrong
    }
};

// const filterItineraries = async (req, res) => {
//     try {
//         const { budget, date, preferences, tourLanguage } = req.query;

//         const fixedPreferences = ['historic', 'beaches', 'family-friendly', 'shopping']; // Fixed array of preferences
//         const filterCriteria = {};   

        
//         // Budget filtering: expects budget to be an array [min, max]

//         if (budget) {
//             const budgetArray = budget.split(',').map(Number); // Convert to array of numbers
//             if (budgetArray.length === 2) { // Ensure the array has exactly two values
//                 const [min, max] = budgetArray; // Destructure the array
//                 // Include values less than the min and within the min-max range
//                 filterCriteria.price = {
//                     $or: [
//                         { $lte: min }, // Prices less than or equal to min
//                         { $gte: min, $lte: max } // Prices within the range [min, max]
//                     ]
//                 };
//             }
//         }

//         // Date filtering
//         if (date) {
//             const availableDate = new Date(date);
//             filterCriteria.availableDates = { $gte: availableDate }; // Upcoming dates
//         } 
//         // Preferences filtering
//         if (preferences) {
//           //  const prefArray = preferences.split(',');
//            // const validPreferences = prefArray.filter(pref => fixedPreferences.includes(pref));
//             //filterCriteria.preferences = { $in: validPreferences };  
//             filterCriteria.preferences =preferences;
//         }

//         // Language filtering
//         if (tourLanguage) {
//             filterCriteria.tourLanguage = tourLanguage; // Exact match for language
//         }

//         const itineraries = await Itinerary.find(filterCriteria).populate('activities').populate(
//             'historicalSites');
//         res.status(200).json(itineraries); // Return the filtered itineraries

//     } catch (error) {
//         res.status(500).json({ message: 'Error filtering itineraries', error: error.message });
//     }
// };

const searchItems = async (req, res) => {
    try {
        // Destructure search parameters from the request query
        const { name, category, tags } = req.query;
    
        // Initialize empty filter objects for each collection
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
          activityFilter.category = category.toLowerCase();  // Exact match for category
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
    
   export const filterItineraries2 = async (req, res) => {
        try {
          const { budget, tags, language, date } = req.query;   
      
          const query = {};
      
          if (budget) {
            const budgetArray = budget.split(',').map(Number);  
            if (budgetArray.length === 2) {  
                const [min, max] = budgetArray;  
                query.price = {
                    $or: [
                        { $lte: min },   
                        { $gte: min, $lte: max } 
                    ]
                };
            }
          }
      
          // Tags filter (match any itinerary that contains the specified tags)
          if (tags) {
            query.tags = { $in: tags.split(',') };  // Split the tags if provided as a comma-separated string
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
            .populate('tags');   
           
    
          res.status(200).json(itineraries);
        } catch (error) {
          console.error("Error filtering itineraries:", error);
          res.status(500).json({ message: "Server error. Could not filter itineraries." });
        }
      };
      

module.exports = { createItinerary, readItineraries, updateItinerary, 
                    deleteItinerary,filterItineraries, searchItems };