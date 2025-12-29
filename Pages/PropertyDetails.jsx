
import { useState, useEffect, useCallback } from "react";
import { Property } from "@/entities/Property";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MapPin,
  Star,
  Wifi,
  Car,
  Users,
  ArrowLeft,
  Share2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

import PhotoGallery from "../components/property/PhotoGallery";
import ContactOwner from "../components/property/ContactOwner";
import PropertyMap from "../components/property/PropertyMap";
import WishlistButton from "../components/wishlist/WishlistButton";
import ReviewSection from "../components/reviews/ReviewSection";

// Helper to convert YouTube URL to embeddable URL
const getEmbedUrl = (url) => {
  if (!url) return null;
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes('youtube.com')) {
      const videoId = urlObj.searchParams.get('v');
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (urlObj.hostname.includes('youtu.be')) {
      const videoId = urlObj.pathname.slice(1);
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (urlObj.hostname.includes('vimeo.com')) {
        const videoId = urlObj.pathname.split('/').pop();
        return `https://player.vimeo.com/video/${videoId}`;
    }
  } catch (e) {
    // a non-valid url
    return null;
  }
  return null;
};


export default function PropertyDetailsPage() {
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProperty = useCallback(async (id) => {
    setLoading(true);
    try {
      const properties = await Property.list();
      const foundProperty = properties.find(p => p.id === id);
      if (foundProperty) {
        setProperty(foundProperty);
      } else {
        navigate(createPageUrl("Search"));
      }
    } catch (error) {
      console.error("Error loading property:", error);
      navigate(createPageUrl("Search"));
    }
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = urlParams.get('id');
    
    if (propertyId) {
      loadProperty(propertyId);
    } else {
      navigate(createPageUrl("Search"));
    }
  }, [loadProperty, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded-2xl"></div>
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return null;
  }

  const facilities = property.facilities || [];
  const videos = property.videos || [];
  const facilityIcons = {
    wifi: Wifi,
    parking: Car,
    gym: Users,
    ac: Star,
    laundry: Users,
    kitchen: Users,
    security: Users,
    housekeeping: Users
  };

  const getPropertyTypeColor = (type) => {
    switch (type) {
      case 'pg': return 'bg-blue-100 text-blue-800';
      case 'hostel': return 'bg-green-100 text-green-800';
      case 'room': return 'bg-purple-100 text-purple-800';
      case 'flat': return 'bg-orange-100 text-orange-800';
      case 'apartment': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("Search"))}
            className="shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-gray-900 truncate">
              {property.title}
            </h1>
            <p className="text-gray-600 flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4" />
              {property.address}, {property.city}
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <WishlistButton 
              propertyId={property.id} 
              className="h-10 w-10 border-2 border-gray-200 hover:border-red-200"
            />
            <Button variant="outline" size="icon">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Photo Gallery */}
            <PhotoGallery photos={property.photos || []} title={property.title} />

            {/* Video Section */}
            {videos.length > 0 && videos[0] && getEmbedUrl(videos[0]) && (
              <Card>
                <CardHeader>
                  <CardTitle>Property Video</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <iframe
                      src={getEmbedUrl(videos[0])}
                      title="Property Video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Property Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-3 mb-6">
                  <Badge className={getPropertyTypeColor(property.property_type)}>
                    {property.property_type?.toUpperCase()}
                  </Badge>
                  {property.featured && (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      ⭐ Featured
                    </Badge>
                  )}
                  <Badge className={`${
                    property.availability_status === 'available' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {property.availability_status === 'available' ? 'Available' : 'Not Available'}
                  </Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Rent Details</h3>
                    <p className="text-3xl font-bold text-gray-900 mb-1">
                      ₹{property.rent_amount?.toLocaleString()}
                    </p>
                    <p className="text-gray-600">
                      {property.rent_type === 'monthly' ? 'Per Month' : 
                       property.rent_type === 'per_bed' ? 'Per Bed' : 'Entire Property'}
                    </p>
                    {property.security_deposit && (
                      <p className="text-sm text-gray-600 mt-2">
                        Security Deposit: ₹{property.security_deposit.toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Occupancy</h3>
                    {property.total_rooms && (
                      <p className="text-gray-600">
                        Total Rooms: {property.total_rooms}
                      </p>
                    )}
                    {property.available_rooms && (
                      <p className="text-gray-600">
                        Available: {property.available_rooms}
                      </p>
                    )}
                    <p className="text-gray-600 capitalize">
                      Gender: {property.gender_preference || 'Any'}
                    </p>
                  </div>
                </div>

                {property.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Description</h3>
                    <p className="text-gray-600 leading-relaxed">{property.description}</p>
                  </div>
                )}

                {/* Facilities */}
                {facilities.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Facilities & Amenities</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {facilities.map((facility, i) => {
                        const IconComponent = facilityIcons[facility.toLowerCase()] || Star;
                        return (
                          <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                            <IconComponent className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium capitalize">{facility}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Nearby Colleges */}
            {property.nearby_colleges && property.nearby_colleges.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Nearby Colleges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {property.nearby_colleges.map((college, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span>{college}</span>
                      </div>
                    ))}
                  </div>
                  {property.distance_to_college && (
                    <p className="text-sm text-gray-600 mt-3">
                      Distance to nearest college: <span className="font-semibold">{property.distance_to_college}</span>
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Map */}
            {property.latitude && property.longitude && (
              <PropertyMap 
                latitude={property.latitude} 
                longitude={property.longitude}
                title={property.title}
                address={property.address}
              />
            )}

            {/* Reviews Section */}
            <ReviewSection propertyId={property.id} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ContactOwner property={property} />
          </div>
        </div>
      </div>
    </div>
  );
}
