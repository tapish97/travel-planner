import { useState } from 'react';

export default function Locations({ locations, setLocations }) {
  const [newLocation, setNewLocation] = useState('');
  const [days, setDays] = useState(1);

  const addLocation = () => {
    if (newLocation.trim() && days > 0) {
      setLocations([...locations, {
        id: Date.now(),
        name: newLocation.trim(),
        days: parseInt(days)
      }]);
      setNewLocation('');
      setDays(1);
    }
  };

  const removeLocation = (id) => {
    setLocations(locations.filter(loc => loc.id !== id));
  };

  return (
    <div className="locations">
      <div className="location-input">
        <input
          type="text"
          placeholder="Enter city or location"
          value={newLocation}
          onChange={(e) => setNewLocation(e.target.value)}
        />
        <input
          type="number"
          min="1"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          className="days-input"
        />
        <button onClick={addLocation}>Add Location</button>
      </div>

      <div className="location-list">
        {locations.map(loc => (
          <div key={loc.id} className="location-item">
            <span>{loc.name} ({loc.days} day{loc.days > 1 ? 's' : ''})</span>
            <button 
              onClick={() => removeLocation(loc.id)}
              className="remove-btn"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}