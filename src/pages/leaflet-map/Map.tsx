import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer } from 'react-leaflet';

function Map() {
  // Important: Set a default height for the map container
  const mapStyle = {
    height: '90vh', // or '400px' or whatever fits your needs
    width: '90%'
  };

  return (
    <div className='w-full h-full'>
      <MapContainer 
        style={mapStyle} 
        center={[48.8566, 2.3522]} 
        zoom={13}
        scrollWheelZoom={true} // Enable scroll zoom by default
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  );
}

export default Map;