import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Plus, Search, Edit2, Trash2 } from 'lucide-react'
import Sidebar from "@/components/Sidebar"
import Navbar from "@/components/NavbarAdmin"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from 'react-toastify' // Assuming you're using react-toastify for toast notifications

import 'react-toastify/dist/ReactToastify.css' // Import the CSS for react-toastify

export default function AdminPromoCode() {
  const [promoCodes, setPromoCodes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [newPromoCode, setNewPromoCode] = useState('')
  const [newValue, setNewValue] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sidebarState, setSidebarState] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [promoToDelete, setPromoToDelete] = useState(null) // State to track promo code to be deleted

  useEffect(() => {
    fetchPromoCodes()
  }, [])

  const toggleSidebar = () => {
    setSidebarState(!sidebarState)
  }

  const fetchPromoCodes = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await axios.get(
        `http://localhost:5001/api/promo-codes`
      )
      setPromoCodes(response.data || [])
    } catch (error) {
      console.error('Error fetching promo codes:', error)
      setError('Failed to fetch promo codes. Please try again later.')
      setPromoCodes([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()  // Prevent default form submission

    if (!newPromoCode || !newValue) {
      setError('Please provide both a promo code and a value.')
      return
    }

    try {
      const response = await axios.post('http://localhost:5001/api/promo-codes', {
        promoCode: newPromoCode,
        value: Number(newValue),
      })

      if (response.data) {
        // Refetch promo codes after creation
        fetchPromoCodes()
        setNewPromoCode('')
        setNewValue('')
        setError(null)
        setIsDialogOpen(false)
        toast.success("Promo code created successfully!", {
          className: "toast-success",
          bodyClassName: "toast-message",
        })
      } else {
        setError('Failed to create promo code. Please check the response structure.')
      }
    } catch (error) {
      console.error('Error creating promo code:', error)
      setError('Failed to create promo code. Please try again.')
      toast.error("Failed to create promo code. Please try again.", {
        className: "toast-error",
        bodyClassName: "toast-message",
      })
    }
  }

  const updatePromoCode = async (id) => {
    try {
      await axios.put(`http://localhost:5001/api/promo-codes/${id}`, {
        value: editValue,
      })
      fetchPromoCodes()
      setEditingId(null)
      setEditValue('')
      toast.success("Promo code updated successfully!", {
        className: "toast-success",
        bodyClassName: "toast-message",
      })
    } catch (error) {
      console.error('Error updating promo code:', error)
      setError('Failed to update promo code. Please try again.')
      toast.error("Failed to update promo code. Please try again.", {
        className: "toast-error",
        bodyClassName: "toast-message",
      })
    }
  }

  const deletePromoCode = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/promo-codes/${id}`)
      fetchPromoCodes()
      toast.success("Promo code deleted successfully!", {
        className: "toast-success",
        bodyClassName: "toast-message",
      })
    } catch (error) {
      console.error('Error deleting promo code:', error)
      toast.error("Failed to delete promo code. Please try again.", {
        className: "toast-error",
        bodyClassName: "toast-message",
      })
    }
  }

  const handleConfirmedDelete = async (id) => {
    try {
      await deletePromoCode(id)
    } finally {
      setPromoToDelete(null)
    }
  }

  const filteredPromoCodes = promoCodes.filter(
    (pc) =>
      pc.promoCode &&
      typeof pc.promoCode === "string" &&
      pc.promoCode.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return <div className="text-center py-8">Loading promo codes...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>
  }

  return (
    <div style={{ display: "flex" }}>
      {/* <Sidebar state={sidebarState} toggleSidebar={toggleSidebar} /> */}
      <div
        style={{
          transition: "margin-left 0.3s ease",
          marginLeft: sidebarState ? "250px" : "0",
          width: "100%",
        }}
      >
        <Navbar toggleSidebar={toggleSidebar} />
        <div className="container mt-20 mx-auto px-4 py-8 w-4/5">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
            <div className="relative w-full md:w-1/3">
              <input
                type="text"
                placeholder="Search promo codes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" /> Create Promo Code
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Promo Code</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="promoCode" className="text-right">
                      Promo Code
                    </Label>
                    <Input
                      id="promoCode"
                      value={newPromoCode}
                      onChange={(e) => setNewPromoCode(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="value" className="text-right">
                      Value
                    </Label>
                    <Input
                      id="value"
                      type="number"
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <Button onClick={handleSubmit}>Create Promo Code</Button>
              </DialogContent>
            </Dialog>
          </div>

          {filteredPromoCodes.length === 0 ? (
            <div className="text-center py-8">No promo codes found.</div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Promo Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPromoCodes.map((promo) => (
                    <tr key={promo._id}>
                      <td className="px-6 py-4 whitespace-nowrap">{promo.promoCode}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingId === promo._id ? (
                          <input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-20 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          promo.value
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {editingId === promo._id ? (
                          <button
                            onClick={() => updatePromoCode(promo._id)}
                            className="text-green-600 hover:text-green-900 mr-4"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingId(promo._id)
                              setEditValue(promo.value)
                            }}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            <Edit2 size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => setPromoToDelete(promo)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal for deletion confirmation */}
      {promoToDelete && (
        <Dialog open={!!promoToDelete} onOpenChange={() => setPromoToDelete(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              Are you sure you want to delete the promo code "{promoToDelete.promoCode}"?
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <Button variant="secondary" onClick={() => setPromoToDelete(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleConfirmedDelete(promoToDelete._id)}
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
