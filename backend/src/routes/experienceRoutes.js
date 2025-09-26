import express from 'express';
import { protect } from '../middleware/auth.js';
import Experience from '../models/Experience.js';

const router = express.Router();

// Get all experiences with filters
router.get('/', async (req, res) => {
  try {
    const {
      city,
      category,
      minPrice,
      maxPrice,
      difficulty,
      date,
      page = 1,
      limit = 10
    } = req.query;

    const query = {};

    if (city) {
      query['location.city'] = new RegExp(city, 'i');
    }

    if (category) {
      query.category = category;
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (minPrice || maxPrice) {
      query['price.amount'] = {};
      if (minPrice) query['price.amount']['$gte'] = Number(minPrice);
      if (maxPrice) query['price.amount']['$lte'] = Number(maxPrice);
    }

    if (date) {
      query['availability'] = {
        $elemMatch: {
          date: new Date(date),
          spots: { $gt: 0 }
        }
      };
    }

    const experiences = await Experience.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('host.user', 'name email avatar');

    const total = await Experience.countDocuments(query);

    res.json({
      status: 'success',
      data: {
        experiences,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Get single experience
router.get('/:id', async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id)
      .populate('host.user', 'name email avatar')
      .populate('reviews.user', 'name avatar');

    if (!experience) {
      return res.status(404).json({
        status: 'error',
        message: 'Experience not found'
      });
    }

    res.json({
      status: 'success',
      data: { experience }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Create experience (protected, guides only)
router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'guide') {
      return res.status(403).json({
        status: 'error',
        message: 'Only guides can create experiences'
      });
    }

    const experience = new Experience({
      ...req.body,
      'host.user': req.user._id
    });

    await experience.save();

    res.status(201).json({
      status: 'success',
      data: { experience }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Update experience (protected, guide only)
router.patch('/:id', protect, async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({
        status: 'error',
        message: 'Experience not found'
      });
    }

    if (experience.host.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'You can only update your own experiences'
      });
    }

    Object.assign(experience, req.body);
    await experience.save();

    res.json({
      status: 'success',
      data: { experience }
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

    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({
        status: 'error',
        message: 'Experience not found'
      });
    }

    const { rating, comment } = req.body;

    experience.reviews.push({
      user: req.user._id,
      rating,
      comment,
      date: new Date()
    });

    // Update average rating
    const totalRatings = experience.reviews.reduce((sum, review) => sum + review.rating, 0);
    experience.rating = totalRatings / experience.reviews.length;

    await experience.save();

    res.status(201).json({
      status: 'success',
      data: { experience }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

export default router;