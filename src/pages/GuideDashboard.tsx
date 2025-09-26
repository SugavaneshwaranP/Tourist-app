import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Booking, Experience } from '../types';
import { bookingService } from '../services/booking';
import { experienceService } from '../services/api';
import { Search, MapPin, Calendar, DollarSign, Users, Star, Plus, Edit, Trash2 } from 'lucide-react';

const GuideDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeTours: 0,
    averageRating: 0
  });

  useEffect(() => {
    fetchGuideData();
  }, []);

  const fetchGuideData = async () => {
    try {
      setLoading(true);
      // Fetch all experiences and filter by guide
      const experiencesResponse = await experienceService.getExperiences();
      const guideExperiences = experiencesResponse.items?.filter(exp => exp.host.user._id === user?._id) || [];
      setExperiences(guideExperiences);

      // Fetch bookings for this guide
      const guideBookings = await bookingService.getGuideBookings(user?._id || '');
      setBookings(guideBookings);

      // Calculate stats
      calculateStats(guideExperiences, guideBookings);
    } catch (error) {
      console.error('Failed to fetch guide data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (experiences: Experience[], bookings: Booking[]) => {
    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.amount?.total || booking.totalPrice || 0), 0);
    const activeTours = experiences.filter(exp => exp.status === 'active').length;
    const averageRating = experiences.length > 0
      ? experiences.reduce((sum, exp) => sum + (exp.rating || 0), 0) / experiences.length
      : 0;

    setStats({
      totalBookings,
      totalRevenue,
      activeTours,
      averageRating: Math.round(averageRating * 10) / 10
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-orange-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Active Tours</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeTours}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <Star className="h-8 w-8 text-yellow-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Average Rating</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Bookings</h3>
              </div>
              <div className="p-6">
                {bookings.slice(0, 5).length > 0 ? (
                  <div className="space-y-4">
                    {bookings.slice(0, 5).map((booking) => (
                      <div key={booking._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium">{typeof booking.itemId === 'object' && 'title' in booking.itemId ? booking.itemId.title : typeof booking.itemId === 'object' && 'name' in booking.itemId ? booking.itemId.name : 'N/A'}</h4>
                          <p className="text-sm text-gray-500">
                            {booking.guests.adults + booking.guests.children} guests • {new Date(booking.startDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${booking.amount?.total || booking.totalPrice}</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            (booking.bookingStatus || booking.status) === 'confirmed' ? 'bg-green-100 text-green-800' :
                            (booking.bookingStatus || booking.status) === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {booking.bookingStatus || booking.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No recent bookings</p>
                )}
              </div>
            </div>
          </div>
        );

      case 'experiences':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">My Experiences</h3>
              <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add Experience
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {experiences.map((experience) => (
                <div key={experience._id} className="bg-white shadow rounded-lg overflow-hidden">
                  <img
                    src={experience.images?.[0] || '/placeholder-experience.jpg'}
                    alt={experience.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h4 className="font-medium text-gray-900">{experience.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">{experience.location.city}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-lg font-bold text-orange-500">${experience.price.amount}</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="ml-1 text-sm">{experience.rating || 0}</span>
                      </div>
                    </div>
                    <div className="flex justify-between mt-4">
                      <button className="text-blue-600 hover:text-blue-700 flex items-center text-sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-700 flex items-center text-sm">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {experiences.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No experiences created yet</p>
                <button className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600">
                  Create Your First Experience
                </button>
              </div>
            )}
          </div>
        );

      case 'bookings':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">All Bookings</h3>

            {bookings.length > 0 ? (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Experience
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tourist
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Guests
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bookings.map((booking) => (
                        <tr key={booking._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {typeof booking.itemId === 'object' && 'title' in booking.itemId ? booking.itemId.title : 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{typeof booking.userId === 'object' ? booking.userId.name : 'N/A'}</div>
                            <div className="text-sm text-gray-500">{typeof booking.userId === 'object' ? booking.userId.email : 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(booking.startDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {booking.guests.adults + booking.guests.children}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ${booking.amount?.total || booking.totalPrice}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              (booking.bookingStatus || booking.status) === 'confirmed' ? 'bg-green-100 text-green-800' :
                              (booking.bookingStatus || booking.status) === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              (booking.bookingStatus || booking.status) === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {booking.bookingStatus || booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {(booking.bookingStatus || booking.status) === 'pending' && (
                              <div className="flex space-x-2">
                                <button className="text-green-600 hover:text-green-700">
                                  Confirm
                                </button>
                                <button className="text-red-600 hover:text-red-700">
                                  Cancel
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No bookings yet</p>
              </div>
            )}
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Profile Settings</h3>

            <div className="bg-white shadow rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    defaultValue={user?.name}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    defaultValue={user?.email}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Bio</label>
                  <textarea
                    rows={4}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Tell tourists about yourself and your guiding experience..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Languages</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    placeholder="English, Hindi, Spanish (comma separated)"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Guide Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">Manage your tours and bookings</p>
            </div>
            <div className="bg-orange-100 rounded-lg p-4">
              <p className="text-sm font-medium text-orange-800">Welcome, {user?.name}!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={activeTab === 'overview'
                ? 'border-orange-500 text-orange-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium'}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('experiences')}
              className={activeTab === 'experiences'
                ? 'border-orange-500 text-orange-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium'}
            >
              My Experiences
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={activeTab === 'bookings'
                ? 'border-orange-500 text-orange-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium'}
            >
              Bookings
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={activeTab === 'profile'
                ? 'border-orange-500 text-orange-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium'}
            >
              Profile
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

export default GuideDashboard;
