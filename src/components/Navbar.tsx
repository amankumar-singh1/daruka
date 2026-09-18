import React, { useState, useEffect } from 'react';
import { LayoutDashboard, User as UserIcon, Menu, X, MapPin, FolderKanban, BarChart3, Shield, Sparkles } from 'lucide-react';
import { User } from '../types';

export type PageTab = 'home' | 'map' | 'projects' | 'analytics' | 'admin';

interface NavbarProps {
  currentPage: PageTab;
  onSelectPage: (page: PageTab) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onOpenGetInvolved: () => void;
  customBrandLogoUrl?: string | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onSelectPage,
  currentUser,
  onOpenAuth,
  onOpenGetInvolved,
  customBrandLogoUrl,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { id: PageTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: null },
    { id: 'map', label: 'GIS Map', icon: <MapPin className="w-3.5 h-3.5" /> },
    { id: 'projects', label: 'Projects', icon: <FolderKanban className="w-3.5 h-3.5" /> },
    { id: 'analytics', label: 'Analytics & MRV', icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { id: 'admin', label: 'Admin Portal', icon: <Shield className="w-3.5 h-3.5" /> },
  ];

  return (
    <header
      id="main-nav"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-black/5'
          : 'bg-white/85 backdrop-blur-md border-b border-black/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        {/* Brand Logo - DARUKAA.EARTH */}
        <button
          onClick={() => onSelectPage('home')}
          className="flex items-center gap-2.5 group cursor-pointer text-left"
        >
          {customBrandLogoUrl ? (
            <img
              src={customBrandLogoUrl}
              alt="Custom Brand Logo"
              className="w-10 h-10 rounded-2xl object-cover shadow-md group-hover:scale-105 transition-transform border border-emerald-200"
            />
          ) : (
            <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <svg
                className="w-5 h-5 text-[#cce24b]"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
              </svg>
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
              DARUKAA<span className="text-emerald-700">.EARTH</span>
            </span>
            <span className="text-[9px] font-bold tracking-widest text-emerald-800 uppercase mt-0.5">
              Nature Intelligence
            </span>
          </div>
        </button>

        {/* 5 Main Page Navigation Links */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1.5 p-1.5 bg-slate-100/80 rounded-full border border-slate-200/80">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectPage(item.id)}
                className={`relative px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.id === 'admin' && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-extrabold ml-0.5">
                    Pro
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action CTA */}
        <div className="flex items-center gap-2.5">
          {/* User Auth trigger */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200/80 cursor-pointer"
            title={currentUser ? `Logged in as ${currentUser.name}` : 'Login / Register'}
          >
            {currentUser ? (
              <>
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-emerald-600"
                />
                <span className="hidden sm:inline max-w-[80px] truncate text-[11px] font-bold">
                  {currentUser.name}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </>
            ) : (
              <>
                <UserIcon className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-xs">Sign In</span>
              </>
            )}
          </button>

          {/* Primary "Get Involved" button */}
          <button
            onClick={onOpenGetInvolved}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-xs font-bold text-[#142119] bg-[#cce24b] hover:bg-[#bdd43e] shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            Get Involved
          </button>

          {/* Mobile menu hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-6 py-4 space-y-2 animate-fadeIn shadow-lg">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onSelectPage(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold flex items-center justify-between cursor-pointer ${
                currentPage === item.id
                  ? 'bg-emerald-50 text-emerald-900'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.id === 'admin' && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-extrabold">
                  Console
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
