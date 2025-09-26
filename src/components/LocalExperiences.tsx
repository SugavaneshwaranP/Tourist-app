import React from 'react';
import { Clock, Users, Star, Heart } from 'lucide-react';
import { SearchFilters } from '../types';

interface LocalExperiencesProps {
  searchFilters?: SearchFilters;
}

const experiences = [
  {
    id: 1,
    title: 'Traditional Pottery Workshop',
    location: 'Khurja, Uttar Pradesh',
    price: '₹1,500',
    duration: '3 hours',
    groupSize: '8 people',
    rating: 4.9,
    image: 'https://images.pexels.com/photos/6472095/pexels-photo-6472095.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Learn ancient pottery techniques from master craftsmen'
  },
  {
    id: 2,
    title: 'Spice Farm Tour & Cooking',
    location: 'Munnar, Kerala',
    price: '₹2,200',
    duration: '5 hours',
    groupSize: '12 people',
    rating: 4.8,
    image: 'https://images.pexels.com/photos/4686821/pexels-photo-4686821.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Explore organic spice gardens and cook traditional dishes'
  },
  {
    id: 3,
    title: 'Handloom Weaving Experience',
    location: 'Varanasi, Uttar Pradesh',
    price: '₹1,800',
    duration: '4 hours',
    groupSize: '6 people',
    rating: 4.7,
    image: 'https://images.pexels.com/photos/6764046/pexels-photo-6764046.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Create your own silk fabric with local weavers'
  }
];

const LocalExperiences: React.FC<LocalExperiencesProps> = ({ searchFilters }) => {
  // Filter experiences based on search filters
  const filteredExperiences = experiences.filter((experience) => {
    if (searchFilters?.query) {
      const query = searchFilters.query.toLowerCase();
      if (!experience.title.toLowerCase().includes(query) &&
          !experience.location.toLowerCase().includes(query) &&
          !experience.description.toLowerCase().includes(query)) {
        return false;
      }
    }

    if (searchFilters?.state) {
      const state = searchFilters.state.toLowerCase();
      if (!experience.location.toLowerCase().includes(state)) {
        return false;
      }
    }

    if (searchFilters?.categories && searchFilters.categories.length > 0) {
      // For experiences, we can map categories to types like 'workshops', 'tours', etc.
      const experienceCategories = ['workshops', 'tours', 'cultural', 'nature'];
      const hasMatchingCategory = searchFilters.categories.some(cat =>
        experienceCategories.includes(cat.toLowerCase()) ||
        experience.title.toLowerCase().includes(cat.toLowerCase())
      );
      if (!hasMatchingCategory) {
        return false;
      }
    }

    return true;
  });
  return (
    <section className="py-20 bg-gradient-to-br from-teal-50 to-green-50" id="experiences">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Authentic Local Experiences
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Immerse yourself in India's rich traditions through hands-on workshops with local artisans and craftspeople
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredExperiences.map((experience) => (
            <div key={experience.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
              <div className="relative overflow-hidden">
                <img
                  src={experience.image}
                  alt={experience.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                  <Heart className="h-5 w-5 text-gray-600 hover:text-red-500" />
                </button>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-teal-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {experience.price}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{experience.title}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{experience.rating}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-3">{experience.location}</p>
                <p className="text-gray-700 mb-4">{experience.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{experience.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{experience.groupSize}</span>
                  </div>
                </div>

                <button className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition-colors font-medium">
                  Book Experience
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredExperiences.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No experiences found matching your search criteria.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700"
            >
              Clear Filters
            </button>
          </div>
        )}

        <div className="text-center mt-12">
          <button className="border-2 border-teal-600 text-teal-600 px-8 py-3 rounded-full hover:bg-teal-600 hover:text-white transition-colors font-medium">
            Explore More Experiences
          </button>
        </div>
      </div>
    </section>
  );
};

export default LocalExperiences;