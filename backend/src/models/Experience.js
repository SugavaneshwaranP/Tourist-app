import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  guideId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['adventure', 'culture', 'nature', 'food', 'shopping', 'relaxation'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: mongoose.Schema.ObjectId,
    ref: 'Place',
    required: true
  },
  duration: {
    hours: Number,
    days: Number
  },
  groupSize: {
    min: Number,
    max: Number
  },
  difficulty: {
    type: String,
    enum: ['easy', 'moderate', 'challenging', 'difficult'],
    required: true
  },
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
  includes: [String],
  excludes: [String],
  requirements: [String],
  images: [String],
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
    review: String,
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  schedule: [{
    date: Date,
    startTime: String,
    slots: {
      total: Number,
      booked: Number
    },
    status: {
      type: String,
      enum: ['available', 'full', 'cancelled'],
      default: 'available'
    }
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'cancelled'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate available slots
experienceSchema.methods.updateAvailability = function(date) {
  const scheduleForDate = this.schedule.find(s => 
    s.date.toISOString().split('T')[0] === date.toISOString().split('T')[0]
  );

  if (scheduleForDate) {
    scheduleForDate.status = 
      scheduleForDate.slots.booked >= scheduleForDate.slots.total 
        ? 'full' 
        : 'available';
  }
};

const Experience = mongoose.model('Experience', experienceSchema);

export default Experience;