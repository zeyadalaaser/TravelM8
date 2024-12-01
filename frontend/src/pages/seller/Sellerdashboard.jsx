import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Navbar from "@/components/DashboardsNavBar.jsx";
function Sellerdashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) return; // No token, no need to check

    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

      if (decodedToken.exp < currentTime) {
        localStorage.removeItem("token"); 
        navigate("/"); 
      } else {
        const timeout = setTimeout(() => {
          localStorage.removeItem("token");
          navigate("/");
        }, (decodedToken.exp - currentTime) * 1000);

        return () => clearTimeout(timeout);
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      localStorage.removeItem("token"); 
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <><Navbar /><div style={styles.container}>

      <h1 style={styles.header}>Seller Dashboard</h1>
      <button style={styles.button} onClick={() => navigate('/SellerProducts')}>
        Go to Seller Products
      </button>
      <button style={styles.button} onClick={() => navigate('/SellerProfile')}>
        Go to Seller Profile
      </button>
    </div></>
  );
}


const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
    },
    header: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '20px',
        color: 'black', // Header text color
      },
    button: {
      margin: '10px',
      padding: '10px 20px',
      fontSize: '16px',
      cursor: 'pointer',
      backgroundColor: 'black', // Button background color
      color: 'white',            // Button text color
      border: 'none',            // Removes default border
      borderRadius: '5px',       // Optional: Rounds the corners
    },
  };
export default Sellerdashboard;