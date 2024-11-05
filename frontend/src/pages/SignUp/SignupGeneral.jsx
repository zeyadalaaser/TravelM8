import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaCompass, FaStore, FaAd } from 'react-icons/fa';
import './signup.css'; 

export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    idCard: null,
    role: '',
    DOB: '',
    mobile: '',
    nationality: '',
    status: '',
    jobTitle: '',
    profilePic: null, // Added for profile picture
    taxationCard: null,
    certificates: [] // Added to store certificate files
  });
  const [errors, setErrors] = useState({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({...prevState,[name]: value,}));
  };

  const validateForm = () => {
    const newErrors = {};
    const { email, username, password, idCard, role, DOB, mobile, nationality, status, profilePic, taxationCard, certificates } = formData;

    if (!email) newErrors.email = 'Email is required';
    else if (!validateEmail(email)) newErrors.email = 'Email format is invalid';
    if (!username) newErrors.username = 'Username is required';
    if (!idCard) newErrors.idCard = 'ID is required';
    if (!password) newErrors.password = 'Password is required';
    if (!role) newErrors.role = 'Role is required';

    // Role-specific validations
    if (role === 'Tourist') {
       if (!mobile) newErrors.mobile = 'Mobile number is required';
       if (!DOB) newErrors.DOB = 'Date of Birth is required';
       if (!nationality) newErrors.nationality = 'Nationality is required';
       if (!status) newErrors.status = 'Status is required';
       if (formData.status === 'Job' && !formData.jobTitle) {
        newErrors.jobTitle = 'Job title is required';
      }
      if (formData.status === 'Student' && !formData.schoolName) {
        newErrors.schoolName = 'School/University Name is required';
      }
    }
    if (role === 'Tour Guide' && !certificates) newErrors.certificates = 'certificates is required';
    if ((role === 'Advertiser' || role === 'Seller') && !taxationCard) newErrors.taxationCard = 'Taxation Card is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex pattern
    return emailPattern.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    // Validate the form
    const isValid = validateForm();
    if (!isValid) {formData
        return; // If the form is not valid, do not proceed with the submission
    }
    try {
        const response = await axios.post('http://localhost:5001/api/pending-users', );
        alert('Your Request Is Pending');
        setMessageType('success');  
        navigate('/');
    } catch (error) {
        setMessage('Error during signup. Please try again.');
        setMessageType('error');  
    }
  };

  const roles = [
    { name: 'Tourist', icon: <FaUser /> },
    { name: 'Tour Guide', icon: <FaCompass /> },
    { name: 'Seller', icon: <FaStore /> },
    { name: 'Advertiser', icon: <FaAd /> },
  ];

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.2 } },
  };

  const handleTermsChange = (e) => {
    setTermsAccepted(e.target.checked);
};

