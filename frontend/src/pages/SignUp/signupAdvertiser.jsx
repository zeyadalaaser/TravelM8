import React, { useState } from 'react';
import './signup.css';
import axios from 'axios';
import backgroundImage from '@/assets/background.jpeg';
import { useNavigate } from 'react-router-dom';

const FormPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        type: 'Advertiser'
    });
    const [documentData, setDocumentData] = useState({
        username: formData.username,
        type:formData.type
    });

    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [image, setImage] = useState();

    const navigate = useNavigate();

    const onInputChange = (e) => {
      setImage(e.target.files[0]);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        
        // Ensure username in documentData is synced
        if (name === 'username') {
            setDocumentData((prev) => ({ ...prev, username: value }));
        }
    };

    const handleDocumentChange = (e) => {
        const { name, files } = e.target;

        if (files && files.length > 0) {
            const file = files[0];
            setDocumentData((prev) => ({ ...prev, [name]: file }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const response = await axios.post('http://localhost:5001/api/pending-users', formData);
            if (response.status === 200) {

                // Second request to upload documents
               // await axios.post('http://localhost:5001/api/documents/advertiser', documentData);
               // Prepare FormData to include the image, username, and type
            const formDataToSend = new FormData();
            formDataToSend.append("image", image);
            formDataToSend.append("username", documentData.username);  // Add username here
            formDataToSend.append("type", documentData.type);  // Add type here

               const result = await axios.post(
                'http://localhost:5001/api/upload-image',
                formDataToSend,
                {
                  headers: { "Content-Type": "multipart/form-data" },
                }
              );
              console.log(result.data);
                alert('Your Request Is Pending');
                setMessageType('success');
                navigate('/');
            }
        } catch (error) {
          console.log("Error uploading image:", error);
            if (error.response) {
                console.error("Backend response:", error.response.data);
                setMessage(error.response.data.message || 'Error during signup. Please try again.');
            } else {
                setMessage('Error during signup. Please try again.');
            }
            setMessageType('error');
        }
    };

    const handleTermsChange = (e) => {
        setTermsAccepted(e.target.checked);
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            <div
                className="background-image"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            ></div>
            <nav className="navbar">
                <div className="navbar-left">
                    <img src="./src/assets/logo4.jpg" alt="TravelM8" className="logo" />
                </div>
                <div className="navbar-right">
                    <button className="nav-button">Home</button>
                    <button className="nav-button">About Us</button>
                    <button className="nav-button">Our Services</button>
                    <button className="nav-button">Contact Us</button>
                    <button className="nav-login-button">Login</button>
                </div>
            </nav>
            <div className="form-container">
                <h1 className="form-title">Get started advertising on TravelM8</h1>
                <form onSubmit={handleSubmit} className="contact-form">
                    <label className="form-label" htmlFor="username">Username</label>
                    <input
                        className="form-input"
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        placeholder="Enter your username"
                    />
                    <label className="form-label" htmlFor="email">Email</label>
                    <input
                        className="form-input"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter your email"
                    />
                    <label className="form-label" htmlFor="password">Password</label>
                    <input
                        className="form-input"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Enter your password"
                    />

                    <label >Upload Logo</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={onInputChange}
                        name="image"
                    />

                    <label className="form-label" htmlFor="idDocument">Upload ID File</label>
                    <input
                        className="form-input"
                        type="file"
                        name="idDocument"
                        accept=".pdf,.doc,.docx,image/*"
                        onChange={handleDocumentChange}
                        required
                    />

                    <label className="form-label" htmlFor="taxationRegistryDocument">Upload Taxation Registry Card</label>
                    <input
                        className="form-input"
                        type="file"
                        name="taxationRegistryDocument"
                        accept=".pdf,.doc,.docx,image/*"
                        onChange={handleDocumentChange}
                        required
                    />

                    <label className="form-label terms-container">
                        <input
                            type="checkbox"
                            checked={termsAccepted}
                            onChange={handleTermsChange}
                            required
                        />{' '}
                        I agree to the
                        <span className="terms-link" onClick={openModal}> Terms and Conditions</span>
                    </label>

                    <button type="submit" className="submit-button">Sign Up</button>
                </form>
                {message && (
                    <div className={messageType === 'success' ? 'success-message' : 'error-message'}>
                        {message}
                    </div>
                )}
                {isModalOpen && (
                    <div className="terms-modal">
                        <div className="terms-content">
                            <h2>Terms and Conditions</h2>
                            <p>Here are the terms and conditions for using this service...</p>
                            <button className="close-button" onClick={closeModal}>Close</button>
                        </div>
                    </div>
                )}
                <p className="already-registered">
                    Already registered? <a href="/signin" className="signin-link">Sign in here</a>
                </p>
            </div>
        </>
    );
};

export default FormPage;
