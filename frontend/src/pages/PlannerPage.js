import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Plane, Train, Bus, Car, Calendar, Users,
  Sparkles, ArrowRight, ArrowLeft, Info,
  Utensils, Heart, Clock, CheckCircle, Wind,
  Baby, Accessibility, Globe, Wand2
} from 'lucide-react';
import Navbar from '../components/ui/Navbar';
import { AIGeneratingLoader } from '../components/ui/LoadingSpinner';
import api from '../utils/api';
import toast from 'react-hot-toast';

const TOTAL_STEPS = 4;

const travelModes = [
  { id: 'flight', label: 'Flight', icon: <Plane className="w-5 h-5" />, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { id: 'train', label: 'Train', icon: <Train className="w-5 h-5" />, color: 'text-green-600 bg-green-50 border-green-200' },
  { id: 'bus', label: 'Bus', icon: <Bus className="w-5 h-5" />, color: 'text-orange-600 bg-orange-50 border-orange-200' },
  { id: 'car', label: 'Car', icon: <Car className="w-5 h-5" />, color: 'text-purple-600 bg-purple-50 border-purple-200' },
];

const preferenceOptions = [
  { id: 'adventure', label: 'Adventure', emoji: '🏕️', desc: 'Trekking & outdoor' },
  { id: 'religious', label: 'Religious', emoji: '🛕', desc: 'Temples & pilgrimage' },
  { id: 'nature', label: 'Nature', emoji: '🌿', desc: 'Wildlife & scenery' },
  { id: 'beach', label: 'Beach', emoji: '🏖️', desc: 'Coastal getaway' },
  { id: 'cultural', label: 'Cultural', emoji: '🏛️', desc: 'Heritage & museums' },
  { id: 'food', label: 'Food Tour', emoji: '🍜', desc: 'Local cuisine' },
  { id: 'family', label: 'Family', emoji: '👨‍👩‍👧', desc: 'Kid-friendly' },
  { id: 'romantic', label: 'Romantic', emoji: '💑', desc: 'Couples getaway' },
  { id: 'photography', label: 'Photography', emoji: '📸', desc: 'Scenic spots' },
  { id: 'shopping', label: 'Shopping', emoji: '🛍️', desc: 'Markets & malls' },
];

const mealPrefs = [
  { id: 'veg', label: 'Vegetarian', emoji: '🥗' },
  { id: 'nonveg', label: 'Non-Veg', emoji: '🍗' },
  { id: 'vegan', label: 'Vegan', emoji: '🌱' },
  { id: 'local', label: 'Local Cuisine', emoji: '🍛' },
  { id: 'street', label: 'Street Food', emoji: '🌮' },
  { id: 'finedining', label: 'Fine Dining', emoji: '🍽️' },
];

const paceOptions = [
  { id: 'auto', label: 'AI Decides', emoji: '🤖', desc: 'AI picks the best pace for your trip' },
  { id: 'relaxed', label: 'Relaxed', emoji: '😌', desc: '2–3 activities/day, lots of rest' },
  { id: 'moderate', label: 'Moderate', emoji: '🚶', desc: '4–5 activities/day, balanced' },
  { id: 'packed', label: 'Action-packed', emoji: '⚡', desc: '6+ activities/day, see everything' },
];

const travellerTypes = [
  { id: 'solo', label: 'Solo', emoji: '🧳', desc: 'Travelling alone' },
  { id: 'couple', label: 'Couple', emoji: '💑', desc: 'Romantic trip for two' },
  { id: 'family', label: 'Family', emoji: '👨‍👩‍👧', desc: 'With kids or elderly' },
  { id: 'friends', label: 'Friends', emoji: '🎉', desc: 'Group of friends' },
  { id: 'business', label: 'Business', emoji: '💼', desc: 'Work + leisure' },
];

const tripVibeOptions = [
  { id: 'relaxation', label: 'Pure Relaxation', emoji: '🧘', desc: 'Recharge, unwind, no rush' },
  { id: 'exploration', label: 'Exploration', emoji: '🗺️', desc: 'Discover new places' },
  { id: 'thrill', label: 'Thrill & Sports', emoji: '🏄', desc: 'Adrenaline & outdoor sports' },
  { id: 'wellness', label: 'Wellness', emoji: '🌸', desc: 'Spa, yoga, rejuvenation' },
  { id: 'party', label: 'Party & Nightlife', emoji: '🎶', desc: 'Music, bars, events' },
  { id: 'educational', label: 'Educational', emoji: '📚', desc: 'Learn local history & culture' },
];

const initialForm = {
  // Step 1
  source: '', destination: '', travelMode: '', startDate: '', endDate: '', days: '', people: '',
  travellerType: '',
  // Step 2
  mealPreference: [], tripVibe: [], distanceRange: '',
  // Step 3
  preferences: [], pace: 'auto', hasChildren: false, hasElderly: false,
  accessibilityNeeds: false, specialRequirements: '',
  // Step 4 — review
};

export default function PlannerPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [generating, setGenerating] = useState(false);
  const [cooldown, setCooldown] = useState(0); // seconds remaining before retry allowed
  const cooldownRef = useRef(null);
  const navigate = useNavigate();

  // Tick the cooldown timer down every second
  useEffect(() => {
    if (cooldown <= 0) return;
    cooldownRef.current = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) { clearInterval(cooldownRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(cooldownRef.current);
  }, [cooldown]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'startDate' || name === 'endDate') {
      const start = name === 'startDate' ? value : form.startDate;
      const end = name === 'endDate' ? value : form.endDate;
      if (start && end) {
        const diff = Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24));
        if (diff > 0) setForm(prev => ({ ...prev, [name]: value, days: diff }));
        else setForm(prev => ({ ...prev, [name]: value }));
      } else {
        setForm(prev => ({ ...prev, [name]: value }));
      }
    } else if (type === 'checkbox') {
      setForm(prev => ({ ...prev, [name]: checked }));
    } else {
      // Auto-select Solo when people = 1
      if (name === 'people') {
        const num = Number(value);
        setForm(prev => ({
          ...prev,
          [name]: value,
          travellerType: num === 1 ? 'solo' : (prev.travellerType === 'solo' ? '' : prev.travellerType),
        }));
      } else {
        setForm(prev => ({ ...prev, [name]: value }));
      }
    }
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const toggle = (field, id) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(id)
        ? prev[field].filter(x => x !== id)
        : [...prev[field], id],
    }));
  };

  const selectOne = (field, id) => {
    setForm(prev => ({ ...prev, [field]: id }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateStep = (s) => {
    const errs = {};
    if (s === 1) {
      if (!form.source.trim()) errs.source = 'Required';
      if (!form.destination.trim()) errs.destination = 'Required';
      if (!form.travelMode) errs.travelMode = 'Select a travel mode';
      if (!form.days || form.days < 1 || form.days > 30) errs.days = 'Enter valid days (1–30)';
      if (!form.people || form.people < 1 || form.people > 20) errs.people = 'Enter valid number (1–20)';
      if (!form.travellerType) errs.travellerType = 'Select traveller type';
    }
    if (s === 2) {
    }
    if (s === 3) {
      // pace defaults to 'auto', so no error needed
    }
    return errs;
  };

  const nextStep = () => {
    const errs = validateStep(step);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error('Please fill in all required fields.');
      return;
    }
    setErrors({});
    setStep(s => s + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep(s => s - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    setGenerating(true);
    try {
      const resolvedPace = form.pace === 'auto' ? '' : form.pace;

      const payload = {
        source: form.source,
        destination: form.destination,
        travelMode: form.travelMode,
        budget: 'medium', // default tier — user changes on itinerary page
        days: Number(form.days),
        people: Number(form.people),
        travellerType: form.travellerType,
        preferences: form.preferences,
        mealPreference: form.mealPreference,
        pace: resolvedPace,
        tripVibe: form.tripVibe,
        distanceRange: form.distanceRange,
        hasChildren: form.hasChildren,
        hasElderly: form.hasElderly,
        accessibilityNeeds: form.accessibilityNeeds,
        startDate: form.startDate,
        endDate: form.endDate,
        specialRequirements: form.specialRequirements,
      };
      const res = await api.post('/trip/generate', payload);
      navigate('/itinerary', {
        state: {
          itinerary: res.data.itinerary,
          tripDetails: { ...payload, budget: res.data.itinerary?.budgetBreakdown?.totalEstimated || 0 },
        },
      });
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;

      if (status === 429) {
        const msg = data?.isDailyLimit
          ? 'Daily Groq limit reached. Please try again after midnight UTC.'
          : 'Rate limit hit. Please wait a minute and try again.';
        toast.error(msg, { duration: 6000 });
        setGenerating(false);
        return;
      }

      const msg = data?.message || 'Failed to generate itinerary. Please try again.';
      toast.error(msg);
      setGenerating(false);
    }
    // Only stop spinner on success (navigated away) or non-429 error
    // For 429 we return early above and auto-retry
  };

  if (generating) return <AIGeneratingLoader />;

  const stepTitles = ['Trip Basics', 'Stay & Vibe', 'Preferences & Pace', 'Review & Generate'];
  const stepIcons = ['🗺️', '🏨', '❤️', '✨'];

  return (
    <div className="min-h-screen bg-mesh">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 pt-24 pb-16">

        {/* Header */}
        <div className="text-center mb-6 animate-slide-up">
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-1">Plan Your Trip</h1>
          <p className="text-gray-500 text-sm">AI builds the perfect itinerary — you just explore</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-between mb-8">
          {stepTitles.map((title, idx) => {
            const n = idx + 1;
            const active = step === n;
            const done = step > n;
            return (
              <div key={n} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-2 ${
                    done ? 'bg-primary-600 border-primary-600 text-white' :
                    active ? 'bg-white border-primary-500 text-primary-600 shadow-md' :
                    'bg-white border-gray-200 text-gray-400'
                  }`}>
                    {done ? '✓' : stepIcons[idx]}
                  </div>
                  <span className={`text-[10px] font-medium hidden md:block ${active ? 'text-primary-600' : done ? 'text-green-600' : 'text-gray-400'}`}>
                    {title}
                  </span>
                </div>
                {idx < stepTitles.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 mt-[-14px] rounded-full transition-all duration-300 ${step > n ? 'bg-primary-500' : 'bg-gray-200'}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* ───── STEP 1: Trip Basics ───── */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <div className="glass-card p-6">
              <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary-600" /> Where are you going? *
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="form-label">Travelling From *</label>
                  <input name="source" value={form.source} onChange={handleChange}
                    className={`form-input ${errors.source ? 'border-red-400' : ''}`}
                    placeholder="e.g. Mumbai, Delhi, Ahmedabad" />
                  {errors.source && <p className="mt-1 text-xs text-red-500">{errors.source}</p>}
                </div>
                <div>
                  <label className="form-label">Destination *</label>
                  <input name="destination" value={form.destination} onChange={handleChange}
                    className={`form-input ${errors.destination ? 'border-red-400' : ''}`}
                    placeholder="e.g. Goa, Manali, Jaipur, Kerala" />
                  {errors.destination && <p className="mt-1 text-xs text-red-500">{errors.destination}</p>}
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Plane className="w-4 h-4 text-primary-600" /> Travel Mode *
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {travelModes.map(m => (
                  <button key={m.id} type="button" onClick={() => selectOne('travelMode', m.id)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                      form.travelMode === m.id ? 'border-primary-400 bg-primary-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}>
                    <span className={`p-2 rounded-lg ${m.color}`}>{m.icon}</span>
                    <span className={`font-medium text-sm ${form.travelMode === m.id ? 'text-primary-700' : 'text-gray-800'}`}>{m.label}</span>
                    {form.travelMode === m.id && <CheckCircle className="w-4 h-4 text-primary-500 ml-auto" />}
                  </button>
                ))}
              </div>
              {errors.travelMode && <p className="mt-2 text-xs text-red-500">{errors.travelMode}</p>}
            </div>

            <div className="glass-card p-6">
              <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary-600" /> Dates & Duration *
              </h2>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="form-label">Start Date</label>
                  <input type="date" name="startDate" value={form.startDate} onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="form-input" />
                </div>
                <div>
                  <label className="form-label">End Date</label>
                  <input type="date" name="endDate" value={form.endDate} onChange={handleChange}
                    min={form.startDate || new Date().toISOString().split('T')[0]}
                    className="form-input" />
                </div>
              </div>
              <div>
                <label className="form-label">Number of Days *</label>
                <input type="number" name="days" value={form.days} onChange={handleChange}
                  min={1} max={30}
                  className={`form-input ${errors.days ? 'border-red-400' : ''}`}
                  placeholder="How many days? (1–30)" />
                {errors.days && <p className="mt-1 text-xs text-red-500">{errors.days}</p>}
                {form.startDate && form.endDate && form.days > 0 && (
                  <p className="text-xs text-green-600 mt-1">✓ Auto-calculated from your dates: {form.days} days</p>
                )}
              </div>
            </div>

            <div className="glass-card p-6">
              <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary-600" /> Travellers *
              </h2>
              <div className="mb-4">
                <label className="form-label">Number of People *</label>
                <input type="number" name="people" value={form.people} onChange={handleChange}
                  min={1} max={20}
                  className={`form-input ${errors.people ? 'border-red-400' : ''}`}
                  placeholder="How many people? (1–20)" />
                {errors.people && <p className="mt-1 text-xs text-red-500">{errors.people}</p>}
              </div>
              <div>
                <label className="form-label flex items-center gap-1">Who's Travelling? *</label>
                {Number(form.people) === 1 && (
                  <p className="text-xs text-primary-600 mb-2 flex items-center gap-1">🧳 Solo auto-selected since you're travelling alone</p>
                )}
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {travellerTypes.map(t => {
                    const isSoloLocked = Number(form.people) === 1;
                    const isDisabled = isSoloLocked && t.id !== 'solo';
                    return (
                      <button key={t.id} type="button"
                        onClick={() => !isDisabled && selectOne('travellerType', t.id)}
                        disabled={isDisabled}
                        className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 text-xs font-medium transition-all duration-200 ${
                          form.travellerType === t.id
                            ? 'border-primary-400 bg-primary-50 text-primary-700'
                            : isDisabled
                            ? 'border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                        }`}>
                        <span className="text-xl">{t.emoji}</span>
                        {t.label}
                      </button>
                    );
                  })}
                </div>
                {errors.travellerType && <p className="mt-2 text-xs text-red-500">{errors.travellerType}</p>}
              </div>
            </div>
          </div>
        )}

        {/* ───── STEP 2: Stay & Vibe ───── */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-700 flex items-start gap-2">
              <Wand2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span><strong>No budget needed!</strong> AI will calculate the minimum realistic cost for your trip and show it in the itinerary. You can refine the budget after seeing the itinerary.</span>
            </div>


            <div className="glass-card p-6">
              <h2 className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary-600" /> Distance from City Centre
                <span className="text-xs font-normal text-gray-400 ml-1">(optional)</span>
              </h2>
              <p className="text-xs text-gray-500 mb-3">Suggest places within this range from the city centre</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: '0-50', label: '0 – 50 km', emoji: '🏙️', desc: 'City centre & nearby' },
                  { id: '0-100', label: '0 – 100 km', emoji: '🌆', desc: 'City + short day trips' },
                  { id: '200+', label: '200+ km', emoji: '✈️', desc: 'Far excursions included' },
                ].map(r => (
                  <button key={r.id} type="button"
                    onClick={() => selectOne('distanceRange', form.distanceRange === r.id ? '' : r.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                      form.distanceRange === r.id
                        ? 'border-primary-400 bg-primary-50 text-primary-700'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                    }`}>
                    <span className="text-xl">{r.emoji}</span>
                    <div>
                      <p className="text-xs font-bold">{r.label}</p>
                      <p className="text-[10px] text-gray-400">{r.desc}</p>
                    </div>
                    {form.distanceRange === r.id && <CheckCircle className="w-4 h-4 text-primary-500 ml-auto" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-card p-6">
              <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Utensils className="w-4 h-4 text-primary-600" /> Meal Preferences
                <span className="text-xs font-normal text-gray-400 ml-1">(optional)</span>
              </h2>
              <div className="grid grid-cols-3 gap-2">
                {mealPrefs.map(m => (
                  <button key={m.id} type="button" onClick={() => toggle('mealPreference', m.id)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-xs font-medium transition-all duration-200 ${
                      form.mealPreference.includes(m.id)
                        ? 'border-primary-400 bg-primary-50 text-primary-700'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                    }`}>
                    <span className="text-xl">{m.emoji}</span>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-card p-6">
              <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary-600" /> Trip Vibe
                <span className="text-xs font-normal text-gray-400 ml-1">(optional, pick any)</span>
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {tripVibeOptions.map(v => (
                  <button key={v.id} type="button" onClick={() => toggle('tripVibe', v.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left text-xs font-medium transition-all duration-200 ${
                      form.tripVibe.includes(v.id)
                        ? 'border-primary-400 bg-primary-50 text-primary-700'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                    }`}>
                    <span className="text-lg">{v.emoji}</span>
                    <div>
                      <p className="font-medium">{v.label}</p>
                      <p className="text-gray-400 font-normal">{v.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ───── STEP 3: Interests, Pace & Needs ───── */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <div className="glass-card p-6">
              <h2 className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
                <Heart className="w-4 h-4 text-primary-600" /> Travel Interests
                <span className="text-xs font-normal text-gray-400 ml-1">(optional)</span>
              </h2>
              <p className="text-xs text-gray-500 mb-4">These help AI tailor your itinerary perfectly.</p>
              <div className="grid grid-cols-3 gap-2">
                {preferenceOptions.map(p => (
                  <button key={p.id} type="button" onClick={() => toggle('preferences', p.id)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 text-xs font-medium transition-all duration-200 ${
                      form.preferences.includes(p.id)
                        ? 'border-primary-400 bg-primary-50 text-primary-700'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                    }`}>
                    <span className="text-xl">{p.emoji}</span>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-card p-6">
              <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary-600" /> Travel Pace
                <span className="text-xs font-normal text-gray-400 ml-1">(optional)</span>
              </h2>
              <div className="space-y-2">
                {paceOptions.map(p => (
                  <button key={p.id} type="button" onClick={() => selectOne('pace', p.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                      form.pace === p.id
                        ? p.id === 'auto' ? 'border-blue-400 bg-blue-50' : 'border-primary-400 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}>
                    <span className="text-2xl">{p.emoji}</span>
                    <div className="flex-1">
                      <p className={`font-medium text-sm ${form.pace === p.id ? (p.id === 'auto' ? 'text-blue-700' : 'text-primary-700') : 'text-gray-800'}`}>{p.label}</p>
                      <p className="text-xs text-gray-500">{p.desc}</p>
                    </div>
                    {form.pace === p.id && <CheckCircle className={`w-5 h-5 flex-shrink-0 ${p.id === 'auto' ? 'text-blue-500' : 'text-primary-500'}`} />}
                  </button>
                ))}
              </div>
            </div>


            <div className="glass-card p-6">
              <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Accessibility className="w-4 h-4 text-primary-600" /> Special Needs
                <span className="text-xs font-normal text-gray-400 ml-1">(optional)</span>
              </h2>
              <div className="space-y-3 mb-4">
                {[
                  { name: 'hasChildren', label: 'Travelling with Children', emoji: '👶', desc: 'AI adds kid-friendly activities & notes' },
                  { name: 'hasElderly', label: 'Travelling with Elderly', emoji: '👴', desc: 'AI adds senior-friendly & accessible options' },
                  { name: 'accessibilityNeeds', label: 'Accessibility Requirements', emoji: '♿', desc: 'Wheelchair or mobility-friendly recommendations' },
                ].map(item => (
                  <label key={item.name} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    form[item.name] ? 'border-primary-400 bg-primary-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}>
                    <span className="text-2xl">{item.emoji}</span>
                    <div className="flex-1">
                      <p className={`font-medium text-sm ${form[item.name] ? 'text-primary-700' : 'text-gray-800'}`}>{item.label}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                    <input type="checkbox" name={item.name} checked={form[item.name]} onChange={handleChange} className="w-5 h-5 accent-primary-600" />
                  </label>
                ))}
              </div>
              <div>
                <label className="form-label flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" /> Anything Else?
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea name="specialRequirements" value={form.specialRequirements} onChange={handleChange}
                  rows={3} placeholder="e.g. celebrating anniversary, need halal food, avoid crowded places, vegetarian restaurants only..."
                  className="form-input resize-none text-sm mt-1" />
              </div>
            </div>
          </div>
        )}

        {/* ───── STEP 4: Review & Generate ───── */}
        {step === 4 && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-gradient-to-br from-primary-700 to-primary-900 rounded-2xl p-6 text-white">
              <p className="text-primary-200 text-xs mb-1">Your Trip Summary</p>
              <h2 className="text-2xl font-bold mb-1">{form.source} → {form.destination}</h2>
              <p className="text-primary-200 text-sm">{form.days} Days · {form.people} {Number(form.people) === 1 ? 'Person' : 'People'} · {form.travelMode}</p>
            </div>

            <div className="glass-card p-5 space-y-3 text-sm">
              {[
                { label: '📅 Dates', value: form.startDate && form.endDate ? `${form.startDate} → ${form.endDate}` : `${form.days} days` },
                { label: '👥 Traveller', value: travellerTypes.find(t => t.id === form.travellerType)?.label || '—' },
                { label: '🍽️ Food', value: form.mealPreference.length > 0 ? form.mealPreference.join(', ') : 'No preference' },
                { label: '⚡ Pace', value: paceOptions.find(p => p.id === form.pace)?.label || 'AI Decides' },
                { label: '❤️ Interests', value: form.preferences.length > 0 ? form.preferences.join(', ') : 'General sightseeing' },
                { label: '✨ Vibe', value: form.tripVibe.length > 0 ? form.tripVibe.join(', ') : 'AI Decides' },
                ...(form.distanceRange ? [{ label: '📍 Range', value: `Within ${form.distanceRange} km` }] : []),
                ...(form.hasChildren || form.hasElderly || form.accessibilityNeeds ? [{
                  label: '♿ Special', value: [form.hasChildren && 'With Children', form.hasElderly && 'With Elderly', form.accessibilityNeeds && 'Accessibility'].filter(Boolean).join(', ')
                }] : []),
                ...(form.specialRequirements ? [{ label: '📝 Notes', value: form.specialRequirements }] : []),
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-gray-500 w-28 flex-shrink-0">{item.label}</span>
                  <span className="text-gray-800 font-medium capitalize">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-primary-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800 flex items-start gap-2">
              <Wand2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>
                AI will generate a <strong>detailed hour-by-hour itinerary</strong> with real places, meal recommendations, and a <strong>minimum realistic budget estimate</strong>.
                After viewing, you can enter a custom budget and regenerate instantly.
              </span>
            </div>

            <button onClick={handleSubmit} disabled={generating}
              className={`w-full flex items-center justify-center gap-3 py-4 text-base shadow-lg rounded-2xl font-semibold transition-all duration-200 ${generating ? 'btn-primary opacity-80 cursor-wait' : 'btn-primary shadow-primary-200'}`}>
              {generating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Generating your itinerary…
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate My Itinerary
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
            {!generating && (
              <p className="text-center text-xs text-gray-400">Powered by Groq AI · Usually takes 10–20 seconds</p>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        {step < 4 && (
          <div className="flex gap-3 mt-6">
            {step > 1 && (
              <button onClick={prevStep} className="btn-secondary flex items-center gap-2 px-5 py-3">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            )}
            <button onClick={nextStep} className="btn-primary flex-1 flex items-center justify-center gap-2 py-3">
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
        {step === 4 && (
          <button onClick={prevStep} className="btn-secondary flex items-center gap-2 px-5 py-3 mt-3 w-full justify-center">
            <ArrowLeft className="w-4 h-4" /> Edit Details
          </button>
        )}
      </div>
    </div>
  );
}