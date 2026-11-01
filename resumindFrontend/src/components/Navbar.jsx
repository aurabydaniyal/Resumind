import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ElectricLogo from './react-bits/ElectricLogo';
import GooeyNav from './react-bits/GooeyNav';
import BranchedMenu from './react-bits/BranchedMenu';
import GlassSurface from './react-bits/GlassSurface';
import WeeklyLimitModal from './WeeklyLimitModal';
import {
  FileSearch,
  PenTool,
  LogOut,
  History,
  FolderOpen,
  LayoutDashboard,
  ExternalLink,
  ChevronRight,
  GitBranch
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [limitModalType, setLimitModalType] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close branched sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Lock body scroll when branched sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const gooeyNavItems = isAuthenticated
    ? [
        { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Analyzer', href: '/analyzer', icon: FileSearch },
        { label: 'Builder', href: '/builder', icon: PenTool },
        { label: 'My Resumes', href: '/resumes', icon: FolderOpen },
        { label: 'History', href: '/analyses', icon: History }
      ]
    : [
        { label: 'Capabilities', href: '/#features' },
        { label: 'Scoring Rubric', href: '/#rubric' },
        { label: 'Templates', href: '/#templates' }
      ];

  return (
    <>
      <WeeklyLimitModal
        open={Boolean(limitModalType)}
        onClose={() => setLimitModalType(null)}
        limitType={limitModalType || 'resume'}
        quota={user?.weeklyQuota}
      />

      <header className="sticky top-0 z-40 w-full border-b border-[#33415c]/55 bg-[#001233]/80 backdrop-blur-xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            {/* Brand Logo (ElectricLogo) & Simple Resumind AI Typography */}
            <div className="flex items-center gap-3 shrink-0">
              <Link to="/" className="flex items-center gap-2.5 group">
                <ElectricLogo size={38} />
                <span className="font-extrabold text-lg sm:text-xl tracking-tight flex items-center gap-1">
                  <span className="text-white">Resumind</span>
                  <span className="text-[#0466c8]">AI</span>
                </span>
              </Link>

              {/* Developer Attribution Link */}
              <a
                href="https://m-daniyal.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:inline-flex items-center gap-1.5 text-[11px] text-[#979dac] hover:text-white bg-[#001845]/90 hover:bg-[#002855] px-2.5 py-1 rounded-full border border-[#33415c]/60 hover:border-[#0466c8]/60 transition-all shadow-sm"
                title="Developed by Daniyal"
              >
                <span className="text-[#7d8597]">By</span>
                <span className="font-semibold text-[#3b9eff] hover:underline">Daniyal</span>
                <ExternalLink className="w-2.5 h-2.5 text-[#7d8597]" />
              </a>
            </div>

            {/* Desktop Navigation Links — @react-bits/GooeyNav-JS-CSS */}
            <nav className="hidden md:flex items-center justify-center">
              <GooeyNav items={gooeyNavItems} />
            </nav>

            {/* Right Controls + BranchedMenu Sidebar Trigger */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              {isAuthenticated ? (
                <div className="hidden md:flex items-center gap-2.5">
                  <GlassSurface
                    as={Link}
                    to="/account"
                    borderRadius={12}
                    interactive
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-white"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#0466c8]/40 text-white flex items-center justify-center font-bold text-[10px]">
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="max-w-[110px] truncate">{user?.name || 'Account'}</span>
                  </GlassSurface>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-[#979dac] hover:text-rose-300 hover:bg-rose-950/30 border border-transparent hover:border-rose-500/30 transition-all"
                    title="Sign out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden xl:inline">Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#979dac] hover:text-white hover:bg-[#002855]/70 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white btn-3d"
                  >
                    <span>Get Started</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}

              {/* BranchedMenu Sidebar Trigger Button (Visible on both Mobile & Desktop) */}
              <GlassSurface
                as="button"
                type="button"
                borderRadius={12}
                interactive
                onClick={() => setSidebarOpen(true)}
                className="h-9 px-3 text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer"
                aria-label="Open branched navigation sidebar"
                title="Open Branched Sidebar Menu"
              >
                <GitBranch className="w-4 h-4 text-[#3b9eff]" />
                <span className="hidden sm:inline">Menu</span>
              </GlassSurface>
            </div>
          </div>
        </div>
      </header>

      {/* @react-bits/BranchedMenu-JS-CSS Sidebar */}
      <BranchedMenu
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={handleLogout}
        onTriggerLimitModal={(type) => setLimitModalType(type)}
      />
    </>
  );
}
