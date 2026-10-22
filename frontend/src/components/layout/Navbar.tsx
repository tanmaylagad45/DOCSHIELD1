import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  UploadCloud, 
  Search,
  Globe,
  User,
  RotateCcw,
  FlaskConical,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onUploadClick: () => void;
  isDemoMode?: boolean;
  onLoadDemoFixtures?: () => void;
  onClearData?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onUploadClick,
  isDemoMode = false,
  onLoadDemoFixtures,
  onClearData
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    await logout();
    navigate('/login', { replace: true });
  };

  // Derive initials
  const getInitials = () => {
    if (user?.full_name) {
      const parts = user.full_name.trim().split(/\s+/);
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return parts[0].slice(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return 'OP';
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors duration-200">
      <div className="flex items-center justify-between px-4 sm:px-6 h-16">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-cyan-400 text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-950 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  DocShield
                </span>
                <span className="text-[10px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                  Workspace
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 -mt-0.5 font-medium">
                Document Authenticity & Compliance
              </p>
            </div>
          </Link>
        </div>

        {/* Global Search */}
        <div className="hidden md:flex items-center gap-3 flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search repository by filename, ID, or SHA-256..."
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500/40 transition-all"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Development Fixture Sandbox Controls */}
          {isDemoMode ? (
            <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-300">
              <FlaskConical className="w-3.5 h-3.5 text-amber-500" />
              <span>Demo Fixtures Active</span>
              {onClearData && (
                <button
                  onClick={onClearData}
                  className="ml-1 inline-flex items-center gap-1 font-semibold underline hover:text-amber-900 dark:hover:text-amber-100 cursor-pointer"
                  title="Reset to empty baseline"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          ) : (
            onLoadDemoFixtures && (
              <button
                onClick={onLoadDemoFixtures}
                className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors border border-transparent hover:border-slate-200 dark:border-slate-800 cursor-pointer"
                title="Load optional sample specimens for development testing"
              >
                <FlaskConical className="w-3 h-3 text-sky-500" />
                <span>Load Test Fixtures</span>
              </button>
            )
          )}

          {/* Public Landing Link */}
          <Link
            to="/"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            title="Go to Public 3D Landing Page"
          >
            <Globe className="w-3.5 h-3.5 text-sky-500" />
            <span>Public Site</span>
          </Link>

          {/* Upload Button */}
          <button
            onClick={onUploadClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white text-xs font-semibold shadow-sm shadow-sky-500/25 hover:shadow-md hover:shadow-sky-500/35 transition-all duration-150 cursor-pointer active:scale-95"
          >
            <UploadCloud className="w-4 h-4" />
            <span className="hidden sm:inline">Upload Document</span>
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Profile & Logout Menu */}
          <div className="relative pl-2 border-l border-slate-200 dark:border-slate-800" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer group"
              aria-label="User account menu"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500/20 to-indigo-500/20 border border-sky-500/30 text-sky-600 dark:text-sky-400 flex items-center justify-center text-xs font-bold shadow-xs">
                {user ? getInitials() : <User className="w-4 h-4" />}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-transform duration-150" />
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800/80">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Signed in as
                  </p>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate mt-0.5">
                    {user?.full_name || 'DocShield Operator'}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
                    {user?.email || 'operator@docshield.ai'}
                  </p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 uppercase">
                      {user?.role || 'OPERATOR'}
                    </span>
                    <span className="text-[10px] text-emerald-500 font-medium">Session Active</span>
                  </div>
                </div>

                <div className="py-1">
                  <Link
                    to="/settings"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Account Settings</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer text-left font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
