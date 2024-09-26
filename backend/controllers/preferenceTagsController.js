const PreferenceTags = require("../models/preferenceTagsModel");
; 



const createPreferenceTag = async (req, res) => {
  console.log("PreferenceTags:", PreferenceTags);
  const { name } = req.body; 
  try {
    const newTag = new PreferenceTags({ name });
    await newTag.save();
    res.status(201).json(newTag); 
  } catch (error) {
    console.error("Error creating PreferenceTag:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllPreferenceTags = async (req, res) => {
  try {
    const tags = await PreferenceTags.find(); 
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};


const updatePreferenceTag = async (req, res) => {
  const { name, newname } = req.body; 
  try {
    const updatedTag = await PreferenceTags.findOneAndUpdate({ name },{ name: newname },{ new: true } );

    if (!updatedTag) {
      return res.status(404).json({ message: "Tag not found" });
    }
    
    res.status(200).json(updatedTag);
  } catch (error) {
    console.error("Error updating Tag:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const deletePreferenceTag = async (req, res) => {
  const { name } = req.body;
  try {
    const deletedTag = await PreferenceTags.deleteOne({ name });
    if (deletedTag.deletedCount === 0) { 
      return res.status(404).json({ message: "Tag not found" });
    }
    res.status(200).json({ message: "Tag deleted successfully" });
  } catch (error) {
    console.error("Error deleting Tag:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createPreferenceTag,
  getAllPreferenceTags,
  updatePreferenceTag,
  deletePreferenceTag,
};
