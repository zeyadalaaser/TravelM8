import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReviewForm from './ReviewForm';

export const PastActivitiesPage = ({ touristId }) => {
  const [pastActivities, setPastActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState(null);

  useEffect(() => {
    const fetchPastActivities = async () => {
      if (!touristId) {
        console.warn("Tourist ID is not available");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5001/api/bookedactivities/completed/${touristId}`);
        if (Array.isArray(response.data)) {
          setPastActivities(response.data);
        } else {
          console.error("Unexpected response format:", response.data);
          setPastActivities([]);
        }
      } catch (error) {
        console.error("Error fetching past activities:", error);
        setPastActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPastActivities();
  }, [touristId]);

  return (
    <div className="mx-4 mt-3 space-y-2">
      <h2 className="text-xl font-bold mb-4">Past Activities</h2>
      {loading ? (
        <p>Loading...</p>
      ) : pastActivities.length === 0 ? (
        <p>No past activities found.</p>
      ) : (
        <ul>
          {pastActivities.map((activity) => (
            <Card key={activity._id} className="p-4 mb-4">
              <h3 className="text-xl font-semibold">{activity.activityId.title}</h3>
              <div className="text-sm text-gray-600 mb-2">{activity.activityId.description}</div>
              <div className="flex items-center text-sm text-gray-600 mb-2 gap-2">
                <Clock className="w-4 h-4 mr-1" />
                <span>{new Date(activity.activityId.date).toLocaleDateString()}</span>
              </div>
              <Label className="text-m font-semibold text-black">Location:</Label>
              <span className="ml-2">{`${activity.activityId.location.lat}, ${activity.activityId.location.lng}`}</span>

              <div className="flex justify-start mt-4">
                <Button
                  onClick={() => {
                    setSelectedActivityId(activity.activityId._id);
                    setIsModalOpen(true);
                  }}
                  className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                >
                  Rate Activity
                </Button>
              </div>
            </Card>
          ))}
        </ul>
      )}

      {/* Modal for rating an activity */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <ReviewForm
              activityId={selectedActivityId}
              touristId={touristId}
              onClose={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};