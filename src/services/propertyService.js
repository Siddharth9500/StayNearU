import { supabase } from '../supabaseClient'

// Get all properties
export const getProperties = async () => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
  if (error) console.error('Error fetching properties:', error)
  return data || []
}

// Get property by ID
export const getPropertyById = async (id) => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single()
  if (error) console.error('Error:', error)
  return data
}

// Add property
export const addProperty = async (property) => {
  const { data, error } = await supabase
    .from('properties')
    .insert([property])
  if (error) console.error('Error adding property:', error)
  return data
}

// Update property
export const updateProperty = async (id, updates) => {
  const { data, error } = await supabase
    .from('properties')
    .update(updates)
    .eq('id', id)
  if (error) console.error('Error updating property:', error)
  return data
}

// Delete property
export const deleteProperty = async (id) => {
  const { data, error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id)
  if (error) console.error('Error deleting property:', error)
  return data
}

// Get reviews for a property
export const getReviews = async (propertyId) => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, user:users(name)')
    .eq('property_id', propertyId)
  if (error) console.error('Error:', error)
  return data || []
}

// Add review
export const addReview = async (review) => {
  const { data, error } = await supabase
    .from('reviews')
    .insert([review])
  if (error) console.error('Error adding review:', error)
  return data
}

// Get wishlist
export const getWishlist = async (userId) => {
  const { data, error } = await supabase
    .from('wishlist')
    .select('*, property:properties(*)')
    .eq('user_id', userId)
  if (error) console.error('Error:', error)
  return data || []
}

// Add to wishlist
export const addToWishlist = async (userId, propertyId) => {
  const { data, error } = await supabase
    .from('wishlist')
    .insert([{ user_id: userId, property_id: propertyId }])
  if (error) console.error('Error:', error)
  return data
}

// Remove from wishlist
export const removeFromWishlist = async (userId, propertyId) => {
  const { data, error } = await supabase
    .from('wishlist')
    .delete()
    .eq('user_id', userId)
    .eq('property_id', propertyId)
  if (error) console.error('Error:', error)
  return data
}
