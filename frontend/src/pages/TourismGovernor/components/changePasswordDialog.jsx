import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { X } from 'lucide-react'
import { useState } from "react"
import * as services from "@/pages/TourismGovernor/services.js";
import { toast } from "sonner"

export default function ChangePasswordDialog({ isOpen, onClose }) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate fields
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match');
      return;
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }
  
    try {
      const passwordData = {
        currentPassword,
        newPassword,
        confirmNewPassword: confirmPassword,
      };
      const response = await services.changePassword(passwordData, token);
  
      // Notify user of success
      toast('Password changed successfully');
      
      // Clear input fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Close the dialog
      onClose();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };
  

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Enter your current password and choose a new password.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handlePasswordChange}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="currentPassword" className="text-right">
                Current Password
              </Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newPassword" className="text-right">
                New Password
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="confirmNewPassword" className="text-right">
                Confirm Password
              </Label>
              <Input
                id="confirmNewPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
          </div>
          {error && (
            <p className="text-sm text-red-500 mb-4" role="alert">
              {error}
            </p>
          )}
          <DialogFooter>
            <Button type="submit">Change Password</Button>
          </DialogFooter>
        </form>
        <button
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          onClick={onClose} // Close the dialog from the parent
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </DialogContent>
    </Dialog>
  )
}
