import express from 'express';
import Wishlist from '../models/Wishlist.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get User's Wishlist
router.get('/', authenticateToken, async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ user_id: req.user.id })
      .populate('property_id')
      .sort({ createdAt: -1 });

    res.status(200).json({
      total: wishlist.length,
      wishlist
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add to Wishlist
router.post('/add/:propertyId', authenticateToken, async (req, res) => {
  try {
    const { propertyId } = req.params;

    // Check if already in wishlist
    const exists = await Wishlist.findOne({
      property_id: propertyId,
      user_id: req.user.id
    });

    if (exists) {
      return res.status(400).json({ message: 'Property already in wishlist' });
    }

    const wishlistItem = new Wishlist({
      property_id: propertyId,
      user_id: req.user.id,
      user_email: req.user.email
    });

    await wishlistItem.save();

    res.status(201).json({
      message: 'Added to wishlist',
      wishlist: wishlistItem
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove from Wishlist
router.delete('/remove/:propertyId', authenticateToken, async (req, res) => {
  try {
    const result = await Wishlist.findOneAndDelete({
      property_id: req.params.propertyId,
      user_id: req.user.id
    });

    if (!result) {
      return res.status(404).json({ message: 'Item not in wishlist' });
    }

    res.status(200).json({ message: 'Removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Check if in Wishlist
router.get('/check/:propertyId', authenticateToken, async (req, res) => {
  try {
    const exists = await Wishlist.findOne({
      property_id: req.params.propertyId,
      user_id: req.user.id
    });

    res.status(200).json({ in_wishlist: !!exists });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
