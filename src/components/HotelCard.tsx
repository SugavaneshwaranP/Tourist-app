import React from 'react';
import { Star, MapPin, Phone, Mail } from 'lucide-react';
import { Hotel } from '../types';

interface HotelCardProps {
  hotel: Hotel;
  onBookNow: (hotel: Hotel) => void;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel, onBookNow }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Image */}
      <div className="relative h-48 w-full">
        <img
          src={hotel.images[0]}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        {hotel.isVerified && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Verified
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{hotel.name}</h3>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm text-gray-600">{hotel.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center text-gray-500 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">
            {hotel.location.city}, {hotel.location.state}
          </span>
        </div>

        {/* Price Range */}
        <div className="mb-3">
          <span className="text-lg font-bold text-orange-500">
            ₹{hotel.priceRange.min.toLocaleString()}
          </span>
          <span className="text-sm text-gray-500"> / night</span>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-3">
          {hotel.amenities.slice(0, 3).map((amenity, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
            >
              {amenity}
            </span>
          ))}
          {hotel.amenities.length > 3 && (
            <span className="text-gray-500 text-xs">
              +{hotel.amenities.length - 3} more
            </span>
          )}
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-1 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Phone className="h-4 w-4 mr-1" />
            <span>{hotel.contactInfo.phone}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Mail className="h-4 w-4 mr-1" />
            <span>{hotel.contactInfo.email}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onBookNow(hotel)}
            className="flex-1 bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition-colors"
          >
            Book Now
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;