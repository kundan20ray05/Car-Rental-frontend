import React, { useState, useRef, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const LocationPicker = ({ location, setLocation, label = "Location" }) => {
  const [showMap, setShowMap] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [mapCenter, setMapCenter] = useState([40.7128, -74.006]); // Default: New York
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  // Initialize map when it should be shown
  useEffect(() => {
    if (showMap && mapRef.current && !mapInstanceRef.current) {
      // Create map instance
      const map = L.map(mapRef.current).setView(mapCenter, 13);

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Add click handler to map
      map.on("click", (e) => {
        const { lat, lng } = e.latlng;
        handleMapSelect(lat, lng);
      });

      mapInstanceRef.current = map;

      // Add initial marker if coordinates exist
      if (selectedCoords) {
        if (markerRef.current) {
          map.removeLayer(markerRef.current);
        }
        markerRef.current = L.marker([selectedCoords.lat, selectedCoords.lng])
          .addTo(map)
          .bindPopup(
            `Selected Location<br>Lat: ${selectedCoords.lat.toFixed(
              6,
            )}<br>Lng: ${selectedCoords.lng.toFixed(6)}`,
          );
      }

      // Cleanup on unmount
      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    }
  }, [showMap, mapCenter]);

  // Update marker when coordinates change
  useEffect(() => {
    if (mapInstanceRef.current && selectedCoords) {
      if (markerRef.current) {
        mapInstanceRef.current.removeLayer(markerRef.current);
      }
      markerRef.current = L.marker([selectedCoords.lat, selectedCoords.lng])
        .addTo(mapInstanceRef.current)
        .bindPopup(
          `<strong>${location}</strong><br>Lat: ${selectedCoords.lat.toFixed(
            6,
          )}<br>Lng: ${selectedCoords.lng.toFixed(6)}`,
        )
        .openPopup();
    }
  }, [selectedCoords, location]);

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handleMapSelect = (lat, lng) => {
    const coords = { lat, lng };
    setSelectedCoords(coords);

    // Use reverse geocoding to get place name from coordinates
    reverseGeocode(lat, lng);
  };

  // Reverse geocode coordinates to get place name
  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      );
      const result = await response.json();

      // Extract meaningful location name from the result
      const placeName =
        result.address?.city ||
        result.address?.town ||
        result.address?.village ||
        result.address?.county ||
        result.address?.state ||
        result.name ||
        `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

      setLocation(placeName);
      console.log("✅ Location found:", placeName);
    } catch (error) {
      console.error("Error reverse geocoding:", error);
      // Fallback to coordinates if reverse geocoding fails
      setLocation(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    }
  };

  const handleSearchLocation = async () => {
    if (!location.trim()) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          location,
        )}`,
      );
      const results = await response.json();

      if (results.length > 0) {
        const { lat, lon } = results[0];
        setMapCenter([parseFloat(lat), parseFloat(lon)]);
        setSelectedCoords({ lat: parseFloat(lat), lng: parseFloat(lon) });
        setShowMap(true);

        // If map already exists, update its center
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView(
            [parseFloat(lat), parseFloat(lon)],
            13,
          );
        }
      } else {
        alert("Location not found. Try another search.");
      }
    } catch (error) {
      console.error("Error searching location:", error);
      alert("Error searching location");
    }
  };

  const toggleMap = () => {
    setShowMap(!showMap);
  };

  return (
    <div className="flex flex-col w-full gap-3">
      <label className="font-medium">{label}</label>

      {/* Location Input */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="e.g., Chicago, New York or address"
          value={location}
          onChange={handleLocationChange}
          className="px-3 py-2 flex-1 border border-borderColor rounded-md outline-none"
        />
        <button
          type="button"
          onClick={handleSearchLocation}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors whitespace-nowrap"
        >
          Search
        </button>
      </div>

      {/* Show Map Button */}
      <button
        type="button"
        onClick={toggleMap}
        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors w-max"
      >
        {showMap ? "Hide Map" : "Open Map"}
      </button>

      {/* Display selected coordinates */}
      {selectedCoords && (
        <p className="text-sm text-gray-600">
          📍 Lat: {selectedCoords.lat.toFixed(6)}, Lng:{" "}
          {selectedCoords.lng.toFixed(6)}
        </p>
      )}

      {/* Map Container - Full width overlay when open */}
      {showMap && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-borderColor bg-white">
            <h3 className="text-lg font-semibold">Select Location on Map</h3>
            <button
              type="button"
              onClick={() => setShowMap(false)}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Close
            </button>
          </div>

          {/* Map Container */}
          <div
            ref={mapRef}
            className="flex-1 w-full h-full bg-gray-200"
            style={{ minHeight: "calc(100vh - 100px)" }}
          />

          {/* Footer */}
          <div className="p-3 text-sm text-gray-600 bg-gray-50 border-t border-gray-200">
            💡 Click on the map to select location
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
