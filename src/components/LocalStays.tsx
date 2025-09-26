import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import HotelCard from './HotelCard';
import BookingModal from './BookingModal';
import type { Hotel } from '../types';
import { hotelService } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface Filters {
  city: string;
  minPrice: string;
  maxPrice: string;
  amenities: string[];
}

const LocalStays: React.FC = () => {
  const { user } = useAuth();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    city: '',
    minPrice: '',
    maxPrice: '',
    amenities: []
  });
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await hotelService.getHotels({
        city: filters.city || undefined,
        minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
        amenities: filters.amenities.length > 0 ? filters.amenities : undefined
      });
      setHotels(response.data);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch hotels');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (hotel: Hotel) => {
    if (!user) {
      alert('Please login to book a stay');
      return;
    }
    setSelectedHotel(hotel);
    setIsBookingModalOpen(true);
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedHotel(null);
  };

  return (
    <section className="py-16 px-4 md:px-8 bg-gray-50">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Local Stays</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience authentic hospitality with our carefully curated local stays. From traditional homestays to boutique hotels, find your perfect accommodation.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by city..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  value={filters.city}
                  onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <input
                type="number"
                placeholder="Min Price"
                className="w-32 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              />
              <input
                type="number"
                placeholder="Max Price"
                className="w-32 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              />
              <button
                onClick={fetchHotels}
                className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition-colors flex items-center"
              >
                <Filter className="w-4 h-4 mr-2" />
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Hotels Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotels.map((hotel) => (
              <HotelCard
                key={hotel._id}
                hotel={hotel}
                onBookNow={handleBookNow}
              />
            ))}
          </div>
        )}

        {/* View More Button */}
        <div className="text-center mt-12">
          <button 
            onClick={fetchHotels}
            className="bg-white text-orange-500 px-8 py-3 rounded-full border-2 border-orange-500 hover:bg-orange-50 transition-colors font-medium"
          >
            View More Stays
          </button>
        </div>

        {/* Booking Modal */}
        {selectedHotel && (
          <BookingModal
            hotel={selectedHotel}
            isOpen={isBookingModalOpen}
            onClose={handleCloseBookingModal}
          />
        )}
      </div>
    </section>
  );
};

export default LocalStays;