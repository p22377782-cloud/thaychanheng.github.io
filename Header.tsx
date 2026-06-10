import React from 'react';
import { 
  Search, 
  Compass, 
  BookOpen, 
  Mail, 
  LayoutDashboard, 
  Menu, 
  X, 
  Globe,
  Info,
  Target,
  Eye,
  Award
} from 'lucide-react';
import { WebConfig } from '../types';

interface HeaderProps {
  config: WebConfig;
  currentView: 'home' | 'blog' | 'about' | 'mission' | 'vision' | 'why' | 'contact' | 'admin';
  onChangeView: (view: 'home' | 'blog' | 'about' | 'mission' | 'vision' | 'why' | 'contact' | 'admin') => void;
  onSearchChange: (val: string) => void;
  searchValue: string;
}

export function Header({ config, currentView, onChangeView, onSearchChange, searchValue }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Apply typography styles from config
  const getLogoFont = () => {
    if (config.fontHeadings === 'Playfair Display') return 'font-serif';
    if (config.fontHeadings === 'Space Grotesk') return 'font-grotesk';
    return 'font-sans';
  };

  const getPrimaryBg = () => {
    switch (config.primaryColor) {
      case 'sky-blue': return 'text-sky-600 hover:text-sky-800 focus:ring-sky-500';
      case 'earth-clay': return 'text-amber-700 hover:text-amber-900 focus:ring-amber-500';
      case 'forest-pine': return 'text-emerald-700 hover:text-emerald-900 focus:ring-emerald-500';
      case 'sunset-rose': return 'text-rose-600 hover:text-rose-800 focus:ring-rose-500';
      default: return 'text-sky-600 hover:text-sky-800 focus:ring-sky-500';
    }
  };

  const getActiveTabClass = (tab: string) => {
    const isCurrent = currentView === tab;
    return `inline-flex items-center px-3.5 py-2 rounded-lg text-xs lg:text-sm font-medium tracking-wide transition-all duration-300 cursor-pointer border hover:scale-105 active:scale-95 ${
      isCurrent 
        ? 'text-amber-800 bg-amber-500/10 border-amber-500/25 shadow-xs font-semibold' 
        : 'text-gray-600 border-transparent hover:text-amber-700 hover:bg-amber-50/40'
    }`;
  };

  return (
    <header className="sticky top-0 z-50 bg-[#faf8f5]/98 backdrop-blur-md shadow-xs border-b border-amber-500/15 relative">
      {/* 1. Royal Khmer Golden Top Line */}
      <div className="h-[4px] w-full bg-gradient-to-r from-amber-700 via-amber-400 to-amber-700 relative overflow-hidden" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 relative z-10">
          <div className="flex items-center">
            {/* Logo with custom sovereign Prasat Angkor temple vector */}
            <div 
              onClick={() => onChangeView('home')} 
              className="flex-shrink-0 flex items-center gap-3.5 cursor-pointer group pr-6 border-r border-amber-500/10 hover:scale-[1.03] active:scale-97 transition-all duration-300"
            >
              <div className="p-1.5 rounded-xl bg-amber-50 border border-amber-500/20 text-amber-600 group-hover:bg-amber-100/50 group-hover:text-amber-700 transition-all flex items-center justify-center shadow-xs">
                <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none" xmlns="http://www.w3.org/2000/svg">
                  {/* Highly polished stylized Khmer Angkor temple tower silhouette */}
                  <path d="M12 2C11.6 5 10 7 7.5 8C10 9 10.8 11 11.6 15C12.4 11 13.2 9 15.7 8C13.2 7 12.4 5 12 2Z" fill="#DF9F28" />
                  <path d="M12 7.5C11.8 9.2 11.2 10 10.3 10.4C11.2 10.8 11.6 11.2 11.8 12C12 11.2 12.4 10.8 13.3 10.4C12.4 10 12.2 9.2 12 7.5Z" fill="#FFEFA1" />
                  <path d="M7 15.5 H17 V17.5 H7 Z" fill="#92610A" />
                  <circle cx="12" cy="19" r="1.2" fill="#DF9F28" />
                </svg>
              </div>
              <span className="text-sm sm:text-base md:text-lg font-bold tracking-tight text-amber-950 font-serif leading-none group-hover:text-amber-700 transition-all duration-300">
                {config.siteName}
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex sm:ml-6 lg:ml-8 items-center gap-2.5">
              <span onClick={() => { onChangeView('home'); setIsMobileMenuOpen(false); }} className={getActiveTabClass('home')}>
                <Compass className={`h-3.5 w-3.5 mr-1.5 ${currentView === 'home' ? 'text-amber-600' : 'text-gray-400'}`} />
                <span>Home</span>
              </span>
              <span onClick={() => { onChangeView('blog'); setIsMobileMenuOpen(false); }} className={getActiveTabClass('blog')}>
                <BookOpen className={`h-3.5 w-3.5 mr-1.5 ${currentView === 'blog' ? 'text-amber-600' : 'text-gray-400'}`} />
                <span>Blog Page</span>
              </span>
              <span onClick={() => { onChangeView('about'); setIsMobileMenuOpen(false); }} className={getActiveTabClass('about')}>
                <Info className={`h-3.5 w-3.5 mr-1.5 ${currentView === 'about' ? 'text-amber-600' : 'text-gray-400'}`} />
                <span>About me</span>
              </span>
              <span onClick={() => { onChangeView('mission'); setIsMobileMenuOpen(false); }} className={getActiveTabClass('mission')}>
                <Target className={`h-3.5 w-3.5 mr-1.5 ${currentView === 'mission' ? 'text-amber-600' : 'text-gray-400'}`} />
                <span>Our Mission</span>
              </span>
              <span onClick={() => { onChangeView('vision'); setIsMobileMenuOpen(false); }} className={getActiveTabClass('vision')}>
                <Eye className={`h-3.5 w-3.5 mr-1.5 ${currentView === 'vision' ? 'text-amber-600' : 'text-gray-400'}`} />
                <span>Our Vision</span>
              </span>
              <span onClick={() => { onChangeView('why'); setIsMobileMenuOpen(false); }} className={getActiveTabClass('why')}>
                <Award className={`h-3.5 w-3.5 mr-1.5 ${currentView === 'why' ? 'text-amber-600' : 'text-gray-400'}`} />
                <span>Why Choose Us?</span>
              </span>
              <span onClick={() => { onChangeView('contact'); setIsMobileMenuOpen(false); }} className={getActiveTabClass('contact')}>
                <Mail className={`h-3.5 w-3.5 mr-1.5 ${currentView === 'contact' ? 'text-amber-600' : 'text-gray-400'}`} />
                <span>Contact Us</span>
              </span>
            </nav>
          </div>

          {/* Search bar and CMS Admin Button */}
          <div className="hidden lg:flex lg:items-center lg:gap-4.5">
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-amber-600/40" />
              </div>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  if (currentView !== 'blog' && e.target.value) {
                    onChangeView('blog');
                  }
                }}
                className="block w-44 xl:w-56 pl-10 pr-4 py-2 border border-amber-500/10 rounded-full bg-[#fcfbfa] text-xs lg:text-sm placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-amber-500/60 focus:border-amber-500/60 transition-all shadow-2xs"
                placeholder="Search travel posts..."
              />
            </div>

            {/* Admin Dashboard CTA with Khmer gold outline */}
            <button
              onClick={() => onChangeView('admin')}
              className={`px-4.5 py-2 rounded-lg cursor-pointer flex items-center gap-2 text-xs lg:text-sm font-medium border border-amber-500/20 bg-amber-50/45 text-amber-700 hover:bg-amber-100/50 hover:text-amber-800 hover:scale-105 active:scale-95 transition-all duration-300 shadow-xs`}
            >
              <LayoutDashboard className="h-4 w-4 text-amber-600" />
              <span>CMS Admin</span>
            </button>
          </div>

          {/* Quick Mobile trigger */}
          <div className="flex items-center lg:hidden gap-2">
            <button
              onClick={() => onChangeView('admin')}
              className="p-1.5 rounded-lg border border-amber-500/20 bg-amber-50/50 text-amber-600 hover:bg-amber-100 transition-colors"
              title="Admin Portal"
            >
              <LayoutDashboard className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-amber-700 hover:text-amber-900 hover:bg-amber-50/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Repeating Khmer Kbach Ornament Decorative Bottom Border Accent */}
      <div className="absolute bottom-0 inset-x-0 h-[5px] bg-[#faf8f5] overflow-hidden flex whitespace-nowrap opacity-60 pointer-events-none select-none z-0 border-t border-amber-500/5">
        {Array.from({ length: 50 }).map((_, i) => (
          <svg key={i} viewBox="0 0 40 10" className="h-5 w-10 text-amber-500/25 fill-none flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,10 Q10,0 20,10 Q30,0 40,10" stroke="currentColor" strokeWidth="1" />
            <circle cx="20" cy="5" r="0.8" fill="currentColor" />
          </svg>
        ))}
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#faf8f5]/98 border-b border-amber-500/15 py-3 px-4 space-y-3 relative z-40">
          <div className="relative mb-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-amber-650/40" />
            </div>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (currentView !== 'blog') onChangeView('blog');
              }}
              className="block w-full pl-9 pr-3 py-2 border border-amber-500/10 rounded-lg bg-[#fcfbfa] text-sm placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-amber-500/50"
              placeholder="Search travel posts..."
            />
          </div>
          
          <div className="flex flex-col gap-1.5 pb-2">
            <button
              onClick={() => { onChangeView('home'); setIsMobileMenuOpen(false); }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium transition-all ${currentView === 'home' ? 'bg-amber-55/10 text-amber-800 border border-amber-500/10 font-bold' : 'text-gray-650 hover:bg-amber-50/20'}`}
            >
              <Compass className="h-5 w-5 text-amber-600" />
              <span>Home Discovery</span>
            </button>
            <button
              onClick={() => { onChangeView('blog'); setIsMobileMenuOpen(false); }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium transition-all ${currentView === 'blog' ? 'bg-amber-55/10 text-amber-800 border border-amber-500/10 font-bold' : 'text-gray-650 hover:bg-amber-50/20'}`}
            >
              <BookOpen className="h-5 w-5 text-amber-600" />
              <span>Blog Page</span>
            </button>
            <button
              onClick={() => { onChangeView('about'); setIsMobileMenuOpen(false); }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium transition-all ${currentView === 'about' ? 'bg-amber-55/10 text-amber-800 border border-amber-500/10 font-bold' : 'text-gray-650 hover:bg-amber-50/20'}`}
            >
              <Info className="h-5 w-5 text-amber-600" />
              <span>About me</span>
            </button>
            <button
              onClick={() => { onChangeView('mission'); setIsMobileMenuOpen(false); }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium transition-all ${currentView === 'mission' ? 'bg-amber-55/10 text-amber-800 border border-amber-500/10 font-bold' : 'text-gray-650 hover:bg-amber-50/20'}`}
            >
              <Target className="h-5 w-5 text-amber-600" />
              <span>Our Mission</span>
            </button>
            <button
              onClick={() => { onChangeView('vision'); setIsMobileMenuOpen(false); }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium transition-all ${currentView === 'vision' ? 'bg-amber-55/10 text-amber-800 border border-amber-500/10 font-bold' : 'text-gray-650 hover:bg-amber-50/20'}`}
            >
              <Eye className="h-5 w-5 text-amber-600" />
              <span>Our Vision</span>
            </button>
            <button
              onClick={() => { onChangeView('why'); setIsMobileMenuOpen(false); }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium transition-all ${currentView === 'why' ? 'bg-amber-55/10 text-amber-800 border border-amber-500/10 font-bold' : 'text-gray-650 hover:bg-amber-50/20'}`}
            >
              <Award className="h-5 w-5 text-amber-600" />
              <span>Why Choose Us?</span>
            </button>
            <button
              onClick={() => { onChangeView('contact'); setIsMobileMenuOpen(false); }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium transition-all ${currentView === 'contact' ? 'bg-amber-55/10 text-amber-800 border border-amber-500/10 font-bold' : 'text-gray-650 hover:bg-amber-50/20'}`}
            >
              <Mail className="h-5 w-5 text-amber-600" />
              <span>Contact Us</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
