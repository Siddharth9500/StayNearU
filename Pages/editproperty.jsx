import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

import PropertyForm from "@/Components/Admin/PropertyForm";
import PhotoUpload from "@/Components/Admin/PhotoUpload";

export default function EditPropertyPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    property_type: "pg",
    rent_amount: "",
    rent_type: "monthly",
    security_deposit: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    latitude: "",
    longitude: "",
    nearby_colleges: [],
    distance_to_college: "",
    facilities: [],
    sharing_options: [],
    photos: [],
    videos: [],
    owner_name: "",
    owner_phone: "",
    owner_email: "",
    owner_whatsapp: "",
    availability_status: "available",
    total_rooms: "",
    available_rooms: "",
    gender_preference: "any",
    featured: false
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const userData = await base44.auth.me();
      setUser(userData);

      const urlParams = new URLSearchParams(window.location.search);
      const propertyId = urlParams.get('id');
      
      if (!propertyId) {
        navigate(createPageUrl("AdminDashboard"));
        return;
      }

      const properties = await base44.entities.Property.list();
      const foundProperty = properties.find(p => p.id === propertyId);
      
      if (!foundProperty) {
        alert("Property not found");
        navigate(createPageUrl("AdminDashboard"));
        return;
      }

      if (foundProperty.created_by !== userData.email && userData.role !== 'admin') {
        alert("You don't have permission to edit this property");
        navigate(createPageUrl("AdminDashboard"));
        return;
      }

      setProperty(foundProperty);
      setFormData({
        title: foundProperty.title || "",
        description: foundProperty.description || "",
        property_type: foundProperty.property_type || "pg",
        rent_amount: foundProperty.rent_amount || "",
        rent_type: foundProperty.rent_type || "monthly",
        security_deposit: foundProperty.security_deposit || "",
        address: foundProperty.address || "",
        city: foundProperty.city || "",
        state: foundProperty.state || "",
        pincode: foundProperty.pincode || "",
        latitude: foundProperty.latitude || "",
        longitude: foundProperty.longitude || "",
        nearby_colleges: foundProperty.nearby_colleges || [],
        distance_to_college: foundProperty.distance_to_college || "",
        facilities: foundProperty.facilities || [],
        sharing_options: foundProperty.sharing_options || [],
        photos: foundProperty.photos || [],
        videos: foundProperty.videos || [],
        owner_name: foundProperty.owner_name || "",
        owner_phone: foundProperty.owner_phone || "",
        owner_email: foundProperty.owner_email || "",
        owner_whatsapp: foundProperty.owner_whatsapp || "",
        availability_status: foundProperty.availability_status || "available",
        total_rooms: foundProperty.total_rooms || "",
        available_rooms: foundProperty.available_rooms || "",
        gender_preference: foundProperty.gender_preference || "any",
        featured: foundProperty.featured || false
      });
    } catch (error) {
      console.error("Error loading data:", error);
      alert("Error loading property. Please try again.");
      navigate(createPageUrl("AdminDashboard"));
    }
    setLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhotoUpload = async (files) => {
    setUploading(true);
    try {
      const uploadPromises = files.map(file => base44.integrations.Core.UploadFile({ file }));
      const results = await Promise.all(uploadPromises);
      const urls = results.map(result => result.file_url);
      
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...urls]
      }));
    } catch (error) {
      console.error("Error uploading photos:", error);
      alert("Error uploading photos. Please try again.");
    }
    setUploading(false);
  };

  const handleRemovePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const processedData = {
        ...formData,
        rent_amount: parseFloat(formData.rent_amount) || 0,
        security_deposit: parseFloat(formData.security_deposit) || 0,
        latitude: parseFloat(formData.latitude) || null,
        longitude: parseFloat(formData.longitude) || null,
        total_rooms: parseInt(formData.total_rooms) || null,
        available_rooms: parseInt(formData.available_rooms) || null,
      };

      await base44.entities.Property.update(property.id, processedData);
      navigate(createPageUrl("AdminDashboard"));
    } catch (error) {
      console.error("Error updating property:", error);
      alert("Error updating property. Please try again.");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Loading property...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("AdminDashboard"))}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Property</h1>
            <p className="text-gray-600 mt-1">Update your property details</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Property Information</CardTitle>
            </CardHeader>
            <CardContent>
              <PropertyForm 
                formData={formData}
                onChange={handleInputChange}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Photos & Videos</CardTitle>
            </CardHeader>
            <CardContent>
              <PhotoUpload
                photos={formData.photos}
                onUpload={handlePhotoUpload}
                onRemove={handleRemovePhoto}
                uploading={uploading}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(createPageUrl("AdminDashboard"))}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving || uploading}
              className="bg-sky-600 hover:bg-sky-700"
            >
              {saving ? (
                "Saving..."
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Property
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}