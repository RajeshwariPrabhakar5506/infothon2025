import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import { MapPin, Star, Clock, Navigation, Phone, Crosshair, Package } from 'lucide-react';
import { toast } from 'react-toastify';
import L from 'leaflet';

// --- LEAFLET SETUP ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- HELPER 1: Component to control Map movement ---
const MapController = ({ center, selectedLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedLocation) {
      map.flyTo(
        [selectedLocation.location.coordinates[1], selectedLocation.location.coordinates[0]], 
        16, 
        { duration: 1.5 }
      );
    } else if (center) {
        map.setView(center, 14, { animate: true });
    }
  }, [selectedLocation, center, map]);

  return null;
};

// --- HELPER 2: Component to listen for Map Clicks ---
const ClickEventLayer = ({ onMapClick }) => {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
};


const MapPage = () => {
  // --- STATE ---
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null); // Initial GPS location
  const [searchCenter, setSearchCenter] = useState({ lat: 12.2958, lng: 76.6394 }); // Mysuru default
  const [selectedLocation, setSelectedLocation] = useState(null);

  // --- FUNCTION: Fetch Data (Memoized) ---
  const fetchLocations = useCallback(async (lat, lng) => {
    setLoading(true);
    try {
      // Calls your dynamic backend (OpenStreetMap)
      const { data } = await axios.get(`/api/locations?lat=${lat}&lng=${lng}`);
      setLocations(data);
      if (data.length === 0) toast.info("No recycling points found in this specific area.");
    } catch (error) {
      console.error("Error loading locations:", error);
      toast.error("Could not load nearby locations");
    } finally {
      setLoading(false);
    }
  }, []); 

  // --- HANDLER: New Search Trigger ---
  const handleNewSearch = useCallback((lat, lng) => {
      setSearchCenter({ lat, lng });
      setSelectedLocation(null); 
      fetchLocations(lat, lng);
      
      toast.success("Searching new area...");
  }, [fetchLocations]);

  // --- EFFECT: Get GPS Location on Initial Load ---
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserLocation({ lat: latitude, longitude });
          handleNewSearch(latitude, longitude); // Initial search is user's location
        },
        () => {
            const defaultLocation = { lat: 12.2958, lng: 76.6394 };
            toast.warn("Location access denied. Showing default map.");
            handleNewSearch(defaultLocation.lat, defaultLocation.lng);
        }
      );
    } else {
      const defaultLocation = { lat: 12.2958, lng: 76.6394 };
      handleNewSearch(defaultLocation.lat, defaultLocation.lng);
    }
  }, [handleNewSearch]);

  // --- HANDLER: Recenter Map ---
  const handleRecenter = () => {
    if (userLocation) {
        handleNewSearch(userLocation.lat, userLocation.lng);
        toast.success("Map updated to your location");
    } else {
        toast.error("GPS location not yet available. Try again in a moment.");
    }
  };

  return (
    <div className="min-h-screen bg-off-white font-sans text-charcoal flex flex-col">
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 md:px-8 py-6">
        
        {/* SECTION 1: Map & Directory Header */}
        <div className="flex items-center mb-8 mt-2">
            <span className="bg-primary text-white rounded-full h-10 w-10 flex items-center justify-center text-xl font-bold mr-4">1</span>
            <h2 className="text-3xl font-bold text-charcoal">Local Hub Directory</h2>
            
            <button 
              onClick={handleRecenter}
              disabled={!userLocation}
              className="ml-auto bg-primary text-white px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-green-800 transition shadow-sm text-sm font-bold disabled:bg-gray-400"
            >
              <Crosshair className="w-4 h-4" /> Recenter to GPS
            </button>
        </div>

        {/* --- MAP & DIRECTORY SPLIT VIEW --- */}
        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-100px)]">
            
            {/* LEFT: Map Container (2/3 width) */}
            <div className="lg:col-span-2 rounded-xl overflow-hidden shadow-lg border border-gray-200 relative z-0">
                {loading && (
                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-90">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mb-4"></div>
                        <p className="text-primary font-bold animate-pulse">Scanning local area...</p>
                    </div>
                )}
                
                <MapContainer 
                    center={[searchCenter.lat, searchCenter.lng]} 
                    zoom={14} 
                    style={{ height: "100%", width: "100%" }}
                    className="shadow-lg"
                >
                    <TileLayer
                        attribution='© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    {/* Enables map clicks for search */}
                    <ClickEventLayer onMapClick={handleNewSearch} />

                    {/* Controls map view and centers on search result */}
                    <MapController center={[searchCenter.lat, searchCenter.lng]} selectedLocation={selectedLocation} />
                    
                    {/* RENDER PINS */}
                    {locations.map((loc) => (
                        <Marker 
                            key={loc._id} 
                            position={[loc.location.coordinates[1], loc.location.coordinates[0]]}
                            eventHandlers={{
                                click: () => setSelectedLocation(loc),
                            }}
                        >
                            <Popup>
                                <div className="min-w-[200px]">
                                    <h3 className="font-bold text-primary text-base mb-1">{loc.name}</h3>
                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full uppercase font-bold">
                                        {loc.type}
                                    </span>
                                    <p className="text-xs text-gray-500 mt-2">{loc.address}</p>
                                    <a 
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${loc.location.coordinates[1]},${loc.location.coordinates[0]}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="block mt-3 text-center bg-primary text-white text-xs py-2 rounded font-bold hover:bg-green-800"
                                    >
                                        Navigate Here
                                    </a>
                                </div>
                            </Popup>
                        </Marker>
                    ))}

                    {/* Current Search Center Pin */}
                    <Marker position={[searchCenter.lat, searchCenter.lng]}>
                         <Popup>New Search Area</Popup>
                    </Marker>
                </MapContainer>
            </div>

            {/* RIGHT: Directory List (1/3 width) */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <h2 className="font-bold text-gray-700">Nearby Locations ({locations.length})</h2>
                </div>
                
                <div className="flex-grow overflow-y-auto p-2 space-y-3 custom-scrollbar">
                    {locations.length === 0 && !loading ? (
                        <div className="text-center text-gray-500 py-10 px-4">
                            <MapPin className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                            <p>No locations found. Click anywhere on the map to search a new area.</p>
                        </div>
                    ) : (
                        locations.map((loc) => (
                            <div 
                                key={loc._id}
                                onClick={() => setSelectedLocation(loc)}
                                className={`p-4 rounded-lg border transition cursor-pointer hover:shadow-md ${selectedLocation?._id === loc._id ? 'border-primary ring-1 ring-primary bg-green-50' : 'border-gray-100 bg-white'}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-bold text-primary text-sm line-clamp-1">{loc.name}</h3>
                                    <span className="text-xs text-gray-400 bg-gray-100 px-1.5 rounded flex items-center">
                                        <Star className="w-3 h-3 mr-1 fill-current text-yellow-400" /> 4.5
                                    </span>
                                </div>
                                
                                <p className="text-xs text-gray-500 mb-2 line-clamp-2">{loc.address}</p>
                                
                                <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                                    <Clock className="w-3 h-3 text-accent" />
                                    <span>{loc.hours ? Object.values(loc.hours)[0] : "Open Now"}</span>
                                </div>

                                <div className="flex justify-between items-center pt-2 border-t border-gray-100/50">
                                    <span className="text-xs font-bold text-primary uppercase">{loc.type}</span>
                                    <a 
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${loc.location.coordinates[1]},${loc.location.coordinates[0]}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs font-bold text-primary hover:underline flex items-center"
                                        onClick={(e) => e.stopPropagation()} 
                                    >
                                        Directions <Navigation className="w-3 h-3 ml-1" />
                                    </a>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
      </main>
      
      {/* Footer is handled globally */}
    </div>
  );
};

export default MapPage;