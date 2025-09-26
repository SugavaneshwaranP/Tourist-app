import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import LocalStays from '../components/LocalStays';
import LocalExperiences from '../components/LocalExperiences';
import LocalGuides from '../components/LocalGuides';
import ArtisanMarketplace from '../components/ArtisanMarketplace';
import Map, { MapMarker } from '../components/Map';
import { Booking } from '../types';
import { bookingService } from '../services/booking';
import { Search, MapPin, Calendar, Filter } from 'lucide-react';

const TouristDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('stays');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    if (activeTab === 'bookings') {
      fetchBookings();
    }
  }, [activeTab]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getMyBookings();
      setBookings(response.data.items || []);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to render the active tab content
  const renderTabContent = () => {
    const filters = {
      query: searchQuery,
      state: selectedState,
      date: selectedDate,
      categories: selectedCategories
    };

    switch (activeTab) {
      case 'stays':
        return <LocalStays searchFilters={filters} />;
      case 'experiences':
        return <LocalExperiences />;
      case 'guides':
        return <LocalGuides />;
      case 'marketplace':
        return <ArtisanMarketplace />;
      case 'bookings':
        if (loading) {
          return (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          );
        }

        if (bookings.length === 0) {
          return (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">No bookings yet</h3>
              <p className="mt-2 text-gray-500">Start exploring local stays and experiences!</p>
            </div>
          );
        }

        return (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {booking.type === 'hotel' ? booking.hotel?.name : booking.experience?.title}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {booking.type === 'hotel' ? booking.hotel?.location.city : booking.experience?.location.city}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Check-in</p>
                    <p className="font-medium">{new Date(booking.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Check-out</p>
                    <p className="font-medium">{new Date(booking.endDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Guests</p>
                    <p className="font-medium">{booking.guests}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Total Price</p>
                    <p className="font-medium">${booking.totalPrice}</p>
                  </div>
                </div>
                {booking.status === 'pending' && (
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => bookingService.cancelBooking(booking._id)}
                      className="text-red-600 hover:text-red-700 font-medium text-sm"
                    >
                      Cancel Booking
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      default:
        return <LocalStays />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
              <p className="mt-1 text-sm text-gray-500">Discover authentic local experiences and stays</p>
            </div>
            <div className="bg-orange-100 rounded-lg p-4">
              <p className="text-sm font-medium text-orange-800">Travel Points: 150</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search for places, hotels, restaurants..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* State Selector */}
            <div className="w-full lg:w-48">
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
              >
                <option value="">All States</option>
                <option value="uttar-pradesh">Uttar Pradesh</option>
                <option value="kerala">Kerala</option>
                <option value="rajasthan">Rajasthan</option>
                <option value="maharashtra">Maharashtra</option>
                <option value="karnataka">Karnataka</option>
                <option value="tamil-nadu">Tamil Nadu</option>
              </select>
            </div>

            {/* Date Input */}
            <div className="w-full lg:w-48">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            </div>

            {/* Category Checkboxes */}
            <div className="flex flex-wrap gap-2">
              {['famous-spots', 'tourist-places', 'hotels', 'restaurants', 'local-guides'].map((category) => (
                <label key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-orange-600"
                    checked={selectedCategories.includes(category)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCategories([...selectedCategories, category]);
                      } else {
                        setSelectedCategories(selectedCategories.filter(c => c !== category));
                      }
                    }}
                  />
                  <span className="ml-2 text-sm capitalize">{category.replace('-', ' ')}</span>
                </label>
              ))}
            </div>

            {/* Location and Map Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        setCurrentLocation({
                          lat: position.coords.latitude,
                          lng: position.coords.longitude
                        });
                      },
                      (error) => {
                        console.error('Error getting location:', error);
                      }
                    );
                  }
                }}
                className="flex items-center px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <MapPin className="h-5 w-5 mr-2" />
                Use My Location
              </button>

              <button
                onClick={() => setShowMap(!showMap)}
                className="flex items-center px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                <Filter className="h-5 w-5 mr-2" />
                {showMap ? 'Hide Map' : 'Show Map'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Map View */}
      {showMap && (
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <Map
              center={currentLocation || { lat: 20.5937, lng: 78.9629 }} // Default to India center
              zoom={currentLocation ? 12 : 5}
              markers={[
                { lat: 27.1751, lng: 78.0421, title: 'Taj Mahal, Agra', id: 'taj-mahal' },
                { lat: 28.6139, lng: 77.2090, title: 'Red Fort, Delhi', id: 'red-fort' },
                { lat: 12.9716, lng: 77.5946, title: 'Bangalore Palace', id: 'bangalore-palace' },
                { lat: 13.0827, lng: 80.2707, title: 'Marina Beach, Chennai', id: 'marina-beach' },
                { lat: 22.5726, lng: 88.3639, title: 'Victoria Memorial, Kolkata', id: 'victoria-memorial' },
                { lat: 19.0760, lng: 72.8777, title: 'Gateway of India, Mumbai', id: 'gateway-india' }
              ]}
              onMarkerClick={(marker: MapMarker) => {
                console.log('Marker clicked:', marker);
                // TODO: Navigate to relevant tab or show details
              }}
              apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('stays')}
              className={activeTab === 'stays'
                ? 'border-orange-500 text-orange-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium'}
            >
              Local Stays
            </button>
            <button
              onClick={() => setActiveTab('experiences')}
              className={activeTab === 'experiences'
                ? 'border-orange-500 text-orange-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium'}
            >
              Experiences
            </button>
            <button
              onClick={() => setActiveTab('guides')}
              className={activeTab === 'guides'
                ? 'border-orange-500 text-orange-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium'}
            >
              Local Guides
            </button>
            <button
              onClick={() => setActiveTab('marketplace')}
              className={activeTab === 'marketplace'
                ? 'border-orange-500 text-orange-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium'}
            >
              Artisan Marketplace
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={activeTab === 'bookings'
                ? 'border-orange-500 text-orange-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium'}
            >
              My Bookings
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white shadow rounded-lg p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default TouristDashboard;