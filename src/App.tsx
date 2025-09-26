import React from 'react';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedDestinations from './components/FeaturedDestinations';
import LocalExperiences from './components/LocalExperiences';
import LocalStays from './components/LocalStays';
import ArtisanMarketplace from './components/ArtisanMarketplace';
import LocalGuides from './components/LocalGuides';
import Footer from './components/Footer';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-white">
        <Header />
        <Hero />
        <FeaturedDestinations />
        <LocalExperiences />
        <LocalStays />
        <ArtisanMarketplace />
        <LocalGuides />
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;