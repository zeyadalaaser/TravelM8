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

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
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
            <AlertDialogAction variant="outline" size="sm" onClick={handleLogout}>
            Sign Out
            </AlertDialogAction>
        </AlertDialogFooter>
    </AlertDialogContent>
    </AlertDialog>
  );
};

export default Logout;