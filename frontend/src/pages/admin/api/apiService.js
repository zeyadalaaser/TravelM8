import axios from "axios";

export async function getSystemStats() {
    const token = localStorage.getItem('token');
    console.log("from getSystemStat: ", token);
    const [itineraries, activities, products] = await Promise.all([
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
        axios.get("http://localhost:5001/api/ordersReport", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);
      console.log("hello from api", itineraries, activities, products);
      return (
        calculateRevenue(activities.data.data || [], itineraries.data.data || [], products.data.data || [])
      );
}

const calculateRevenue = (allActivities, allItineraries, allProducts) => {
    const activitiesRev = allActivities.reduce((acc, { revenue }) => acc + revenue, 0) * 0.1;
    const itinerariesRev = allItineraries.reduce((acc, { revenue }) => acc + revenue, 0) * 0.1;
    const productsRev = allProducts.reduce((acc, { revenue }) => acc + revenue, 0) * 0.1; // Assuming product revenue calculation
    const totalRev = activitiesRev + itinerariesRev + productsRev;
    console.log("itineraries revenue", itinerariesRev);
    console.log("activities revenue", activitiesRev);
    console.log("products revenue", productsRev);

    return {
        Activities: activitiesRev || 0,
        Itineraries: itinerariesRev || 0,
        Products: productsRev || 0,
        Total: totalRev || 0,
    };
};
