import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"
import { submitComplaint } from "@/pages/tourist/api/apiService.js"


export function ComplaintForm({ onClose }) {

  const token = localStorage.getItem('token');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    body: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await submitComplaint(formData,token)
      alert("Complaint submitted successfully")
      onClose()
    } catch (error) {
      console.error("Error submitting complaint:", error)
      if (error.response) {
        alert(`Failed to submit complaint: ${error.response.data.message || error.response.statusText}`)
      } else if (error.request) {
        alert("Failed to submit complaint: No response from server")
      } else {
        alert(`Failed to submit complaint: ${error.message}`)
      }
    } finally {
      setIsSubmitting(false)
    }
}

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
        <h2 className="text-2xl font-bold mb-4">Submit a Complaint</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <Textarea
              id="body"
              name="body"
              value={formData.body}
              onChange={handleChange}
              required
              className="w-full"
              rows={4}
            />
          </div>
         
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Submitting..." : "Submit Complaint"}
          </Button>
        </form>
      </div>
    </div>
  )
}