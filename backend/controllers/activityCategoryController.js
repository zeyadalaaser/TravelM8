import ActivityCategory from "../models/activityCategoryModel.js";

// Create a new activity category
export const createActivityCategory = async (req, res) => {
  const { name } = req.body; // Only get name
  try {
    const newCategory = new ActivityCategory({ name });
    await newCategory.save();
    res.status(201).json(newCategory); // Send the created category back
  } catch (error) {
    console.error("Error creating activity category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all activity categories
export const getAllActivityCategories = async (req, res) => {
  try {
    const categories = await ActivityCategory.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching activity categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update an activity category
export const updateActivityCategory = async (req, res) => {
  const { name, newName } = req.body; // Get current name and new name from the body
  try {
    const updatedCategory = await ActivityCategory.findOneAndUpdate(
      { name }, // Find by current name
      { name: newName }, // Update to the new name
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error("Error updating activity category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete an activity category
export const deleteActivityCategory = async (req, res) => {
  const { name } = req.body; // Get the name from the body
  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  try {
    // Use a case-insensitive regular expression to find the category
    const deletedCategory = await ActivityCategory.findOneAndDelete({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Activity category deleted successfully" });
  } catch (error) {
    console.error("Error deleting activity category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Export all functions
/*module.exports = {
  createActivityCategory,
  getAllActivityCategories,
  updateActivityCategory,
  deleteActivityCategory,
};*/
