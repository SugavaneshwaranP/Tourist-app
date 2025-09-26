import Booking from '../models/Booking.js';
import Hotel from '../models/Hotel.js';
import Experience from '../models/Experience.js';
import { sendBookingConfirmation, sendBookingCancellation } from '../utils/notifications.js';

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const booking = new Booking({
      ...req.body,
      userId: req.user._id
    });

    // Check availability
    const Model = booking.type === 'hotel' ? Hotel : Experience;
    const item = await Model.findById(booking.itemId);

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Check hotel room availability
    if (booking.type === 'hotel') {
      for (const roomBooking of booking.rooms) {
        const room = item.rooms.find(r => r.type === roomBooking.roomType);
        if (!room || room.available < roomBooking.quantity) {
          return res.status(400).json({
            error: `Room type ${roomBooking.roomType} is not available in requested quantity`
          });
        }
      }
    }

    // Check experience availability and capacity
    if (booking.type === 'experience') {
      const totalGuests = booking.guests.adults + booking.guests.children;
      if (totalGuests > item.maxCapacity) {
        return res.status(400).json({
          error: 'Guest count exceeds experience capacity'
        });
      }

      // Check date availability
      const isAvailable = item.availability.some(slot => 
        slot.date.toDateString() === booking.startDate.toDateString() &&
        slot.spots >= totalGuests
      );

      if (!isAvailable) {
        return res.status(400).json({
          error: 'Experience is not available on selected date'
        });
      }
    }

    await booking.save();

    // Update availability
    if (booking.type === 'hotel') {
      for (const roomBooking of booking.rooms) {
        await Hotel.updateOne(
          { 
            _id: booking.itemId,
            'rooms.type': roomBooking.roomType
          },
          {
            $inc: { 'rooms.$.available': -roomBooking.quantity }
          }
        );
      }
    } else {
      await Experience.updateOne(
        {
          _id: booking.itemId,
          'availability.date': booking.startDate
        },
        {
          $inc: { 'availability.$.spots': -(booking.guests.adults + booking.guests.children) }
        }
      );
    }

    // Send booking confirmation
    await sendBookingConfirmation(req.user.email, booking);

    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a specific booking
export const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('itemId');

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if user is authorized to view this booking
    if (booking.userId._id.toString() !== req.user._id.toString() && 
        !['admin', 'host'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all bookings for the logged-in user
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('itemId')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a booking
export const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if user is authorized to update this booking
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Only allow updating certain fields
    const allowedUpdates = ['specialRequests'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid updates' });
    }

    updates.forEach(update => booking[update] = req.body[update]);
    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Cancel a booking
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if user is authorized to cancel this booking
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Check if booking can be cancelled
    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({ error: 'Booking is already cancelled' });
    }

    if (booking.bookingStatus === 'completed') {
      return res.status(400).json({ error: 'Cannot cancel a completed booking' });
    }

    // Calculate refund amount based on cancellation policy
    let refundAmount = 0;
    const daysUntilBooking = Math.ceil(
      (booking.startDate - new Date()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilBooking > 7) {
      refundAmount = booking.amount.total * 0.9; // 90% refund
    } else if (daysUntilBooking > 3) {
      refundAmount = booking.amount.total * 0.5; // 50% refund
    } // No refund for <= 3 days

    // Update booking status
    booking.bookingStatus = 'cancelled';
    booking.cancellation = {
      date: new Date(),
      reason: req.body.reason,
      refundAmount
    };

    // Release availability
    if (booking.type === 'hotel') {
      for (const roomBooking of booking.rooms) {
        await Hotel.updateOne(
          {
            _id: booking.itemId,
            'rooms.type': roomBooking.roomType
          },
          {
            $inc: { 'rooms.$.available': roomBooking.quantity }
          }
        );
      }
    } else {
      await Experience.updateOne(
        {
          _id: booking.itemId,
          'availability.date': booking.startDate
        },
        {
          $inc: { 'availability.$.spots': (booking.guests.adults + booking.guests.children) }
        }
      );
    }

    await booking.save();

    // Send cancellation notification
    await sendBookingCancellation(req.user.email, booking);

    res.json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};