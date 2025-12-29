import { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search as SearchIcon, 
  Filter, 
  Navigation
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import PropertyCard from "@/Components/Search/PropertyCard";
import SearchFilters from "@/Components/Search/SearchFilters";
import Hero from "@/Components/Search/Hero";

const GOOGLE_MAPS_API_KEY = "AIzaSyD5ypvab8XXpDlkI3BZJScaJGGYZ5u_cr8";

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        let errorMessage = "Unable to get your location. ";
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "Please allow location access.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Location unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage += "Request timed out.";
            break;
        }
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000
      }
    );
  });
};

export default function SearchPage() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    propertyType: "all",
    priceRange: "all",
    genderPreference: "all",
    city: "all",
    sharingOptions: "all"
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const applyFilters = useCallback(() => {
    let filtered = properties;

    if (searchTerm) {
      filtered = filtered.filter(property => 
        property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.nearby_colleges?.some(college => 
          college.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (filters.propertyType !== "all") {
      filtered = filtered.filter(property => property.property_type === filters.propertyType);
    }

    if (filters.priceRange !== "all") {
      const [minStr, maxStr] = filters.priceRange.split("-");
      const minNum = Number(minStr);
      const maxNum = maxStr ? Number(maxStr) : Infinity;

      filtered = filtered.filter(property => {
        const rent = property.rent_amount;
        if (maxNum === Infinity) {
          return rent >= minNum;
        } else {
          return rent >= minNum && rent <= maxNum;
        }
      });
    }

    if (filters.genderPreference !== "all") {
      filtered = filtered.filter(property => 
        property.gender_preference === filters.genderPreference || 
        property.gender_preference === "any"
      );
    }

    if (filters.city !== "all") {
      filtered = filtered.filter(property => property.city === filters.city);
    }

    if (filters.sharingOptions !== "all") {
      filtered = filtered.filter(property => 
        property.sharing_options && property.sharing_options.includes(filters.sharingOptions)
      );
    }

    setFilteredProperties(filtered);
  }, [searchTerm, filters, properties]);

  useEffect(() => {
    const loadProperties = async () => {
      if (dataLoaded) return;
      
      setLoading(true);
      try {
        const data = await base44.entities.Property.list("-created_date");
        setProperties(data);
        setFilteredProperties(data);
        setDataLoaded(true);
      } catch (error) {
        console.error("Error loading properties:", error);
      }
      setLoading(false);
    };

    loadProperties();
  }, [dataLoaded]);

  useEffect(() => {
    if (dataLoaded) {
      applyFilters();
    }
  }, [searchTerm, filters, dataLoaded, applyFilters]);

  const handleUseLocation = async () => {
    setIsLocating(true);
    
    try {
      const location = await getUserLocation();
      
      const sorted = [...properties]
        .map(p => ({
          ...p,
          distance: (typeof p.latitude === 'number' && typeof p.longitude === 'number') 
                    ? calculateDistance(location.latitude, location.longitude, p.latitude, p.longitude) 
                    : Infinity
        }))
        .sort((a, b) => a.distance - b.distance);
      
      setFilteredProperties(sorted);
      
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.latitude},${location.longitude}&key=${GOOGLE_MAPS_API_KEY}`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'OK' && data.results && data.results.length > 0) {
          const addressComponents = data.results[0].address_components;
          let locality = '';
          addressComponents.forEach(component => {
            if (component.types.includes('locality')) locality = component.long_name;
          });
          setSearchTerm(locality || "Properties near you");
        } else {
          setSearchTerm("Properties near you");
        }
      } else {
        setSearchTerm("Properties near you");
      }
      
      setFilters({ 
        propertyType: "all", 
        priceRange: "all", 
        genderPreference: "all", 
        city: "all", 
        sharingOptions: "all" 
      });
    } catch (error) {
      console.error("Location error:", error);
      alert(error.message);
    }
    
    setIsLocating(false);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero 
        onSearch={handleSearch} 
        onUseLocation={handleUseLocation} 
        isLocating={isLocating} 
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search by location, college, or property name..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-12 h-12 border-gray-200 bg-white focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
            <Button
              variant="outline"
              onClick={handleUseLocation}
              disabled={isLocating}
              className="h-12 px-6 border-gray-200"
            >
              {isLocating ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
              ) : (
                <Navigation className="w-4 h-4 mr-2" />
              )}
              Near Me
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="h-12 px-6 border-gray-200"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-gray-100"
              >
                <SearchFilters 
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  properties={properties}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredProperties.length} Properties Found
            </h2>
            {searchTerm && (
              <p className="text-gray-600 mt-1">
                Results for "<span className="font-semibold text-sky-600">{searchTerm}</span>"
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {filteredProperties.filter(p => p.availability_status === "available").length} Available
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              {filteredProperties.filter(p => p.featured).length} Featured
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {loading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))
            ) : filteredProperties.length > 0 ? (
              filteredProperties.map((property, index) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  index={index}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SearchIcon className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or filters</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}