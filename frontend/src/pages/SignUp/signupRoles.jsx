import React from 'react';
import { useNavigate } from 'react-router-dom';

function signup() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
        <h1 style={styles.header}>Choose your Role</h1>
      <button style={styles.button} onClick={() => navigate('/signup/signupTourist')}>
        Tourist
      </button>
      <button style={styles.button} onClick={() => navigate('/signup/signupSeller')}>
        Seller
      </button>
      <button style={styles.button} onClick={() => navigate('/signup/signupTourguide')}>
        Tourguide
      </button>
      <button style={styles.button} onClick={() => navigate('/signup/signupAdvertiser')}>
        Advertiser
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
export default signup;
