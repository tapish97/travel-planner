import { useState } from 'react';
import axios from 'axios';
import Locations from './components/Locations';

function App() {
  const [locations, setLocations] = useState([]);
  const [interests, setInterests] = useState('');
  const [itinerary, setItinerary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const getCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            
            const address = response.data.address;
            const city = address.city || address.town || address.village;
            if (city) {
              setLocations(prev => [...prev, {
                id: Date.now(),
                name: city,
                days: 1
              }]);
            }
          } catch (err) {
            setError('Failed to detect location');
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          setError('Location access denied');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation not supported');
      setLoading(false);
    }
  };

  const generateItinerary = async () => {
    if (locations.length === 0) {
      setError('Please add at least one location');
      return;
    }

    try {
      setLoading(true);
      setError('');
      console.log(BACKEND_URL)
      const response = await axios.post(BACKEND_URL, {
        locations,
        interests
      });

      setItinerary(response.data.itinerary);
    } catch (err) {
      setError('Failed to generate itinerary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Multi-City Travel Planner 🌍</h1>

      <button 
        onClick={getCurrentLocation}
        disabled={loading}
        className="current-location-btn"
      >
        {loading ? 'Detecting...' : 'Use Current Location'}
      </button>

      <Locations locations={locations} setLocations={setLocations} />

      <div className="interests-input">
        <input
          type="text"
          placeholder="Interests (e.g., museums, hiking, food)"
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
        />
      </div>

      <button 
        onClick={generateItinerary} 
        disabled={loading || locations.length === 0}
        className="generate-btn"
      >
        {loading ? 'Generating...' : 'Create Itinerary'}
      </button>

      {error && <div className="error">{error}</div>}

      {itinerary && (
        <div className="itinerary">
          <h2>Your Travel Plan:</h2>
          <pre>{itinerary}</pre>
        </div>
      )}
    </div>
  );
}

export default App;