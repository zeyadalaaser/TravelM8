import React, { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import axios from "axios"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

  const MapCard = ({ setLatLng }) => {
  const [mapCenter, setMapCenter] = useState([51.505, -0.09])
  const [address, setAddress] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [markerPosition, setMarkerPosition] = useState(null)

  const handleAddressChange = async (e) => {
    const inputValue = e.target.value
    setAddress(inputValue)

    if (inputValue.length > 2) {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${inputValue}`
        )
        setSuggestions(response.data)
      } catch (error) {
        console.error("Error fetching suggestions:", error)
      }
    } else {
      setSuggestions([])
    }
  }

  const handleSuggestionClick = (suggestion) => {
    const { display_name, lat, lon } = suggestion;
    placeMarker(lat, lon, display_name);
    setSuggestions([]);
    setAddress(display_name);
  }

  const placeMarker = (lat, lng, name) => {
    setMarkerPosition({ lat, lng })
    setMapCenter([lat, lng])
    setLatLng({lat:lat, lng:lng })
    setAddress(name)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <form className="mb-4">
          <Input
            type="text"
            value={address}
            onChange={handleAddressChange}
            placeholder="Type an address"
            className="w-full"
          />
        </form>
        {suggestions.length > 0 && (
         <div className="h-32 mb-4 border rounded-md overflow-auto">
          <ul className="p-2">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="py-2 px-3 hover:bg-accent rounded-md cursor-pointer"
              >
                {suggestion.display_name}
              </li>
            ))}
          </ul>
       </div>
        )}
        <div className="rounded-md overflow-hidden border">
          <MapContainer
            center={mapCenter}
            zoom={13}
            style={{ height: "400px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {markerPosition && (
              <Marker position={markerPosition}>
                <Popup>{address}</Popup>
              </Marker>
            )}
            <MapClickHandler placeMarker={placeMarker} setAddress={setAddress} />
            <RecenterMap center={mapCenter} />
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  )
}

const MapClickHandler = ({ placeMarker, setAddress }) => {
  const map = useMap()
  useEffect(() => {
    const handleMapClick = async (e) => {
      const { lat, lng } = e.latlng
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        )
        const displayName = response.data.display_name
        setAddress(displayName);
        placeMarker(lat, lng, displayName);

      } catch (error) {
        console.error("Error fetching address from coordinates:", error)
      }
    }

    map.on("click", handleMapClick)

    return () => {
      map.off("click", handleMapClick)
    }
  }, [map, placeMarker, setAddress])

  return null
}

const RecenterMap = ({ center }) => {
  const map = useMap()
  useEffect(() => {
    map.setView(center, map.getZoom())
  }, [center, map])

  return null
}

export default MapCard;