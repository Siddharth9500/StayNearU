
import { useState, useEffect } from "react";
import { Property } from "@/entities/Property";
import { User } from "@/entities/User";
import { UploadFile } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, LogIn, Building } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

import PropertyForm from "../components/admin/PropertyForm";
import PhotoUpload from "../components/admin/PhotoUpload";

export default function AddPropertyPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
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
    sharing_options: [], // Initialize sharing_options
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
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setCheckingAuth(true);
    try {
      const userData = await User.me();
      setUser(userData);
      // Pre-fill owner information if available
      if (userData) {
        setFormData(prev => ({
          ...prev,
          owner_name: userData.full_name || "",
          owner_email: userData.email || ""
        }));
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setUser(null);
    }
    setCheckingAuth(false);
  };

  const handleLogin = async () => {
    try {
      await User.loginWithRedirect(window.location.href);
    } catch (error) {
      console.error("Login error:", error);
    }
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
      const uploadPromises = files.map(file => UploadFile({ file }));
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
    
    if (!user) {
      const shouldLogin = confirm("You need to sign in to list a property. Would you like to sign in now?");
      if (shouldLogin) {
        handleLogin();
      }
      return;
    }

    setSaving(true);

    try {
      // Convert string numbers to numbers
      const processedData = {
        ...formData,
        rent_amount: parseFloat(formData.rent_amount) || 0,
        security_deposit: parseFloat(formData.security_deposit) || 0,
        latitude: parseFloat(formData.latitude) || null,
        longitude: parseFloat(formData.longitude) || null,
        total_rooms: parseInt(formData.total_rooms) || null,
        available_rooms: parseInt(formData.available_rooms) || null,
      };

      await Property.create(processedData);
      navigate(createPageUrl("AdminDashboard"));
    } catch (error) {
      console.error("Error creating property:", error);
      alert("Error creating property. Please try again.");
    }
    setSaving(false);
  };

  // Show loading spinner while checking authentication
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-sky-500 to-sky-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">List Your Property</CardTitle>
            <p className="text-gray-600 mt-2">
              Sign in to start listing your properties and connect with students looking for accommodation
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
                <span>Reach thousands of students searching for accommodation</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
                <span>Upload multiple photos and videos to showcase your property</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
                <span>Get direct inquiries from interested students</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
                <span>Manage your listings with our easy-to-use dashboard</span>
              </div>
            </div>
            
            <Button 
              onClick={handleLogin}
              className="w-full bg-sky-600 hover:bg-sky-700 h-12"
              size="lg"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Sign In to List Property
            </Button>
            
            <p className="text-xs text-gray-500 text-center">
              It's free to list your property. Sign in with your Google account to get started.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("AdminDashboard"))}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Property</h1>
            <p className="text-gray-600 mt-1">Fill in the details to list your property</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Property Form */}
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

          {/* Photo Upload */}
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

          {/* Submit Button */}
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
                  Save Property
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
