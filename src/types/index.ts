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
  userId: string | User;
  type: 'hotel' | 'experience';
  itemId: string | Experience | Hotel;
  startDate: Date;
  endDate?: Date;
  guests: {
    adults: number;
    children: number;
  };
  rooms?: {
    roomType: string;
    quantity: number;
  }[];
  amount: {
    subtotal: number;
    taxes: number;
    total: number;
    currency: string;
  };
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  bookingStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  cancellation?: {
    date: Date;
    reason: string;
    refundAmount: number;
  };
  specialRequests?: string;
  createdAt: Date;
  // For backward compatibility
  user?: string | User;
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalPrice?: number;
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
  status?: 'active' | 'inactive' | 'draft';
}

export interface Guide {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  location: Location;
  speciality: string;
  languages: string[];
  experience: string;
  rating: number;
  reviews: Review[];
  pricePerDay: number;
  availability: {
    dates: Date[];
    timeSlots: string[];
  };
  certifications: string[];
  tours: number;
  bio: string;
  isVerified: boolean;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  artisan: {
    _id: string;
    name: string;
    location: Location;
    bio: string;
  };
  price: {
    amount: number;
    currency: string;
    originalPrice?: number;
  };
  images: string[];
  stock: number;
  rating: number;
  reviews: Review[];
  tags: string[];
  isAuthentic: boolean;
  shipping: {
    free: boolean;
    cost: number;
    time: string;
  };
}

export interface SearchFilters {
  query?: string;
  state?: string;
  date?: string;
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
  rating?: number;
  sortBy?: 'price' | 'rating' | 'distance' | 'newest';
  page?: number;
  limit?: number;
}


