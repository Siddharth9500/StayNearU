import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  property_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  user_email: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure unique combination of property and user
wishlistSchema.index({ property_id: 1, user_id: 1 }, { unique: true });

export default mongoose.model('Wishlist', wishlistSchema);
