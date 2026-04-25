import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, LayoutDashboard, Plus, Menu, X, Compass, User, Edit3, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout, isAuthenticated, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [saving, setSaving] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleProfileOpen = () => {
    setProfileName(user?.name || '');
    setShowProfile(true);
  };

  const handleProfileSave = async () => {
    const trimmed = profileName.trim();
    if (!trimmed) return toast.error('Name cannot be empty');
    if (trimmed === user?.name) { setShowProfile(false); return; }
    setSaving(true);
    try {
      const token = localStorage.getItem('wanderai_token');
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
      setUser(data.user);
      setProfileName(data.user.name);
      toast.success('Profile updated! ✅');
      setShowProfile(false);
    } catch (err) {
      console.error('Profile save error:', err.message);
      toast.error(err.message || 'Failed to update profile.');
    } finally { setSaving(false); }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileOpen
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-gray-900">
                Trip<span className="text-primary-600">Genie</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  <NavLink to="/dashboard" active={isActive('/dashboard')} icon={<LayoutDashboard className="w-4 h-4" />}>
                    Dashboard
                  </NavLink>
                  <NavLink to="/plan" active={isActive('/plan')} icon={<Plus className="w-4 h-4" />}>
                    Plan Trip
                  </NavLink>

                  <div className="w-px h-6 bg-gray-200 mx-2" />

                  {/* Clickable User Profile */}
                  <div className="relative" ref={profileRef}>
                    <button
                      onClick={handleProfileOpen}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100 hover:bg-primary-50 hover:border-primary-200 transition-all group"
                    >
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-semibold">
                        {user?.name?.[0]?.toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-primary-700">{user?.name?.split(' ')[0]}</span>
                      <Edit3 className="w-3 h-3 text-gray-400 group-hover:text-primary-500" />
                    </button>
                  </div>

                  <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 px-3 py-2 rounded-lg hover:bg-red-50 transition-all">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all">
                    Sign In
                  </Link>
                  <Link to="/signup" className="btn-primary text-sm">
                    Get Started Free
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1 animate-slide-up">
            {isAuthenticated ? (
              <>
                {/* Mobile profile row — clickable */}
                <button
                  onClick={handleProfileOpen}
                  className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-3 hover:bg-primary-50 transition-all group"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <Edit3 className="w-4 h-4 text-gray-400 group-hover:text-primary-500" />
                </button>
                <MobileNavLink to="/dashboard" icon={<LayoutDashboard className="w-4 h-4" />}>Dashboard</MobileNavLink>
                <MobileNavLink to="/plan" icon={<Plus className="w-4 h-4" />}>Plan New Trip</MobileNavLink>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all text-sm font-medium">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <MobileNavLink to="/login">Sign In</MobileNavLink>
                <Link to="/signup" className="block w-full btn-primary text-center text-sm mt-2">Get Started Free</Link>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Profile Edit Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
          onMouseDown={() => setShowProfile(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl"
            onMouseDown={e => e.stopPropagation()}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-primary-600" /> My Profile
              </h3>
              <button onClick={() => setShowProfile(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex justify-center mb-5">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg">
                <span className="text-3xl font-bold text-white">{(profileName || user?.name || '?')[0].toUpperCase()}</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Full Name</label>
              <input
                type="text"
                value={profileName}
                onChange={e => setProfileName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleProfileSave()}
                placeholder="Enter your name"
                className="form-input w-full"
                autoFocus
              />
            </div>

            <div className="mb-5">
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Email Address</label>
              <input type="email" value={user?.email || ''} disabled
                className="form-input w-full bg-gray-50 text-gray-400 cursor-not-allowed" />
              <p className="text-[10px] text-gray-400 mt-1">Email cannot be changed</p>
            </div>

            <button
              type="button"
              onMouseDown={e => { e.stopPropagation(); e.preventDefault(); }}
              onClick={(e) => { e.stopPropagation(); handleProfileSave(); }}
              disabled={saving}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving
                ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Saving…</>
                : <><CheckCircle className="w-4 h-4" />Save Changes</>
              }
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const NavLink = ({ to, active, icon, children }) => (
  <Link to={to} className={`flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg transition-all ${
    active ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
  }`}>
    {icon}{children}
  </Link>
);

const MobileNavLink = ({ to, icon, children }) => (
  <Link to={to} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-all text-sm font-medium">
    {icon}{children}
  </Link>
);