const openModal = () => setIsModalOpen(true);
const closeModal = () => setIsModalOpen(false);

  return (
    <div class="wrapper">
    <div class="background-image"></div>
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center justify-center w-[1200px] mb-10"> 
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-auto mt-60"
        >
         <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Sign Up</h1>
         
            <form onSubmit={handleSubmit} className="space-y-4">
              {['email', 'username', 'password'].map((field, index) => (
                <div key={index}>
                  <label htmlFor={field} className="block text-sm font-medium text-gray-700 capitalize">{field}</label>
                  <input
                    type={field.includes('password') ? 'password' : 'text'}
                    id={field}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                  />
                  {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
                </div>
              ))}
              <div>
                <label htmlFor="profilePic" className="block text-sm font-medium text-gray-700">profilePic</label>
                <input
                  type="file"
                  id="profilePic"
                  name="profilePic"
                  onChange={(e) => setFormData({ ...formData, profilePic: e.target.files[0] })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                />
                {errors.profilePic && <p className="text-red-500 text-xs mt-1">{errors.profilePic}</p>}
              </div>
              <div>
                <label htmlFor="idCard" className="block text-sm font-medium text-gray-700">idCard</label>
                <input
                  type="file"
                  id="idCard"
                  name="idCard"
                  onChange={(e) => setFormData({ ...formData, idCard: e.target.files[0] })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                />
                {errors.idCard && <p className="text-red-500 text-xs mt-1">{errors.idCard}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Your Role</label>
                <div className="grid grid-cols-2 gap-4">
                  {roles.map((role) => (
                    <motion.button
                      key={role.name}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, role: role.name }))}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      className={`py-2 px-4 rounded-lg font-semibold text-sm flex items-center justify-center space-x-2 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                        formData.role === role.name
                          ? 'bg-black text-white'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      {role.icon}
                      <span>{role.name}</span>
                    </motion.button>
                  ))}
                </div>
                {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
              </div>

              {/* Role-specific fields */}
              {formData.role === 'Tourist' && (
                <>
                  <div>
                    <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">Mobile Number</label>
                    <input
                      type="text"
                      id="mobile"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      required
                    />
                    {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
                  </div>
                  <div>
                    <label htmlFor="DOB" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <input
                    type="date"
                    id="DOB"
                    name="DOB"
                    value={formData.DOB}
                    onChange={(e) => {
                      const selectedDate = new Date(e.target.value);
                      const today = new Date();
                      const age = today.getFullYear() - selectedDate.getFullYear();
                      const monthDiff = today.getMonth() - selectedDate.getMonth();
                      if (age < 18 || (age === 18 && monthDiff < 0) || (age === 18 && monthDiff === 0 && today.getDate() < selectedDate.getDate())) {
                        setErrors({ ...errors, DOB: "You must be at least 18 years old." });
                      } else {
                        setErrors({ ...errors, DOB: "" }); // Clear the error message if valid
                      }
                      handleChange(e); // Call the original handleChange function
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                    />
                    {errors.DOB && <p className="text-red-500 text-xs mt-1">{errors.DOB}</p>}
                  </div>

                  <div>
                    <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">Nationality</label>
                    <select
                    id="nationality"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required>
                    <option value="American">Select Nationality</option>
                    <option value="American">American</option>
                    <option value="British">British</option>
                    <option value="Canadian">Canadian</option>
                    <option value="Australian">Australian</option>
                    <option value="Indian">Indian</option>
                    <option value="Chinese">Chinese</option>
                    <option value="German">German</option>
                    <option value="French">French</option>
                    <option value="Brazilian">Brazilian</option>
                    <option value="Japanese">Japanese</option>
                    <option value="Mexican">Mexican</option>
                    <option value="Italian">Italian</option>
                    <option value="Russian">Russian</option>
                    <option value="Spanish">Spanish</option>
                    <option value="South African">South African</option>
                    <option value="Nigerian">Nigerian</option>
                    <option value="Saudi">Saudi</option>
                    <option value="Egyptian">Egyptian</option>
                    <option value="Korean">Korean</option>
                    <option value="Turkish">Turkish</option>
                    <option value="Thai">Thai</option>
                  </select>
                  {errors.nationality && <p className="text-red-500 text-xs mt-1">{errors.nationality}</p>}
                  </div>
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={(e) => {handleChange(e);
                      if (e.target.value !== 'Job') {
                        setFormData((prevState) => ({ ...prevState, jobTitle: '' }));}
                      if (e.target.value !== 'Student') {
                        setFormData((prevState) => ({ ...prevState, schoolName: '' }));}
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      required>
                      <option value="">Select Status</option>
                      <option value="Student">Student</option>
                      <option value="Job">Job</option>
                    </select>
                    {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
                  </div>
                  {formData.status === 'Job' && (
                  <div>
                    <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">Job Title</label>
                    <input
                    type="text"
                    id="jobTitle"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required/>
                    {errors.jobTitle && (<p className="text-red-500 text-xs mt-1">{errors.jobTitle}</p>)}
                  </div>
                   )}
                  {formData.status === 'Student' && (
                  <div>
                    <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700">School/University Name</label>
                    <input
                    type="text"
                    id="schoolName"
                    name="schoolName"
                    value={formData.schoolName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required/>
                    {errors.schoolName && (<p className="text-red-500 text-xs mt-1">{errors.schoolName}</p>)}
                  </div>
                  )}
                </>
              )}

              {formData.role === 'Tour Guide' && (
                <div>
                <label htmlFor="certificates" className="block text-sm font-medium text-gray-700">Certificates</label>
                <input
                  type="file"
                  id="certificates"
                  name="certificates"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" // Specify accepted file types
                  onChange={(e) => {
                    const files = Array.from(e.target.files); // Convert FileList to an array
                    handleChange({ target: { name: 'certificates', value: files } });
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  multiple // Enable multiple file selection
                  required
                />
                {errors.certificates && <p className="text-red-500 text-xs mt-1">{errors.certificates}</p>}
              </div>
              
              )}

              {(formData.role === 'Advertiser' || formData.role === 'Seller') && (
                <div>
                  <label htmlFor="taxationCard" className="block text-sm font-medium text-gray-700">Taxation Card</label>
                  <input
                    type="file"
                    id="taxationCard"
                    name="taxationCard"
                    onChange={(e) => setFormData({ ...formData, taxationCard: e.target.files[0] })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                  />
                  {errors.taxationCard && <p className="text-red-500 text-xs mt-1">{errors.taxationCard}</p>}
                </div>
              )}
              {/* Terms and Conditions */}
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

              {/* Modal for Terms and Conditions */}
              {isModalOpen && (
                    <div className="terms-modal">
                        <div className="terms-content">
                            <h2>Terms and Conditions</h2>
                            <p>Here are the terms and conditions for using this service...</p>
                            <button className="close-button" onClick={closeModal}>Close</button>
                        </div>
                    </div>
                )}
              <motion.button
                type="submit"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="w-full bg-blue-500 text-white py-2 rounded-md mt-4 font-semibold hover:bg-blue-600 transition duration-300"
              >
                Sign Up
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
      </div>
  );
}
