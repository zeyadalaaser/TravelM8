import mongoose from "mongoose";
import bookmarkActivity from "../models/bookmarks.js";
import Activity from "../models/activityModel.js";

export const AddtoBookmarks = async (req, res) => {
    const { activityId} = req.body;
    const touristId = req.user.userId;
  
    try {
      // Check if bookmark already exists
      const existingBookmark = await bookmarkActivity.findOne({ 
          touristId, 
          activityId 
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
  
      const newBookmark= new bookmarkActivity({
        touristId,
        activityId,
        bookmark:true
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
        const allBookmarks = await bookmarkActivity.find({
          touristId: touristId,
        }).populate("activityId");
        res
          .status(201)
          .json({
            allBookmarks,
            message: "Successfully fetched all your Bookmarked activity!",
          });
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    };

export const removeBookmark = async (req, res) => {
      try {
          const bookmarkId = req.params.id;
          const bookmark = await bookmarkActivity.findById(bookmarkId);
          
          if (!bookmark) {
              return res.status(404).json({ message: "Bookmark not found" });
          }
  
          // Verify the bookmark belongs to the current user
          if (bookmark.touristId.toString() !== req.user.userId) {
              return res.status(403).json({ message: "Unauthorized" });
          }
  
          await bookmarkActivity.findByIdAndDelete(bookmarkId);
  
          res.status(200).json({
              message: "Successfully removed your bookmark!"
          });
      } catch (error) {
          console.error("Error removing bookmark:", error);
          res.status(400).json({ message: error.message });
      }
  };
