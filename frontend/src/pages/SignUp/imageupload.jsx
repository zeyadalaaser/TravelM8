import React, { useState } from 'react';
import './signup.css';
import axios from 'axios';
import backgroundImage from '@/assets/background.jpeg';

const FormPage = () => {
  const [image, setImage] = useState();

  const onInputChange = (e) => {
    setImage(e.target.files[0]);
  };

  const submitImage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);

    try {
      const result = await axios.post(
        'http://localhost:5001/api/upload-image',
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log(result.data);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <>
      <div
        className="background-image"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>
      <div className="form-container">
        <h1 className="form-title">Get started advertising on TravelM8</h1>
        <form onSubmit={submitImage} className="contact-form">
          <label>Upload Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={onInputChange}
          />
          <button type="submit" className="submit-button">Sign Up</button>
        </form>
      </div>
    </>
  );
};

export default FormPage;
