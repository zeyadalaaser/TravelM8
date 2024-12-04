import axios from "axios";

export async function getSystemStats() {
    const token = localStorage.getItem('token');
    console.log("from getSystemStat: ", token);
    const [itineraries, activities] = await Promise.all([
        axios.get("http://localhost:5001/api/itinerariesReport", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get("http://localhost:5001/api/activitiesReport", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);
      console.log("hello from api", itineraries, activities);
      return (

        calculateRevenue(activities.data.data || [] , itineraries.data.data || [])  
      ) ;
}

const calculateRevenue = (allActivities, allItineraries) => {
    const activitiesRev = allActivities.reduce((acc, { revenue }) => acc + revenue, 0) * 0.1;
    const itinerariesRev = allItineraries.reduce((acc, { revenue }) => acc + revenue, 0) * 0.1;
    const totalRev = activitiesRev + itinerariesRev;
    console.log("itineraries revenue" ,itinerariesRev );
    console.log("activities revenue" ,activitiesRev );

    return (
        {
            Activities : activitiesRev || 0,
            Itineraries : itinerariesRev || 0,
            Products : 0, 
            Total :  totalRev || 0,
        }
    );
  };