import express from 'express';
import { auth } from '../middleware/auth.js';
import { createBooking, getBooking, getMyBookings, updateBooking, cancelBooking } from '../controllers/bookingController.js';

const router = express.Router();

// Create a new booking
router.post('/', auth, createBooking);

// Get a specific booking
router.get('/:id', auth, getBooking);

// Get all bookings for the logged-in user
router.get('/my-bookings', auth, getMyBookings);

// Update a booking (e.g., special requests)
router.patch('/:id', auth, updateBooking);

// Cancel a booking
router.post('/:id/cancel', auth, cancelBooking);

export default router;