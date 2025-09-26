import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendVerificationEmail, sendVerificationSMS } from '../utils/notifications.js';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

export const signup = async (req, res) => {
  try {
    const {
      role,
      name,
      email,
      phone,
      password,
      preferences,
      placeOfExpertise,
      languages,
      businessName,
      location
    } = req.body;

    // Create user based on role
    const userData = {
      role,
      name,
      email,
      phone,
      password
    };

    // Add role-specific fields
    if (role === 'tourist' && preferences) {
      userData.preferences = preferences;
    }

    if (role === 'guide') {
      userData.placeOfExpertise = placeOfExpertise;
      userData.languages = languages;
    }

    if (['agency', 'hotel'].includes(role)) {
      userData.businessName = businessName;
      userData.location = location;
    }

    const user = await User.create(userData);

    // Generate verification codes
    const emailCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const phoneCode = Math.floor(100000 + Math.random() * 900000).toString();

    user.verificationCodes = {
      email: emailCode,
      phone: phoneCode
    };
    await user.save({ validateBeforeSave: false });

    // Send verification codes
    await sendVerificationEmail(user.email, emailCode);
    await sendVerificationSMS(user.phone, phoneCode);

    // Create token
    const token = signToken(user._id);

    // Remove password from output
    user.password = undefined;

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password'
      });
    }

    // Check if user exists & password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect email or password'
      });
    }

    // Create token
    const token = signToken(user._id);

    // Remove password from output
    user.password = undefined;

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    if (user.verificationCodes.email !== code) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid verification code'
      });
    }

    user.verified.email = true;
    user.verificationCodes.email = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

export const verifyPhone = async (req, res) => {
  try {
    const { phone, code } = req.body;

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    if (user.verificationCodes.phone !== code) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid verification code'
      });
    }

    user.verified.phone = true;
    user.verificationCodes.phone = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      message: 'Phone verified successfully'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};