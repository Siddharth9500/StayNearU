
import { useState, useEffect, useCallback } from "react";
import { Property } from "@/entities/Property";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Plus, 
  Building,
  Star,
  Users,
  DollarSign,
  LogIn
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

import AdminStats from "../components/admin/AdminStats";
import PropertyList from "../components/admin/PropertyList";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [stats, setStats] = useState({
    totalProperties: 0,
    availableProperties: 0,
    totalRevenue: 0,
    averageRent: 0
  });

  // Memoize functions with stable dependencies
  const loadData = useCallback(async (userData) => {
    if (!userData) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const propertiesData = await Property.list("-created_date");
      const userProperties = propertiesData.filter(p => p.created_by === userData.email);
      setProperties(userProperties);

      // Calculate stats
      const totalRevenue = userProperties.reduce((sum, p) => sum + (p.rent_amount || 0), 0);
      const averageRent = userProperties.length > 0 ? totalRevenue / userProperties.length : 0;
      
      setStats({
        totalProperties: userProperties.length,
        availableProperties: userProperties.filter(p => p.availability_status === 'available').length,
        totalRevenue,
        averageRent
      });
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  }, []);

  // Check authentication and load data
  useEffect(() => {
    const checkAuth = async () => {
      if (authChecked) return;
      
      try {
        const userData = await User.me();
        setUser(userData);
        await loadData(userData);
      } catch (error) {
        console.error("Authentication error:", error);
        setUser(null);
        setLoading(false); // Ensure loading is turned off even if auth fails
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, [authChecked, loadData]);

  const handleLogin = async () => {
    try {
      await User.loginWithRedirect(window.location.href);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (confirm("Are you sure you want to delete this property?")) {
      try {
        await Property.delete(propertyId);
        // Reload data only for current user
        if (user) {
          await loadData(user);
        }
      } catch (error) {
        console.error("Error deleting property:", error);
        alert("Error deleting property. Please try again.");
      }
    }
  };

  // Show loading spinner while checking authentication
  if (!authChecked) {
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
            <CardTitle className="text-2xl">Property Management</CardTitle>
            <p className="text-gray-600 mt-2">
              Sign in to manage your property listings and track your business
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-blue-50 rounded-lg">
                <Building className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-blue-900">List Properties</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-green-900">Manage Bookings</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-purple-900">Track Revenue</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <Star className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-orange-900">Get Reviews</p>
              </div>
            </div>
            
            <Button 
              onClick={handleLogin}
              className="w-full bg-sky-600 hover:bg-sky-700 h-12"
              size="lg"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Sign In to Continue
            </Button>
            
            <p className="text-xs text-gray-500 text-center">
              New to StayNearU? Sign in with your Google account to get started
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading state for authenticated user
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Property Management
            </h1>
            <p className="text-gray-600 mt-2">
              Welcome back{user?.full_name ? `, ${user.full_name}` : ''}! Manage your property listings.
            </p>
          </div>
          <Link to={createPageUrl("AddProperty")}>
            <Button size="lg" className="bg-sky-600 hover:bg-sky-700">
              <Plus className="w-5 h-5 mr-2" />
              Add New Property
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <AdminStats stats={stats} />

        {/* Properties List */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Your Properties ({properties.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {properties.length > 0 ? (
              <PropertyList 
                properties={properties} 
                onDelete={handleDeleteProperty}
              />
            ) : (
              <div className="text-center py-12">
                <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Properties Yet</h3>
                <p className="text-gray-600 mb-6">Start by adding your first property listing</p>
                <Link to={createPageUrl("AddProperty")}>
                  <Button size="lg" className="bg-sky-600">
                    <Plus className="w-5 h-5 mr-2" />
                    Add First Property
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
