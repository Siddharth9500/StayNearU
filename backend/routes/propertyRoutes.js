import express from 'express';
import Property from '../models/Property.js';
import { authenticateToken, authorizeOwner } from '../middleware/auth.js';

const router = express.Router();

// Get All Properties (with filters)
router.get('/', async (req, res) => {
  try {
    const { city, property_type, min_rent, max_rent, page = 1, limit = 10 } = req.query;

    let filter = {};
    if (city) filter.city = { $regex: city, $options: 'i' };
    if (property_type) filter.property_type = property_type;
    if (min_rent || max_rent) {
      filter.rent_amount = {};
      if (min_rent) filter.rent_amount.$gte = parseInt(min_rent);
      if (max_rent) filter.rent_amount.$lte = parseInt(max_rent);
    }

    const properties = await Property.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('owner_id', 'full_name email phone')
      .sort({ createdAt: -1 });

    const total = await Property.countDocuments(filter);

    res.status(200).json({
      properties,
      total,
      pages: Math.ceil(total / limit),
      current_page: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Single Property
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { $inc: { views_count: 1 } },
      { new: true }
    ).populate('owner_id', 'full_name email phone profile_photo');

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create Property (Owner only)
router.post('/', authenticateToken, authorizeOwner, async (req, res) => {
  try {
    const {
      title,
      description,
      property_type,
      rent_amount,
      rent_type,
      security_deposit,
      address,
      city,
      state,
      pincode,
      latitude,
      longitude,
      nearby_colleges,
      distance_to_college,
      facilities,
      photos,
      videos,
      owner_name,
      owner_phone,
      owner_email,
      owner_whatsapp,
      total_rooms,
      available_rooms,
      gender_preference,
      sharing_options
    } = req.body;

    const property = new Property({
      title,
      description,
      property_type,
      rent_amount,
      rent_type,
      security_deposit,
      address,
      city,
      state,
      pincode,
      latitude,
      longitude,
      nearby_colleges,
      distance_to_college,
      facilities,
      photos,
      videos,
      owner_id: req.user.id,
      owner_name,
      owner_phone,
      owner_email,
      owner_whatsapp,
      total_rooms,
      available_rooms,
      gender_preference,
      sharing_options
    });

    await property.save();

    res.status(201).json({
      message: 'Property created successfully',
      property
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Property (Owner only)
router.put('/:id', authenticateToken, authorizeOwner, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.owner_id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this property' });
    }

    Object.assign(property, req.body);
    property.updatedAt = Date.now();
    await property.save();

    res.status(200).json({
      message: 'Property updated successfully',
      property
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Property (Owner only)
router.delete('/:id', authenticateToken, authorizeOwner, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.owner_id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this property' });
    }

    await Property.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Owner's Properties
router.get('/owner/my-properties', authenticateToken, authorizeOwner, async (req, res) => {
  try {
    const properties = await Property.find({ owner_id: req.user.id });

    res.status(200).json({
      total: properties.length,
      properties
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
