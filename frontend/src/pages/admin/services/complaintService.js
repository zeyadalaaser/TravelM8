import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api/';

const apiClient = axios.create({
    baseURL: API_BASE_URL
});


export async function getAllComplaints(token) {
    return (await apiClient.get('complaints', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })).data;
}

export async function updateComplaintStatusAndReply(token, complaintId, reply, status) {
  return (await apiClient.put(`complaints/reply/${complaintId}`, {
      reply,
      status,
  }, {
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
      },
  })).data;
}

// export async function updateComplaintStatus(complaintId, status, token) {
//     try {
//       const response = await apiClient.put(
//         `complaints/${complaintId}/status`,
//         { status },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       return response.data;
//     } catch (error) {
//       console.error("Error updating complaint status:", error);
//       throw error;
//     }
//   }

//   export async function updateComplaintReply(complaintId, reply , token) {
//     try {
//       const response = await apiClient.put(
//         `complaints/${complaintId}/reply`,
//         { reply },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       return response.data;
//     } catch (error) {
//       console.error("Error updating complaint status:", error);
//       throw error;
//     }
//   }



