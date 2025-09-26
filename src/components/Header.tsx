import React, { useState } from 'react';
import { Menu, X, MapPin, User, Search, LogOut, Heart, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { User as UserType } from '../types';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
  };

  const handleSignIn = () => {
    // Handle sign in logic - should be provided by AuthContext
    setIsMenuOpen(false);
  };

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const navigationLinks = [
    { href: '#destinations', label: 'Destinations' },
    { href: '#experiences', label: 'Experiences' },
    { href: '#hotels', label: 'Stay Local' },
    { href: '#artisans', label: 'Artisans' },
    { href: '#guides', label: 'Local Guides' },
  ];

  const userLinks = [
    { href: '/profile', icon: <User className="h-4 w-4 mr-2" />, label: 'Profile' },
    { href: '/bookings', icon: <BookOpen className="h-4 w-4 mr-2" />, label: 'My Bookings' },
    { href: '/wishlist', icon: <Heart className="h-4 w-4 mr-2" />, label: 'Wishlist' },
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <MapPin className="h-8 w-8 text-orange-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              SwadeshiYatra
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="text-gray-700 hover:text-orange-500 font-medium transition-colors"
                onClick={closeMenus}
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-orange-500 transition-colors">
              <Search className="h-5 w-5" />
            </button>
            
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-orange-500"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                      <span className="text-orange-500 font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span className="font-medium">{user.name}</span>
                </button>

                {/* User dropdown menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                    {userLinks.map(({ href, icon, label }) => (
                      <a
                        key={href}
                        href={href}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-50"
                        onClick={closeMenus}
                      >
                        {icon}
                        {label}
                      </a>
                    ))}
                    {user.role === 'admin' && (
                      <a
                        href="/admin"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-50"
                        onClick={closeMenus}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Admin Dashboard
                      </a>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-orange-50"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-colors font-medium"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-orange-500 transition-colors"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigationLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-md"
                onClick={closeMenus}
              >
                {label}
              </a>
            ))}
            {user ? (
              <>
                {userLinks.map(({ href, label }) => (
                  <a
                    key={href}
                    href={href}
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-md"
                    onClick={closeMenus}
                  >
                    {label}
                  </a>
                ))}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={handleSignIn}
                className="block w-full mt-4 bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-colors font-medium"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;