import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Camera, MapPin, BarChart } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-off-white">
      {/* Hero Section */}
      <section className="bg-recycle-green text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6">
            Sort Smarter. Recycle Better.
          </h1>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Use AI to identify waste, find local recycling centers, and track your environmental impact.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/identify" className="bg-white text-recycle-green px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition flex items-center gap-2">
              Identify Waste <Camera className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-charcoal mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Camera className="w-10 h-10 text-recycle-green" />}
            title="Snap a Photo"
            desc="Take a picture of any item. Our AI instantly tells you if it's recyclable, compostable, or trash."
          />
          <FeatureCard 
            icon={<MapPin className="w-10 h-10 text-ocean-teal" />}
            title="Find Locations"
            desc="Locate the nearest drop-off points, e-waste centers, and repair shops in your city."
          />
          <FeatureCard 
            icon={<BarChart className="w-10 h-10 text-warning-amber" />}
            title="Track Impact"
            desc="Earn points and see how much CO2 you've saved by sorting correctly."
          />
        </div>
      </section>
    </div>
  );
};

// Simple internal component for the cards
const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 text-center">
    <div className="bg-off-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3 text-charcoal">{title}</h3>
    <p className="text-gray-600">{desc}</p>
  </div>
);

export default HomePage;