import React from 'react';
import { ShoppingBag, Star, Truck, Award } from 'lucide-react';
import { SearchFilters } from '../types';

interface ArtisanMarketplaceProps {
  searchFilters?: SearchFilters;
}

const products = [
  {
    id: 1,
    name: 'Kashmiri Pashmina Shawl',
    artisan: 'Ahmad Craftworks',
    location: 'Srinagar, Kashmir',
    price: '₹8,500',
    originalPrice: '₹12,000',
    rating: 4.9,
    reviews: 45,
    image: 'https://images.pexels.com/photos/7679862/pexels-photo-7679862.jpeg?auto=compress&cs=tinysrgb&w=800',
    badge: 'Certified Authentic'
  },
  {
    id: 2,
    name: 'Madhubani Painting',
    artisan: 'Sita Devi Art',
    location: 'Mithila, Bihar',
    price: '₹3,200',
    originalPrice: '₹4,500',
    rating: 4.8,
    reviews: 67,
    image: 'https://images.pexels.com/photos/1070960/pexels-photo-1070960.jpeg?auto=compress&cs=tinysrgb&w=800',
    badge: 'Traditional Art'
  },
  {
    id: 3,
    name: 'Wooden Handicrafts Set',
    artisan: 'Kerala Wood Crafts',
    location: 'Ernakulam, Kerala',
    price: '₹2,800',
    originalPrice: '₹3,500',
    rating: 4.7,
    reviews: 89,
    image: 'https://images.pexels.com/photos/7525163/pexels-photo-7525163.jpeg?auto=compress&cs=tinysrgb&w=800',
    badge: 'Eco-Friendly'
  },
  {
    id: 4,
    name: 'Bandhani Silk Dupatta',
    artisan: 'Rajasthani Textiles',
    location: 'Jaipur, Rajasthan',
    price: '₹1,900',
    originalPrice: '₹2,800',
    rating: 4.6,
    reviews: 134,
    image: 'https://images.pexels.com/photos/8542052/pexels-photo-8542052.jpeg?auto=compress&cs=tinysrgb&w=800',
    badge: 'Heritage Craft'
  }
];

const ArtisanMarketplace: React.FC<ArtisanMarketplaceProps> = ({ searchFilters }) => {
  // Filter products based on search filters
  const filteredProducts = products.filter((product) => {
    if (searchFilters?.query) {
      const query = searchFilters.query.toLowerCase();
      if (!product.name.toLowerCase().includes(query) &&
          !product.artisan.toLowerCase().includes(query) &&
          !product.location.toLowerCase().includes(query)) {
        return false;
      }
    }

    if (searchFilters?.state) {
      const state = searchFilters.state.toLowerCase();
      if (!product.location.toLowerCase().includes(state)) {
        return false;
      }
    }

    if (searchFilters?.categories && searchFilters.categories.length > 0) {
      // For marketplace, we can map categories to product types
      const productCategories = ['handicrafts', 'textiles', 'jewelry', 'art'];
      const hasMatchingCategory = searchFilters.categories.some(cat =>
        productCategories.includes(cat.toLowerCase()) ||
        product.name.toLowerCase().includes(cat.toLowerCase()) ||
        product.badge.toLowerCase().includes(cat.toLowerCase())
      );
      if (!hasMatchingCategory) {
        return false;
      }
    }

    if (searchFilters?.minPrice && parseInt(product.price.replace(/[^\d]/g, '')) < searchFilters.minPrice) {
      return false;
    }

    if (searchFilters?.maxPrice && parseInt(product.price.replace(/[^\d]/g, '')) > searchFilters.maxPrice) {
      return false;
    }

    if (searchFilters?.rating && product.rating < searchFilters.rating) {
      return false;
    }

    return true;
  });
  return (
    <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50" id="artisans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Artisan Marketplace
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Support local craftspeople and take home authentic Indian handicrafts, textiles, and artwork
          </p>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-amber-500" />
              <span>Certified Authentic</span>
            </div>
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-amber-500" />
              <span>Direct from Artisans</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-5 w-5 text-amber-500" />
              <span>Secure Packaging</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {product.badge}
                  </span>
                </div>
                <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <ShoppingBag className="h-4 w-4 text-gray-600" />
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>

                <div className="text-sm text-gray-600 mb-2">
                  <div>{product.artisan}</div>
                  <div>{product.location}</div>
                </div>

                <div className="flex items-center space-x-1 mb-3">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{product.rating}</span>
                  <span className="text-xs text-gray-500">({product.reviews})</span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">{product.price}</span>
                    <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                  </div>
                </div>

                <button className="w-full bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600 transition-colors font-medium">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found matching your search criteria.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600"
            >
              Clear Filters
            </button>
          </div>
        )}

        <div className="text-center mt-12">
          <button className="bg-amber-500 text-white px-8 py-3 rounded-full hover:bg-amber-600 transition-colors font-medium">
            Explore All Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default ArtisanMarketplace;