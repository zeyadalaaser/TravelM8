import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyComponent = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetch data from backend API
    axios.get('http://localhost:5001/api/data')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div>
      <h1>Data from Backend:</h1>
      {data ? <p>{data.message}</p> : <p>Loading...</p>}
    </div>
  );
};

export default Mytourguide;
