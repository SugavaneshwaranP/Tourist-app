import React from 'react';
import { Star, MapPin, ArrowRight } from 'lucide-react';

const destinations = [
  {
    id: 1,
    name: 'Kerala Backwaters',
    state: 'Kerala',
    image: 'https://images.pexels.com/photos/12830416/pexels-photo-12830416.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.8,
    experiences: 45,
    description: 'Serene houseboat journeys through palm-fringed canals'
  },
  {
    id: 2,
    name: 'Rajasthan Desert',
    state: 'Rajasthan',
    image: 'https://images.pexels.com/photos/1586298/pexels-photo-1586298.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.9,
    experiences: 62,
    description: 'Camel safaris and royal palace stays'
  },
  {
    id: 3,
    name: 'Himalayan Villages',
    state: 'Himachal Pradesh',
    image: 'https://images.pexels.com/photos/457881/pexels-photo-457881.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.7,
    experiences: 38,
    description: 'Mountain homestays and traditional crafts'
  },
  {
    id: 4,
    name: 'Goa Beaches',
    state: 'Goa',
    image: 'https://images.pexels.com/photos/2404370/pexels-photo-2404370.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.6,
    experiences: 71,
    description: 'Beach shacks and Portuguese heritage'
  }
];

const FeaturedDestinations = () => {
  return (
    <section className="py-20 bg-white" id="destinations">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Destinations
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore India's diverse landscapes and rich cultural heritage through authentic local experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination) => (
            <div key={destination.id} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-xl mb-4">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold mb-1">{destination.name}</h3>
                  <div className="flex items-center space-x-1 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>{destination.state}</span>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{destination.rating}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-gray-600 text-sm">{destination.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{destination.experiences} experiences</span>
                  <ArrowRight className="h-4 w-4 text-orange-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-orange-500 text-white px-8 py-3 rounded-full hover:bg-orange-600 transition-colors font-medium">
            View All Destinations
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDestinations;