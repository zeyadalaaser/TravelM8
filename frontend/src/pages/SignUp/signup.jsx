'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Link } from 'react-router-dom';
import LoginPage from "@/pages/signIn/signin.jsx";

 

export default function SignupDialog({children, isOpen, onOpenChange, onLoginClick }) {
  const [open, setOpen] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    // Handle form submission logic here
    console.log('Form submitted')
    setOpen(false)
  }

  const commonFields = ['username', 'email', 'password']
  const touristFields = [...commonFields, 'name', 'mobileNumber', 'nationality', 'dob', 'occupation']
  const otherFields = commonFields

  const renderField = (field) => {
    switch (field) { 
        case 'name':
            return (
              <div key={field} className="space-y-2">
                <Label htmlFor={field}>Full Name</Label>
                <Input id={field} type="text" placeholder={`Enter your full name`} required />
              </div>
            ) 
        case 'email':
            return (
            <div key={field} className="space-y-2">
                <Label htmlFor={field}>Email</Label>
                <Input id={field} type="email" placeholder={`Enter your email`} required />
             </div>
            ) 
        case 'username':
            return (
            <div key={field} className="space-y-2">
                <Label htmlFor={field}>Username</Label>
                <Input id={field} type="text" placeholder={`Enter your username`} required />
            </div>
            )
        case 'password':
            return (
                <div key={field} className="space-y-2">
                    <Label htmlFor={field}>Password</Label>
                    <Input id={field} type="password" placeholder={`Enter your password`} required />
                </div>
            )                      

      case 'dob':
        return (
          <div key={field} className="space-y-2">
            <Label htmlFor={field}>Date of Birth</Label>
            <Input id={field} type="date" required />
          </div>
        )
        case 'mobileNumber':
            return (
              <div key={field} className="space-y-2">
                <Label htmlFor={field}>Mobile Number</Label>
                <Input id={field} type="text" placeholder={`Enter your mobile number`}  required />
              </div>
            )
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
                {/* Add more countries as needed */}
              </SelectContent>
            </Select>
          </div>
        )
      case 'occupation':
        return (
          <div key={field} className="space-y-2">
            <Label htmlFor={field}>Occupation</Label>
            <Input id={field} placeholder="Enter your occupation" required />
          </div>
        )
    }
  }

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
                    className="text-gray-600 underline hover:underline" >
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
          {['tourist', 'tourguide', 'seller', 'advertiser'].map((role) => (
            <TabsContent key={role} value={role}>
              <form onSubmit={handleSubmit} className="space-y-4">
                {(role === 'tourist' ? touristFields : otherFields).map(renderField)}
                <Button type="submit" className="w-full bg-gray-800 hover:bg-gray-700 ">
                  Sign up
                </Button>
              </form>
            </TabsContent>
          ))}
        </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}