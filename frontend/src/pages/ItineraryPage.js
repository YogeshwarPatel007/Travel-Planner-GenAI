import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  MapPin, Clock, Wallet, Users, Plane, Hotel, ChevronDown, ChevronUp,
  Star, Utensils, Save, ArrowLeft, CheckCircle, Zap, Info, Download,
  Coffee, AlertCircle, Backpack, MessageCircle, Calendar,
  RefreshCw, Wand2, Edit3, X, ChevronRight, Settings
} from 'lucide-react';
import Navbar from '../components/ui/Navbar';
import api from '../utils/api';
import toast from 'react-hot-toast';

const fmt = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);

const categoryColors = {
  travel: 'bg-blue-100 text-blue-700',
  logistics: 'bg-gray-100 text-gray-600',
  sightseeing: 'bg-green-100 text-green-700',
  food: 'bg-orange-100 text-orange-700',
  activity: 'bg-purple-100 text-purple-700',
  shopping: 'bg-pink-100 text-pink-700',
  relaxation: 'bg-teal-100 text-teal-700',
};

// ── Editable fields config ─────────────────────────────────────────────────
const TRAVEL_MODES = ['flight', 'train', 'bus', 'car'];
const PACE_OPTIONS = [
  { id: 'auto', label: 'AI Decides' },
  { id: 'relaxed', label: 'Relaxed' },
  { id: 'moderate', label: 'Moderate' },
  { id: 'packed', label: 'Action-packed' },
];
const MEAL_OPTIONS = [
  { id: 'veg', label: 'Vegetarian', emoji: '🥗' },
  { id: 'nonveg', label: 'Non-Veg', emoji: '🍗' },
  { id: 'vegan', label: 'Vegan', emoji: '🌱' },
  { id: 'local', label: 'Local Cuisine', emoji: '🍛' },
  { id: 'street', label: 'Street Food', emoji: '🌮' },
  { id: 'finedining', label: 'Fine Dining', emoji: '🍽️' },
];
const PREFERENCE_OPTIONS = [
  { id: 'adventure', label: 'Adventure', emoji: '🏕️' },
  { id: 'religious', label: 'Religious', emoji: '🛕' },
  { id: 'nature', label: 'Nature', emoji: '🌿' },
  { id: 'beach', label: 'Beach', emoji: '🏖️' },
  { id: 'cultural', label: 'Cultural', emoji: '🏛️' },
  { id: 'food', label: 'Food Tour', emoji: '🍜' },
  { id: 'family', label: 'Family', emoji: '👨‍👩‍👧' },
  { id: 'romantic', label: 'Romantic', emoji: '💑' },
  { id: 'photography', label: 'Photography', emoji: '📸' },
  { id: 'shopping', label: 'Shopping', emoji: '🛍️' },
];
// ── Edit Panel Component ───────────────────────────────────────────────────
function EditPanel({ tripDetails, onClose, onUpdate }) {
  const [edits, setEdits] = useState({
    travelMode: tripDetails.travelMode || '',
    pace: tripDetails.pace || 'auto',
    mealPreference: tripDetails.mealPreference || [],
    preferences: tripDetails.preferences || [],
    people: tripDetails.people || 1,
    days: tripDetails.days || 1,
    distanceRange: tripDetails.distanceRange || '',
    specialRequirements: tripDetails.specialRequirements || '',
  });
  const [errors, setErrors] = useState({});

  const toggleArr = (field, id) => {
    setEdits(prev => ({
      ...prev,
      [field]: prev[field].includes(id) ? prev[field].filter(x => x !== id) : [...prev[field], id],
    }));
  };

  const validate = () => {
    const errs = {};
    if (edits.budget && Number(edits.budget) < 500) errs.budget = 'Min ₹500 if specified';
    if (!edits.travelMode) errs.travelMode = 'Required';
    if (!edits.people || edits.people < 1) errs.people = 'Min 1';
    if (!edits.days || edits.days < 1 || edits.days > 30) errs.days = '1–30 days';
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onUpdate({ ...tripDetails, ...edits, budget: edits.budget ? Number(edits.budget) : 0 });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative bg-white w-full md:max-w-2xl md:rounded-3xl rounded-t-3xl shadow-2xl max-h-[90vh] overflow-y-auto z-10">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
          <div>
            <h2 className="font-display text-lg font-bold text-gray-900 flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary-600" /> Edit Trip & Regenerate
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Change any details, then hit Update to get a new itinerary</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">

          {/* Days & People */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-primary-600" /> Days *
              </label>
              <input type="number" min={1} max={30} value={edits.days}
                onChange={e => setEdits(p => ({ ...p, days: Number(e.target.value) }))}
                className={`form-input mt-1 ${errors.days ? 'border-red-400' : ''}`} />
              {errors.days && <p className="text-xs text-red-500 mt-1">{errors.days}</p>}
            </div>
            <div>
              <label className="form-label flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-primary-600" /> People *
              </label>
              <input type="number" min={1} max={20} value={edits.people}
                onChange={e => setEdits(p => ({ ...p, people: Number(e.target.value) }))}
                className={`form-input mt-1 ${errors.people ? 'border-red-400' : ''}`} />
              {errors.people && <p className="text-xs text-red-500 mt-1">{errors.people}</p>}
            </div>
          </div>

          {/* Travel Mode */}
          <div>
            <label className="form-label flex items-center gap-1.5">
              <Plane className="w-3.5 h-3.5 text-primary-600" /> Travel Mode *
            </label>
            <div className="grid grid-cols-4 gap-2 mt-1">
              {TRAVEL_MODES.map(m => (
                <button key={m} type="button" onClick={() => setEdits(p => ({ ...p, travelMode: m }))}
                  className={`py-2.5 rounded-xl border-2 text-xs font-medium capitalize transition-all ${
                    edits.travelMode === m ? 'border-primary-400 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}>
                  {m === 'flight' ? '✈️' : m === 'train' ? '🚂' : m === 'bus' ? '🚌' : '🚗'} {m}
                </button>
              ))}
            </div>
            {errors.travelMode && <p className="text-xs text-red-500 mt-1">{errors.travelMode}</p>}
          </div>

          {/* Pace */}
          <div>
            <label className="form-label flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary-600" /> Travel Pace
            </label>
            <div className="grid grid-cols-4 gap-2 mt-1">
              {PACE_OPTIONS.map(p => (
                <button key={p.id} type="button" onClick={() => setEdits(prev => ({ ...prev, pace: p.id }))}
                  className={`py-2.5 rounded-xl border-2 text-xs font-medium transition-all ${
                    edits.pace === p.id
                      ? p.id === 'auto' ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-primary-400 bg-primary-50 text-primary-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Meal Preferences */}
          <div>
            <label className="form-label flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-primary-600" /> Meal Preferences
            </label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {MEAL_OPTIONS.map(m => (
                <button key={m.id} type="button" onClick={() => toggleArr('mealPreference', m.id)}
                  className={`flex items-center gap-1.5 py-2 px-2 rounded-xl border-2 text-xs font-medium transition-all ${
                    edits.mealPreference.includes(m.id) ? 'border-primary-400 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}>
                  {m.emoji} {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="form-label flex items-center gap-1.5">
              ❤️ Travel Interests
            </label>
            <div className="grid grid-cols-4 gap-2 mt-1">
              {PREFERENCE_OPTIONS.map(p => (
                <button key={p.id} type="button" onClick={() => toggleArr('preferences', p.id)}
                  className={`flex flex-col items-center gap-0.5 py-2 rounded-xl border-2 text-[11px] font-medium transition-all ${
                    edits.preferences.includes(p.id) ? 'border-primary-400 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}>
                  <span>{p.emoji}</span>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Distance Range */}
          <div>
            <label className="form-label flex items-center gap-1.5">
              📍 Distance from City Centre
              <span className="text-gray-400 font-normal text-[11px]">(optional)</span>
            </label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {[
                { id: '0-50', label: '0–50 km', emoji: '🏙️' },
                { id: '0-100', label: '0–100 km', emoji: '🌆' },
                { id: '200+', label: '200+ km', emoji: '✈️' },
              ].map(r => (
                <button key={r.id} type="button"
                  onClick={() => setEdits(p => ({ ...p, distanceRange: p.distanceRange === r.id ? '' : r.id }))}
                  className={`flex items-center gap-2 py-2.5 px-3 rounded-xl border-2 text-xs font-medium transition-all ${
                    edits.distanceRange === r.id ? 'border-primary-400 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}>
                  <span>{r.emoji}</span> {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Special Requirements */}
          <div>
            <label className="form-label flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-primary-600" /> Special Requirements
              <span className="text-gray-400 font-normal text-[11px]">(optional)</span>
            </label>
            <textarea value={edits.specialRequirements}
              onChange={e => setEdits(p => ({ ...p, specialRequirements: e.target.value }))}
              rows={2} placeholder="e.g. halal food, avoid crowds, wheelchair needed..."
              className="form-input resize-none text-sm mt-1" />
          </div>

          {/* CTA */}
          <div className="flex gap-3 pb-2">
            <button onClick={onClose} className="btn-secondary flex-1 py-3 text-sm">Cancel</button>
            <button onClick={handleSubmit}
              className="btn-primary flex-1 flex items-center justify-center gap-2 py-3 text-sm shadow-lg shadow-primary-200">
              <RefreshCw className="w-4 h-4" /> Update Itinerary
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function ItineraryPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [expandedDays, setExpandedDays] = useState({ 0: true });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showEditPanel, setShowEditPanel] = useState(false);


  const [regenerating, setRegenerating] = useState(false);

  if (!state?.itinerary) { navigate('/plan'); return null; }

  const { itinerary, tripDetails } = state;
  const { tripSummary, travelInfo, accommodation, dailyItinerary, budgetBreakdown, packingList, importantTips, localPhrases, emergencyContacts } = itinerary;

  const estimatedCost = budgetBreakdown?.totalEstimated || 0;
  const isLongTrip = tripDetails?.days > 8;

  const toggleDay = (idx) => setExpandedDays(prev => ({ ...prev, [idx]: !prev[idx] }));

  const handleSave = async () => {
    if (saved) return;
    setSaving(true);
    try {
      await api.post('/trip/save', { tripDetails, itinerary });
      setSaved(true);
      toast.success('Trip saved! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save trip.');
    } finally { setSaving(false); }
  };

  // Shared regen function — handles 429 with auto-retry
  const regenWithPayload = async (payload) => {
    setRegenerating(true);
    try {
      const res = await api.post('/trip/generate', payload);
      toast.success('Itinerary updated! ✨');
      setRegenerating(false);
      navigate('/itinerary', {
        state: { itinerary: res.data.itinerary, tripDetails: { ...payload, budget: payload.budget || res.data.itinerary?.budgetBreakdown?.totalEstimated || 0 } },
        replace: true,
      });
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;

      // Always stop the loading overlay immediately on any error
      setRegenerating(false);

      if (status === 429) {
        if (data?.isDailyLimit) {
          toast.error('Daily Groq limit reached. Please try again after midnight UTC.', { duration: 8000 });
          return;
        }
        toast.error('Rate limit hit. Please wait a minute and try again.', { duration: 6000 });
        return;
      }

      toast.error(data?.message || 'Failed to regenerate. Please try again.');
    }
  };

  const handleEditUpdate = async (updatedDetails) => {
    setShowEditPanel(false);
    await regenWithPayload(updatedDetails);
  };

  const modeIcon = { flight: '✈️', train: '🚂', bus: '🚌', car: '🚗' };
  const packingObj = packingList && !Array.isArray(packingList) ? packingList : null;
  const packingArr = Array.isArray(packingList) ? packingList : null;

  // Remove the full-screen loader — use overlay instead so page stays visible

  return (
    <div className="min-h-screen bg-mesh">
      <Navbar />

      {/* Inline regenerating overlay — doesn't block navigation */}
      {regenerating && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full mx-4 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin" style={{borderWidth: '3px'}} />
            </div>
            <h3 className="font-display text-xl font-bold text-gray-900 mb-2">Updating Itinerary</h3>
            <p className="text-gray-500 text-sm">AI is crafting your new plan… This takes 15–30 seconds.</p>
          </div>
        </div>
      )}
      {showEditPanel && (
        <EditPanel
          tripDetails={tripDetails}
          onClose={() => setShowEditPanel(false)}
          onUpdate={handleEditUpdate}
        />
      )}

      <div className="max-w-4xl mx-auto px-4 pt-24 pb-16">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <button onClick={() => navigate('/plan')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Planner
          </button>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/dashboard')} className="btn-secondary text-sm py-2">Dashboard</button>
            <button onClick={() => setShowEditPanel(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border-2 border-primary-200 text-primary-700 bg-primary-50 hover:bg-primary-100 transition-all">
              <Edit3 className="w-4 h-4" /> Edit Trip
            </button>
            <button onClick={handleSave} disabled={saving || saved}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                saved ? 'bg-green-50 text-green-700 border border-green-200' : 'btn-primary shadow-md shadow-primary-200'
              }`}>
              {saving ? <><div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />Saving…</>
                : saved ? <><CheckCircle className="w-4 h-4" />Saved!</>
                : <><Save className="w-4 h-4" />Save Trip</>}
            </button>
            <button onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border-2 border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition-all">
              <Download className="w-4 h-4" /> Download PDF
            </button>
          </div>
        </div>

        {/* Hero */}
        <div className="bg-gradient-to-br from-primary-700 to-primary-900 rounded-3xl p-8 text-white mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-hero-pattern opacity-10" />
          <div className="relative">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full">AI Generated ✨</span>
                  {isLongTrip && (
                    <span className="bg-amber-400/30 text-amber-100 text-xs font-medium px-3 py-1 rounded-full border border-amber-300/40">
                      📋 Summary Mode ({tripDetails.days} days)
                    </span>
                  )}
                </div>
                <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">{tripSummary?.title}</h1>
                <p className="text-primary-200 text-sm max-w-xl">{tripSummary?.overview}</p>
              </div>
              <div className="text-4xl">{modeIcon[tripDetails?.travelMode] || '🗺️'}</div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
              {[
                { icon: <MapPin className="w-4 h-4" />, label: 'Destination', value: tripDetails?.destination },
                { icon: <Clock className="w-4 h-4" />, label: 'Duration', value: tripSummary?.duration },
                { icon: <Users className="w-4 h-4" />, label: 'Travellers', value: `${tripDetails?.people} People` },
                { icon: <Wallet className="w-4 h-4" />, label: 'Budget Tier', value: { minimum: '🎒 Minimum', medium: '🏨 Medium', luxury: '✨ Luxury', ultra: '👑 Ultra' }[tripDetails?.budgetTier || tripDetails?.budget] || '🏨 Medium' },
              ].map((s, i) => (
                <div key={i} className="bg-white/10 rounded-xl p-3 backdrop-blur-xs">
                  <div className="flex items-center gap-1.5 text-primary-200 text-xs mb-1">{s.icon}{s.label}</div>
                  <div className="font-semibold text-sm text-white">{s.value}</div>
                </div>
              ))}
            </div>
            {tripSummary?.highlights?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {tripSummary.highlights.map((h, i) => (
                  <span key={i} className="bg-white/15 text-white text-xs px-3 py-1 rounded-full border border-white/20">✦ {h}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Long trip notice */}
        {isLongTrip && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <span className="text-2xl">📋</span>
            <div>
              <p className="text-sm font-semibold text-amber-800">Summary Mode — {tripDetails.days} Day Trip</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Trips over 8 days show a condensed schedule (3 highlights/day) to keep things fast. Each day still covers morning, afternoon and evening.
                For a deeper look at any day, use the <strong>Edit Trip</strong> button to regenerate with fewer days.
              </p>
            </div>
          </div>
        )}

        {/* Budget Tier Selector */}
        {(() => {
          const currentTier = tripDetails?.budgetTier || tripDetails?.budget || 'medium';
          const tiers = [
            { id: 'minimum', label: 'Minimum',     emoji: '🎒', sub: 'Hostels & street food',    activeColor: 'border-green-500 bg-green-100 ring-2 ring-green-400 text-green-700',   inactiveColor: 'border-green-200 bg-green-50 text-green-600' },
            { id: 'medium',  label: 'Medium',       emoji: '🏨', sub: '3-star & mid restaurants', activeColor: 'border-blue-500 bg-blue-100 ring-2 ring-blue-400 text-blue-700',       inactiveColor: 'border-blue-200 bg-blue-50 text-blue-600' },
            { id: 'luxury',  label: 'Luxury',       emoji: '✨', sub: '4-star & fine dining',     activeColor: 'border-purple-500 bg-purple-100 ring-2 ring-purple-400 text-purple-700', inactiveColor: 'border-purple-200 bg-purple-50 text-purple-600' },
            { id: 'ultra',   label: 'Ultra Luxury', emoji: '👑', sub: '5-star & private tours',   activeColor: 'border-amber-500 bg-amber-100 ring-2 ring-amber-400 text-amber-700',   inactiveColor: 'border-amber-200 bg-amber-50 text-amber-600' },
          ];
          return (
            <div className="mb-6 rounded-2xl border-2 border-gray-200 bg-white p-5">
              <div className="flex items-center gap-2 mb-1">
                <Wand2 className="w-4 h-4 text-primary-600" />
                <h3 className="font-semibold text-gray-900 text-sm">Choose Your Budget Style</h3>
              </div>
              <p className="text-xs text-gray-400 mb-4">Tap a tier — AI regenerates hotels, food and activity costs to match</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {tiers.map(t => (
                  <button key={t.id} type="button"
                    disabled={regenerating}
                    onClick={() => regenWithPayload({ ...tripDetails, budget: t.id, budgetTier: t.id })}
                    className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 text-center transition-all duration-200 ${currentTier === t.id ? t.activeColor : t.inactiveColor} ${regenerating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-90'}`}>
                    <span className="text-2xl">{t.emoji}</span>
                    <p className="text-xs font-bold">{t.label}</p>
                    <p className="text-[10px] text-gray-500 leading-tight">{t.sub}</p>
                    {currentTier === t.id && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 bg-white/70">✓ Current</span>}
                  </button>
                ))}
              </div>

            </div>
          );
        })()}


        {/* Edit Trip CTA banner */}
        <button onClick={() => setShowEditPanel(true)}
          className="w-full mb-6 flex items-center justify-between p-4 rounded-2xl bg-white border-2 border-gray-200 hover:border-primary-300 hover:bg-primary-50/50 transition-all group">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-100 flex items-center justify-center">
              <Edit3 className="w-4 h-4 text-primary-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-800">Want a different itinerary?</p>
              <p className="text-xs text-gray-500">Change travel mode, pace, accommodation, interests and more</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
        </button>

        {/* Extra tags row */}
        {(tripDetails?.pace || tripDetails?.accommodationType || tripDetails?.startDate) && (
          <div className="flex flex-wrap gap-3 mb-6">
            {tripDetails?.startDate && tripDetails?.endDate && (
              <span className="flex items-center gap-1.5 text-xs bg-white border border-gray-200 rounded-full px-3 py-1.5 text-gray-600">
                <Calendar className="w-3.5 h-3.5" /> {tripDetails.startDate} → {tripDetails.endDate}
              </span>
            )}
            {tripDetails?.pace && tripDetails.pace !== 'auto' && (
              <span className="text-xs bg-white border border-gray-200 rounded-full px-3 py-1.5 text-gray-600">⚡ {tripDetails.pace}</span>
            )}
            {tripDetails?.distanceRange && (
              <span className="text-xs bg-white border border-gray-200 rounded-full px-3 py-1.5 text-gray-600">📍 Within {tripDetails.distanceRange} km</span>
            )}
            {tripDetails?.mealPreference?.length > 0 && (
              <span className="text-xs bg-white border border-gray-200 rounded-full px-3 py-1.5 text-gray-600">🍽️ {tripDetails.mealPreference.join(', ')}</span>
            )}
            {tripDetails?.travellerType && (
              <span className="text-xs bg-white border border-gray-200 rounded-full px-3 py-1.5 text-gray-600">👥 {tripDetails.travellerType}</span>
            )}
          </div>
        )}

        {/* Travel Info */}
        {travelInfo && (
          <div className="glass-card p-5 mb-6">
            <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Plane className="w-4 h-4 text-primary-600" /> Travel Information
            </h2>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-gray-500 text-xs mb-1">Route</p>
                <p className="font-medium text-gray-800">{travelInfo.from} → {travelInfo.to}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-gray-500 text-xs mb-1">Est. Travel Time</p>
                <p className="font-medium text-gray-800">{travelInfo.estimatedTravelTime}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-gray-500 text-xs mb-1">Estimated Fare (Total)</p>
                <p className="font-medium text-gray-800">{fmt(travelInfo.estimatedFare?.total)}</p>
              </div>
            </div>
            {travelInfo.bookingTips && (
              <p className="text-xs text-gray-500 mt-3 flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-amber-500" />{travelInfo.bookingTips}
              </p>
            )}
          </div>
        )}

        {/* Accommodation */}
        {accommodation?.length > 0 && (
          <div className="glass-card p-5 mb-6">
            <h2 className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
              <Hotel className="w-4 h-4 text-primary-600" /> Recommended Stays
            </h2>
            <p className="text-xs text-gray-400 mb-3">AI-suggested hotels — click links to verify availability & book</p>
            <div className="grid md:grid-cols-2 gap-3">
              {accommodation.map((a, i) => {
                const searchQuery = encodeURIComponent(`${a.name} ${a.location || tripDetails?.destination} hotel`);
                const googleLink = `https://www.google.com/search?q=${searchQuery}`;
                const bookingLink = `https://www.booking.com/search.html?ss=${encodeURIComponent(a.name + ' ' + (tripDetails?.destination || ''))}`;
                const mmtLink = `https://www.makemytrip.com/hotels/hotel-listing/?checkin=&checkout=&city=${encodeURIComponent(tripDetails?.destination || '')}&searchText=${encodeURIComponent(a.name)}`;
                return (
                  <div key={i} className="border border-gray-100 rounded-xl p-4 hover:border-primary-200 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="font-semibold text-sm text-gray-800">{a.name}</p>
                        <p className="text-xs text-gray-500">{a.location}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg flex-shrink-0">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-medium text-amber-700">{a.rating}</span>
                      </div>
                    </div>

                    <p className="text-sm font-bold text-primary-700 mb-2">
                      {fmt(a.pricePerNight)}<span className="text-xs text-gray-400 font-normal">/night</span>
                    </p>

                    {a.amenities?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {a.amenities.slice(0, 4).map((am, j) => (
                          <span key={j} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{am}</span>
                        ))}
                      </div>
                    )}

                    {a.bookingTip && (
                      <p className="text-[11px] text-amber-600 flex items-start gap-1 mb-3">
                        <Zap className="w-3 h-3 mt-0.5 flex-shrink-0" />{a.bookingTip}
                      </p>
                    )}

                    {/* Search & booking links */}
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                      <a href={googleLink} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
                        🔍 Google
                      </a>
                      <a href={bookingLink} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors">
                        🏨 Booking.com
                      </a>
                      <a href={mmtLink} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors">
                        ✈️ MakeMyTrip
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Daily Itinerary */}
        <div className="mb-6">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary-600" /> Day-by-Day Itinerary
            <span className="text-xs font-normal text-gray-400">({dailyItinerary?.length} days)</span>
            {isLongTrip && <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Summary Mode</span>}
          </h2>
          <div className="space-y-3">
            {dailyItinerary?.map((day, idx) => (
              <div key={idx} className="glass-card overflow-hidden">
                <button className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50/50 transition-colors" onClick={() => toggleDay(idx)}>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {day.day}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-800 text-sm">{day.title}</p>
                      {day.theme && <span className="text-[10px] bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full font-medium">{day.theme}</span>}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                      <span>{day.date}</span>
                      {day.schedule?.length > 0 && <span>· {day.schedule.length} activities</span>}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-gray-400">
                    {expandedDays[idx] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {expandedDays[idx] && (
                  <div className="border-t border-gray-100 px-5 pb-5">
                    {day.schedule?.length > 0 && (
                      <div className="mt-4 space-y-0">
                        {day.schedule.map((activity, aIdx) => (
                          <div key={aIdx} className="flex gap-4 relative">
                            <div className="flex flex-col items-center flex-shrink-0 w-16">
                              <span className="text-[10px] font-semibold text-primary-600 bg-primary-50 px-1.5 py-1 rounded-lg text-center leading-tight w-full">
                                {activity.time}
                              </span>
                              {aIdx < day.schedule.length - 1 && (
                                <div className="w-0.5 h-full min-h-[24px] bg-gray-200 my-1 flex-1" />
                              )}
                            </div>
                            <div className={`flex-1 mb-4 pb-4 ${aIdx < day.schedule.length - 1 ? 'border-b border-gray-50' : ''}`}>
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <div>
                                  <p className="font-semibold text-sm text-gray-800">{activity.activity}</p>
                                  {activity.location && (
                                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                      <MapPin className="w-3 h-3" />{activity.location}
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  {activity.category && (
                                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${categoryColors[activity.category] || 'bg-gray-100 text-gray-600'}`}>
                                      {activity.category}
                                    </span>
                                  )}
                                </div>
                              </div>
                              {activity.description && (
                                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{activity.description}</p>
                              )}
                              <div className="flex flex-wrap items-center gap-3 mt-1.5">
                                {activity.duration && (
                                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />{activity.duration}
                                  </span>
                                )}
                                {activity.tips && (
                                  <span className="text-[10px] text-amber-600 flex items-start gap-1">
                                    <Zap className="w-3 h-3 mt-0.5 flex-shrink-0" />{activity.tips}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Food Suggestions — at end of day */}
                    {day.foodSuggestions?.places?.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1.5">
                          <Utensils className="w-3.5 h-3.5" /> Food Options Nearby
                          <span className="font-normal text-gray-400 text-[10px]">— suggestions only, you decide</span>
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {day.foodSuggestions.places.map((place, pi) => {
                            const searchQ = encodeURIComponent(`${place.name} ${tripDetails?.destination}`);
                            const typeEmoji = place.type === 'cafe' ? '☕' : place.type === 'street food' ? '🍢' : place.type?.includes('bakery') || place.type?.includes('dessert') ? '🧁' : '🍽️';
                            return (
                              <div key={pi} className="bg-orange-50 border border-orange-100 rounded-xl px-3 py-2.5">
                                <div className="flex items-start justify-between gap-1">
                                  <div className="flex items-start gap-1.5 min-w-0 flex-1">
                                    <span className="text-sm flex-shrink-0 mt-0.5">{typeEmoji}</span>
                                    <div className="min-w-0">
                                      <p className="text-xs font-bold text-gray-900 leading-tight truncate">{place.name}</p>
                                      <p className="text-[10px] text-gray-500 mt-0.5">{place.cuisine}</p>
                                      {place.priceRange && <p className="text-[10px] text-orange-600">{place.priceRange}</p>}
                                    </div>
                                  </div>
                                  <a href={`https://www.google.com/search?q=${searchQ}`} target="_blank" rel="noopener noreferrer"
                                    className="text-[10px] bg-white border border-orange-200 text-blue-600 px-1.5 py-0.5 rounded-lg hover:bg-blue-50 transition-colors flex-shrink-0">
                                    🔍
                                  </a>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Budget Required — from LLM per day */}
                    {day.dayBudget && (
                      <div className="mt-3">
                        <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1.5">
                          <Wallet className="w-3.5 h-3.5" /> Approx. Budget Required (this day)
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { label: 'Stay', value: day.dayBudget.accommodation, emoji: '🏨', color: 'bg-purple-50 border-purple-100 text-purple-700' },
                            { label: 'Food', value: day.dayBudget.food, emoji: '🍽️', color: 'bg-orange-50 border-orange-100 text-orange-700' },
                            { label: 'Activities', value: (day.dayBudget.activities || 0) + (day.dayBudget.transport || 0) + (day.dayBudget.miscellaneous || 0), emoji: '🎯', color: 'bg-blue-50 border-blue-100 text-blue-700' },
                          ].map(item => (
                            <div key={item.label} className={`rounded-xl p-2.5 border ${item.color}`}>
                              <p className="text-base mb-1">{item.emoji}</p>
                              <p className="text-[10px] font-semibold opacity-80 uppercase tracking-wide">{item.label}</p>
                              <p className="text-sm font-bold mt-0.5">~{fmt(item.value || 0)}</p>
                            </div>
                          ))}
                        </div>
                        {day.dayBudget.dayTotal > 0 && (
                          <div className="mt-2 flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                            <span className="text-xs text-gray-500">Day Total</span>
                            <span className="text-sm font-bold text-primary-700">~{fmt(day.dayBudget.dayTotal)}</span>
                          </div>
                        )}
                        {day.dayBudget.note && (
                          <p className="text-[10px] text-gray-400 mt-1 italic">{day.dayBudget.note}</p>
                        )}
                      </div>
                    )}

                    {day.dayTips && (
                      <div className="mt-3 flex items-start gap-2 bg-amber-50 rounded-xl p-3">
                        <Zap className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-800">{day.dayTips}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Budget Breakdown — compact */}
        {budgetBreakdown && (
          <div className="glass-card p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-primary-600" /> Trip Budget Breakdown
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">AI-estimated realistic costs</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary-700">{fmt(budgetBreakdown.totalEstimated)}</p>
                <p className="text-[10px] text-gray-400">
                  {budgetBreakdown.perDay > 0 && `${fmt(budgetBreakdown.perDay)}/day`}
                  {budgetBreakdown.perPerson > 0 && ` · ${fmt(budgetBreakdown.perPerson)}/person`}
                </p>
              </div>
            </div>

            {/* Category pills */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { label: 'Travel',        value: budgetBreakdown.travel,        emoji: '✈️', color: 'bg-blue-50 text-blue-700' },
                { label: 'Stay',          value: budgetBreakdown.accommodation,  emoji: '🏨', color: 'bg-purple-50 text-purple-700' },
                { label: 'Food',          value: budgetBreakdown.food,           emoji: '🍽️', color: 'bg-orange-50 text-orange-700' },
                { label: 'Activities',    value: budgetBreakdown.activities,     emoji: '🎯', color: 'bg-green-50 text-green-700' },
                { label: 'Shopping',      value: budgetBreakdown.shopping,       emoji: '🛍️', color: 'bg-pink-50 text-pink-700' },
                { label: 'Misc',          value: budgetBreakdown.miscellaneous,  emoji: '💼', color: 'bg-gray-50 text-gray-700' },
              ].filter(i => i.value > 0).map(item => (
                <div key={item.label} className={`rounded-xl p-3 ${item.color}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-base">{item.emoji}</span>
                    <span className="text-xs font-bold">{fmt(item.value)}</span>
                  </div>
                  <p className="text-[10px] font-medium opacity-80">{item.label}</p>
                  <div className="mt-1.5 h-1 bg-white/50 rounded-full overflow-hidden">
                    <div className="h-full bg-current rounded-full opacity-60"
                      style={{ width: `${Math.min(100, ((item.value || 0) / (budgetBreakdown.totalEstimated || 1)) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {budgetBreakdown.savingsTips?.filter(t => t).length > 0 && (
              <div className="bg-amber-50 rounded-xl p-3">
                <p className="text-[10px] font-bold text-amber-700 mb-1.5">💡 Saving Tips</p>
                <div className="space-y-1">
                  {budgetBreakdown.savingsTips.filter(t => t).map((tip, i) => (
                    <p key={i} className="text-[10px] text-amber-800 flex items-start gap-1.5">
                      <CheckCircle className="w-3 h-3 text-amber-600 mt-0.5 flex-shrink-0" />{tip}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Packing List */}
        {(packingObj || packingArr) && (
          <div className="glass-card p-5 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Backpack className="w-4 h-4 text-primary-600" /> Packing List
            </h3>
            {packingObj ? (
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(packingObj).map(([cat, items]) => (
                  Array.isArray(items) && items.length > 0 && (
                    <div key={cat}>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 capitalize">{cat}</p>
                      <div className="space-y-1">
                        {items.map((item, i) => (
                          <p key={i} className="text-xs text-gray-600 flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0 flex items-center justify-center text-gray-400 text-[10px]">{i + 1}</span>
                            {item}
                          </p>
                        ))}
                      </div>
                    </div>
                  )
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-1.5">
                {packingArr.map((item, i) => (
                  <p key={i} className="text-xs text-gray-600 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0 flex items-center justify-center text-gray-400 text-[10px]">{i + 1}</span>
                    {item}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tips + Local Phrases */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {importantTips?.length > 0 && (
            <div className="glass-card p-5">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" /> Important Tips
              </h3>
              <div className="space-y-2">
                {importantTips.map((tip, i) => (
                  <p key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                    <span className="text-amber-500 mt-0.5 flex-shrink-0">⚡</span>{tip}
                  </p>
                ))}
              </div>
            </div>
          )}
          {localPhrases?.length > 0 && (
            <div className="glass-card p-5">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-primary-600" /> Useful Local Phrases
              </h3>
              <div className="space-y-2">
                {localPhrases.map((p, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <span className="font-semibold text-primary-700 min-w-[80px]">{p.phrase}</span>
                    <span className="text-gray-500">= {p.meaning}</span>
                    {p.pronunciation && <span className="text-gray-400 italic">({p.pronunciation})</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Emergency Contacts */}
        {emergencyContacts && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-5 mb-6">
            <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Emergency Contacts
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(emergencyContacts).map(([key, val]) => (
                <div key={key} className="bg-white rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500 capitalize mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                  <p className="font-bold text-red-700">{val}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Save CTA */}
        {!saved && (
          <div className="text-center">
            <button onClick={handleSave} disabled={saving}
              className="btn-primary px-10 py-4 text-base shadow-lg shadow-primary-200 flex items-center gap-2 mx-auto">
              <Save className="w-5 h-5" />
              {saving ? 'Saving to Dashboard…' : 'Save This Trip'}
            </button>
            <p className="text-xs text-gray-400 mt-2">Saved trips appear in your dashboard</p>
          </div>
        )}
      </div>
    </div>
  );
}