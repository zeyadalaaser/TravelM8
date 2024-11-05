export async function fetchItineraries(){
    try {
        const [activitiesRes, tagsRes, historicalSitesRes] = await Promise.all([
          axios.get('http://localhost:5001/api/activities'),
          axios.get('http://localhost:5001/api/preference-tags'),
          axios.get('http://localhost:5001/api/getAllPlaces'),
        ]);

        setActivities(activitiesRes.data);
        console.log(activitiesRes.data);
        setTags(tagsRes.data);
        setHistoricalSites(historicalSitesRes.data);
        setTourGuides(tourGuidesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
  };

export async function deleteItinerary(id){
    try {
      await axios.delete(`http://localhost:5001/api/itineraries/${id}`);
      alert('Itinerary deleted successfully!');
      setItineraries((prev) => prev.filter((itinerary) => itinerary.id !== id));
    } catch (error) {
      console.error('Error deleting itinerary:', error);
      alert('Failed to delete itinerary.');
    }
  };