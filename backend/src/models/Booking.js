import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['hotel', 'experience'],
    required: true
  },
  itemId: {
    type: mongoose.Schema.ObjectId,
    refPath: 'type',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: function() {
      return this.type === 'hotel';
    }
  },
  guests: {
    adults: {
      type: Number,
      required: true,
      min: 1
    },
    children: {
      type: Number,
      default: 0
    }
  },
  rooms: [{
    roomType: String,
    quantity: Number
  }],
  amount: {
    subtotal: Number,
    taxes: Number,
    total: Number,
    currency: {
      type: String,
      default: 'INR'
    }
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  bookingStatus: {
    type: String,
    enum: ['confirmed', 'pending', 'cancelled', 'completed'],
    default: 'pending'
  },
  cancellation: {
    date: Date,
    reason: String,
    refundAmount: Number
  },
  specialRequests: String,
  review: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    images: [String],
    createdAt: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate booking amount
bookingSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('guests') || this.isModified('rooms')) {
    let Model;
    try {
      Model = mongoose.model(this.type === 'hotel' ? 'Hotel' : 'Experience');
      const item = await Model.findById(this.itemId);

      if (!item) {
        throw new Error('Item not found');
      }

      let subtotal = 0;
      if (this.type === 'hotel') {
        // Calculate hotel booking amount
        const nights = Math.ceil(
          (this.endDate - this.startDate) / (1000 * 60 * 60 * 24)
        );
        
        this.rooms.forEach(room => {
          const roomType = item.rooms.find(r => r.type === room.roomType);
          if (roomType) {
            subtotal += roomType.price.amount * room.quantity * nights;
          }
        });
      } else {
        // Calculate experience booking amount
        subtotal = item.price.amount * (this.guests.adults + (this.guests.children * 0.5));
      }

      // Apply taxes (18% GST)
      const taxes = subtotal * 0.18;
      
      this.amount = {
        subtotal,
        taxes,
        total: subtotal + taxes,
        currency: item.price?.currency || 'INR'
      };
    } catch (error) {
      return next(error);
    }
  }
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;