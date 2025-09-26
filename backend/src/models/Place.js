import mongoose from 'mongoose';

const placeSchema = new mongoose.Schema({
  placeId: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    address: String,
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  guideIds: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  agencyIds: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  hotelIds: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  description: String,
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
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate Place ID before saving
placeSchema.pre('save', function(next) {
  if (this.isNew) {
    // Create a 3-letter code from city name
    const cityCode = this.location.city
      .substring(0, 3)
      .toUpperCase();
    
    // Add a random 3-digit number
    const randomNum = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    
    this.placeId = `${cityCode}${randomNum}`;
  }
  next();
});

const Place = mongoose.model('Place', placeSchema);

export default Place;