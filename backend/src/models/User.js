import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    required: true
  },
  role: {
    type: String,
    enum: ['tourist', 'guide', 'agency', 'hotel'],
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  verified: {
    type: Boolean,
    default: true
  },
  // Tourist specific fields
  preferences: [{
    type: String,
    enum: ['adventure', 'culture', 'nature', 'food', 'shopping', 'relaxation']
  }],
  
  // Guide specific fields
  placeOfExpertise: {
    type: mongoose.Schema.ObjectId,
    ref: 'Place'
  },
  languages: [{
    type: String
  }],
  
  // Agency/Hotel specific fields
  businessName: String,
  location: {
    type: mongoose.Schema.ObjectId,
    ref: 'Place'
  },
  
  verified: {
    email: {
      type: Boolean,
      default: false
    },
    phone: {
      type: Boolean,
      default: false
    }
  },
  verificationCodes: {
    email: String,
    phone: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Generate User ID based on role
userSchema.pre('save', function(next) {
  if (this.isNew) {
    const rolePrefix = this.role.charAt(0).toUpperCase();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const year = new Date().getFullYear();
    this.userId = `${rolePrefix}-${randomNum}-${year}`;
  }
  next();
});

// Check if password is correct
userSchema.methods.correctPassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;