import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from 'react-router-dom';
import LoginPage from "@/pages/signIn/signin.jsx";
import axios from 'axios'; // Add axios for API calls
import { useNavigate } from 'react-router-dom';

export default function SignupDialog({children, isOpen, onOpenChange, onLoginClick }) {
  const [open, setOpen] = useState(false);
  const [fileInputs, setFileInputs] = useState({
    logo: null,
    idFile: null,
    taxationCard: null
  });
  const [formDataAdvertiser, setFormDataAdvertiser] = useState({
    username: '',
    email: '',
    password: '',
    type: 'Advertiser'
  });
  const [termsOpen, setTermsOpen] = useState(false); 
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [image, setImage] = useState();
  const [idfile, setIdFile] = useState();
  const [taxfile, setTaxFile] = useState();
  const navigate = useNavigate();

  const handleSubmit = async (e)  => {
    event.preventDefault();
    setMessage('');
    try {

      const response = axios.post('http://localhost:5001/api/pending-users', formDataAdvertiser)
      console.log("Signup Successful", response);

      if (response.status === 200) {

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

      alert('Your Request Is Pending');
      setMessageType('success');
      navigate('/');
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setMessage('Error during signup. Please try again.');
      setMessageType('error');
    }
  
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFileInputs((prevState) => ({
      ...prevState,
      [name]: files[0]
    }));
    // Handle specific files
    if (name === 'logo') {
      setImage(files[0]);
    } else if (name === 'idFile') {
      setIdFile(files[0]);
    } else if (name === 'taxationCard') {
      setTaxFile(files[0]);
    }
  
  };

  const handleTermsChange = (e) => {
    setTermsAccepted(e.target.checked);
  };

  const commonFields = ['username', 'email', 'password'];
  const touristFields = [...commonFields, 'name', 'mobileNumber', 'nationality', 'dob', 'occupation'];
  const otherFields = commonFields;

  const renderField = (field) => {
    switch (field) { 
      case 'name':
        return (
          <div key={field} className="space-y-2">
            <Label htmlFor={field}>Full Name</Label>
            <Input id={field} type="text" placeholder={`Enter your full name`} required />
          </div>
        );
      case 'email':
        return (
          <div key={field} className="space-y-2">
            <Label htmlFor={field}>Email</Label>
            <Input id={field} type="email" 
            placeholder={`Enter your email`} 
            value={formDataAdvertiser.email}
            onChange={(e) => setFormDataAdvertiser((prev) => ({ ...prev, [field]: e.target.value }))}
            required 
            />
          </div>
        );
      case 'username':
        return (
          <div key={field} className="space-y-2">
            <Label htmlFor={field}>Username</Label>
            <Input
              id={field}
              type="text"
              placeholder={`Enter your username`}
              value={formDataAdvertiser.username}
              onChange={(e) => setFormDataAdvertiser((prev) => ({ ...prev, [field]: e.target.value }))}
              required
            />
          </div>
        );
      case 'password':
        return (
          <div key={field} className="space-y-2">
            <Label htmlFor={field}>Password</Label>
            <Input
              id={field}
              type="password"
              placeholder={`Enter your password`}
              value={formDataAdvertiser.password}
              onChange={(e) => setFormDataAdvertiser((prev) => ({ ...prev, [field]: e.target.value }))}
              required
            />
          </div>
        );
      case 'dob':
        return (
          <div key={field} className="space-y-2">
            <Label htmlFor={field}>Date of Birth</Label>
            <Input id={field} type="date" required />
          </div>
        );
      case 'mobileNumber':
        return (
          <div key={field} className="space-y-2">
            <Label htmlFor={field}>Mobile Number</Label>
            <Input id={field} type="text" placeholder={`Enter your mobile number`} required />
          </div>
        );
      case 'nationality':
        return (
          <div key={field} className="space-y-2">
            <Label htmlFor={field}>Nationality</Label>
            <Select required>
              <SelectTrigger id={field}>
                <SelectValue placeholder="Select nationality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      case 'occupation':
        return (
          <div key={field} className="space-y-2">
            <Label htmlFor={field}>Occupation</Label>
            <Input id={field} placeholder="Enter your occupation" required />
          </div>
        );
    }
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
          <Tabs defaultValue="tourist" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="tourist">Tourist</TabsTrigger>
              <TabsTrigger value="tourguide">Tour Guide</TabsTrigger>
              <TabsTrigger value="seller">Seller</TabsTrigger>
              <TabsTrigger value="advertiser">Advertiser</TabsTrigger>
            </TabsList>
            <TabsContent value="advertiser">
              <form onSubmit={handleSubmit} className="space-y-4">
                {['username', 'email', 'password'].map(renderField)}

                <div className="space-y-2">
                  <Label htmlFor="logo">Logo</Label>
                  <Input id="logo" type="file" name="logo" onChange={handleFileChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="idFile">ID File</Label>
                  <Input id="idFile" type="file" name="idFile" onChange={handleFileChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxationCard">Taxation Card</Label>
                  <Input id="taxationCard" type="file" name="taxationCard" onChange={handleFileChange} required />
                </div>

                <div className="space-y-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={handleTermsChange}
                    required
                  />
                  <label htmlFor="terms">
                    I accept the{' '}
                    <span
                      className="text-blue-600 cursor-pointer"
                      onClick={() => setTermsOpen(true)}
                    >
                      Terms and Conditions
                    </span>
                  </label>
                </div>

                <Button type="submit" className="w-full bg-gray-800 hover:bg-gray-700">
                  Sign up
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}