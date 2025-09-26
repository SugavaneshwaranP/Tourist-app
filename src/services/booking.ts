import { api } from './api';
import type { Booking } from '../types';

export const bookingService = {
  async getMyBookings() {
    const response = await api.get('/bookings/my-bookings');
    return response.data;
  },

  async getGuideBookings(guideId: string) {
    const response = await api.get(`/bookings/guide/${guideId}`);
    return response.data;
  },

  async createBooking(data: {
    type: 'hotel' | 'experience';
    hotelId?: string;
    experienceId?: string;
    startDate: Date;
    endDate: Date;
    guests: number;
  }) {
    const response = await api.post('/bookings', data);
    return response.data;
  },

  async cancelBooking(bookingId: string) {
    const response = await api.post(`/bookings/${bookingId}/cancel`);
    return response.data;
  }
};
