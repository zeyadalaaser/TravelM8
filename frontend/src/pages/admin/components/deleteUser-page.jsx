"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import axios from "axios"

// Mock data for database users with types
const initialUsers = [
  { id: 1, username: "admin", type: "Admin" },
  { id: 2, username: "user1", type: "Tourist" },
  { id: 3, username: "dbmanager", type: "TourGuide" },
  { id: 4, username: "analyst", type: "Seller" },
  { id: 5, username: "developer", type: "Advertiser" },
]

export default function Component() {
  const [users, setUsers] = useState(initialUsers)
  const [loading, setLoading] = useState(false)  // For showing loading state
  const [error, setError] = useState(null)       // For showing errors

  const handleDelete = async (id, username, type) => {
    setLoading(true)
    try {
      // Make DELETE request to the backend
      const response = await axios.delete(`/api/deleteAccount`, {
        params: {
          username,
          type,
        },
      })

      if (response.status === 200) {
        // Remove the user from the state after successful deletion
        setUsers(users.filter(user => user.id !== id))
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error deleting user")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Database Users</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.type}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(user.id, user.username, user.type)}
                  disabled={loading}  // Disable button when loading
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {users.length === 0 && (
        <p className="text-center text-muted-foreground mt-4">No users found.</p>
      )}
    </div>
  )
}
