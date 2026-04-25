import React from 'react';
import { Compass, MapPin, Plane, Hotel, Utensils } from 'lucide-react';

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div
      className={`rounded-full border-4 border-gray-200 border-t-primary-600 animate-spin ${sizes[size]} ${className}`}
    />
  );
};

export const SkeletonCard = () => (
  <div className="trip-card p-6 space-y-4">
    <div className="flex items-start justify-between">
      <div className="space-y-2 flex-1">
        <div className="skeleton h-5 w-2/3 rounded-lg" />
        <div className="skeleton h-4 w-1/2 rounded-lg" />
      </div>
      <div className="skeleton h-10 w-10 rounded-xl ml-4" />
    </div>
    <div className="flex gap-2">
      <div className="skeleton h-6 w-20 rounded-full" />
      <div className="skeleton h-6 w-20 rounded-full" />
      <div className="skeleton h-6 w-16 rounded-full" />
    </div>
    <div className="skeleton h-4 w-full rounded-lg" />
    <div className="skeleton h-4 w-3/4 rounded-lg" />
    <div className="flex gap-3 pt-2">
      <div className="skeleton h-9 flex-1 rounded-xl" />
      <div className="skeleton h-9 w-9 rounded-xl" />
    </div>
  </div>
);

export const AIGeneratingLoader = () => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-3xl p-10 max-w-sm w-full text-center shadow-2xl animate-fade-in">
      {/* Animated compass */}
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className="absolute inset-0 rounded-full bg-primary-100 animate-ping opacity-40" />
        <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg">
          <Compass className="w-10 h-10 text-white animate-spin-slow" />
        </div>
      </div>

      <h3 className="font-display text-2xl font-bold text-gray-900 mb-2">
        Crafting Your Journey
      </h3>
      <p className="text-gray-500 text-sm mb-8 leading-relaxed">
        Our AI is designing a personalized itinerary just for you. This takes about 15–30 seconds.
      </p>

      {/* Progress steps */}
      <div className="space-y-3 text-left">
        {[
          { icon: <MapPin className="w-4 h-4" />, label: 'Analyzing destination…', delay: 0 },
          { icon: <Hotel className="w-4 h-4" />, label: 'Finding best stays…', delay: 0.5 },
          { icon: <Utensils className="w-4 h-4" />, label: 'Discovering local food…', delay: 1 },
          { icon: <Plane className="w-4 h-4" />, label: 'Building day-wise plan…', delay: 1.5 },
        ].map((step, i) => (
          <div
            key={i}
            className="flex items-center gap-3 text-sm text-gray-500"
            style={{ animation: `fadeIn 0.5s ease-in-out ${step.delay}s both` }}
          >
            <div className="w-7 h-7 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
              {step.icon}
            </div>
            <span>{step.label}</span>
            <div className="ml-auto">
              <div className="w-4 h-4 rounded-full border-2 border-primary-300 border-t-primary-600 animate-spin" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Spinner;
