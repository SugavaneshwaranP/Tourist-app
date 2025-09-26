// Common types
export interface Location {
  address: string;
  city: string;
  state: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface Review {
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  date: Date;
}

export interface PriceRange {
  min: number;
  max: number;
  currency: string;
}

// Hotel types
export interface Room {
  type: string;
  description: string;
  price: number;
  capacity: number;
  amenities: string[];
  images: string[];
}

export interface Hotel {
  _id: string;
  name: string;
  description: string;
  location: Location;
  images: string[];
  amenities: string[];
  priceRange: PriceRange;
  rooms: Room[];
  rating: number;
  reviews: Review[];
  policies: {
    checkIn: string;
    checkOut: string;
    cancellation: string;
    restrictions: string[];
  };
  isVerified: boolean;
  contactInfo: {
    phone: string;
    email: string;
    website?: string;
  };
}

// Experience types
export interface Experience {
  _id: string;
  title: string;
  description: string;
  category: string;
  location: Location;
  duration: {
    hours: number;
    days?: number;
  };
  price: {
    amount: number;
    currency: string;
  };
  images: string[];
  highlights: string[];
  included: string[];
  excluded: string[];
  host: {
    user: {
      _id: string;
      name: string;
      email: string;
      avatar?: string;
    };
    bio: string;
    languages: string[];
    rating: number;
  };
  maxGroupSize: number;
  minAge: number;
  difficulty: 'easy' | 'moderate' | 'challenging';
  rating: number;
  reviews: Review[];
  tags: string[];
}

// Booking types
export interface Booking {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  type: 'hotel' | 'experience';
  item: Hotel | Experience;
  startDate: Date;
  endDate: Date;
  guests: {
    adults: number;
    children: number;
  };
  totalAmount: {
    amount: number;
    currency: string;
  };
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  specialRequests?: string;
}

// Authentication types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'guide';
  avatar?: string;
  preferences?: {
    interests: string[];
    preferredDestinations: string[];
    budget: {
      min: number;
      max: number;
    };
  };
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ListResponse<T> {
  success: boolean;
  count: number;
  data: T[];
  message?: string;
}