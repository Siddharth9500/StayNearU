import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: null
  },
  property_type: {
    type: String,
    enum: ['pg', 'hostel', 'room', 'flat', 'apartment'],
    required: true
  },
  rent_amount: {
    type: Number,
    required: true
  },
  rent_type: {
    type: String,
    enum: ['monthly', 'per_bed', 'entire_property'],
    default: 'monthly'
  },
  security_deposit: {
    type: Number,
    default: 0
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    default: null
  },
  pincode: {
    type: String,
    default: null
  },
  latitude: {
    type: Number,
    default: null
  },
  longitude: {
    type: Number,
    default: null
  },
  nearby_colleges: [{
    type: String
  }],
  distance_to_college: {
    type: String,
    default: null
  },
  facilities: [{
    type: String
  }],
  photos: [{
    type: String
  }],
  videos: [{
    type: String
  }],
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  owner_name: {
    type: String,
    required: true
  },
  owner_phone: {
    type: String,
    required: true
  },
  owner_email: {
    type: String,
    required: true
  },
  owner_whatsapp: {
    type: String,
    default: null
  },
  availability_status: {
    type: String,
    enum: ['available', 'partially_available', 'not_available'],
    default: 'available'
  },
  total_rooms: {
    type: Number,
    default: null
  },
  available_rooms: {
    type: Number,
    default: null
  },
  gender_preference: {
    type: String,
    enum: ['male', 'female', 'coed', 'any'],
    default: 'any'
  },
  sharing_options: [{
    type: String,
    enum: ['single', 'double', 'triple']
  }],
  is_verified: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews_count: {
    type: Number,
    default: 0
  },
  views_count: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
propertySchema.index({ city: 1, property_type: 1 });
propertySchema.index({ owner_id: 1 });
propertySchema.index({ latitude: '2dsphere', longitude: '2dsphere' });

export default mongoose.model('Property', propertySchema);
