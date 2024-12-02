import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tag } from 'lucide-react';

export default function PreferencesPage({ token, touristId }) {
  const [preferences, setPreferences] = useState({});  // Change to object
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPreferencesForm, setShowPreferencesForm] = useState(false);
  const [allPreferences, setAllPreferences] = useState([]);
  const [progress, setProgress] = useState(0);

  // Fetch tourist preferences
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/tourist/${touristId}/preferences`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const prefObject = response.data.preferences.reduce((acc, pref) => {
          acc[pref] = true; // Convert preferences array to an object
          return acc;
        }, {});
        setPreferences(prefObject);  // Set as object
      } catch (err) {
        setError(err.response ? err.response.data.message : 'Failed to load preferences');
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [touristId, token]);

  // Fetch all available preferences
  useEffect(() => {
    const fetchAllPreferences = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/preference-tags');
        setAllPreferences(response.data); // Set the fetched preference tags
      } catch (err) {
        setError(err.response ? err.response.data.message : 'Failed to load preference tags');
      }
    };

    fetchAllPreferences();
  }, []);

  // Update progress on preference change
  useEffect(() => {
    if (allPreferences.length > 0) {
      const selectedCount = Object.values(preferences).filter(Boolean).length;  // Only count selected preferences
      setProgress((selectedCount / allPreferences.length) * 100);
    }
  }, [preferences, allPreferences]);

  const handleToggle = (name) => {
    setPreferences((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleAddPreferencesClick = () => {
    setShowPreferencesForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const preferencesArray = Object.entries(preferences)
        .filter(([name, value]) => value)  // Only include checked preferences
        .map(([name]) => name);  // Get the preference names

      await axios.put(
        `http://localhost:5001/api/tourists/${touristId}/updatePreferences`,
        { preferences: preferencesArray },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Preferences saved!');
      setShowPreferencesForm(false);
    } catch (error) {
      console.error('Failed to save preferences', error);
      alert('An error occurred while saving preferences.');
    }
  };

  return (
    <div className="container p-4 bg-background">
      <h1 className="text-2xl font-bold mb-6">Tourist Preferences</h1>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : preferences && Object.keys(preferences).length === 0 ? (
        <div>
          <p>No preferences found.</p>
          <Button onClick={handleAddPreferencesClick}>Add Preferences</Button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {Object.keys(preferences).map((preference, index) => {
            const prefData = allPreferences.find((pref) => pref.name === preference); // Find the preference data by name
            return (
              <div key={index} className="preference-item">
                <Card>
                  <CardContent>
                    <Tag className="mr-2" />
                    <p>{prefData ? prefData.label : preference}</p> {/* Display the label or fallback to name */}
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      )}

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="text-sm mb-2">Completion: {progress.toFixed(0)}%</div>
        <div className="bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Conditionally show the preferences form when the button is clicked */}
      {showPreferencesForm && (
        <div className="mt-6">
          <Card className="overflow-hidden shadow-lg">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit}>
                <h2 className="text-xl font-bold mb-4">Set Your Preferences</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  {allPreferences.length > 0 ? (
                    allPreferences.map((pref) => (
                      <div key={pref.name} className="relative">
                        <input
                          type="checkbox"
                          id={pref.name}
                          checked={preferences[pref.name] || false}
                          onChange={() => handleToggle(pref.name)}
                          className="sr-only"
                        />
                        <label
                          htmlFor={pref.name}
                          className={`flex items-center p-4 rounded-lg cursor-pointer transition-all ${
                            preferences[pref.name]
                              ? 'bg-blue-500 text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <Tag className="w-6 h-6 mr-3" />
                          <span className="text-lg font-medium">{pref.label}</span>
                        </label>
                      </div>
                    ))
                  ) : (
                    <p>No preferences available.</p>
                  )}
                </div>
                <Button type="submit">Save Preferences</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
