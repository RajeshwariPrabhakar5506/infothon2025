import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Recycle, User, MapPin, Camera } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Recycle className="w-8 h-8 text-recycle-green" />
            <span className="text-xl font-bold font-heading text-charcoal">GreenSort</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            <Link to="/identify" className="flex items-center space-x-1 text-gray-600 hover:text-recycle-green font-medium">
              <Camera className="w-4 h-4" />
              <span>Identify</span>
            </Link>
            <Link to="/map" className="flex items-center space-x-1 text-gray-600 hover:text-recycle-green font-medium">
              <MapPin className="w-4 h-4" />
              <span>Map</span>
            </Link>
            
            {/* Auth Buttons (We will make these dynamic later) */}
            <div className="flex items-center space-x-4 ml-4">
              <Link to="/login" className="text-recycle-green font-semibold hover:underline">
                Login
              </Link>
              <Link to="/register" className="bg-recycle-green text-white px-4 py-2 rounded-full hover:bg-green-700 transition shadow-sm">
                Get Started
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-charcoal"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t p-4 space-y-4">
          <Link to="/identify" className="block text-gray-600 hover:text-recycle-green" onClick={() => setIsMenuOpen(false)}>Identify Waste</Link>
          <Link to="/map" className="block text-gray-600 hover:text-recycle-green" onClick={() => setIsMenuOpen(false)}>Find Locations</Link>
          <hr />
          <Link to="/login" className="block text-recycle-green font-semibold" onClick={() => setIsMenuOpen(false)}>Login</Link>
          <Link to="/register" className="block bg-recycle-green text-white px-4 py-2 rounded-md text-center" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
        </div>
      )}
    </header>
  );
};

export default Header;