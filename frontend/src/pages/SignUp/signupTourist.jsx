import React, { useState } from 'react';
import './signupTourist.css';
import backgroundImage from '@/assets/backgroundtourist.jpg';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios

export default function TouristRegistration() {
  const [formData, setFormData] = useState({
    name:'',
    username: '',
    email: '',
    password: '',
    mobileNumber: '',
    nationality: '',
    dob: '',
    occupation: 'student', // Default to student
  });

  const Footer = () => {
    return (
      <footer className="footer">
        <p>&copy; 2024 TravelM8. All rights reserved.</p>
        <p>
          <a href="#privacy">Privacy Policy</a> | <a href="#terms">Terms of Service</a>
        </p>
      </footer>
    );
  };
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const navigate = useNavigate(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const today = new Date();
    const birthDate = new Date(formData.dob);
    const age = today.getFullYear() - birthDate.getFullYear();

    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters long';
    }
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }
    if (formData.mobileNumber.length < 10) {
      newErrors.mobileNumber = 'Invalid mobile number';
    }
    if (!formData.nationality) {
      newErrors.nationality = 'Nationality is required';
    }
    if (!formData.dob) {
      newErrors.dob = 'Date of Birth is required';
    } else if (age < 18) {
      newErrors.dob = 'You must be at least 18 years old to register';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post('http://localhost:5001/api/tourists', formData);
        console.log('Form submitted successfully:', response.data);
        setMessage('Registration Successful! Thank you for registering, ' + formData.username);
        setIsSubmitted(true);
        navigate('/tourist-page');
      } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            setErrors({ submit: error.response.data.message || 'An error occurred' });
        } else if (error.request) {
            // The request was made but no response was received
            setErrors({ submit: 'No response from server' });
        } else {
            // Something happened in setting up the request that triggered an Error
            setErrors({ submit: 'Error: ' + error.message });
        }
    }
    }
  };

  if (isSubmitted) {
    return (
      <div className="registration-success">
        <h2>Registration Successful!</h2>
        <p>Thank you for registering, {formData.username}.</p>
      </div>
    );
  }

  const nationalities = [
    "Afghan", "Albanian", "Algerian", "American", "Andorran", "Angolan", "Antiguan", "Argentine", "Armenian", "Australian", 
    "Austrian", "Azerbaijani", "Bahamian", "Bahraini", "Bangladeshi", "Barbadian", "Belarusian", "Belgian", "Belizean", 
    "Beninese", "Bhutanese", "Bolivian", "Bosnian", "Botswanan", "Brazilian", "British", "Bruneian", "Bulgarian", "Burkinabé", 
    "Burmese", "Burundian", "Cabo Verdean", "Cambodian", "Cameroonian", "Canadian", "Central African", "Chadian", "Chilean", 
    "Chinese", "Colombian", "Comoran", "Congolese", "Costa Rican", "Croatian", "Cuban", "Cypriot", "Czech", "Danish", 
    "Djiboutian", "Dominican", "Dutch", "East Timorese", "Ecuadorean", "Egyptian", "Emirati", "Equatorial Guinean", "Eritrean", 
    "Estonian", "Ethiopian", "Fijian", "Filipino", "Finnish", "French", "Gabonese", "Gambian", "Georgian", "German", 
    "Ghanaian", "Greek", "Grenadian", "Guatemalan", "Guinea-Bissauan", "Guinean", "Guyanese", "Haitian", "Honduran", "Hungarian", 
    "Icelander", "Indian", "Indonesian", "Iranian", "Iraqi", "Irish", "Israeli", "Italian", "Ivorian", "Jamaican", "Japanese", 
    "Jordanian", "Kazakhstani", "Kenyan", "Kittian and Nevisian", "Kuwaiti", "Kyrgyz", "Laotian", "Latvian", "Lebanese", 
    "Liberian", "Libyan", "Liechtensteiner", "Lithuanian", "Luxembourger", "Macedonian", "Malagasy", "Malawian", "Malaysian", 
    "Maldivian", "Malian", "Maltese", "Marshallese", "Mauritanian", "Mauritian", "Mexican", "Micronesian", "Moldovan", "Monacan", 
    "Mongolian", "Moroccan", "Mozambican", "Namibian", "Nauruan", "Nepalese", "New Zealander", "Nicaraguan", "Nigerian", "Nigerien", 
    "North Korean", "Norwegian", "Omani", "Pakistani", "Palauan", "Panamanian", "Papua New Guinean", "Paraguayan", "Peruvian", 
    "Polish", "Portuguese", "Qatari", "Romanian", "Russian", "Rwandan", "Saint Lucian", "Salvadoran", "Samoan", "San Marinese", 
    "Sao Tomean", "Saudi", "Senegalese", "Serbian", "Seychellois", "Sierra Leonean", "Singaporean", "Slovakian", "Slovenian", 
    "Solomon Islander", "Somali", "South African", "South Korean", "Spanish", "Sri Lankan", "Sudanese", "Surinamer", "Swazi", 
    "Swedish", "Swiss", "Syrian", "Taiwanese", "Tajik", "Tanzanian", "Thai", "Togolese", "Tongan", "Trinidadian or Tobagonian", 
    "Tunisian", "Turkish", "Tuvaluan", "Ugandan", "Ukrainian", "Uruguayan", "Uzbek", "Vanuatuan", "Venezuelan", "Vietnamese", 
    "Yemeni", "Zambian", "Zimbabwean"
  ];

  return (
    <><div
          className="background-image"
          style={{ backgroundImage: `url(${backgroundImage})` }} // Set the background image source here
      ></div><>
      <><nav className="navbar">
      <div className="navbar-container">
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
      </div>
    </nav>
      <div className="registration-container">
      <h2 className="form-title">
      Join to unlock the best of TravelM8</h2>
              {errors.submit && <div className="error">{errors.submit}</div>} {/* Display error messages here */}
              <form onSubmit={handleSubmit} className="registration-form">


              <div className="form-group">
                            <label htmlFor="name" >Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder= "Enter your Name"
                                required />
                        </div>

                  {['email', 'username', 'password'].map((field, index) => (
                      <div key={index} className="form-group">
                          <label htmlFor={field}> {field.charAt(0).toUpperCase() + field.slice(1)}</label>
                          <input
                              type={field === 'dob' ? 'date' : field === 'password' ? 'password' : 'text'}
                              id={field}
                              name={field}
                              value={formData[field]}
                              onChange={handleChange}
                              required
                              placeholder= {`Enter your ${field}`} />
                          {errors[field] && <span className="error">{errors[field]}</span>}
                      </div>
                      
                  ))}


                  

                    <div className="form-group">
                          <label htmlFor="dob" >Date Of Birth</label>
                          <input
                              type="date"
                              id="dob"
                              name="dob"
                              value={formData.dob}
                              onChange={handleChange}
                              required />
                      </div>

                      <div className="form-group">
                          <label htmlFor="mobileNumber" >Mobile Number</label>
                          <input
                              type="text"
                              id="mobileNumber"
                              name="mobileNumber"
                              value={formData.mobileNumber}
                              onChange={handleChange}
                              placeholder= "Enter your Mobile Number"
                              required />
                      </div>


                      <div className="form-group">
                      <label htmlFor="nationality">Nationality</label>
                      <select
                        id="nationality"
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select your nationality</option>
                        {nationalities.map((nationality, index) => (
                          <option key={index} value={nationality}>
                            {nationality}
                          </option>
                        ))}
                      </select>
                    </div>

                  <div className="form-group">
                      <label htmlFor="occupation">Occupation</label>
                      <select
                          id="occupation"
                          name="occupation"
                          value={formData.occupation}
                          onChange={handleChange}
                          required
                      >
                          <option value="student">Student</option>
                          <option value="employed">Employed</option>
                          <option value="unemployed">Unemployed</option>
                          <option value="retired">Retired</option>
                      </select>
                  </div>

                  <button type="submit" className="submit-btn">Register</button>
              </form>
              {message && <div className="message">{message}</div>} {/* Display success or failure message */}
              <p className="already-registered">
                    Already registered? <a href="/signin" className="signin-link">Sign in here</a>
                </p>
          </div></><Footer /></></> 

  );

}