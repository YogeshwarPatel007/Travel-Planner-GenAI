import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader } from 'lucide-react';
import Navbar from '../components/ui/Navbar';
import api from '../utils/api';
import toast from 'react-hot-toast';

// We reuse the same itinerary rendering — redirect to ItineraryPage logic with fetched data
export default function TripDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await api.get(`/trip/${id}`);
        setTrip(res.data.trip);
      } catch (err) {
        toast.error('Trip not found or access denied.');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-mesh flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader className="w-8 h-8 text-primary-600 animate-spin" />
          <p className="text-gray-500 text-sm">Loading trip details…</p>
        </div>
      </div>
    );
  }

  if (!trip) return null;

  // Navigate to ItineraryPage with trip data pre-loaded
  navigate('/itinerary', {
    state: { itinerary: trip.itinerary, tripDetails: trip.tripDetails, savedTripId: trip._id },
    replace: true,
  });

  return null;
}
