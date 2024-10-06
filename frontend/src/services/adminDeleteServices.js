
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/getallusers';

const API_URL2 = 'http://localhost:5001/api/users';

  const getAllUsers = async () => {

    const response = await axios.get(API_URL);
    return response.data;
  }; 


    const deleteUser = async (username, type) => {
        const response = await axios.delete(API_URL2, { 
          data: { username, type } // Send username and type in the request body
        });
        return response.data;
      };

  export {getAllUsers, deleteUser};
  