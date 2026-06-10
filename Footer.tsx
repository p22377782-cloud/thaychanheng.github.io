import React from 'react';
import { Send, Facebook, Instagram, Youtube, Heart, Globe, Flame } from 'lucide-react';
import { WebConfig, Category } from '../types';

interface FooterProps {
  config: WebConfig;
  categories: Category[];
  onSelectCategory: (name: string) => void;
  onChangeView: (view: 'home' | 'blog' | 'about' | 'mission' | 'vision' | 'why' | 'contact' | 'admin') => void;
}

export function Footer({ config, categories, onSelectCategory, onChangeView }: FooterProps) {
  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = React.useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    try {
      setStatus('loading');
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.alreadySubscribed) {
        setStatus('success');
        setMessage('You are already subscribed to our newsletter! Thank you!');
      } else {
        setStatus('success');
        setEmail('');
        setMessage('Successfully subscribed! Get ready for beautiful travel notifications.');
      }
    } catch {
      setStatus('error');
      setMessage('Failed to subscribe. Please try again.');
    }
  };

  const getPrimaryText = () => {
    switch (config.primaryColor) {
      case 'sky-blue': return 'text-sky-400';
      case 'earth-clay': return 'text-amber-500';
      case 'forest-pine': return 'text-emerald-500';
      case 'sunset-rose': return 'text-rose-400';
      default: return 'text-sky-400';
    }
  };

  const getPrimaryBg = () => {
    switch (config.primaryColor) {
      case 'sky-blue': return 'bg-sky-600 hover:bg-sky-700';
      case 'earth-clay': return 'bg-amber-700 hover:bg-amber-800';
      case 'forest-pine': return 'bg-emerald-700 hover:bg-emerald-800';
      case 'sunset-rose': return 'bg-rose-600 hover:bg-rose-700';
      default: return 'bg-sky-600 hover:bg-sky-700';
    }
  };

  const KhmerLotusIcon = () => (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-amber-400 fill-amber-500/10 flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C11.5 6 9 8.5 6 9.5C9 10.5 10.5 13 11.5 17C12.5 13 14 10.5 17 9.5C14 8.5 12.5 6 12 2Z" fill="currentColor" stroke="currentColor" strokeWidth="1" />
      <path d="M12 11C11.7 13 10.5 14 9 14.5C10.5 15 11.2 16 11.5 17.5C11.8 16 12.5 15 14 14.5C12.5 14 12.3 13 12 11Z" fill="#FFF" opacity="0.8" />
    </svg>
  );

  return (
    <footer className="relative bg-[#060c09] text-gray-300 border-t-2 border-amber-500/60 overflow-hidden">
      {/* 1. Khmer Traditional "Prasat & Kbach" Architectural Roof Border */}
      <div className="relative w-full bg-gradient-to-b from-gray-950 to-[#060c09] py-3 border-b border-amber-500/10">
        <div className="max-w-7xl mx-auto flex justify-center px-4 relative z-10 -mt-2">
          <div className="w-full max-w-xl">
            <svg
              viewBox="0 0 600 110"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full drop-shadow-[0_-8px_20px_rgba(217,119,6,0.25)]"
            >
              <defs>
                <linearGradient id="khmerGold" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFF7D1" />
                  <stop offset="35%" stopColor="#DF9F28" />
                  <stop offset="70%" stopColor="#92610A" />
                  <stop offset="100%" stopColor="#FAD055" />
                </linearGradient>
                <linearGradient id="goldHollow" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#92610A" stopOpacity="0.1" />
                  <stop offset="50%" stopColor="#DF9F28" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#92610A" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              
              {/* Decorative base lines and curves */}
              <path d="M 0 95 Q 300 85 600 95" stroke="url(#goldHollow)" strokeWidth="1.2" />
              <path d="M 40 95 H 560" stroke="url(#khmerGold)" strokeWidth="1.5" strokeDasharray="4 4" />
              
              {/* Majestic traditional roof sweeping gables (Chovar/Naga finials) */}
              {/* Left Wing Sweep */}
              <path 
                d="M 300 95 L 190 95 Q 130 90 90 65 Q 70 50 55 25 Q 50 18 52 14 Q 56 12 62 25 Q 85 52 120 62 Q 165 72 230 75 L 300 78 Z" 
                fill="url(#khmerGold)" 
              />
              {/* Right Wing Sweep */}
              <path 
                d="M 300 95 L 410 95 Q 470 90 510 65 Q 530 50 545 25 Q 550 18 548 14 Q 544 12 538 25 Q 515 52 480 62 Q 435 72 370 75 L 300 78 Z" 
                fill="url(#khmerGold)" 
              />

              {/* Master Pediment triangular tiers of Cambodian Temple */}
              <path 
                d="M 300 25 L 200 72 L 210 82 L 300 42 L 390 82 L 400 72 Z" 
                fill="url(#khmerGold)" 
                opacity="0.95"
              />
              <path 
                d="M 300 45 L 235 75 L 242 82 L 300 55 L 358 82 L 365 75 Z" 
                fill="url(#khmerGold)" 
                opacity="0.85"
              />

              {/* Centered Sovereign Temple Spire (Prasat) */}
              {/* Base structure */}
              <rect x="282" y="70" width="36" height="25" rx="3" fill="url(#khmerGold)" stroke="#3e2402" strokeWidth="0.5" />
              <line x1="282" y1="78" x2="318" y2="78" stroke="#523103" strokeWidth="1.2" />
              <line x1="282" y1="86" x2="318" y2="86" stroke="#523103" strokeWidth="1.2" />
              
              {/* Sacred Golden Diamond Emblem in middle base */}
              <path d="M 300 73 L 306 82 L 300 91 L 294 82 Z" fill="#FFEFA1" />

              {/* Middle Section of Prasat */}
              <path d="M 286 70 L 290 50 H 310 L 314 70 Z" fill="url(#khmerGold)" />
              {/* Accent side hooks on middle section */}
              <path d="M 286 60 Q 281 58 286 54" stroke="url(#khmerGold)" strokeWidth="1.5" fill="none" />
              <path d="M 314 60 Q 319 58 314 54" stroke="url(#khmerGold)" strokeWidth="1.5" fill="none" />

              {/* Upper Section of Prasat */}
              <path d="M 292 50 L 295 32 H 305 L 308 50 Z" fill="url(#khmerGold)" />
              
              {/* Pinnacle needle */}
              <path d="M 297 32 L 300 5 L 303 32 Z" fill="url(#khmerGold)" />
              {/* Rings on top */}
              <circle cx="300" cy="25" r="4.5" fill="url(#khmerGold)" />
              <circle cx="300" cy="16" r="3" fill="url(#khmerGold)" />
              <circle cx="300" cy="9" r="1.5" fill="url(#khmerGold)" />

              {/* Left Companion Spire */}
              <path d="M 235 95 L 238 72 H 242 L 245 95 Z" fill="url(#khmerGold)" opacity="0.85" />
              <path d="M 238 72 L 240 60 L 242 72 Z" fill="url(#khmerGold)" opacity="0.85" />

              {/* Right Companion Spire */}
              <path d="M 355 95 L 358 72 H 362 L 365 95 Z" fill="url(#khmerGold)" opacity="0.85" />
              <path d="M 358 72 L 360 60 L 362 72 Z" fill="url(#khmerGold)" opacity="0.85" />

              {/* Dynamic glowing spark in middle temple center */}
              <circle cx="300" cy="58" r="2" fill="#FFECA1" className="animate-ping" />
            </svg>
          </div>
        </div>

        {/* Ambient gradient corners */}
        <div className="absolute inset-0 bg-radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops)) from-amber-500/5 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* 2. Main Footer Body with Khmer Ornament Touches */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-l-4 border-amber-500 pl-3">
              <span className="text-xl font-bold font-serif tracking-wider text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {config.siteName}
              </span>
            </div>
            <p className="text-sm text-gray-400 font-sans leading-relaxed">
              {config.description}
            </p>
            {/* Social Links with golden circles */}
            <div className="flex space-x-3 pt-3">
              {config.socialLinks.facebook && (
                <a href={config.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-gray-900/60 border border-amber-500/25 hover:border-amber-400 text-amber-400 hover:text-amber-300 hover:bg-amber-950/40 transition-all shadow-md">
                  <Facebook className="h-4.5 w-4.5" />
                </a>
              )}
              {config.socialLinks.instagram && (
                <a href={config.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-gray-900/60 border border-amber-500/25 hover:border-amber-400 text-amber-400 hover:text-amber-300 hover:bg-amber-950/40 transition-all shadow-md">
                  <Instagram className="h-4.5 w-4.5" />
                </a>
              )}
              {config.socialLinks.youtube && (
                <a href={config.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-gray-900/60 border border-amber-500/25 hover:border-amber-400 text-amber-400 hover:text-amber-300 hover:bg-amber-950/40 transition-all shadow-md">
                  <Youtube className="h-4.5 w-4.5" />
                </a>
              )}
              {config.socialLinks.tiktok && (
                <a href={config.socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-gray-900/60 border border-amber-500/25 hover:border-amber-400 text-amber-400 hover:text-amber-300 hover:bg-amber-950/40 transition-all font-bold text-xs flex items-center justify-center h-9 w-9 shadow-md">
                  <span>d</span>
                </a>
              )}
            </div>
          </div>

          {/* Quick Nav Categories */}
          <div>
            <h3 className="text-amber-400 font-serif font-semibold text-base tracking-wider mb-5 border-b border-amber-500/15 pb-2 flex items-center gap-2">
              <KhmerLotusIcon />
              <span>Explore Cambodia</span>
            </h3>
            <ul className="space-y-2.5 text-sm">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button 
                    onClick={() => {
                      onSelectCategory(cat.name);
                      onChangeView('blog');
                    }}
                    className="text-gray-400 hover:text-amber-300 hover:translate-x-1.5 transition-all cursor-pointer text-left flex items-center gap-1.5 duration-200"
                  >
                    <span className="text-amber-500/50">✦</span>
                    <span>{cat.name}</span>
                  </button>
                </li>
              ))}
              <li>
                <button 
                  onClick={() => onChangeView('blog')}
                  className="text-gray-400 hover:text-amber-300 hover:translate-x-1.5 transition-all cursor-pointer text-left flex items-center gap-1.5 duration-200"
                >
                  <span className="text-amber-500/50">✦</span>
                  <span>All Travel Logs</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Useful Navigation Links */}
          <div>
            <h3 className="text-amber-400 font-serif font-semibold text-base tracking-wider mb-5 border-b border-amber-500/15 pb-2 flex items-center gap-2">
              <KhmerLotusIcon />
              <span>Travel Planner</span>
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <button onClick={() => onChangeView('home')} className="hover:text-amber-300 hover:translate-x-1 transition-all duration-200 cursor-pointer text-left flex items-center gap-1.5">
                  <span className="text-amber-500/30">◇</span> Featured Slideshow
                </button>
              </li>
              <li>
                <button onClick={() => onChangeView('about')} className="hover:text-amber-300 hover:translate-x-1 transition-all duration-200 cursor-pointer text-left flex items-center gap-1.5">
                  <span className="text-amber-500/30">◇</span> About me
                </button>
              </li>
              <li>
                <button onClick={() => onChangeView('mission')} className="hover:text-amber-300 hover:translate-x-1 transition-all duration-200 cursor-pointer text-left flex items-center gap-1.5">
                  <span className="text-amber-500/30">◇</span> Our Mission
                </button>
              </li>
              <li>
                <button onClick={() => onChangeView('vision')} className="hover:text-amber-300 hover:translate-x-1 transition-all duration-200 cursor-pointer text-left flex items-center gap-1.5">
                  <span className="text-amber-500/30">◇</span> Our Vision
                </button>
              </li>
              <li>
                <button onClick={() => onChangeView('why')} className="hover:text-amber-300 hover:translate-x-1 transition-all duration-200 cursor-pointer text-left flex items-center gap-1.5">
                  <span className="text-amber-500/30">◇</span> Why Choose Us?
                </button>
              </li>
              <li>
                <button onClick={() => onChangeView('contact')} className="hover:text-amber-300 hover:translate-x-1 transition-all duration-200 cursor-pointer text-left flex items-center gap-1.5">
                  <span className="text-amber-500/30">◇</span> Contact Us
                </button>
              </li>
              <li>
                <button onClick={() => onChangeView('admin')} className="hover:text-amber-300 text-amber-500/90 font-medium hover:translate-x-1 transition-all duration-200 cursor-pointer flex items-center gap-1.5 text-left mt-2 pl-1">
                  <Flame className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
                  Admin CMS Module
                </button>
              </li>
            </ul>
          </div>

          {/* Premium Newsletter Box framed with elegant border */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0a1410] to-[#040806] border border-amber-500/15 relative overflow-hidden shadow-lg space-y-4">
            <div className="absolute top-0 right-0 p-1">
              <svg viewBox="0 0 100 100" className="h-10 w-10 text-amber-500/10 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M0,0 L100,0 L100,100 Z" />
              </svg>
            </div>
            
            <h3 className="text-amber-400 font-serif font-semibold text-base tracking-wider flex items-center gap-2">
              <KhmerLotusIcon />
              <span>Kingdom Logs</span>
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              Receive raw travel guides, secret Angkor temples, and local culinary lists right to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2 pt-1">
              <div className="flex relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your favorite email"
                  required
                  className="bg-gray-950 border border-amber-500/20 text-white rounded-l-xl px-3 py-2 text-xs w-full focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-sans"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="bg-amber-600 hover:bg-amber-700 text-slate-950 font-bold px-4 py-2 rounded-r-xl text-xs cursor-pointer transition-all shadow-md hover:scale-[1.02] active:scale-95 flex items-center justify-center"
                >
                  {status === 'loading' ? '⏳' : <Send className="h-3.5 w-3.5" />}
                </button>
              </div>
              {message && (
                <p className={`text-[11px] font-medium mt-1 ${status === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* 3. Divider & Copyright with subtle lotus details */}
        <div className="border-t border-amber-500/15 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p className="text-gray-400 font-sans">© {new Date().getFullYear()} Travel with Thaychanheng. All rights reserved.</p>
          
          <div className="flex items-center gap-1.5 mt-3 md:mt-0 text-amber-500/80 bg-amber-500/5 px-3.5 py-1.5 rounded-full border border-amber-500/10 shadow-sm font-serif">
            <span>Made with</span>
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500 animate-pulse" />
            <span>in the Royal Kingdom of Cambodia</span>
          </div>
        </div>
      </div>
    </footer>
  );

}
