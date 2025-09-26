import React from 'react';
import { Star, MapPin, Languages, Award, MessageCircle } from 'lucide-react';

const guides = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    location: 'Agra, Uttar Pradesh',
    speciality: 'Heritage & History',
    rating: 4.9,
    reviews: 287,
    languages: ['Hindi', 'English', 'Urdu'],
    experience: '8 years',
    price: '₹1,500/day',
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    badge: 'Certified Guide',
    tours: 145
  },
  {
    id: 2,
    name: 'Priya Sharma',
    location: 'Jaipur, Rajasthan',
    speciality: 'Culture & Crafts',
    rating: 4.8,
    reviews: 156,
    languages: ['Hindi', 'English', 'Rajasthani'],
    experience: '6 years',
    price: '₹1,200/day',
    image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
    badge: 'Local Expert',
    tours: 98
  },
  {
    id: 3,
    name: 'Arjun Menon',
    location: 'Kochi, Kerala',
    speciality: 'Nature & Wildlife',
    rating: 4.9,
    reviews: 203,
    languages: ['Malayalam', 'English', 'Tamil'],
    experience: '10 years',
    price: '₹1,800/day',
    image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
    badge: 'Wildlife Expert',
    tours: 176
  }
];

const LocalGuides = () => {
  return (
    <section className="py-20 bg-gray-50" id="guides">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Local Expert Guides
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with passionate local guides who bring destinations to life with authentic stories and insider knowledge
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.map((guide) => (
            <div key={guide.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative p-6 pb-4">
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <img
                      src={guide.image}
                      alt={guide.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-xl font-bold text-gray-900">{guide.name}</h3>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {guide.badge}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-1 mb-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600 text-sm">{guide.location}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{guide.rating}</span>
                        <span>({guide.reviews})</span>
                      </div>
                      <span>•</span>
                      <span>{guide.tours} tours</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-gray-900">Speciality</span>
                    <span className="text-teal-600 font-medium">{guide.speciality}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-gray-900">Experience</span>
                    <span className="text-gray-600">{guide.experience}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1 mb-3">
                    <Languages className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {guide.languages.join(', ')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-xl font-bold text-orange-500">{guide.price}</div>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Award className="h-4 w-4" />
                    <span>Verified</span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button className="flex-1 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium">
                    Book Guide
                  </button>
                  <button className="p-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                    <MessageCircle className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="border-2 border-teal-600 text-teal-600 px-8 py-3 rounded-full hover:bg-teal-600 hover:text-white transition-colors font-medium">
            Find More Guides
          </button>
        </div>
      </div>
    </section>
  );
};

export default LocalGuides;