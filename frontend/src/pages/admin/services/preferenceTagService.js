// src/services/preferenceTagService.js
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/preference-tags'; // 

const createPreferenceTag = async (tagName) => {
  const response = await axios.post(API_URL, { name: tagName });
  return response.data;
};

const getAllPreferenceTags = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const updatePreferenceTag = async (oldName, newName) => {
  const response = await axios.put(API_URL, { name: oldName, newName });
  return response.data;
};

const deletePreferenceTag = async (tagName) => {
  const response = await axios.delete(API_URL, { data: { name: tagName } });
  return response.data;
};

export { createPreferenceTag, getAllPreferenceTags, updatePreferenceTag, deletePreferenceTag };
