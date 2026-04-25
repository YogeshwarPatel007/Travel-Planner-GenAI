import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, Wallet, Clock, Users, ArrowRight,
  Star, Compass, ChevronRight, Globe, Shield,
  Sunrise, Camera
} from 'lucide-react';
import Navbar from '../components/ui/Navbar';

const features = [
  { icon: <Globe className="w-6 h-6" />, title: 'Personalised Itineraries', desc: 'Day-by-day plans crafted around your preferences, travel style, and pace.', color: 'from-blue-500 to-cyan-400' },
  { icon: <Wallet className="w-6 h-6" />, title: 'Honest Budget Breakdown', desc: 'Real cost estimates for transport, food, stays, and activities — no surprises.', color: 'from-emerald-500 to-teal-400' },
  { icon: <Clock className="w-6 h-6" />, title: 'Hour-by-Hour Schedule', desc: 'Never waste a minute. Every day planned with precise time slots.', color: 'from-violet-500 to-purple-400' },
  { icon: <MapPin className="w-6 h-6" />, title: 'Hotels & Food Picks', desc: 'Curated stays and local restaurants matched to your budget tier.', color: 'from-rose-500 to-pink-400' },
  { icon: <Shield className="w-6 h-6" />, title: 'Save & Revisit Anytime', desc: 'Your trips are always saved. Access them as travel guides on the go.', color: 'from-amber-500 to-orange-400' },
  { icon: <Users className="w-6 h-6" />, title: 'Solo to Group Travel', desc: 'Plan for one or a crowd. Per-person breakdowns handled automatically.', color: 'from-sky-500 to-indigo-400' },
];

const steps = [
  { num: '01', icon: <MapPin className="w-7 h-7" />, title: 'Enter Your Trip Details', desc: 'Destination, dates, budget, and a few preferences. Takes under 2 minutes.', color: 'from-primary-500 to-primary-700' },
  { num: '02', icon: <Compass className="w-7 h-7" />, title: 'Get Your Perfect Plan', desc: 'A complete itinerary with places, schedules, hotels, food spots, and budget.', color: 'from-violet-500 to-purple-600' },
  { num: '03', icon: <Sunrise className="w-7 h-7" />, title: 'Pack & Go', desc: 'Save your plan, download it as PDF, and start the adventure.', color: 'from-amber-400 to-orange-500' },
];

const destinations = [
  { name: 'Varanasi', tag: 'Spiritual', days: '4 Days', img: '🛕' },
  { name: 'Goa', tag: 'Beach', days: '5 Days', img: '🏖️' },
  { name: 'Manali', tag: 'Mountains', days: '6 Days', img: '🏔️' },
  { name: 'Jaipur', tag: 'Heritage', days: '3 Days', img: '🏯' },
  { name: 'Coorg', tag: 'Nature', days: '4 Days', img: '🌿' },
  { name: 'Andaman', tag: 'Islands', days: '7 Days', img: '🌊' },
  { name: 'Rishikesh', tag: 'Adventure', days: '3 Days', img: '🏄' },
  { name: 'Udaipur', tag: 'Royalty', days: '4 Days', img: '🕌' },
];

const testimonials = [
  { name: 'Priya S.', city: 'Mumbai', text: 'Planned our Rajasthan trip in minutes. Every hotel and place was spot on.', stars: 5 },
  { name: 'Arjun K.', city: 'Bangalore', text: 'The budget breakdown was incredibly accurate. No surprises on the trip!', stars: 5 },
  { name: 'Meera T.', city: 'Delhi', text: 'Solo trip to Uttarakhand perfectly planned. The time-wise schedule was a lifesaver.', stars: 5 },
];

const itineraryDays = [
  { day: 'Day 1', title: 'Arrival & Ghat Walk', activities: ['Check into hotel near Assi Ghat', 'Evening Ganga Aarti at Dashashwamedh', 'Dinner at Kashi Chat Bhandar'] },
  { day: 'Day 2', title: 'Temples & Culture', activities: ['Sunrise boat ride on Ganges', 'Kashi Vishwanath Temple visit', 'Banaras Hindu University campus'] },
  { day: 'Day 3', title: 'Old City Explorer', activities: ['Sarnath Buddhist complex', 'Shopping at Vishwanath Gali', 'Rooftop dinner with river view'] },
];

