import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Plus, Search, Edit2, Trash2, Tag, Ticket } from 'lucide-react'
import Sidebar from "@/components/Sidebar"
import Navbar from "@/components/NavbarAdmin"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from 'react-toastify'

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Show 6 promo codes per page (2 rows of 3)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchPromoCodes()
  }, [])

  const toggleSidebar = () => {
    setSidebarState(!sidebarState)
  }

  const fetchPromoCodes = async () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  // Pagination logic
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPromoCodes.slice(indexOfFirstItem, indexOfLastItem);

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredPromoCodes.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar state={sidebarState} toggleSidebar={() => setSidebarState(!sidebarState)} />
      <div
        style={{
          transition: "margin-left 0.3s ease",
          marginLeft: sidebarState ? "250px" : "0",
          width: "100%",
        }}
      >
        <Navbar toggleSidebar={() => setSidebarState(!sidebarState)} />
        <main className="flex-1 py-28 bg-gray-50">
          <div className="container mx-auto p-6 w-4/5">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-800">Promo Codes</h1>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="mb-6 flex justify-between items-center">
                <div className="relative w-1/3">
                  <input
                    type="text"
                    placeholder="Search promo codes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gray-800">
                      <Plus className="mr-2 h-4 w-4" /> Create Promo Code
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold">Create New Promo Code</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="promoCode">Promo Code</Label>
                        <Input
                          id="promoCode"
                          value={newPromoCode}
                          onChange={(e) => setNewPromoCode(e.target.value)}
                          placeholder="Enter promo code..."
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="value">Value</Label>
                        <Input
                          id="value"
                          type="number"
                          value={newValue}
                          onChange={(e) => setNewValue(e.target.value)}
                          placeholder="Enter value..."
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleSubmit} className="w-full bg-black hover:bg-gray-800">
                        Create Promo Code
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                </div>
              ) : filteredPromoCodes.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                  <Ticket className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">
                    {searchTerm ? "No promo codes found matching your search." : "No promo codes available."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentItems.map((promo) => (
                    <div
                      key={promo._id}
                      className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center transform rotate-3">
                            <Ticket className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-lg text-gray-900">{promo.promoCode}</span>
                            <span className="text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                              {promo.value}% OFF
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {editingId === promo._id ? (
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="w-20 focus:ring-purple-500"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updatePromoCode(promo._id)}
                                className="text-green-600 hover:text-green-800 hover:bg-green-50"
                              >
                                Save
                              </Button>
                            </div>
                          ) : (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingId(promo._id);
                                  setEditValue(promo.value);
                                }}
                                className="hover:bg-purple-50"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setPromoToDelete(promo)}
                                className="text-red-600 hover:text-red-800 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Updated Pagination with ellipsis */}
            {Math.ceil(filteredPromoCodes.length / itemsPerPage) > 1 && (
              <div className="flex justify-center gap-2 mt-6 pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => paginate(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                {/* First page */}
                <Button
                  variant={currentPage === 1 ? "default" : "outline"}
                  onClick={() => paginate(1)}
                  className={currentPage === 1 ? 'bg-black text-white hover:bg-black' : ''}
                >
                  1
                </Button>

                {/* Second page */}
                {Math.ceil(filteredPromoCodes.length / itemsPerPage) > 1 && (
                  <Button
                    variant={currentPage === 2 ? "default" : "outline"}
                    onClick={() => paginate(2)}
                    className={currentPage === 2 ? 'bg-black text-white hover:bg-black' : ''}
                  >
                    2
                  </Button>
                )}

                {/* Ellipsis */}
                {Math.ceil(filteredPromoCodes.length / itemsPerPage) > 3 && (
                  <Button variant="outline" disabled className="cursor-default">
                    ...
                  </Button>
                )}

                {/* Last page */}
                {Math.ceil(filteredPromoCodes.length / itemsPerPage) > 2 && (
                  <Button
                    variant={currentPage === Math.ceil(filteredPromoCodes.length / itemsPerPage) ? "default" : "outline"}
                    onClick={() => paginate(Math.ceil(filteredPromoCodes.length / itemsPerPage))}
                    className={currentPage === Math.ceil(filteredPromoCodes.length / itemsPerPage) ? 'bg-black text-white hover:bg-black' : ''}
                  >
                    {Math.ceil(filteredPromoCodes.length / itemsPerPage)}
                  </Button>
                )}

                <Button
                  variant="outline"
                  onClick={() => paginate(Math.min(currentPage + 1, Math.ceil(filteredPromoCodes.length / itemsPerPage)))}
                  disabled={currentPage === Math.ceil(filteredPromoCodes.length / itemsPerPage)}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </main>
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
