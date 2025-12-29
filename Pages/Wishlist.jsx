
import { useState, useEffect, useCallback } from "react";
import { Wishlist as WishlistEntity } from "@/entities/Wishlist";
import { Property } from "@/entities/Property";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Trash2, ExternalLink, MapPin } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function WishlistPage() {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const loadWishlist = useCallback(async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      
      const wishlists = await WishlistEntity.filter({ 
        user_email: userData.email 
      }, "-created_date");
      
      // Get property details for each wishlist item
      const properties = await Property.list();
      const wishlistWithProperties = wishlists.map(wishlist => {
        const property = properties.find(p => p.id === wishlist.property_id);
        return {
          ...wishlist,
          property
        };
      }).filter(item => item.property); // Filter out items where property was deleted
      
      setWishlistItems(wishlistWithProperties);
    } catch (error) {
      console.error("Error loading wishlist:", error);
      // If user not authenticated, redirect to search
      navigate(createPageUrl("Search"));
    }
    setLoading(false);
  }, [navigate]); // navigate is a dependency because it's used inside the useCallback

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]); // loadWishlist is now stable due to useCallback

  const removeFromWishlist = async (wishlistId) => {
    try {
      await WishlistEntity.delete(wishlistId);
      setWishlistItems(prev => prev.filter(item => item.id !== wishlistId));
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      alert("Error removing from wishlist. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-80 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            My Wishlist
          </h1>
          <p className="text-gray-600">
            Properties you've saved for later ({wishlistItems.length} items)
          </p>
        </div>

        {/* Wishlist Items */}
        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {wishlistItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="relative">
                      {/* Property Image */}
                      <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                        {item.property.photos && item.property.photos[0] ? (
                          <img
                            src={item.property.photos[0]}
                            alt={item.property.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <MapPin className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                        
                        {/* Remove Button */}
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-3 right-3 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeFromWishlist(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Property Info */}
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-sky-600 transition-colors">
                          {item.property.title}
                        </h3>
                        
                        <div className="flex items-center gap-1 text-gray-600 mb-3">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{item.property.city}</span>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <span className="text-2xl font-bold text-gray-900">
                              ₹{item.property.rent_amount?.toLocaleString()}
                            </span>
                            <span className="text-gray-500 text-sm ml-1">
                              /{item.property.rent_type === 'monthly' ? 'month' : 
                                item.property.rent_type === 'per_bed' ? 'bed' : 'property'}
                            </span>
                          </div>
                          
                          <div className="text-sm text-gray-600 capitalize bg-gray-100 px-2 py-1 rounded">
                            {item.property.property_type}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Link 
                            to={createPageUrl(`PropertyDetails?id=${item.property.id}`)}
                            className="flex-1"
                          >
                            <Button className="w-full bg-sky-600 hover:bg-sky-700">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                          </Link>
                        </div>
                        
                        <p className="text-xs text-gray-500 mt-3">
                          Added {new Date(item.created_date).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Wishlist is Empty</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start exploring properties and save your favorites to view them later.
            </p>
            <Link to={createPageUrl("Search")}>
              <Button size="lg" className="bg-sky-600 hover:bg-sky-700">
                <Heart className="w-5 h-5 mr-2" />
                Explore Properties
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
