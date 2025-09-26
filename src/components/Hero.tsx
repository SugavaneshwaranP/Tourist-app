import React from 'react';
import { Search, MapPin, Calendar, Users } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Discover
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              {' '}Incredible India
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Experience authentic India through local stays, indigenous crafts, and community-guided adventures. 
            Support local businesses while creating unforgettable memories.
          </p>
          
          {/* Search Form */}
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="h-5 w-5 text-orange-500" />
                <input
                  type="text"
                  placeholder="Where to?"
                  className="bg-transparent flex-1 outline-none text-gray-700"
                />
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="h-5 w-5 text-orange-500" />
                <input
                  type="date"
                  className="bg-transparent flex-1 outline-none text-gray-700"
                />
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Users className="h-5 w-5 text-orange-500" />
                <select className="bg-transparent flex-1 outline-none text-gray-700">
                  <option>1 Guest</option>
                  <option>2 Guests</option>
                  <option>3+ Guests</option>
                </select>
              </div>
              
              <button className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-3 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold flex items-center justify-center space-x-2">
                <Search className="h-5 w-5" />
                <span>Search</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500">500+</div>
            <div className="text-gray-600">Local Partners</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500">1000+</div>
            <div className="text-gray-600">Destinations</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500">50K+</div>
            <div className="text-gray-600">Happy Travelers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500">24/7</div>
            <div className="text-gray-600">Local Support</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;