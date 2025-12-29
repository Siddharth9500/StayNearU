import express from 'express';
import Service from '../models/Service.js';
import { authenticateToken, authorizeOwner } from '../middleware/auth.js';

const router = express.Router();

// Get all services (with filters)
router.get('/', async (req, res) => {
  try {
    const {
      city,
      category,
      latitude,
      longitude,
      maxDistance = 5,
      page = 1,
      limit = 20,
      search
    } = req.query;

    let filter = { active: true };

    // City filter
    if (city) {
      filter.city = { $regex: city, $options: 'i' };
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { specialties: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Get services with pagination
    const services = await Service.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ verified: -1, rating: -1 })
      .select('-owner_id');

    // Calculate distance if latitude and longitude provided
    if (latitude && longitude) {
      services.forEach(service => {
        if (service.latitude && service.longitude) {
          const R = 6371; // Earth's radius in km
          const dLat = (service.latitude - latitude) * Math.PI / 180;
          const dLon = (service.longitude - longitude) * Math.PI / 180;
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(latitude * Math.PI / 180) * Math.cos(service.latitude * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          service._doc.distance = Math.round((R * c) * 10) / 10;
        }
      });

      // Filter by max distance and sort by distance
      const filteredByDistance = services.filter(s => !s._doc.distance || s._doc.distance <= maxDistance);
      filteredByDistance.sort((a, b) => (a._doc.distance || 999) - (b._doc.distance || 999));

      const total = await Service.countDocuments(filter);
      return res.status(200).json({
        services: filteredByDistance,
        total,
        pages: Math.ceil(total / limit),
        current_page: page
      });
    }

    const total = await Service.countDocuments(filter);
    res.status(200).json({
      services,
      total,
      pages: Math.ceil(total / limit),
      current_page: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single service
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { $inc: { views_count: 1 } },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create service (Owner only)
router.post('/', authenticateToken, authorizeOwner, async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      address,
      city,
      latitude,
      longitude,
      phone,
      email,
      website,
      serviceTime,
      price,
      specialties
    } = req.body;

    if (!name || !category || !city) {
      return res.status(400).json({ message: 'Name, category, and city are required' });
    }

    const newService = new Service({
      name,
      category,
      description,
      address,
      city,
      latitude,
      longitude,
      phone,
      email,
      website,
      serviceTime,
      price,
      specialties: specialties || [],
      owner_id: req.user.id,
      owner_name: req.user.full_name,
      owner_phone: req.user.phone
    });

    await newService.save();
    res.status(201).json({
      message: 'Service created successfully',
      service: newService
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update service (Owner only)
router.put('/:id', authenticateToken, authorizeOwner, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (service.owner_id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this service' });
    }

    Object.assign(service, req.body);
    await service.save();

    res.status(200).json({
      message: 'Service updated successfully',
      service
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete service (Owner only)
router.delete('/:id', authenticateToken, authorizeOwner, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (service.owner_id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this service' });
    }

    await Service.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get services by city and category
router.get('/city/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const { category } = req.query;

    let filter = { city: { $regex: city, $options: 'i' }, active: true };
    if (category) filter.category = category;

    const services = await Service.find(filter)
      .sort({ verified: -1, rating: -1 })
      .select('-owner_id');

    res.status(200).json({
      services,
      total: services.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get owner's services
router.get('/owner/my-services', authenticateToken, authorizeOwner, async (req, res) => {
  try {
    const services = await Service.find({ owner_id: req.user.id });

    res.status(200).json({
      total: services.length,
      services
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Record service click (analytics)
router.post('/:id/click', async (req, res) => {
  try {
    await Service.findByIdAndUpdate(
      req.params.id,
      { $inc: { click_count: 1 } }
    );
    res.status(200).json({ message: 'Click recorded' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
