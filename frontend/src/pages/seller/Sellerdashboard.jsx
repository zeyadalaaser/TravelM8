import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Sellerdashboard() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
        <h1 style={styles.header}>Seller Dashboard</h1>
      <button style={styles.button} onClick={() => navigate('/SellerProducts')}>
        Go to Seller Products
      </button>
      <button style={styles.button} onClick={() => navigate('/SellerProfile')}>
        Go to Seller Profile
      </button>
    </div>
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
