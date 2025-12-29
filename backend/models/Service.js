import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  category: {
    type: String,
    enum: ['mess_tiffin', 'laundry', 'medical', 'gym', 'daily_needs', 'cafe'],
    required: true,
    index: true
  },
  description: String,
  address: String,
  city: {
    type: String,
    required: true,
    index: true
  },
  latitude: Number,
  longitude: Number,
  phone: String,
  email: String,
  website: String,
  serviceTime: String,
  price: String,
  specialties: [String],
  
  // Ratings and reviews
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5
  },
  reviews_count: {
    type: Number,
    default: 0
  },
  rating_breakdown: {
    quality: { type: Number, default: 4.5 },
    price: { type: Number, default: 4.5 },
    service: { type: Number, default: 4.5 }
  },
  
  // Owner info
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  owner_name: String,
  owner_phone: String,
  
  // Status
  verified: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  },
  
  // Analytics
  views_count: {
    type: Number,
    default: 0
  },
  click_count: {
    type: Number,
    default: 0
  },
  saved_count: {
    type: Number,
    default: 0
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Index for geospatial queries
serviceSchema.index({ latitude: 1, longitude: 1 });
serviceSchema.index({ city: 1, category: 1 });

export default mongoose.model('Service', serviceSchema);
