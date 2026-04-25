import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, MapPin, Calendar, Users, Wallet, Trash2,
  Eye, Heart, Compass, Plane, Train, Bus, Car,
  TrendingUp, Clock
} from 'lucide-react';
import Navbar from '../components/ui/Navbar';
import { SkeletonCard } from '../components/ui/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const travelModeIcons = {
  flight: <Plane className="w-3.5 h-3.5" />,
  train: <Train className="w-3.5 h-3.5" />,
  bus: <Bus className="w-3.5 h-3.5" />,
  car: <Car className="w-3.5 h-3.5" />,
};

const travelModeColors = {
  flight: 'bg-blue-50 text-blue-700',
  train: 'bg-green-50 text-green-700',
  bus: 'bg-orange-50 text-orange-700',
  car: 'bg-purple-50 text-purple-700',
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);

export default function DashboardPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const res = await api.get('/trip/get');
      setTrips(res.data.trips);
    } catch (err) {
      toast.error('Failed to load trips.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (tripId, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this trip? This cannot be undone.')) return;
    setDeletingId(tripId);
    try {
      await api.delete(`/trip/${tripId}`);
      setTrips((prev) => prev.filter((t) => t._id !== tripId));
      toast.success('Trip deleted.');
    } catch {
      toast.error('Failed to delete trip.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleFavorite = async (tripId, e) => {
    e.stopPropagation();
    try {
      const res = await api.patch(`/trip/${tripId}/favorite`);
      setTrips((prev) =>
        prev.map((t) => (t._id === tripId ? { ...t, isFavorite: res.data.isFavorite } : t))
      );
    } catch {
      toast.error('Failed to update favorite.');
    }
  };

  // Stats
  const totalTrips = trips.length;
  const totalBudget = trips.reduce((sum, t) => { const b = t.tripDetails?.budget; return sum + (typeof b === "number" && !isNaN(b) ? b : (t.itinerary?.budgetBreakdown?.totalEstimated || 0)); }, 0);
  const uniqueDestinations = new Set(trips.map((t) => t.tripDetails?.destination)).size;

  return (
    <div className="min-h-screen bg-mesh">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-16">
        {/* Welcome header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 animate-slide-up">
          <div>
            <h1 className="font-display text-3xl font-bold text-gray-900">
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {totalTrips > 0
                ? `You have ${totalTrips} saved trip${totalTrips > 1 ? 's' : ''}. Ready for your next adventure?`
                : 'Your travel dashboard is ready. Plan your first AI-powered trip!'}
            </p>
          </div>
          <button
            onClick={() => navigate('/plan')}
            className="btn-primary flex items-center gap-2 shadow-lg shadow-primary-200 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Plan New Trip
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in">
          {[
            { label: 'Total Trips', value: totalTrips, icon: <Compass className="w-5 h-5" />, color: 'bg-primary-50 text-primary-600' },
            { label: 'Destinations', value: uniqueDestinations, icon: <MapPin className="w-5 h-5" />, color: 'bg-rose-50 text-rose-600' },
            { label: 'Total Planned', value: formatCurrency(totalBudget), icon: <Wallet className="w-5 h-5" />, color: 'bg-green-50 text-green-600' },
            { label: 'Days Planned', value: trips.reduce((s, t) => s + (t.tripDetails?.days || 0), 0), icon: <Calendar className="w-5 h-5" />, color: 'bg-amber-50 text-amber-600' },
          ].map((stat, i) => (
            <div key={i} className="trip-card p-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                {stat.icon}
              </div>
              <p className="text-xs text-gray-500 mb-0.5">{stat.label}</p>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Trips Grid */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-primary-600" />
            <h2 className="font-semibold text-gray-800">Your Saved Trips</h2>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : trips.length === 0 ? (
            <EmptyState onPlan={() => navigate('/plan')} />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {trips.map((trip, idx) => (
                <TripCard
                  key={trip._id}
                  trip={trip}
                  idx={idx}
                  deletingId={deletingId}
                  onView={() => navigate(`/trip/${trip._id}`)}
                  onDelete={handleDelete}
                  onFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TripCard({ trip, idx, deletingId, onView, onDelete, onFavorite }) {
  const mode = trip.tripDetails?.travelMode;
  const isDeleting = deletingId === trip._id;

  return (
    <div
      className="trip-card cursor-pointer group animate-fade-in"
      style={{ animationDelay: `${idx * 0.05}s` }}
      onClick={onView}
    >
      {/* Card top gradient bar */}
      <div className="h-2 bg-gradient-to-r from-primary-500 to-sky-400" />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0 pr-3">
            <h3 className="font-semibold text-gray-900 text-base leading-tight line-clamp-2">
              {trip.title}
            </h3>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(new Date(trip.createdAt), { addSuffix: true })}
            </p>
          </div>
          <button
            onClick={(e) => onFavorite(trip._id, e)}
            className={`p-2 rounded-xl transition-all flex-shrink-0 ${
              trip.isFavorite ? 'text-rose-500 bg-rose-50' : 'text-gray-300 hover:text-rose-400 hover:bg-rose-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${trip.isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Route */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-lg">
            {trip.tripDetails?.source}
          </span>
          <span className="text-gray-300">→</span>
          <span className="text-xs font-semibold text-primary-700 bg-primary-50 px-2 py-1 rounded-lg">
            {trip.tripDetails?.destination}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${travelModeColors[mode] || 'bg-gray-100 text-gray-600'}`}>
            {travelModeIcons[mode]}
            {mode?.charAt(0).toUpperCase() + mode?.slice(1)}
          </span>
          <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
            <Calendar className="w-3 h-3" />
            {trip.tripDetails?.days} Days
          </span>
          <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
            <Users className="w-3 h-3" />
            {trip.tripDetails?.people} People
          </span>
        </div>

        {/* Budget */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-400">Budget</p>
            <p className="text-sm font-bold text-gray-800">
              {formatCurrency(typeof trip.tripDetails?.budget === "number" && !isNaN(trip.tripDetails?.budget) ? trip.tripDetails.budget : (trip.itinerary?.budgetBreakdown?.totalEstimated || 0))}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(trip._id, e); }}
              disabled={isDeleting}
              className="p-2 rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
            >
              {isDeleting
                ? <div className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                : <Trash2 className="w-4 h-4" />
              }
            </button>
            <button
              onClick={onView}
              className="flex items-center gap-1.5 text-xs font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 px-3 py-2 rounded-xl transition-all"
            >
              <Eye className="w-3.5 h-3.5" /> View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onPlan }) {
  return (
    <div className="text-center py-20 animate-fade-in">
      <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-5 animate-float">
        <Compass className="w-10 h-10 text-primary-400" />
      </div>
      <h3 className="font-display text-xl font-semibold text-gray-800 mb-2">No trips yet</h3>
      <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
        Create your first AI-powered travel itinerary and save it here.
      </p>
      <button onClick={onPlan} className="btn-primary flex items-center gap-2 mx-auto shadow-lg shadow-primary-100">
        <Plus className="w-4 h-4" /> Plan Your First Trip
      </button>
    </div>
  );
}