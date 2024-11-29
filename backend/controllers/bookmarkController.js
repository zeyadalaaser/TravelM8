import mongoose from "mongoose";
import Bookmark from "../models/bookmarks.js";

export const AddtoBookmarks = async (req, res) => {
    const { itemId, itemType } = req.body;
    const touristId = req.user.userId;
  
    try {
      if (!['Activity', 'Itinerary'].includes(itemType)) {
        return res.status(400).json({ message: "Invalid item type" });
      }
      // Check if bookmark already exists
      const existingBookmark = await Bookmark.findOne({ 
        touristId, 
        itemId,
        itemType
      });

      if (existingBookmark) {
         // Toggle bookmark status
         existingBookmark.bookmark = !existingBookmark.bookmark;
         await existingBookmark.save();
         
         return res.status(200).json({ 
             message: existingBookmark.bookmark ? "Bookmark added!" : "Bookmark removed!",
             bookmark: existingBookmark
         });
      }
  
      const newBookmark= new Bookmark({
        touristId,
        itemId,
        itemType,
        bookmark: true
      });
  
      await newBookmark.save();
      res.status(201).json({ 
        message: "Bookmark added!", 
        bookmark: newBookmark 
    });
  }catch (error) {
    console.error("Error bookmarking activity:", error);
    return res.status(500).json({ message: "Internal server error." });
    }
  };

  export const getAllTourBookmarks = async (req, res) => {
    try {
        const touristId = req.user.userId;
        const { type } = req.query; // Optional query parameter to filter by type

        let query = { touristId };
        if (type) {
            query.itemType = type;
        }

        const allBookmarks = await Bookmark.find(query)
            .populate({
                path: 'itemId',
                // This will populate based on the itemType field
                refPath: 'itemType'
            });

        res.status(200).json({
            allBookmarks,
            message: "Successfully fetched all your bookmarks!",
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const removeBookmark = async (req, res) => {
  try {
      const bookmarkId = req.params.id;
      const bookmark = await Bookmark.findById(bookmarkId);
      
      if (!bookmark) {
          return res.status(404).json({ message: "Bookmark not found" });
      }

      if (bookmark.touristId.toString() !== req.user.userId) {
          return res.status(403).json({ message: "Unauthorized" });
      }

      await Bookmark.findByIdAndDelete(bookmarkId);

      res.status(200).json({
          message: "Successfully removed your bookmark!"
      });
  } catch (error) {
      console.error("Error removing bookmark:", error);
      res.status(400).json({ message: error.message });
  }
};