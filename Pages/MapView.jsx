import { useState, useEffect } from 'react';
import { Property } from '@/entities/Property';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

// Fix for default Leaflet icon issue with Webpack
const DefaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function MapViewPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProperties() {
      try {
        const data = await Property.list();
        const geoProperties = data.filter(p => p.latitude && p.longitude);
        setProperties(geoProperties);
      } catch (error) {
        console.error("Error loading properties for map:", error);
      }
      setLoading(false);
    }
    loadProperties();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Loading Map...</p>
        </div>
      </div>
    );
  }

  const mapCenter = properties.length > 0 
    ? [properties[0].latitude, properties[0].longitude] 
    : [20.5937, 78.9629]; // Default to center of India

  return (
    <div className="h-screen w-full relative pt-16">
      <MapContainer center={mapCenter} zoom={properties.length > 0 ? 12 : 5} scrollWheelZoom={true} className="h-full w-full z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {properties.map(property => (
          <Marker key={property.id} position={[property.latitude, property.longitude]}>
            <Popup>
              <div className="w-64">
                {property.photos && property.photos[0] && (
                  <img src={property.photos[0]} alt={property.title} className="w-full h-32 object-cover rounded-lg mb-2" />
                )}
                <h3 className="font-bold text-md mb-1">{property.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{property.city}</p>
                <div className="flex justify-between items-center">
                  <p className="font-bold text-lg text-sky-600">₹{property.rent_amount?.toLocaleString()}</p>
                  <Link to={createPageUrl(`PropertyDetails?id=${property.id}`)}>
                    <Button size="sm">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View
                    </Button>
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}