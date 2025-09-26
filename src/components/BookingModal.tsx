import React, { useState } from 'react';
import { X, Calendar, Users } from 'lucide-react';
import type { Hotel } from '../types';
import { bookingService } from '../services/api';

interface BookingModalProps {
  hotel: Hotel;
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ hotel, isOpen, onClose }) => {
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    guests: {
      adults: 1,
      children: 0
    },
    specialRequests: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      await bookingService.createBooking({
        type: 'hotel',
        itemId: hotel._id,
        startDate: new Date(bookingData.startDate),
        endDate: new Date(bookingData.endDate),
        guests: bookingData.guests,
        specialRequests: bookingData.specialRequests
      });

      onClose();
      alert('Booking successful!');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-xl mx-4">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-900">Book Your Stay</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Hotel Info */}
          <div className="mb-6">
            <h4 className="font-medium text-lg text-gray-900">{hotel.name}</h4>
            <p className="text-gray-600">
              {hotel.location.address}, {hotel.location.city}
            </p>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Check-in Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="date"
                  required
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  value={bookingData.startDate}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, startDate: e.target.value })
                  }
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Check-out Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="date"
                  required
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  value={bookingData.endDate}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, endDate: e.target.value })
                  }
                  min={bookingData.startDate}
                />
              </div>
            </div>
          </div>

          {/* Guests */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Guests
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="number"
                    min="1"
                    required
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    value={bookingData.guests.adults}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        guests: {
                          ...bookingData.guests,
                          adults: parseInt(e.target.value)
                        }
                      })
                    }
                    placeholder="Adults"
                  />
                </div>
              </div>
              <div>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="number"
                    min="0"
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    value={bookingData.guests.children}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        guests: {
                          ...bookingData.guests,
                          children: parseInt(e.target.value)
                        }
                      })
                    }
                    placeholder="Children"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Special Requests
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              rows={3}
              value={bookingData.specialRequests}
              onChange={(e) =>
                setBookingData({ ...bookingData, specialRequests: e.target.value })
              }
              placeholder="Any special requirements or requests..."
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-4 px-6 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;