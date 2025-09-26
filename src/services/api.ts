import axios from 'axios';
import type {
  AuthResponse,
  ApiResponse,
  ListResponse,
  User,
  Hotel,
  Experience,
  Booking
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth services
export const authService = {
  async register(data: { name: string; email: string; password: string; phone?: string }) {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  async login(data: { email: string; password: string }) {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  async getProfile() {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data;
  }
};

// Hotel services
export const hotelService = {
  async getHotels(params?: {
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    amenities?: string[];
  }) {
    const response = await api.get<ListResponse<Hotel>>('/hotels', { params });
    return response.data;
  },

  async getHotel(id: string) {
    const response = await api.get<ApiResponse<Hotel>>(`/hotels/${id}`);
    return response.data;
  },

  async createHotel(data: Partial<Hotel>) {
    const response = await api.post<ApiResponse<Hotel>>('/hotels', data);
    return response.data;
  },

  async updateHotel(id: string, data: Partial<Hotel>) {
    const response = await api.put<ApiResponse<Hotel>>(`/hotels/${id}`, data);
    return response.data;
  },

  async addReview(id: string, data: { rating: number; comment: string }) {
    const response = await api.post<ApiResponse<Hotel>>(`/hotels/${id}/reviews`, data);
    return response.data;
  }
};

// Experience services
export const experienceService = {
  async getExperiences(params?: {
    city?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    difficulty?: string;
    date?: string;
  }) {
    const response = await api.get<ListResponse<Experience>>('/experiences', { params });
    return response.data;
  },

  async getExperience(id: string) {
    const response = await api.get<ApiResponse<Experience>>(`/experiences/${id}`);
    return response.data;
  },

  async createExperience(data: Partial<Experience>) {
    const response = await api.post<ApiResponse<Experience>>('/experiences', data);
    return response.data;
  },

  async updateExperience(id: string, data: Partial<Experience>) {
    const response = await api.put<ApiResponse<Experience>>(`/experiences/${id}`, data);
    return response.data;
  },

  async addReview(id: string, data: { rating: number; comment: string }) {
    const response = await api.post<ApiResponse<Experience>>(`/experiences/${id}/reviews`, data);
    return response.data;
  }
};

// Booking services
export const bookingService = {
  async getBookings() {
    const response = await api.get<ListResponse<Booking>>('/bookings');
    return response.data;
  },

  async getBooking(id: string) {
    const response = await api.get<ApiResponse<Booking>>(`/bookings/${id}`);
    return response.data;
  },

  async createBooking(data: {
    type: 'hotel' | 'experience';
    itemId: string;
    startDate: Date;
    endDate: Date;
    guests: {
      adults: number;
      children: number;
    };
    specialRequests?: string;
  }) {
    const response = await api.post<ApiResponse<Booking>>('/bookings', data);
    return response.data;
  },

  async cancelBooking(id: string, reason: string) {
    const response = await api.put<ApiResponse<Booking>>(`/bookings/${id}/cancel`, { reason });
    return response.data;
  }
};