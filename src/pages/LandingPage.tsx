import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import FeaturedDestinations from '../components/FeaturedDestinations';
import LocalGuides from '../components/LocalGuides';
import LocalStays from '../components/LocalStays';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Hero />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Featured Destinations */}
        <FeaturedDestinations />

        {/* Local Experiences */}
        <section className="my-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Discover Local Experiences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Local Guides */}
            <LocalGuides />

            {/* Local Stays */}
            <LocalStays />
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-indigo-600 text-white rounded-lg p-8 my-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Start Your Journey Today</h2>
            <p className="mb-6">Join our community and discover authentic local experiences</p>
            <div className="space-x-4">
              <Link
                to="/signup"
                className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="border-2 border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;