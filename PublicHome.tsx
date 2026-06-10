import React from 'react';
import { BlogPost, Category, WebConfig } from '../types';
import { motion } from 'motion/react';

// Character-by-character typing typewriter component
function Typewriter({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = React.useState('');
  
  React.useEffect(() => {
    setDisplayedText('');
    let currentIdx = 0;
    let accumulated = '';
    const interval = setInterval(() => {
      if (currentIdx < text.length) {
        accumulated += text.charAt(currentIdx);
        setDisplayedText(accumulated);
        currentIdx++;
      } else {
        clearInterval(interval);
      }
    }, 55);
    
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span className="relative">
      <span>{displayedText}</span>
      <span className="inline-block w-[3px] h-[0.9em] bg-amber-400 ml-1.5 align-middle animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.85)]" />
    </span>
  );
}

import { ArrowRight, Calendar, User, Eye, MapPin, Compass, BookOpen, Utensils, Award, Search, Filter, Info, Sparkles, Phone, Mail, DollarSign } from 'lucide-react';
import { CAMBODIA_PROVINCES, Province } from '../data/provinces';
import { AboutMe, OurMission, OurVision, WhyChooseUs, ContactUs } from './AboutSections';
import angkorWatCustom from '../assets/images/angkor_wat_custom_1780726060601.png';
import ratanakiriProvinceCustom from '../assets/images/ratanakiri_province_1780726076105.png';
import kampotProvinceCustom from '../assets/images/kampot_province_1780726089419.png';
import preahSihanoukCustom from '../assets/images/preah_sihanouk_1780726105713.png';
import royalPalacePhnomPenhCustom from '../assets/images/royal_palace_skyline_phnom_penh_1781074104782.png';

interface PublicHomeProps {
  posts: BlogPost[];
  categories: Category[];
  config: WebConfig;
  onSelectPost: (post: BlogPost) => void;
  onSelectCategory: (name: string) => void;
  onChangeView: (view: 'home' | 'blog' | 'about' | 'mission' | 'vision' | 'why' | 'contact' | 'admin') => void;
  activeSection?: 'home' | 'blog' | 'about' | 'mission' | 'vision' | 'why' | 'contact' | 'admin';
}

export function PublicHome({ posts, categories, config, onSelectPost, onSelectCategory, onChangeView, activeSection }: PublicHomeProps) {
  React.useEffect(() => {
    if (activeSection === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (activeSection) {
      const sectionMap: Record<string, string> = {
        about: 'about-me-section',
        mission: 'our-mission-section',
        vision: 'our-vision-section',
        why: 'why-choose-us-section',
        contact: 'contact-us-section'
      };
      const elementId = sectionMap[activeSection];
      if (elementId) {
        const timer = setTimeout(() => {
          const element = document.getElementById(elementId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 120);
        return () => clearTimeout(timer);
      }
    }
  }, [activeSection]);

  const publishedPosts = posts.filter(p => p.state === 'published');
  const featuredPost = publishedPosts[0] || null;
  const recentPosts = publishedPosts.slice(1, 4);

  // Mouse coordinates state for immersive 3D parallax effect
  const [mouseCoords, setMouseCoords] = React.useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { width, height, left, top } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5; // range [-0.5, 0.5]
    const y = (e.clientY - top) / height - 0.5; // range [-0.5, 0.5]
    setMouseCoords({ x, y });
  };
  const handleMouseLeave = () => {
    setMouseCoords({ x: 0, y: 0 });
  };

  // Provinces explore states
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedRegion, setSelectedRegion] = React.useState<'All' | 'Plain' | 'Coastal' | 'Plateau/Mountain' | 'Mekong'>('All');
  const [activeProvince, setActiveProvince] = React.useState<Province | null>(null);

  // Styled helper for config font pairings
  const getHeadingFont = () => {
    if (config.fontHeadings === 'Playfair Display') return 'font-serif';
    if (config.fontHeadings === 'Space Grotesk') return 'font-grotesk';
    return 'font-sans';
  };

  const getPrimaryText = () => {
    switch (config.primaryColor) {
      case 'sky-blue': return 'text-sky-600 hover:text-sky-800';
      case 'earth-clay': return 'text-amber-700 hover:text-amber-900';
      case 'forest-pine': return 'text-emerald-700 hover:text-emerald-900';
      case 'sunset-rose': return 'text-rose-600 hover:text-rose-800';
      default: return 'text-sky-600 hover:text-sky-800';
    }
  };

  const getPrimaryBg = () => {
    switch (config.primaryColor) {
      case 'sky-blue': return 'bg-sky-600 hover:bg-sky-700 focus:ring-sky-500';
      case 'earth-clay': return 'bg-amber-700 hover:bg-amber-800 focus:ring-amber-500';
      case 'forest-pine': return 'bg-emerald-700 hover:bg-emerald-800 focus:ring-emerald-500';
      case 'sunset-rose': return 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500';
      default: return 'bg-sky-600 hover:bg-sky-700 focus:ring-sky-500';
    }
  };

  const getPrimaryBadge = () => {
    switch (config.primaryColor) {
      case 'sky-blue': return 'bg-sky-50 text-sky-700 border-sky-100';
      case 'earth-clay': return 'bg-amber-50 text-amber-800 border-amber-100';
      case 'forest-pine': return 'bg-emerald-50 text-emerald-800 border-emerald-100';
      case 'sunset-rose': return 'bg-rose-50 text-rose-700 border-rose-100';
      default: return 'bg-sky-50 text-sky-750 border-sky-100';
    }
  };

  // Pre-seed some iconic Cambodian destinations details for visual section
  const highlights = [
    { name: 'Angkor Wat (Siem Reap)', image: angkorWatCustom, desc: 'The architectural peak of ancient Khmer civilizations, surrounded by deep scenic forests.', route: 'Destinations' },
    { name: 'Ratanakiri Province', image: ratanakiriProvinceCustom, desc: 'Breathtaking volcanic crater lakes, majestic cascading waterfalls, and dense native forests.', route: 'Destinations' },
    { name: 'Kampot Province', image: kampotProvinceCustom, desc: 'A peaceful riverside town famous for world-class pepper farms and French colonial architecture.', route: 'Destinations' },
    { name: 'Preah Sihanouk', image: preahSihanoukCustom, desc: 'Pristine turquoise lagoons and powdery white sand coastlines in southern Cambodia.', route: 'Destinations' },
    { name: 'Royal Palace (Phnom Penh)', image: royalPalacePhnomPenhCustom, desc: 'Breathtaking golden-roof architectural structures set upon the grand Mekong river banks in the middle of Phnom Penh.', route: 'Culture' }
  ];

  const filteredProvinces = CAMBODIA_PROVINCES.filter(prov => {
    const matchesSearch = prov.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prov.capital.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prov.attraction.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'All' || prov.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="space-y-16 pb-12">
      {/* 1. HERO SLIDESHOW / BANNER */}
      {featuredPost && (
        <section 
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative overflow-hidden bg-zinc-900 rounded-2xl md:mx-4 lg:mx-8 shadow-lg group/hero cursor-default select-none"
        >
          {/* Angkor Wat background image with Ken Burns + Mouse Parallax "moving effect" */}
          <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden scale-105">
            <motion.div 
              className="absolute -inset-8 w-[calc(100%+4rem)] h-[calc(100%+4rem)]"
              animate={{
                x: mouseCoords.x * -24,
                y: mouseCoords.y * -24,
              }}
              transition={{ type: 'spring', damping: 22, stiffness: 85 }}
            >
              <motion.img 
                src={angkorWatCustom} 
                alt="Angkor Wat, Siem Reap, Cambodia" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center brightness-[0.34] saturate-[1.12]" 
                animate={{
                  scale: [1, 1.05, 1.02, 1.06, 1],
                }}
                transition={{
                  duration: 25,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "mirror"
                }}
              />
            </motion.div>
            {/* Gradient overlays designed specifically to fit the text overlay cleanly */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#030604]/90 via-black/55 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020503] via-transparent to-black/35 z-10" />
          </div>

          <motion.div 
            className="relative z-20 max-w-4xl mx-auto px-6 py-20 md:py-32 flex flex-col items-start gap-4 text-white"
            animate={{
              x: mouseCoords.x * 12,
              y: mouseCoords.y * 12,
            }}
            transition={{ type: 'spring', damping: 25, stiffness: 95 }}
          >
            <motion.span 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase shadow-sm border ${getPrimaryBadge()}`}
            >
              Featured Travel Spot
            </motion.span>
            
            {/* Typing animated Heading */}
            <h1 className={`text-3xl md:text-5xl font-bold tracking-tight leading-tight drop-shadow-md min-h-[4.5rem] md:min-h-[7.5rem] text-amber-100 ${getHeadingFont()}`}>
              <Typewriter text={featuredPost.title} />
            </h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-gray-200 text-sm md:text-base max-w-2xl leading-relaxed drop-shadow-xs font-sans"
            >
              {featuredPost.summary}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-wrap items-center gap-4 text-xs text-gray-300 mt-2 font-mono drop-shadow-sm border-t border-white/5 pt-3 w-full max-w-md"
            >
              <span className="flex items-center gap-1">
                <User className="h-3.5 w-3.5 text-amber-400" />
                {featuredPost.author.name}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-amber-400" />
                {featuredPost.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5 text-amber-400" />
                {featuredPost.viewCount} views
              </span>
            </motion.div>
            
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5, type: 'spring' }}
              onClick={() => onSelectPost(featuredPost)}
              className={`mt-4 px-6 py-3 text-slate-900 bg-amber-500 hover:bg-amber-600 font-bold rounded-xl inline-flex items-center gap-2 cursor-pointer transition-all shadow-md duration-350 hover:shadow-amber-500/10 hover:translate-x-1.5`}
            >
              <span>Explore This Story</span>
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </motion.div>
        </section>
      )}

      {/* 2. HIGHLIGHTED DESTINATIONS IMAGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 mb-8">
          <div>
            <h2 className={`text-2xl md:text-3xl font-bold text-gray-900 tracking-tight ${getHeadingFont()}`}>
              Uncover Beautiful Cambodia
            </h2>
            <p className="text-gray-500 text-sm mt-1 max-w-xl">
              From majestic ancient stone palaces to peaceful colonial river towns, choose your magical starting point.
            </p>
          </div>
          <button 
            onClick={() => onChangeView('blog')} 
            className={`inline-flex items-center gap-1 text-sm font-semibold transition-all cursor-pointer ${getPrimaryText()}`}
          >
            <span>View All Spots</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {highlights.map((hl, i) => (
            <div 
              key={i} 
              onClick={() => {
                onSelectCategory(hl.route);
                onChangeView('blog');
              }}
              className="group cursor-pointer bg-white rounded-xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all flex flex-col"
            >
              <div className="relative h-48 overflow-hidden bg-black flex items-center justify-center">
                {hl.image ? (
                  <img 
                    src={hl.image} 
                    alt={hl.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <img 
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" 
                    alt={hl.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover bg-black"
                  />
                )}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-xs font-medium text-gray-800 flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-sky-600" />
                  <span>Cambodia</span>
                </div>
              </div>
              <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-sky-600 transition-colors text-base">
                    {hl.name}
                  </h3>
                  <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                    {hl.desc}
                  </p>
                </div>
                <div className="text-xs font-semibold text-sky-600 mt-4 inline-flex items-center gap-1 group-hover:translate-x-1 transition-all">
                  <span>Explore Category</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2.1 ABOUT ME SECTION */}
      <section id="about-me-section" className="scroll-mt-20">
        <AboutMe config={config} />
      </section>

      {/* 2.2 OUR MISSION SECTION */}
      <section id="our-mission-section" className="scroll-mt-20">
        <OurMission config={config} />
      </section>

      {/* 2.3 OUR VISION SECTION */}
      <section id="our-vision-section" className="scroll-mt-20">
        <OurVision config={config} />
      </section>

      {/* 2.4 WHY CHOOSE US SECTION */}
      <section id="why-choose-us-section" className="scroll-mt-20">
        <WhyChooseUs config={config} />
      </section>

      {/* 2.5 ALL 25 CAMBODIA PROVINCES DIRECTORY */}
      <section id="cambodia-provinces-directory" className="bg-zinc-50 border-y border-gray-150 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-semibold tracking-wider text-sky-600 uppercase bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
              Interactive Explorer
            </span>
            <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mt-3 ${getHeadingFont()}`}>
              Explore All 25 Provinces of Cambodia
            </h2>
            <p className="text-gray-500 text-sm mt-3 leading-relaxed">
              Find detailed travel profiles, key regional landmarks, administration capitals, and iconic attractions for every single province across the kingdom.
            </p>

            {/* Interactive Filters and Search controls */}
            <div id="provinces-control-bar" className="mt-8 flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-3 rounded-2xl shadow-xs border border-gray-150">
              <div className="relative w-full md:max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="province-search-input"
                  type="text"
                  placeholder="Search province, capital, or attraction..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none text-gray-800"
                />
              </div>

              {/* Region Selectors */}
              <div id="province-region-filters" className="flex flex-wrap gap-1.5 justify-center">
                {(['All', 'Plain', 'Coastal', 'Plateau/Mountain', 'Mekong'] as const).map((r) => {
                  const label = r === 'All' ? 'All Region'
                              : r === 'Plain' ? 'Plainlands'
                              : r === 'Coastal' ? 'Coastal'
                              : r === 'Plateau/Mountain' ? 'Highlands'
                              : 'Mekong Basin';
                  return (
                    <button
                      key={r}
                      onClick={() => setSelectedRegion(r)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold select-none transition-all cursor-pointer ${
                        selectedRegion === r
                          ? 'bg-sky-600 text-white shadow-xs'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Grid Layout of Provinces */}
          <div id="provinces-bento-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProvinces.map((prov) => (
              <div
                key={prov.id}
                onClick={() => setActiveProvince(prov)}
                className="group cursor-pointer bg-white rounded-xl overflow-hidden border border-gray-150/60 shadow-xs hover:shadow-md hover:border-sky-350 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-40 overflow-hidden bg-gray-900">
                    <img
                      src={prov.image}
                      alt={prov.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-xs text-[10px] font-mono text-white px-2 py-0.5 rounded-md">
                      {prov.region === 'Plain' ? 'Plainlands'
                       : prov.region === 'Coastal' ? 'Coastal'
                       : prov.region === 'Plateau/Mountain' ? 'Highland'
                       : 'Mekong'}
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-1 text-[11px] font-mono text-sky-600 uppercase tracking-widest font-semibold">
                      <MapPin className="h-3 w-3" />
                      <span>{prov.capital}</span>
                    </div>
                    <h3 className="font-bold text-gray-950 text-base group-hover:text-sky-600 transition-colors">
                      {prov.name}
                    </h3>
                    <p className="text-gray-550 text-xs line-clamp-2 leading-relaxed">
                      {prov.description}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-1.5 border-t border-gray-50 flex items-center justify-between text-xs font-medium text-gray-600">
                  <span className="text-gray-400 font-mono text-[10px] truncate max-w-[150px]">
                     Goal: <span className="text-gray-700 font-sans font-semibold">{prov.attraction}</span>
                  </span>
                  <span className="text-sky-600 text-xs font-semibold inline-flex items-center gap-1 group-hover:translate-x-1 transition-all">
                    Explore <Info className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            ))}

            {filteredProvinces.length === 0 && (
              <div className="col-span-full bg-white p-12 rounded-xl text-center border border-gray-150">
                <Compass className="h-12 w-12 text-gray-300 mx-auto mb-3 animate-pulse" />
                <p className="text-gray-800 font-semibold">No Cambodia provinces matched your query.</p>
                <p className="text-gray-400 text-xs mt-1">Try searching for other keywords, or clear characters to list all 25 provinces.</p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedRegion('All'); }}
                  className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg text-xs cursor-pointer transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2.6 PROVINCE EXPANDED DETAIL DIALOG OVERLAY */}
      {activeProvince && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200">
            {/* Dark image header banner */}
            <div className="relative h-64 bg-gray-900">
              <img
                src={activeProvince.image}
                alt={activeProvince.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex flex-col justify-end p-6">
                <span className="text-xs text-sky-300 font-semibold font-mono tracking-widest uppercase">
                  {activeProvince.region === 'Plain' ? 'Plainlands Plain'
                   : activeProvince.region === 'Coastal' ? 'Coastal Sea Shore'
                   : activeProvince.region === 'Plateau/Mountain' ? 'Plateau & Mountainous'
                   : 'Mekong River Basin'}
                </span>
                <h3 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
                  {activeProvince.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveProvince(null)}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 cursor-pointer transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Profile body info */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider block">Capital City</span>
                  <span className="text-gray-900 font-bold text-sm block mt-0.5">{activeProvince.capital}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider block">Iconic Spot</span>
                  <span className="text-sky-700 font-bold text-sm block mt-0.5 flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    {activeProvince.attraction}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-gray-400 font-mono uppercase tracking-widest">About this Province</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {activeProvince.description}
                </p>
              </div>

              {/* Find and display guide for this specific province */}
              {(() => {
                const provinceGuides = posts.filter(p => p.isTour && p.provinceId === activeProvince.id);
                if (provinceGuides.length === 0) return null;
                return (
                  <div id="province-matching-guides-list" className="space-y-3 pt-4 border-t border-gray-100">
                    <h4 className="text-xs font-semibold text-emerald-850 font-mono uppercase tracking-widest">
                      Recommended Local Guide In this Province
                    </h4>
                    {provinceGuides.map(guide => (
                      <div key={guide.id} className="bg-emerald-50/55 p-4 rounded-xl border border-emerald-100/75 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={guide.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80'}
                            alt={guide.author?.name}
                            referrerPolicy="no-referrer"
                            className="h-11 w-11 rounded-full object-cover border border-emerald-250 animate-pulse"
                          />
                          <div>
                            <div className="flex items-baseline gap-1.5">
                              <span className="font-bold text-gray-900 text-sm">{guide.author?.name}</span>
                              <span className="text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded-md">
                                {guide.tourPrice}
                              </span>
                            </div>
                            <div className="flex flex-col gap-0.5 mt-1 text-[11px] text-gray-500 font-medium">
                              <a href={`tel:${guide.contactPhone}`} className="flex items-center gap-1.5 hover:text-emerald-700">
                                <Phone className="h-3 w-3 text-sky-600" /> {guide.contactPhone}
                              </a>
                              <a href={`mailto:${guide.contactEmail}`} className="flex items-center gap-1.5 hover:text-emerald-700 mt-0.5">
                                <Mail className="h-3 w-3 text-sky-600" /> {guide.contactEmail}
                              </a>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setActiveProvince(null);
                            onSelectPost(guide);
                          }}
                          className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>View & Book Tour</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    onSelectCategory('Destinations');
                    onChangeView('blog');
                    setActiveProvince(null);
                  }}
                  className="flex-1 bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-xl text-center font-semibold text-xs cursor-pointer transition-colors shadow-sm"
                >
                  Search Travelogue Posts
                </button>
                <button
                  onClick={() => setActiveProvince(null)}
                  className="px-5 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold text-xs cursor-pointer transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. LATEST BLOG POSTS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-gray-100 pt-12">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className={`text-2xl md:text-3xl font-bold text-gray-900 tracking-tight ${getHeadingFont()}`}>
                Latest Travel Stories
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Authentic firsthand memories, cultural breakdowns, and local budget insights.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <article 
                key={post.id} 
                onClick={() => onSelectPost(post)}
                className="group cursor-pointer flex flex-col justify-between overflow-hidden rounded-xl border border-gray-100 bg-white transition-all shadow-xs hover:shadow-md"
              >
                <div>
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={post.featuredImage || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='} 
                      alt={post.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-sky-600 px-2.5 py-1 rounded-md text-6xs font-medium text-white shadow-xs">
                      {post.category}
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-3 text-xs text-gray-400 font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        {post.viewCount} views
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-sky-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                      {post.summary}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-gray-50 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2">
                    <img 
                      src={post.author.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80'} 
                      alt={post.author.name}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="text-xs font-semibold text-gray-800">{post.author.name}</span>
                  </div>
                  <span className={`text-xs font-semibold inline-flex items-center gap-1 group-hover:translate-x-1 transition-all ${getPrimaryText()}`}>
                    Read entry
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. POPULAR CATEGORIES SECTION */}
      <section className="bg-gray-50/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className={`text-2xl md:text-3xl font-bold text-gray-900 tracking-tight ${getHeadingFont()}`}>
              Travel Styles & Categories
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              Select a specialized lens to filter your next discovery or planning.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat, idx) => {
              const getIcon = () => {
                switch (cat.slug) {
                  case 'destinations': return <Compass className="h-6 w-6 text-sky-600" />;
                  case 'food': return <Utensils className="h-6 w-6 text-amber-600" />;
                  case 'tips': return <Award className="h-6 w-6 text-emerald-600" />;
                  default: return <BookOpen className="h-6 w-6 text-rose-500" />;
                }
              };

              return (
                <div 
                  key={cat.id} 
                  onClick={() => onSelectCategory(cat.name)}
                  className="bg-white p-6 rounded-xl border border-gray-150/60 shadow-xs cursor-pointer text-center hover:shadow-md hover:border-sky-200 transition-all group flex flex-col items-center justify-center gap-2"
                >
                  <div className="p-3 bg-gray-50 rounded-full group-hover:bg-sky-50 group-hover:scale-105 transition-all">
                    {getIcon()}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mt-1">{cat.name}</h3>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed px-1">
                    {cat.description || 'Guides, insights, and recommendations.'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. INSTAGRAM TRAVEL GRID SIMULATOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-gray-100 pt-12 text-center">
          <h2 className={`text-2xl font-bold text-gray-900 tracking-tight ${getHeadingFont()}`}>
            #TravelWithThaychanheng
          </h2>
          <p className="text-gray-500 text-sm mt-1 max-w-lg mx-auto mb-8">
            Immerse yourself in authentic live stories directly from our camera roll across Cambodia. Learn, share, and subscribe.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {[
              preahSihanoukCustom,
              angkorWatCustom,
              royalPalacePhnomPenhCustom,
              ratanakiriProvinceCustom,
              kampotProvinceCustom,
              angkorWatCustom
            ].map((img, index) => (
              <div key={index} className="relative aspect-square overflow-hidden rounded-lg group border border-gray-100">
                <img 
                  src={img} 
                  alt="Cambodian scenery" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
                  <span>View Photo</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CONTACT US SECTION */}
      <section id="contact-us-section" className="scroll-mt-20 border-t border-gray-100 pt-12">
        <ContactUs config={config} />
      </section>

    </div>
  );
}
