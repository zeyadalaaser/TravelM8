import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tag } from 'lucide-react';
import { toast } from 'sonner';

export default function PreferencesPage() {
  const { touristId } = useParams(); // Get the touristId from the URL
  const navigate = useNavigate(); // Initialize the navigate function
  const [preferences, setPreferences] = useState({}); // Preferences state
  const [allPreferences, setAllPreferences] = useState([]); // Store fetched preferences
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);  // Track loading state
  const [loadingPreferences, setLoadingPreferences] = useState(true); 

  useEffect(() => {
    const token = localStorage.getItem('token');  // Get token from storage or context

    // Fetch preferences from the backend
    const fetchPreferences = async () => {
        setLoadingPreferences(true); // Start loading
        try {
          const response = await axios.get('http://localhost:5001/api/preference-tags'); // Get all preferences
          setAllPreferences(response.data); // Set the fetched preferences
      
          // Fetch the tourist's preferences
          const touristPreferencesResponse = await axios.get('http://localhost:5001/api/tourists/preferences', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
      
          const touristPreferences = touristPreferencesResponse.data?.preferences || []; // Access the preferences array inside the object
          console.log(touristPreferences);  // Log the data to inspect it
      
          if (!Array.isArray(touristPreferences)) {
            console.error('touristPreferences is not an array:', touristPreferences);
            return;
          }
      
          const initialPreferences = response.data.reduce((acc, pref) => {
            // Set initial preference values, assuming `touristPreferences` is an array of strings
            acc[pref.name] = touristPreferences.includes(pref.name);
            return acc;
          }, {}); 
      
          setPreferences(initialPreferences); // Set initial preferences state
        } catch (error) {
          console.error('Failed to fetch preferences', error);
        } finally {
          setLoadingPreferences(false); // Stop loading after data fetching
        }
      };
      

    fetchPreferences();
  }, [touristId]); // Run once when the component mounts

  useEffect(() => {
    if (allPreferences.length > 0) {
      const selectedCount = Object.values(preferences).filter(Boolean).length;
      setProgress((selectedCount / allPreferences.length) * 100); // Adjust progress based on fetched preferences
    }
  }, [preferences, allPreferences]);

  const handleToggle = (name) => {
    setPreferences((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleBudgetChange = (value) => {
    setPreferences((prev) => ({ ...prev, budget: value[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);  // Start loading

    try {
      const token = localStorage.getItem('token');  // Get token from storage or context

      if (!token) {
        toast('You are not authenticated. Please log in.');
        setLoading(false);  // Stop loading
        return;
      }

      const preferencesArray = Object.entries(preferences)
        .filter(([name, value]) => value && name !== 'budget') // Filter out 'budget' or any unchecked preferences
        .map(([name]) => name); // Map to an array of selected preference names

      const response = await axios.put(
        'http://localhost:5001/api/tourists/updatePreferences', 
        { preferences: preferencesArray },
        { headers: { Authorization: `Bearer ${token}`,  } }
      );
      
      toast('Preferences saved!');
      window.location.href = '/tourist-profile';
    } catch (error) {
      console.error('Failed to save preferences', error);
      if (error.response?.status === 403) {
        toast('You do not have permission to update preferences.');
      } else {
        toast('An error occurred while saving preferences.');
      }
    }
  };

  const preferenceItems = allPreferences.map((pref) => ({
    name: pref.name,
    label: pref.label,
    icon: pref.icon || Tag, // Fallback to Palmtree if icon is missing
  }));

  return (
    <div className="container p-4 bg-background">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold mb-6"
      >
        Choose your preferences!
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-hidden shadow-lg mb-6">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                {preferenceItems.map(({ name, icon: Icon, label }) => (
                  <div key={name} className="relative">
                    <input
                      type="checkbox"
                      id={name}
                      checked={preferences[name] || false}
                      onChange={() => handleToggle(name)}
                      className="sr-only"
                    />
                    <label
                      htmlFor={name}
                      className={`flex items-center p-4 rounded-lg cursor-pointer transition-all ${preferences[name] ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                    >
                      <Icon className="w-6 h-6 mr-3" />
                      <span className="text-lg font-medium">{label}</span>
                      <span className="ml-2 text-sm text-gray-600">{name}</span>
                      <div
                        className={`absolute right-3 w-10 h-6 rounded-full transition-all ${preferences[name] ? 'bg-blue-300' : 'bg-gray-300'}`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${preferences[name] ? 'right-1' : 'left-1'}`}
                        />
                      </div>
                    </label>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mb-8">
                <div className="text-sm text-gray-600">Preferences selected: {Math.round(progress)}%</div>
                <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Saving...' : 'Save Preferences'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
