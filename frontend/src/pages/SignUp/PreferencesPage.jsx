import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Palmtree, ShoppingBag, Landmark, Users } from 'lucide-react';

export default function PreferencesPage() {
  const { touristId } = useParams(); // Get the touristId from the URL
  const navigate = useNavigate(); // Initialize the navigate function
  const [preferences, setPreferences] = useState({
    historic: false,
    beaches: false,
    familyFriendly: false,
    shopping: false,
    budget: 50,
  });

  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);  // Track loading state

  useEffect(() => {
    const selectedCount = Object.values(preferences).filter(Boolean).length - 1; // Subtract 1 to exclude budget
    setProgress((selectedCount / 4) * 100);
  }, [preferences]);

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
        alert('You are not authenticated. Please log in.');
        setLoading(false);  // Stop loading
        return;
      }

      const response = await axios.put(
        `http://localhost:5001/api/tourists/${touristId}/updatePreferences`, 
        { preferences }, // Wrap preferences in an object
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert('Preferences saved!');
      console.log("the pref: ", preferenceItems);

      // Redirect to tourist page after saving preferences
      navigate('/tourist-page');  // Navigate to tourist page
    } catch (error) {
      console.error('Failed to save preferences', error);
      if (error.response?.status === 403) {
        alert('You do not have permission to update preferences.');
      } else {
        alert('An error occurred while saving preferences.');
      }
    } finally {
      setLoading(false);  // Stop loading
    }
  };

  useEffect(() => {
    console.log("Current URL:", window.location.href); // Check the current URL
    console.log("Tourist ID:", touristId); // Check the touristId
  }, [touristId]);

  const preferenceItems = [
    { name: 'historic', icon: Landmark, label: 'Historic Areas' },
    { name: 'beaches', icon: Palmtree, label: 'Beaches' },
    { name: 'familyFriendly', icon: Users, label: 'Family-Friendly' },
    { name: 'shopping', icon: ShoppingBag, label: 'Shopping' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-green-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center text-gray-900 mb-8"
        >
          Customize Your Dream Vacation
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden shadow-lg">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  {preferenceItems.map(({ name, icon: Icon, label }) => (
                    <div key={name} className="relative">
                      <input
                        type="checkbox"
                        id={name}
                        checked={preferences[name]}
                        onChange={() => handleToggle(name)}
                        className="sr-only"
                      />
                      <label
                        htmlFor={name}
                        className={`flex items-center p-4 rounded-lg cursor-pointer transition-all ${
                          preferences[name]
                            ? 'bg-blue-500 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-6 h-6 mr-3" />
                        <span className="text-lg font-medium">{label}</span>
                        <div
                          className={`absolute right-3 w-10 h-6 rounded-full transition-all ${
                            preferences[name] ? 'bg-blue-300' : 'bg-gray-300'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${
                              preferences[name] ? 'right-1' : 'left-1'
                            }`}/>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
                <div className="mb-8">
                  <label htmlFor="budget" className="block text-lg font-medium text-gray-700 mb-2">
                    Budget: ${preferences.budget * 20}
                  </label>
                  <Slider
                    id="budget"
                    min={0}
                    max={100}
                    step={1}
                    value={[preferences.budget]}
                    onValueChange={handleBudgetChange}
                    className="w-full"
                  />
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
    </div>
  );
}
