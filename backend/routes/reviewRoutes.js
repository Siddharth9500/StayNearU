import express from 'express';
import Review from '../models/Review.js';
import Property from '../models/Property.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get Reviews for a Property
router.get('/property/:propertyId', async (req, res) => {
  try {
    const reviews = await Review.find({ property_id: req.params.propertyId })
      .populate('user_id', 'full_name profile_photo')
      .sort({ createdAt: -1 });

    const avgRating = reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

    res.status(200).json({
      reviews,
      total: reviews.length,
      average_rating: avgRating
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create Review
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { property_id, rating, review_text, stay_duration } = req.body;

    // Check if property exists
    const property = await Property.findById(property_id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if user already reviewed
    const existingReview = await Review.findOne({
      property_id,
      user_id: req.user.id
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this property' });
    }

    const review = new Review({
      property_id,
      user_id: req.user.id,
      user_email: req.user.email,
      rating,
      review_text,
      stay_duration
    });

    await review.save();

    // Update property rating
    const allReviews = await Review.find({ property_id });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    
    await Property.findByIdAndUpdate(property_id, {
      rating: avgRating,
      reviews_count: allReviews.length
    });

    res.status(201).json({
      message: 'Review created successfully',
      review
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Review
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user_id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    Object.assign(review, req.body);
    await review.save();

    res.status(200).json({
      message: 'Review updated successfully',
      review
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Review
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user_id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    const propertyId = review.property_id;
    await Review.findByIdAndDelete(req.params.id);

    // Update property rating
    const allReviews = await Review.find({ property_id: propertyId });
    const avgRating = allReviews.length > 0
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
      : 0;
    
    await Property.findByIdAndUpdate(propertyId, {
      rating: avgRating,
      reviews_count: allReviews.length
    });

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
