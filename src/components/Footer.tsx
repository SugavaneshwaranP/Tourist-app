import React from 'react';
import { MapPin, Mail, Phone, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="h-8 w-8 text-orange-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                SwadeshiYatra
              </span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Discover authentic India through local experiences, supporting communities and preserving traditions for Atmanirbhar Bharat.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-6 w-6 text-gray-400 hover:text-orange-500 cursor-pointer transition-colors" />
              <Twitter className="h-6 w-6 text-gray-400 hover:text-orange-500 cursor-pointer transition-colors" />
              <Instagram className="h-6 w-6 text-gray-400 hover:text-orange-500 cursor-pointer transition-colors" />
              <Youtube className="h-6 w-6 text-gray-400 hover:text-orange-500 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Destinations */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-orange-500">Popular Destinations</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Rajasthan</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Kerala</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Himachal Pradesh</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Goa</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Tamil Nadu</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Uttar Pradesh</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-orange-500">Our Services</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Local Experiences</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Heritage Stays</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Expert Guides</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Artisan Marketplace</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cultural Tours</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Travel Planning</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-orange-500">Get in Touch</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-orange-500" />
                <span className="text-gray-400">hello@swadeshiyatra.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-orange-500" />
                <span className="text-gray-400">+91 98765 43210</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-orange-500 mt-1" />
                <span className="text-gray-400">New Delhi, India</span>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium mb-3">Subscribe to our Newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-orange-500"
                />
                <button className="bg-orange-500 px-4 py-2 rounded-r-lg hover:bg-orange-600 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 SwadeshiYatra. Supporting Atmanirbhar Bharat through authentic travel experiences.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Support</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;