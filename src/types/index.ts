// Auth types
export type UserRole = 'tourist' | 'guide' | 'agency' | 'hotel' | 'admin';

export interface User {
  _id: string;
  userId: string;
  role: UserRole;
  name: string;
  email: string;
  phone: string;
  password: string;
  verified?: boolean;
  createdAt?: Date;
  preferences?: string[];
  expertise?: string[];
  languages?: string[];
  businessName?: string;
  location?: {
    address: string;
    city: string;
    state: string;
    country: string;
  };
  avatar?: string;
}

export interface AuthResponse {
  status: string;
  token: string;
  data: {
    user: Omit<User, 'password'>;
  };
}

export interface Booking {
  _id: string;
  user: string | User;
  type: 'hotel' | 'experience';
  hotel?: {
    _id: string;
    name: string;
    location: Location;
    image: string;
  };
  experience?: {
    _id: string;
    title: string;
    location: Location;
    image: string;
  };
  startDate: Date;
  endDate: Date;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  status: string;
  data: T;
}

// Common types
export interface ListResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

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


