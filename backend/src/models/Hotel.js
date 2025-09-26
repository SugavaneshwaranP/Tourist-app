import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['standard', 'deluxe', 'suite', 'family']
  },
  capacity: {
    adults: {
      type: Number,
      required: true
    },
    children: {
      type: Number,
      default: 0
    }
  },
  amenities: [String],
  price: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'maintenance'],
    default: 'available'
  }
});

const hotelSchema = new mongoose.Schema({
  managerId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  location: {
    address: String,
    city: {
      type: String,
      required: true
    },
    state: String,
    country: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  category: {
    type: String,
    enum: ['budget', 'business', 'luxury', 'resort'],
    required: true
  },
  amenities: [{
    type: String,
    enum: [
      'wifi', 'parking', 'pool', 'spa', 'gym', 
      'restaurant', 'room-service', 'bar',
      'conference-room', 'laundry'
    ]
  }],
  rooms: [roomSchema],
  images: [String],
  description: String,
  policies: {
    checkIn: String,
    checkOut: String,
    cancellation: String
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 4
  },
  reviews: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    rating: Number,
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  availability: [{
    date: Date,
    availableRooms: {
      standard: Number,
      deluxe: Number,
      suite: Number,
      family: Number
    }
  }]
});

// Update availability when rooms are added/modified
hotelSchema.pre('save', function(next) {
  if (this.isModified('rooms')) {
    const roomCounts = this.rooms.reduce((acc, room) => {
      if (room.status === 'available') {
        acc[room.type] = (acc[room.type] || 0) + 1;
      }
      return acc;
    }, {});

    // Update availability for next 365 days
    const availability = [];
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      availability.push({
        date,
        availableRooms: { ...roomCounts }
      });
    }
    this.availability = availability;
  }
  next();
});

const Hotel = mongoose.model('Hotel', hotelSchema);

export default Hotel;