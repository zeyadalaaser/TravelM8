import PlaceTag from "../models/placeTag.js";

export const getAllTags = async (req, res) => {
    try {
      const tags = await PlaceTag.find(); 
      res.status(200).json(tags); 
    } catch (error) {
      res.status(500).json({ message: "Internal server error" }); // Handle errors
    }
};

export const createTag = async (req, res) => {
    const { type, historicalPeriod } = req.body; // Destructure the type and historicalPeriod from the request body
  
    if (!type || !historicalPeriod) {
      throw new Error("Type and historical period are required");
    }
  
    const newTag = new PlaceTag({ type, historicalPeriod });
  
    try {
      const savedTag = await newTag.save(); // Save the new tag to the database
      res.status(201).json(savedTag); // Respond with the saved tag
    } catch (error) {
      res.status(400).json({ message: error.message }); // Handle validation errors
    }
};