import express from 'express';
import { protect } from '../middleware/auth.js';
import Hotel from '../models/Hotel.js';

const router = express.Router();

// Get all hotels with filters
router.get('/', async (req, res) => {
  try {
    const {
      city,
      minPrice,
      maxPrice,
      amenities,
      page = 1,
      limit = 10
    } = req.query;

    const query = {};

    if (city) {
      query['location.city'] = new RegExp(city, 'i');
    }

    if (minPrice || maxPrice) {
      query['rooms.price'] = {};
      if (minPrice) query['rooms.price']['$gte'] = Number(minPrice);
      if (maxPrice) query['rooms.price']['$lte'] = Number(maxPrice);
    }

    if (amenities) {
      query.amenities = {
        $all: Array.isArray(amenities) ? amenities : [amenities]
      };
    }

    const hotels = await Hotel.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('hotelManager', 'name email phone');

    const total = await Hotel.countDocuments(query);

    res.json({
      items: hotels,
      total,
      page: Number(page),
      pageSize: Number(limit)
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Get single hotel
router.get('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
      .populate('hotelManager', 'name email phone')
      .populate('reviews.user', 'name avatar');

    if (!hotel) {
      return res.status(404).json({
        status: 'error',
        message: 'Hotel not found'
      });
    }

    res.json({
      status: 'success',
      data: { hotel }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Create hotel (protected, hotel manager only)
router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'hotel') {
      return res.status(403).json({
        status: 'error',
        message: 'Only hotel managers can create hotels'
      });
    }

    const hotel = new Hotel({
      ...req.body,
      hotelManager: req.user._id
    });

    await hotel.save();

    res.status(201).json({
      status: 'success',
      data: { hotel }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Update hotel (protected, hotel manager only)
router.patch('/:id', protect, async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        status: 'error',
        message: 'Hotel not found'
      });
    }

    if (hotel.hotelManager.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'You can only update your own hotel'
      });
    }

    Object.assign(hotel, req.body);
    await hotel.save();

    res.json({
      status: 'success',
      data: { hotel }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Add review (protected, tourists only)
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    if (req.user.role !== 'tourist') {
      return res.status(403).json({
        status: 'error',
        message: 'Only tourists can add reviews'
      });
    }

    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        status: 'error',
        message: 'Hotel not found'
      });
    }

    const { rating, comment } = req.body;

    hotel.reviews.push({
      user: req.user._id,
      rating,
      comment,
      date: new Date()
    });

    // Update average rating
    const totalRatings = hotel.reviews.reduce((sum, review) => sum + review.rating, 0);
    hotel.rating = totalRatings / hotel.reviews.length;

    await hotel.save();

    res.status(201).json({
      status: 'success',
      data: { hotel }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

export default router;