import { useNavigate } from 'react-router-dom';
import { LogOut  } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"; 
import {Button} from "@/components/ui/button";
import { jwtDecode } from 'jwt-decode';

const Logout = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const currentTime = Math.floor(Date.now() / 1000);
  
  if (decodedToken.exp < currentTime) {
    navigate("/");
  } else {
    setTimeout(() => {
      navigate("/");
    }, (decodedToken.exp - currentTime) * 1000); // Time until expiration
  }

  console.log(decodedToken);
  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      // navigate("/loading");
    // setTimeout(() => {
      if (response.ok) {
        localStorage.removeItem('token');
        setTimeout(() => {
          navigate("/"); 
        }, 500); 

        // window.location.reload(); 

      } else {
        console.error('Failed to logout');
      }
    // }, 2000); 
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AlertDialog>
    <AlertDialogTrigger asChild>
    <div className="flex justify-center">
        <button variant="outline" className="text-red-600 hover:text-red-800">
            Sign out
        </button>
        </div>
    </AlertDialogTrigger>
    <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle style={{ fontSize: '1.7rem', fontWeight: 'bold' }}>You're about to sign out</AlertDialogTitle>
            <AlertDialogDescription>
                Are you sure?
            </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
                variant="destructive"
                size="sm"
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 font-medium rounded-md hover:bg-red-700">
            Sign Out
            </AlertDialogAction>
        </AlertDialogFooter>
    </AlertDialogContent>
    </AlertDialog>
  );
};

export default Logout;