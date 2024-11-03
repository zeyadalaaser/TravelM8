import axios from 'axios';

export async function fetchItineraries(){

  const response = await fetch(`http://localhost:5001/api/itineraries`)
  return await response.json();

};

// export async function deleteItinerary(id){
//     try {
//       await axios.delete(`http://localhost:5001/api/itineraries/${id}`);
//       alert('Itinerary deleted successfully!');
//       setItineraries((prev) => prev.filter((itinerary) => itinerary.id !== id));
//     } catch (error) {
//       console.error('Error deleting itinerary:', error);
//       alert('Failed to delete itinerary.');
//     }
//   };