export default function LandingPage() {
  const [activeDay, setActiveDay] = useState(0);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#fafaf9' }}>
      <style>{`
        @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .marquee-track { animation: marquee 25s linear infinite; }
        .marquee-track:hover { animation-play-state: paused; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .float-card { animation: float 4s ease-in-out infinite; }
        .float-card2 { animation: float 4s ease-in-out infinite 2s; }
      `}</style>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-16 pb-10 px-4 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full opacity-[0.12]"
            style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }} />
          <div className="absolute -bottom-20 -left-40 w-[500px] h-[500px] rounded-full opacity-[0.10]"
            style={{ background: 'radial-gradient(circle, #f59e0b, transparent 70%)' }} />
          <div className="absolute top-28 left-10 grid grid-cols-6 gap-3 opacity-[0.12]">
            {[...Array(36)].map((_, i) => <div key={i} className="w-1 h-1 rounded-full bg-gray-500" />)}
          </div>
        </div>

        <div className="max-w-6xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* LEFT */}
            <div>
              <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-100 rounded-full px-4 py-1.5 mb-7">
                <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                <span className="text-sm font-semibold text-primary-700">Travel Smarter</span>
              </div>

              <h1 className="font-display text-5xl md:text-6xl font-bold text-gray-900 leading-[1.1] mb-6"
                style={{ letterSpacing: '-0.025em' }}>
                Plan Your<br />
                <span className="relative">
                  <span style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    Dream Trip
                  </span>
                </span><br />
                in Minutes
              </h1>

              <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-md">
                Tell us where you want to go. Get a complete day-by-day itinerary — hotels, restaurants, schedules, and a real budget breakdown.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <Link to="/signup"
                  className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl text-base font-semibold text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                  Start Planning Free <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/login"
                  className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl text-base font-semibold text-gray-700 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all shadow-sm">
                  Sign In
                </Link>
              </div>

              {/* Trust */}
              <div className="flex flex-wrap items-center gap-5 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1.5">
                    {['#818cf8', '#34d399', '#f59e0b', '#f472b6'].map((c, i) => (
                      <div key={i} className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                        style={{ background: c }}>{String.fromCharCode(65 + i)}</div>
                    ))}
                  </div>
                  <span>10,000+ trips planned</span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                  <span className="ml-1">4.9 / 5</span>
                </div>
                <span className="text-gray-300">•</span>
                <span>Free to use</span>
              </div>
            </div>

            {/* RIGHT — Live itinerary preview */}
            <div className="relative">
              {/* Floating badges */}
              <div className="float-card absolute -top-5 -right-2 z-20 bg-white rounded-2xl shadow-xl px-4 py-2.5 border border-gray-100 hidden md:flex items-center gap-2">
                <span className="text-lg">✨</span>
                <div>
                  <p className="text-xs font-bold text-gray-800">Plan generated!</p>
                  <p className="text-[10px] text-gray-400">Complete itinerary ready</p>
                </div>
              </div>
              <div className="float-card2 absolute -bottom-5 -left-2 z-20 bg-white rounded-2xl shadow-xl px-4 py-2.5 border border-gray-100 hidden md:block">
                <p className="text-[10px] text-gray-400 mb-0.5">Estimated Budget</p>
                <p className="text-lg font-bold text-emerald-600">₹18,500</p>
                <p className="text-[10px] text-gray-400">5 days · 2 people</p>
              </div>

              {/* Main preview card */}
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">🛕</span>
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">Varanasi · 3 Days</h3>
                        <p className="text-[10px] text-gray-400">Gandhinagar → Varanasi · Train · 2 People</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold bg-violet-100 text-violet-700 px-2.5 py-1 rounded-full">Spiritual</span>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-50">
                  {itineraryDays.map((d, i) => (
                    <button key={i} onClick={() => setActiveDay(i)}
                      className={`flex-1 py-2.5 text-xs font-semibold transition-all ${activeDay === i ? 'text-primary-700 border-b-2 border-primary-500 bg-primary-50/30' : 'text-gray-400 hover:text-gray-600'}`}>
                      {d.day}
                    </button>
                  ))}
                </div>

                <div className="p-5">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">{itineraryDays[activeDay].title}</p>
                  <div className="space-y-2">
                    {itineraryDays[activeDay].activities.map((act, i) => (
                      <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 hover:bg-primary-50/50 transition-colors cursor-default">
                        <div className="w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-[9px] font-bold flex-shrink-0">
                          {i + 1}
                        </div>
                        <span className="text-xs text-gray-700 flex-1">{act}</span>
                        <ChevronRight className="w-3 h-3 text-gray-300 flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {[{ l: '🏨 Stay', v: '₹3,200' }, { l: '🍽️ Food', v: '₹900' }, { l: '🎯 Acts', v: '₹400' }].map((b, i) => (
                      <div key={i} className="bg-gray-50 rounded-xl p-2 text-center">
                        <p className="text-[9px] text-gray-400">{b.l}</p>
                        <p className="text-xs font-bold text-gray-800">{b.v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DESTINATIONS MARQUEE ──────────────────────────────────── */}
      <section className="py-10 bg-white border-y border-gray-100 overflow-hidden">
        <p className="text-center text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mb-5">Popular Destinations</p>
        <div className="flex gap-4 marquee-track">
          {[...destinations, ...destinations].map((d, i) => (
            <div key={i} className="inline-flex items-center gap-2.5 bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 flex-shrink-0 hover:bg-primary-50 hover:border-primary-100 transition-colors cursor-default">
              <span className="text-xl">{d.img}</span>
              <div>
                <p className="text-sm font-semibold text-gray-800">{d.name}</p>
                <p className="text-[10px] text-gray-400">{d.tag} · {d.days}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary-600 font-bold text-[10px] uppercase tracking-[0.25em] mb-3">Simple Process</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900" style={{ letterSpacing: '-0.02em' }}>
              Three steps.<br />One perfect trip.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-[38%] right-[38%] h-px" style={{ background: 'linear-gradient(to right, #c7d2fe, #ddd6fe)' }} />
            {steps.map((s, i) => (
              <div key={i} className="text-center group relative">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg group-hover:scale-105 transition-transform bg-gradient-to-br ${s.color}`}>
                  {s.icon}
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────── */}
      <section className="py-24 px-4" style={{ background: '#f5f3ff' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary-600 font-bold text-[10px] uppercase tracking-[0.25em] mb-3">What You Get</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900" style={{ letterSpacing: '-0.02em' }}>
              Everything in one place
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white bg-gradient-to-br ${f.color}`}>{f.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-primary-600 font-bold text-[10px] uppercase tracking-[0.25em] mb-3">Travellers Love It</p>
            <h2 className="font-display text-4xl font-bold text-gray-900" style={{ letterSpacing: '-0.02em' }}>Real trips. Real stories.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex mb-3">{[...Array(t.stars)].map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, #6366f1, #8b5cf6)` }}>{t.name[0]}</div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">{t.name}</p>
                    <p className="text-[10px] text-gray-400">{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="py-24 px-4 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)' }}>
        <div className="absolute inset-0 pointer-events-none opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #818cf8, transparent 40%), radial-gradient(circle at 80% 50%, #a78bfa, transparent 40%)' }} />
        <div className="max-w-3xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2 mb-8">
            <Camera className="w-4 h-4 text-violet-300" />
            <span className="text-sm font-semibold text-violet-200">Join 10,000+ happy travellers</span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-5 leading-tight" style={{ letterSpacing: '-0.025em' }}>
            Your next adventure<br />
            <span style={{ background: 'linear-gradient(135deg, #a5b4fc, #e879f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              starts here.
            </span>
          </h2>
          <p className="text-indigo-300 text-lg mb-10">Free to use. No credit card required.</p>
          <Link to="/signup"
            className="inline-flex items-center gap-2.5 bg-white text-indigo-700 font-bold px-9 py-4 rounded-2xl hover:bg-indigo-50 transition-all shadow-2xl text-base">
            <Compass className="w-5 h-5" />
            Plan My Trip — It's Free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <footer className="bg-gray-950 py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-violet-600 rounded-lg flex items-center justify-center">
              <Compass className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-white text-lg">TripGenie</span>
          </div>
          <p className="text-sm text-gray-600">© {new Date().getFullYear()} TripGenie. All rights reserved.</p>
          <div className="flex items-center gap-5 text-sm text-gray-500">
            <Link to="/signup" className="hover:text-white transition-colors">Get Started</Link>
            <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}