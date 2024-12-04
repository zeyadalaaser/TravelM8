import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaCompass, FaStore, FaAd } from 'react-icons/fa';
import './signup.css'; 

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    type: '',
  });

  const [documentData, setDocumentData] = useState({
    username: formData.username,
    type:formData.type
  });
  
const [formData2, setformData2] = useState({
  name: '',
  username: formData.username,
  email: formData.email,
  password: formData.password,
  mobileNumber: '',
  nationality: '',
  dob: '',
  occupation: 'student',
});

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState();
  const [idfile,setidfile]=useState();
  const [taxfile,settaxfile]=useState();
  const [certificatesfile,setcertificatesfile]=useState();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({...prevState,[name]: value,}));
    setformData2(prevState => ({...prevState,[name]: value,}));

    if (name === 'username') {
      setDocumentData((prev) => ({ ...prev, username: value }));
  }

  };

  const validateForm = () => {
    const newErrors = {};
    const { email, username, password, idfile, type, dob, mobileNumber, nationality, occupation, taxfile, certificatesfile } = formData;

    if (!email) newErrors.email = 'Email is required';
    if (!username) newErrors.username = 'Username is required';
    if (!password) newErrors.password = 'Password is required';
    if (!type) newErrors.type = 'type is required';

    if (type === 'Tourist') {
       if (!mobileNumber) newErrors.mobile = 'Mobile number is required';
       if (!dob) newErrors.DOB = 'Date of Birth is required';
       if (!nationality) newErrors.nationality = 'Nationality is required';
       if (!occupation) newErrors.occupation = 'occupation is required';

    }
    if (type === 'Tour Guide'){
      if (!idfile) newErrors.idfile = 'ID is required';
      if (!certificatesfile) newErrors.certificatesfile = 'certificatesfile is required';
    } 
    if (type === 'Advertiser' || type === 'Seller') {
      //if (!idfile) newErrors.idfile = 'ID is required';
      //if (!taxfile) newErrors.taxfile = 'Taxation Card is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleFileChange = (e) => {
    setidfile(e.target.files[0]);
    settaxfile(e.target.files[0]);
    setcertificatesfile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    // Validate the form
    const isValid = validateForm();
    if (!isValid) {formData
        return;
    }
    try {
      if(!formData.type=="Tourist"){
        const response = await axios.post('http://localhost:5001/api/pending-users', formData );

        if (response.status === 200) {
          if(!formData.type=="Tour guide"){
            const formDataToSend = new FormData();
            formDataToSend.append("image", image);
            formDataToSend.append("idfile", idfile);
            formDataToSend.append("taxfile", taxfile);
            formDataToSend.append("username", documentData.username);  // Add username here
            formDataToSend.append("type", documentData.type);  // Add type here
            await axios.post(
              'http://localhost:5001/api/upload-files',
              formDataToSend,
              { headers: { "Content-Type": "multipart/form-data" } }
            );
          }
          else{
            const formDataToSend = new FormData();
            formDataToSend.append("image", image);
            formDataToSend.append("idfile", idfile);
            formDataToSend.append("certificatesfile", certificatesfile);
            formDataToSend.append("username", documentData.username);  // Add username here
            formDataToSend.append("type", documentData.type);  // Add type here
            await axios.post(
              'http://localhost:5001/api/upload-files2',
              formDataToSend,
              { headers: { "Content-Type": "multipart/form-data" } }
            );
            }
        }
        toast('Your Request Is Pending');
        setMessageType('success');  
        navigate('/');

      }
      else{
        const formDataToSend = new FormData();
            formDataToSend.append("name", formData2.username);
            formDataToSend.append("username", formData.username);
            formDataToSend.append("email", formData.email);
            formDataToSend.append("password", formData.password);
            formDataToSend.append("mobile", mobileNumber);  
            formDataToSend.append("nationality", nationality);
            formDataToSend.append("DOB", dob); 
            formDataToSend.append("occupation", occupation); 
          const response = await axios.post('http://localhost:5001/api/tourists', formData);
        }

        toast('success');
        setMessageType('success');  
      
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
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">profilePic</label>
                <input
                  type="file"
                  accept="image/*"
                  id="image"
                  name="image"
                  onChange={handleImageChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
              </div>
              <div>
                <label htmlFor="idfile" className="block text-sm font-medium text-gray-700">idCard</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,image/*"
                  id="idfile"
                  name="idfile"
                  onChange={handleFileChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                {errors.idfile && <p className="text-red-500 text-xs mt-1">{errors.idfile}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Your Role</label>
                <div className="grid grid-cols-2 gap-4">
                  {roles.map((type) => (
                    <motion.button
                      key={type.name}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, type: type.name }))}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      className={`py-2 px-4 rounded-lg font-semibold text-sm flex items-center justify-center space-x-2 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                        formData.type === type.name
                          ? 'bg-black text-white'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      {type.icon}
                      <span>{type.name}</span>
                    </motion.button>
                  ))}
                </div>
                {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
              </div>

              {/* Role-specific fields */}
              {formData.type === 'Tourist' && (
                <>
                 <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData2.name}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      required
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">Mobile Number</label>
                    <input
                      type="text"
                      id="mobileNumber"
                      name="mobileNumber"
                      value={formData2.mobileNumber}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      required
                    />
                    {errors.mobileNumber && <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>}
                  </div>
                  <div>
                    <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <input
                    type="date"
                    id="dob"
                    name="dob"
                    value={formData2.dob}
                    onChange={(e) => {
                      const selectedDate = new Date(e.target.value);
                      const today = new Date();
                      const age = today.getFullYear() - selectedDate.getFullYear();
                      const monthDiff = today.getMonth() - selectedDate.getMonth();
                      if (age < 18 || (age === 18 && monthDiff < 0) || (age === 18 && monthDiff === 0 && today.getDate() < selectedDate.getDate())) {
                        setErrors({ ...errors, dob: "You must be at least 18 years old." });
                      } else {
                        setErrors({ ...errors, dob: "" }); // Clear the error message if valid
                      }
                      handleChange(e); // Call the original handleChange function
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                    />
                    {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
                  </div>

                  <div>
                    <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">Nationality</label>
                    <select
                    id="nationality"
                    name="nationality"
                    value={formData2.nationality}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required>
                    <option value="American">Select Nationality</option>
                    <option value="American">American</option>
                    <option value="British">British</option>
                    <option value="Canadian">Canadian</option>
                    <option value="Australian">Australian</option>
                    <option value="Indian">Indian</option>
                    <option value="Saudi">Saudi</option>
                    <option value="Egyptian">Egyptian</option>
                    <option value="Korean">Korean</option>
                    <option value="Turkish">Turkish</option>
                    <option value="Thai">Thai</option>
                  </select>
                  {errors.nationality && <p className="text-red-500 text-xs mt-1">{errors.nationality}</p>}
                  </div>
                  <div>
                    <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">occupation</label>
                    <select
                      id="occupation"
                      name="occupation"
                      value={formData2.occupation}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      required>
              <option value="student">Student</option>
              <option value="employed">Employed</option>
              <option value="unemployed">Unemployed</option>                

                    </select>
                    {errors.occupation && <p className="text-red-500 text-xs mt-1">{errors.occupation}</p>}
                  </div>
                </>
              )}

              {formData.type === 'Tour Guide' && (
                <div>
                <label htmlFor="certificatesfile" className="block text-sm font-medium text-gray-700">Certificates</label>
                <input
                  type="file"
                  id="certificatesfile"
                  name="certificatesfile"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" // Specify accepted file types
                  onChange={(e) => {
                    const files = Array.from(e.target.files); // Convert FileList to an array
                    handleChange({ target: { name: 'certificatesfile', value: files } });
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  multiple // Enable multiple file selection
                />
                {errors.certificatesfile && <p className="text-red-500 text-xs mt-1">{errors.certificatesfile}</p>}
              </div>
              
              )}

              {(formData.type === 'Advertiser' || formData.type === 'Seller') && (
                <div>
                  <label htmlFor="taxfile" className="block text-sm font-medium text-gray-700">Taxation Card</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,image/*"
                    name="taxfile"
                    onChange={handleFileChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  {errors.taxfile && <p className="text-red-500 text-xs mt-1">{errors.taxfile}</p>}
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
