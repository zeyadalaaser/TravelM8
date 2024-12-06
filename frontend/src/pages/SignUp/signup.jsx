import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from 'react-router-dom';
import axios from 'axios'; // Add axios for API calls
import { useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { FaCompass, FaStore , FaAd  } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'sonner';


export default function SignupDialog({children, isOpen, onOpenChange, onLoginClick }) {
  const [open, setOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false); 
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    type: 'Tourist'
  });
  const [formData2, setFormData2] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    mobileNumber:'',
    countryCode:'',
    nationality:'',
    dob:'',
    occupation:'student'

  });

  const roles = [
    { name: 'Tourist', icon: <FaUser /> },
    { name: 'TourGuide', icon: <FaCompass /> },
    { name: 'Seller', icon: <FaStore /> },
    { name: 'Advertiser', icon: <FaAd /> },
  ];

  const [image, setImage] = useState();
  const [idfile, setIdFile] = useState();
  const [taxfile, setTaxFile] = useState();
  const [certificatesfile, setcertificatesfile] = useState();
  const navigate = useNavigate();

  const handleRoleChange = (role) => {
      setFormData2({
        name: '',
        username: '',
        email: '',
        countryCode:'',
        mobile: '',
        dob: '', // Ensure dob is reset
        nationality: '',
        occupation: '',
      }); // Reset fields when the role is changed to 'Tourist'
    setFormData({
      username: '',
      email: '',
      password: '',
      type: role
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormData2((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field) => (value) => {
    setFormData(prevState => ({...prevState, [field]: value}));
    setFormData2(prevState => ({...prevState, [field]: value}));
  
    if (field === 'username') {
      setDocumentData((prev) => ({ ...prev, username: value }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'logo') {
      setImage(files[0]);
    } else if (name === 'idFile') {
      setIdFile(files[0]);
    } else if (name === 'taxationCard') {
      setTaxFile(files[0]);
    }
    else if (name === 'certificatesfile') {
      setcertificatesfile(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {

      if(formData.type=='Advertiser'||formData.type=='Seller'){
      const response = await axios.post('http://localhost:5001/api/pending-users', formData);

      if (response.status === 200) {
        // Prepare FormData for file uploads
        const formDataToSend = new FormData();
        formDataToSend.append("image", image);
        formDataToSend.append("idfile", idfile);
        formDataToSend.append("taxfile", taxfile);
        formDataToSend.append("username", formData.username); // Add username here
        formDataToSend.append("type", formData.type);

        // POST request to upload files
        await axios.post(
          'http://localhost:5001/api/upload-files',
          formDataToSend,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        // Success message
        toast('Your Request Is Pending');
        setMessageType('success');
        window.location.reload();
      }
      
    }
    else if(formData.type=='TourGuide'){
      const response = await axios.post('http://localhost:5001/api/pending-users', formData);

      if (response.status === 200) {
        // Prepare FormData for file uploads
        const formDataToSend = new FormData();
        formDataToSend.append("image", image);
        formDataToSend.append("idfile", idfile);
        formDataToSend.append("certificatesfile",certificatesfile);
        formDataToSend.append("username", formData.username); // Add username here
        formDataToSend.append("type", formData.type);

        // POST request to upload files
        await axios.post(
          'http://localhost:5001/api/upload-files2',
          formDataToSend,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        // Success message
        toast('Your Request Is Pending');
        setMessageType('success');
        window.location.reload();
      }
      
    }
    else if(formData.type === 'Tourist') {
      // Check if the user is at least 18 years old
      const dob = new Date(formData2.dob);
      const age = new Date().getFullYear() - dob.getFullYear();
      if (age < 18) {
        setMessage('You must be at least 18 years old.');
        setMessageType('error');
        return; // Prevent submission if under 18
      }
      const response = await axios.post('http://localhost:5001/api/tourists', formData2);

      if (response.status === 200) {
        toast('Your Tourist Registration is Successful');
        setMessageType('success');
        window.location.reload(); // Refresh after successful submission
      }
    }
    } catch (error) {
      console.log("Error:", error);
      setMessage('Error during signup. Please try again.');
      setMessageType('error');
    }
  };

  const handleTermsChange = (e) => {
    setTermsAccepted(e.target.checked);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto bg-gray-100">
        <DialogHeader className="flex flex-col items-center text-center">
          <DialogTitle className="text-2xl font-medium">Sign up</DialogTitle>
          <DialogDescription className="text-gray-600">Already Registered?{' '}
            <Link
              onClick={(e) => {
                e.preventDefault();
                onLoginClick();
              }}
              variant="outline"
              className="text-gray-600 underline hover:underline">
              Sign in
            </Link>
          </DialogDescription>
        </DialogHeader>
        <div className="bg-white bg-opacity-80 rounded-xl shadow-2xl p-8">
          <div className="grid mb-4 grid-cols-2 gap-4">
            {roles.map((role) => (
              <motion.button
                key={role.name}
                type="button"
                onClick={() => handleRoleChange(role.name)}
                whileHover="hover"
                whileTap="tap"
                className={`py-2 px-4 rounded-lg font-semibold text-sm flex items-center justify-center space-x-2 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                  formData.type === role.name
                    ? 'bg-black text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {role.icon}
                <span>{role.name}</span>
              </motion.button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
          {formData.type === "Tourist" && (
  <>
    <div className="space-y-2">
      <Label htmlFor="name">Full Name</Label>
      <Input
        id="name"
        type="text"
        name="name"
        value={formData2.name}
        onChange={handleChange}
        placeholder="Enter your full name"
        required
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="username">Username</Label>
      <Input
        id="username"
        type="text"
        name="username"
        value={formData2.username}
        onChange={handleChange}
        placeholder="Enter your user name"
        required
      />
    </div>
    <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={formData2.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="mobileNumber">Mobile number</Label>
                    <div className="flex gap-2">
                    <Select name="countryCode" defaultValue="+20"
                      onValueChange={(value) => handleChange({ target: { name: 'countryCode', value } })}
                      >
                      <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="countryCode" /> 
                      </SelectTrigger>
                      <SelectContent >
                        <SelectItem value="+966">🇸🇦 +966</SelectItem> {/* Saudi Arabia */}
                        <SelectItem value="+971">🇦🇪 +971</SelectItem> {/* United Arab Emirates */}
                        <SelectItem value="+965">🇰🇼 +965</SelectItem> {/* Kuwait */}
                        <SelectItem value="+1">🇺🇸 +1</SelectItem> {/* United States */}
                        <SelectItem value="+44">🇬🇧 +44</SelectItem> {/* United Kingdom */}
                        <SelectItem value="+91">🇮🇳 +91</SelectItem> {/* India */}
                        <SelectItem value="+92">🇵🇰 +92</SelectItem> {/* Pakistan */}
                        <SelectItem value="+20">🇪🇬 +20</SelectItem> {/* Egypt */}
                        <SelectItem value="+27">🇿🇦 +27</SelectItem> {/* South Africa */}
                        <SelectItem value="+49">🇩🇪 +49</SelectItem> {/* Germany */}
                        <SelectItem value="+33">🇫🇷 +33</SelectItem> {/* France */}
                        <SelectItem value="+86">🇨🇳 +86</SelectItem> {/* China */}
                        <SelectItem value="+81">🇯🇵 +81</SelectItem> {/* Japan */}
                        <SelectItem value="+82">🇰🇷 +82</SelectItem> {/* South Korea */}
                        <SelectItem value="+55">🇧🇷 +55</SelectItem> {/* Brazil */}
                        <SelectItem value="+52">🇲🇽 +52</SelectItem> {/* Mexico */}
                        <SelectItem value="+39">🇮🇹 +39</SelectItem> {/* Italy */}
                        <SelectItem value="+34">🇪🇸 +34</SelectItem> {/* Spain */}
                        <SelectItem value="+7">🇷🇺 +7</SelectItem> {/* Russia */}
                        <SelectItem value="+90">🇹🇷 +90</SelectItem> {/* Turkey */}
                        <SelectItem value="+62">🇮🇩 +62</SelectItem> {/* Indonesia */}
                        <SelectItem value="+60">🇲🇾 +60</SelectItem> {/* Malaysia */}
                        <SelectItem value="+65">🇸🇬 +65</SelectItem> {/* Singapore */}
                        <SelectItem value="+61">🇦🇺 +61</SelectItem> {/* Australia */}
                        <SelectItem value="+1">🇨🇦 +1</SelectItem> {/* Canada */}
                        <SelectItem value="+48">🇵🇱 +48</SelectItem> {/* Poland */}
                        <SelectItem value="+63">🇵🇭 +63</SelectItem> {/* Philippines */}
                        <SelectItem value="+94">🇱🇰 +94</SelectItem> {/* Sri Lanka */}
                        <SelectItem value="+880">🇧🇩 +880</SelectItem> {/* Bangladesh */}
                      </SelectContent>
                    </Select>
                    <Input 
                    onChange={handleChange}
                    className="flex-1" 
                    id="mobileNumber" 
                    name="mobileNumber" 
                    value={formData2.mobileNumber}
                    placeholder="e.g. 01XXXXXXXX" 
                    required />
                    </div>
                  </div>

    <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    value={formData2.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                  />
                </div>

    <div className="space-y-2">
      <Label htmlFor="dob">Date of Birth</Label>
      <Input
        id="dob"
        type="date"
        name="dob"
        value={formData2.dob}
        onChange={handleChange}
        required
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="nationality">Nationality</Label>
      <select
        id="nationality"
        name="nationality"
        value={formData2.nationality}
        onChange={handleChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        required
      >
        <option value="">Select Nationality</option>
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
    </div>

    <div className="space-y-2">
      <Label htmlFor="occupation">Occupation</Label>
      <select
        id="occupation"
        name="occupation"
        value={formData2.occupation}
        onChange={handleChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        required
      >
        <option value="student">Student</option>
        <option value="employed">Employed</option>
        <option value="unemployed">Unemployed</option>
      </select>
    </div>
  </>
)}

            {formData.type === "TourGuide" && (
              <>
              <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo">Logo</Label>
                  <Input
                    id="logo"
                    type="file"
                    name="logo"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="idFile">ID File</Label>
                  <Input
                    id="idFile"
                    type="file"
                    name="idFile"
                    accept=".pdf,.doc,.docx,image/*"
                    onChange={handleFileChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certificatesfile">Certificate</Label>
                  <Input
                    id="certificatesfile"
                    type="file"
                    name="certificatesfile"
                    accept=".pdf,.doc,.docx,image/*"
                    onChange={handleFileChange}
                    required
                  />
                </div>
              </>
            )}

            {formData.type === "Seller" && (
              <>
              <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo">Logo</Label>
                  <Input
                    id="logo"
                    type="file"
                    name="logo"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="idFile">ID File</Label>
                  <Input
                    id="idFile"
                    type="file"
                    name="idFile"
                    accept=".pdf,.doc,.docx,image/*"
                    onChange={handleFileChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxationCard">Taxation Card</Label>
                  <Input
                    id="taxationCard"
                    type="file"
                    name="taxationCard"
                    accept=".pdf,.doc,.docx,image/*"
                    onChange={handleFileChange}
                    required
                  />
                </div>
              </>
            )}
            {formData.type === "Advertiser" && (
              <>
              <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo">Logo</Label>
                  <Input
                    id="logo"
                    type="file"
                    name="logo"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="idFile">ID File</Label>
                  <Input
                    id="idFile"
                    type="file"
                    name="idFile"
                    accept=".pdf,.doc,.docx,image/*"
                    onChange={handleFileChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxationCard">Taxation Card</Label>
                  <Input
                    id="taxationCard"
                    type="file"
                    name="taxationCard"
                    accept=".pdf,.doc,.docx,image/*"
                    onChange={handleFileChange}
                    required
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                required
              />
              <label htmlFor="terms">
                {" "}I accept the{' '}
                <span
                  className="text-blue-600 cursor-pointer"
                  onClick={() => toast("read terms and consitions")}
                >
                  Terms and Conditions
                </span>
              </label>
            </div>

            <Button type="submit" className="w-full">
              Sign up
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}