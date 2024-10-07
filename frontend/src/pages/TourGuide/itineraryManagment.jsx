import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Edit, Plus, X } from 'lucide-react'
//import '@/pages/TourGuide/ItineraryManagement.css'

// Mock data for activities, historical sites, and tags
const mockActivities = [
  { _id: '1', name: 'City Tour' },
  { _id: '2', name: 'Museum Visit' },
]

const mockHistoricalSites = [
  { _id: '1', name: 'Ancient Ruins' },
  { _id: '2', name: 'Old Town' },
]

const mockTags = [
  { _id: '1', name: 'Cultural' },
  { _id: '2', name: 'Historical' },
]

export default function ItineraryManagement() {
  const [itineraries, setItineraries] = useState([])
  const [currentItinerary, setCurrentItinerary] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    // Fetch itineraries from API
    // For now, we'll use mock data
    setItineraries([
      {
        _id: '1',
        name: 'City Explorer',
        description: 'Explore the city\'s best attractions',
        activities: ['1'],
        historicalSites: ['2'],
        tourLanguage: 'English',
        price: 50,
        availableSlots: [
          {
            date: '2023-07-01',
            startTime: '09:00',
            endTime: '17:00',
            timeline: [
              {
                referenceModel: 'Activity',
                event: '1',
                startTime: '2023-07-01T09:00:00',
                endTime: '2023-07-01T12:00:00',
              },
              {
                referenceModel: 'HistoricalPlaces',
                event: '2',
                startTime: '2023-07-01T13:00:00',
                endTime: '2023-07-01T16:00:00',
              },
            ],
            numberOfBookings: 0,
          },
        ],
        accessibility: 'Wheelchair accessible',
        pickUpLocation: 'City Center',
        dropOffLocation: 'City Center',
        tags: ['1', '2'],
        tourGuideId: 'guide1',
      },
    ])
  }, [])

  const handleCreate = () => {
    setCurrentItinerary({})
    setIsEditing(false)
  }

  const handleEdit = (itinerary) => {
    setCurrentItinerary(itinerary)
    setIsEditing(true)
  }

  const handleDelete = (id) => {
    // Delete itinerary from API
    // For now, we'll just update the local state
    setItineraries(itineraries.filter(itinerary => itinerary._id !== id))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isEditing) {
      // Update itinerary in API
      // For now, we'll just update the local state
      setItineraries(itineraries.map(itinerary => 
        itinerary._id === currentItinerary?._id ? { ...itinerary, ...currentItinerary } : itinerary
      ))
    } else {
      // Create new itinerary in API
      // For now, we'll just add to the local state
      setItineraries([...itineraries, { ...currentItinerary, _id: Date.now().toString() }])
    }
    setCurrentItinerary(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCurrentItinerary({ ...currentItinerary, [name]: value })
  }

  return (
    <div className="itinerary-management">
      <h1 className="itinerary-management__title">Itinerary Management</h1>
      
      <Button onClick={handleCreate} className="itinerary-management__create-button">
        <Plus className="itinerary-management__create-icon" /> Create New Itinerary
      </Button>

      {currentItinerary && (
        <Card className="itinerary-form">
          <CardHeader>
            <CardTitle>{isEditing ? 'Edit Itinerary' : 'Create Itinerary'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="itinerary-form__form">
              <div className="itinerary-form__grid">
                <div className="itinerary-form__field">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" value={currentItinerary.name || ''} onChange={handleInputChange} required />
                </div>
                <div className="itinerary-form__field">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" value={currentItinerary.description || ''} onChange={handleInputChange} required />
                </div>
                <div className="itinerary-form__field">
                  <Label htmlFor="tourLanguage">Tour Language</Label>
                  <Input id="tourLanguage" name="tourLanguage" value={currentItinerary.tourLanguage || ''} onChange={handleInputChange} required />
                </div>
                <div className="itinerary-form__field">
                  <Label htmlFor="price">Price</Label>
                  <Input type="number" id="price" name="price" value={currentItinerary.price || ''} onChange={handleInputChange} required min="0" />
                </div>
                <div className="itinerary-form__field">
                  <Label htmlFor="accessibility">Accessibility</Label>
                  <Input id="accessibility" name="accessibility" value={currentItinerary.accessibility || ''} onChange={handleInputChange} required />
                </div>
                <div className="itinerary-form__field">
                  <Label htmlFor="pickUpLocation">Pick Up Location</Label>
                  <Input id="pickUpLocation" name="pickUpLocation" value={currentItinerary.pickUpLocation || ''} onChange={handleInputChange} required />
                </div>
                <div className="itinerary-form__field">
                  <Label htmlFor="dropOffLocation">Drop Off Location</Label>
                  <Input id="dropOffLocation" name="dropOffLocation" value={currentItinerary.dropOffLocation || ''} onChange={handleInputChange} required />
                </div>
                <div className="itinerary-form__field">
                  <Label htmlFor="activities">Activities</Label>
                  <Select name="activities" onValueChange={(value) => handleInputChange({ target: { name: 'activities', value } })} value={currentItinerary.activities?.[0] || ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select activities" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockActivities.map(activity => (
                        <SelectItem key={activity._id} value={activity._id}>{activity.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="itinerary-form__field">
                  <Label htmlFor="historicalSites">Historical Sites</Label>
                  <Select name="historicalSites" onValueChange={(value) => handleInputChange({ target: { name: 'historicalSites', value } })} value={currentItinerary.historicalSites?.[0] || ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select historical sites" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockHistoricalSites.map(site => (
                        <SelectItem key={site._id} value={site._id}>{site.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="itinerary-form__field">
                  <Label htmlFor="tags">Tags</Label>
                  <Select name="tags" onValueChange={(value) => handleInputChange({ target: { name: 'tags', value } })} value={currentItinerary.tags?.[0] || ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tags" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTags.map(tag => (
                        <SelectItem key={tag._id} value={tag._id}>{tag.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="itinerary-form__actions">
                <Button type="submit">{isEditing ? 'Update' : 'Create'}</Button>
                <Button type="button" variant="outline" onClick={() => setCurrentItinerary(null)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="itinerary-list">
        <CardHeader>
          <CardTitle>Itineraries</CardTitle>
          <CardDescription>List of all itineraries</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {itineraries.map(itinerary => (
                <TableRow key={itinerary._id}>
                  <TableCell>{itinerary.name}</TableCell>
                  <TableCell>{itinerary.description}</TableCell>
                  <TableCell>${itinerary.price}</TableCell>
                  <TableCell>
                    <Button variant="ghost" onClick={() => handleEdit(itinerary)} className="itinerary-list__action-button">
                      <Edit className="itinerary-list__action-icon" />
                    </Button>
                    <Button variant="ghost" onClick={() => handleDelete(itinerary._id)} className="itinerary-list__action-button">
                      <Trash2 className="itinerary-list__action-icon" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
