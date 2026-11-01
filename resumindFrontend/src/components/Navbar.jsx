import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  FileSearch,
  PenTool,
  BarChart3,
  User,
  LogOut,
  Menu,
  X,
  History,
  FolderOpen,
  LayoutDashboard,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-blue-500/15 bg-space-950/85 backdrop-blur-xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Developer Attribution */}
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-electric-600 to-electric-800 p-0.5 flex items-center justify-center shadow-glass-glow group-hover:scale-105 transition-transform">
                  <div className="w-full h-full bg-space-900 rounded-[10px] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-electric-400 group-hover:text-white transition-colors" />
                  </div>
                </div>
                <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
                  Resumind <span className="text-electric-500 font-black text-[10px] uppercase px-1.5 py-0.5 rounded-md bg-electric-950/90 border border-electric-500/30">AI</span>
                </span>
              </Link>

              {/* Developer Attribution Link */}
              <a
                href="https://m-daniyal.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-white bg-space-900/90 hover:bg-space-850 px-2.5 py-1 rounded-full border border-blue-500/20 hover:border-blue-500/40 transition-all shadow-sm"
                title="Developed by Daniyal"
              >
                <span className="text-slate-500">By</span>
                <span className="font-semibold text-electric-400 hover:underline">Daniyal</span>
                <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
              </a>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive('/dashboard')
                        ? 'text-white bg-electric-600/25 border border-electric-500/40 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-space-850'
                    }`}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-electric-400" />
                    <span>Dashboard</span>
                  </Link>

                  <Link
                    to="/analyzer"
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive('/analyzer')
                        ? 'text-white bg-electric-600/25 border border-electric-500/40 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-space-850'
                    }`}
                  >
                    <FileSearch className="w-3.5 h-3.5 text-electric-400" />
                    <span>Analyzer</span>
                  </Link>

                  <Link
                    to="/builder"
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive('/builder')
                        ? 'text-white bg-electric-600/25 border border-electric-500/40 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-space-850'
                    }`}
                  >
                    <PenTool className="w-3.5 h-3.5 text-electric-400" />
                    <span>Builder</span>
                  </Link>

                  <Link
                    to="/resumes"
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive('/resumes')
                        ? 'text-white bg-electric-600/25 border border-electric-500/40 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-space-850'
                    }`}
                  >
                    <FolderOpen className="w-3.5 h-3.5 text-electric-400" />
                    <span>My Resumes</span>
                  </Link>

                  <Link
                    to="/analyses"
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive('/analyses')
                        ? 'text-white bg-electric-600/25 border border-electric-500/40 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-space-850'
                    }`}
                  >
                    <History className="w-3.5 h-3.5 text-electric-400" />
                    <span>History</span>
                  </Link>
                </>
              ) : (
                <>
                  <a
                    href="/#features"
                    className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-space-850 transition-colors"
                  >
                    Capabilities
                  </a>
                  <a
                    href="/#rubric"
                    className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-space-850 transition-colors"
                  >
                    Scoring Rubric
                  </a>
                  <a
                    href="/#templates"
                    className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-space-850 transition-colors"
                  >
                    Templates
                  </a>
                </>
              )}
            </nav>

            {/* Desktop Auth Controls */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <Link
                    to="/account"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-space-900 border border-blue-500/20 hover:border-blue-500/40 transition-all shadow-sm"
                  >
                    <div className="w-5 h-5 rounded-full bg-electric-600/30 text-electric-400 flex items-center justify-center font-bold text-[10px]">
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span>{user?.name || 'Account'}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 border border-transparent hover:border-rose-500/20 transition-all"
                    title="Sign out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-space-850 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-electric-600 hover:bg-electric-500 shadow-glass-glow hover:shadow-blue-glow transition-all"
                  >
                    <span>Get Started</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2.5 rounded-xl text-slate-300 hover:text-white bg-space-900 border border-blue-500/20 focus:outline-none"
                aria-label="Open mobile navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Modern Mobile Slide-Over Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop with blur */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-space-950/80 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-space-900 border-l border-blue-500/25 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-5 border-b border-space-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-electric-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-extrabold text-white text-base">Resumind AI</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white bg-space-850 hover:bg-space-800"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Profile Card (if authenticated) */}
              {isAuthenticated && (
                <div className="mt-5 p-3.5 rounded-xl bg-space-850 border border-blue-500/20 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-electric-600/30 text-electric-400 flex items-center justify-center font-bold text-sm">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-bold text-white truncate">{user?.name}</h4>
                    <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <div className="mt-6 space-y-1">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        isActive('/dashboard')
                          ? 'bg-electric-600 text-white shadow-sm'
                          : 'text-slate-300 hover:bg-space-800 hover:text-white'
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4 text-electric-400" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/analyzer"
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        isActive('/analyzer')
                          ? 'bg-electric-600 text-white shadow-sm'
                          : 'text-slate-300 hover:bg-space-800 hover:text-white'
                      }`}
                    >
                      <FileSearch className="w-4 h-4 text-electric-400" />
                      <span>Resume Analyzer</span>
                    </Link>
                    <Link
                      to="/builder"
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        isActive('/builder')
                          ? 'bg-electric-600 text-white shadow-sm'
                          : 'text-slate-300 hover:bg-space-800 hover:text-white'
                      }`}
                    >
                      <PenTool className="w-4 h-4 text-electric-400" />
                      <span>Resume Builder</span>
                    </Link>
                    <Link
                      to="/resumes"
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        isActive('/resumes')
                          ? 'bg-electric-600 text-white shadow-sm'
                          : 'text-slate-300 hover:bg-space-800 hover:text-white'
                      }`}
                    >
                      <FolderOpen className="w-4 h-4 text-electric-400" />
                      <span>My Resumes</span>
                    </Link>
                    <Link
                      to="/analyses"
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        isActive('/analyses')
                          ? 'bg-electric-600 text-white shadow-sm'
                          : 'text-slate-300 hover:bg-space-800 hover:text-white'
                      }`}
                    >
                      <History className="w-4 h-4 text-electric-400" />
                      <span>Analysis History</span>
                    </Link>
                    <Link
                      to="/account"
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        isActive('/account')
                          ? 'bg-electric-600 text-white shadow-sm'
                          : 'text-slate-300 hover:bg-space-800 hover:text-white'
                      }`}
                    >
                      <User className="w-4 h-4 text-electric-400" />
                      <span>Account Settings</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-space-800 hover:text-white"
                    >
                      <span>Home</span>
                    </Link>
                    <a
                      href="/#features"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-space-800 hover:text-white"
                    >
                      <span>Product Features</span>
                    </a>
                    <a
                      href="/#rubric"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-space-800 hover:text-white"
                    >
                      <span>Scoring Rubric</span>
                    </a>
                    <a
                      href="/#templates"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-space-800 hover:text-white"
                    >
                      <span>Templates</span>
                    </a>
                  </>
                )}
              </div>
            </div>

            {/* Drawer Footer & Developer Credit */}
            <div className="pt-6 border-t border-space-800 space-y-4">
              <a
                href="https://m-daniyal.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-space-850 border border-blue-500/20 text-xs text-slate-300 hover:text-white group"
              >
                <span>Developed by <strong className="text-electric-400">Daniyal</strong></span>
                <ExternalLink className="w-3.5 h-3.5 text-electric-400 group-hover:translate-x-0.5 transition-transform" />
              </a>

              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/login"
                    className="w-full text-center py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-space-800 hover:bg-space-700 border border-space-700"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="w-full text-center py-2.5 rounded-xl text-xs font-semibold text-white bg-electric-600 hover:bg-electric-500 shadow-glass-glow"
                  >
                    Get Started Free
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
