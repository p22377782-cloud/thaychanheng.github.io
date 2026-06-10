import React from 'react';
import { motion } from 'motion/react';
import { 
  Compass, 
  Target, 
  Eye, 
  CheckCircle, 
  Phone, 
  Mail, 
  Facebook, 
  Music, 
  Send, 
  MapPin, 
  Map, 
  Users, 
  Heart, 
  Award,
  Globe
} from 'lucide-react';
import { WebConfig } from '../types';
import angkorWatCustom from '../assets/images/angkor_wat_custom_1780726060601.png';
import royalPalaceImg from '../assets/images/royal_palace_skyline_phnom_penh_1781074104782.png';
import preahVihearImg from '../assets/images/preah_vihear_temple_1780728080905.png';
import kampotImg from '../assets/images/kampot_province_1780726089419.png';

interface SectionProps {
  config: WebConfig;
}

// Helper styling generators based on config
const getFontHeadings = (config: WebConfig) => {
  if (config.fontHeadings === 'Playfair Display') return 'font-serif';
  if (config.fontHeadings === 'Space Grotesk') return 'font-grotesk';
  return 'font-sans';
};

const getPrimaryColorClass = (config: WebConfig) => {
  switch (config.primaryColor) {
    case 'sky-blue': return 'text-sky-600 bg-sky-50 border-sky-100 hover:text-sky-800';
    case 'earth-clay': return 'text-amber-700 bg-amber-50 border-amber-100 hover:text-amber-900';
    case 'forest-pine': return 'text-emerald-700 bg-emerald-50 border-emerald-100 hover:text-emerald-900';
    case 'sunset-rose': return 'text-rose-600 bg-rose-50 border-rose-100 hover:text-rose-800';
    default: return 'text-sky-600 bg-sky-50 border-sky-100 hover:text-sky-800';
  }
};

const getPrimaryButtonBg = (config: WebConfig) => {
  switch (config.primaryColor) {
    case 'sky-blue': return 'bg-sky-600 hover:bg-sky-700 ring-sky-500';
    case 'earth-clay': return 'bg-amber-700 hover:bg-amber-800 ring-amber-500';
    case 'forest-pine': return 'bg-emerald-700 hover:bg-emerald-800 ring-emerald-500';
    case 'sunset-rose': return 'bg-rose-600 hover:bg-rose-700 ring-rose-500';
    default: return 'bg-sky-600 hover:bg-sky-700 ring-sky-500';
  }
};

// ==========================================
// 1. ABOUT ME VIEW
// ==========================================
export function AboutMe({ config }: SectionProps) {
  const isDark = config.theme === 'dark';
  return (
    <div id="about-me-page" className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
        {/* Left Column: Image with beautiful framed decoration */}
        <div className="lg:col-span-5 relative">
          <div className={`absolute -inset-2 rounded-2xl bg-gradient-to-tr from-sky-500/20 to-amber-500/20 blur-lg`} />
          <div className="relative rounded-2xl overflow-hidden border border-gray-150/80 shadow-md">
            <img 
              src={angkorWatCustom} 
              alt="Angkor Wat, Siem Reap, Cambodia" 
              className="w-full h-[320px] md:h-[450px] object-cover hover:scale-105 transition-transform duration-500" 
            />
            {/* Overlay Caption */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 text-white">
              <span className="text-xs uppercase font-mono tracking-widest text-amber-300">Cambodia Core Heritage</span>
              <h4 className="font-bold text-base mt-1">Angkor Wat, Siem Reap</h4>
            </div>
          </div>
        </div>

        {/* Right Column: Narrative content */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <span id="about-tag" className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase border ${getPrimaryColorClass(config)}`}>
              <Compass className="h-3 w-3" />
              About Me & Travel Company
            </span>
            <h1 className={`text-3xl md:text-4xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'} ${getFontHeadings(config)}`}>
              Travel With Thaychanheng
            </h1>
            <p className={`text-base font-medium leading-relaxed ${isDark ? 'text-sky-300' : 'text-sky-600'}`}>
              Your trusted partner for discovering the beauty, culture, and history of Cambodia.
            </p>
          </div>

          <div className={`space-y-4 text-sm md:text-base leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            <p>
              Welcome to **Travel With Thaychanheng**, your trusted partner for discovering the beauty, culture, and history of Cambodia.
            </p>
            <p>
              We connect travelers from around the world with experienced local tour guides, creating memorable and authentic travel experiences. Our platform helps tourists find professional guides while also providing opportunities for local guides to grow their careers and share their knowledge of Cambodia.
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-150/60">
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-900/60 border-gray-800' : 'bg-white border-gray-100'} shadow-3xs`}>
              <span className={`block text-2xl font-black ${isDark ? 'text-sky-400' : 'text-sky-600'}`}>25 / 25</span>
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} font-medium`}>Cambodia Provinces Directory</span>
            </div>
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-900/60 border-gray-800' : 'bg-white border-gray-100'} shadow-3xs`}>
              <span className={`block text-2xl font-black ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>100%</span>
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} font-medium`}>Verified Local Guides Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. OUR MISSION VIEW
// ==========================================
export function OurMission({ config }: SectionProps) {
  const isDark = config.theme === 'dark';
  return (
    <div id="our-mission-page" className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
        {/* Left Column: Narrative Content */}
        <div className="lg:col-span-7 space-y-6 order-2 lg:order-1">
          <div className="space-y-2">
            <span id="mission-tag" className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase border ${getPrimaryColorClass(config)}`}>
              <Target className="h-3 w-3" />
              Our Mission
            </span>
            <h1 className={`text-3xl md:text-4xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'} ${getFontHeadings(config)}`}>
              Empowering Communities, Enhancing Journeys
            </h1>
          </div>

          <div className={`space-y-4 text-sm md:text-base leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            <p className="text-lg font-medium leading-relaxed italic border-l-4 border-sky-450 pl-4 py-1">
              "Our mission is to promote Cambodia as a world-class travel destination by providing exceptional tourism services, supporting local tour guides, and helping visitors experience the country’s rich culture, heritage, and natural beauty."
            </p>
            <p>
              By choosing Travel With Thaychanheng, you directly support local families. We train, empower and elevate local hospitality professionals so they can deliver authentic cultural insights to global travelers, fostering sustainable mutual respect.
            </p>
          </div>

          {/* Goals Checklist */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span className={`text-sm ${isDark ? 'text-gray-355' : 'text-gray-700'}`}>Exceptional hospitality and comprehensive itinerary design</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span className={`text-sm ${isDark ? 'text-gray-355' : 'text-gray-700'}`}>Economic growth of Cambodia’s remote provincial areas</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span className={`text-sm ${isDark ? 'text-gray-355' : 'text-gray-700'}`}>Preservation of natural ecosystems and traditional arts</span>
            </div>
          </div>
        </div>

        {/* Right Column: Decorative image */}
        <div className="lg:col-span-5 relative order-1 lg:order-2">
          <div className="relative rounded-2xl overflow-hidden border border-gray-150/85 shadow-md">
            <img 
              src={royalPalaceImg} 
              alt="Royal Palace, Phnom Penh, Cambodia" 
              className="w-full h-[320px] md:h-[420px] object-cover hover:scale-105 transition-transform duration-500" 
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 text-white">
              <span className="text-xs uppercase font-mono tracking-widest text-sky-300">Capital Splendor</span>
              <h4 className="font-bold text-base mt-1">Royal Palace, Phnom Penh</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. OUR VISION VIEW
// ==========================================
export function OurVision({ config }: SectionProps) {
  const isDark = config.theme === 'dark';
  return (
    <div id="our-vision-page" className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
        {/* Left Column: Decorative image */}
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-2xl overflow-hidden border border-gray-150/85 shadow-md">
            <img 
              src={preahVihearImg} 
              alt="Prasat Preah Vihear Temple, Cambodia" 
              className="w-full h-[320px] md:h-[420px] object-cover hover:scale-105 transition-transform duration-500" 
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 text-white">
              <span className="text-xs uppercase font-mono tracking-widest text-emerald-300">UNESCO World Heritage Cliffside</span>
              <h4 className="font-bold text-base mt-1">Prasat Preah Vihear, Preah Vihear</h4>
            </div>
          </div>
        </div>

        {/* Right Column: Narrative Content */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <span id="vision-tag" className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase border ${getPrimaryColorClass(config)}`}>
              <Eye className="h-3 w-3" />
              Our Vision
            </span>
            <h1 className={`text-3xl md:text-4xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'} ${getFontHeadings(config)}`}>
              Shaping the Global Travel Landscape
            </h1>
          </div>

          <div className={`space-y-4 text-sm md:text-base leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            <p className="text-lg font-medium leading-relaxed italic border-l-4 border-amber-450 pl-4 py-1">
              "Our vision is to make Cambodia more recognized and admired around the world. We aim to attract more international and domestic tourists, contribute to the growth of Cambodia’s tourism industry, and support the country’s economic development through sustainable and responsible tourism."
            </p>
            <p>
              We look toward a future where every global traveler interacts with Cambodia not just as a location on a itinerary, but as an immersive sanctuary of living traditions. We champion low-impact travel techniques to preserve historical structures, reduce urban carbon drift, and benefit native guardians.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. WHY CHOOSE US VIEW
// ==========================================
export function WhyChooseUs({ config }: SectionProps) {
  const isDark = config.theme === 'dark';

  const bulletPoints = [
    {
      title: "Professional and knowledgeable local tour guides",
      desc: "Our carefully certified local guides love sharing hidden pathways, native dialects, and accurate history that regular guidebooks miss.",
      icon: Users,
    },
    {
      title: "Authentic Cambodian travel experiences",
      desc: "Experience real village food crafting, custom temple meditations, and remote eco-wetlands away from generic cruise ports.",
      icon: Map,
    },
    {
      title: "Easy connection between tourists and guides",
      desc: "Our interactive digital directories and modern booking interfaces bridge global needs with immediate native expertise safely.",
      icon: Globe,
    },
    {
      title: "Commitment to quality service and customer satisfaction",
      desc: "From private transport systems to safety audits and customized travel speeds, your peace of mind is our absolute signature.",
      icon: Award,
    },
    {
      title: "Support for local communities and tourism development",
      desc: "We route sustainable financial proceeds back into school foundations, clean water initiatives, and native craft markets.",
      icon: Heart,
    }
  ];

  return (
    <div id="why-choose-us-page" className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-12">
      <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16 space-y-3">
        <span id="why-tag" className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase border ${getPrimaryColorClass(config)}`}>
          <CheckCircle className="h-3 w-3" />
          Why Choose Us?
        </span>
        <h1 className={`text-3xl md:text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'} ${getFontHeadings(config)}`}>
          Why Travel With Thaychanheng?
        </h1>
        <p className={`text-base ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Discover the unique values, structures, and professional metrics that set our Cambodia journeys apart.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bulletPoints.map((bp, idx) => {
          const IconComp = bp.icon;
          return (
            <div 
              key={idx}
              className={`p-6 rounded-2xl border transition-all hover:shadow-md ${
                isDark 
                  ? 'bg-gray-900/60 border-gray-800 hover:border-gray-700' 
                  : 'bg-white border-gray-150/70 hover:border-sky-200'
              } flex flex-col justify-between`}
            >
              <div className="space-y-4">
                <div className={`p-3 rounded-xl w-fit ${isDark ? 'bg-sky-950/80 text-sky-400' : 'bg-sky-50 text-sky-600'}`}>
                  <IconComp className="h-6 w-6" />
                </div>
                <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'} leading-snug`}>
                  {bp.title}
                </h3>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-350' : 'text-gray-600'}`}>
                  {bp.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// 5. CONTACT US VIEW
// ==========================================
export function ContactUs({ config }: SectionProps) {
  const isDark = config.theme === 'dark';
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [status, setStatus] = React.useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    try {
      setStatus('submitting');
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });
      if (res.ok) {
        setStatus('success');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div id="contact-us-page" className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-12 space-y-12">
      {/* Intro block */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span id="contact-tag" className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase border ${getPrimaryColorClass(config)}`}>
          <Phone className="h-3 w-3" />
          Contact Us
        </span>
        <h1 className={`text-3xl md:text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'} ${getFontHeadings(config)}`}>
          Let's Plan Your Cambodia Adventure
        </h1>
        <p className={`text-base leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-650'}`}>
          We would love to help you plan your perfect journey in Cambodia. If you have any questions, need travel assistance, or would like to hire a local tour guide, please contact us.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Direct Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className={`p-6 rounded-2xl border ${isDark ? 'bg-gray-900/60 border-gray-800' : 'bg-white border-gray-150/70'} shadow-3xs space-y-6`}>
            <div className="space-y-1">
              <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Travel With Thaychanheng
              </h3>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} font-medium uppercase tracking-wider`}>
                Official Channels
              </p>
            </div>

            <div className="space-y-4">
              {/* Phone */}
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${isDark ? 'bg-sky-950/80 text-sky-400' : 'bg-sky-50 text-sky-600'} flex-shrink-0`}>
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <span className={`block text-xs uppercase font-semibold tracking-wider ${isDark ? 'text-gray-450' : 'text-gray-400'}`}>Phone</span>
                  <a href="tel:+855968630653" className={`text-base font-bold text-sky-600 hover:underline`}>
                    +855 96 863 0653
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${isDark ? 'bg-sky-950/80 text-sky-400' : 'bg-sky-50 text-sky-600'} flex-shrink-0`}>
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <span className={`block text-xs uppercase font-semibold tracking-wider ${isDark ? 'text-gray-455' : 'text-gray-400'}`}>Email Address</span>
                  <a href="mailto:longteparon@gmail.com" className={`text-base font-bold text-sky-600 hover:underline break-all`}>
                    longteparon@gmail.com
                  </a>
                </div>
              </div>

              {/* Facebook Page */}
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${isDark ? 'bg-sky-950/80 text-sky-400' : 'bg-sky-55 text-sky-600'} flex-shrink-0`}>
                  <Facebook className="h-5 w-5" />
                </div>
                <div>
                  <span className={`block text-xs uppercase font-semibold tracking-wider ${isDark ? 'text-gray-455' : 'text-gray-400'}`}>Facebook Page</span>
                  <a 
                    href="https://facebook.com/Thaychanheng" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-base font-bold text-gray-700 hover:text-sky-600 hover:underline dark:text-gray-200"
                  >
                    Thaychanheng
                  </a>
                </div>
              </div>

              {/* TikTok */}
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${isDark ? 'bg-sky-950/80 text-sky-400' : 'bg-sky-55 text-sky-600'} flex-shrink-0`}>
                  <Music className="h-5 w-5" />
                </div>
                <div>
                  <span className={`block text-xs uppercase font-semibold tracking-wider ${isDark ? 'text-gray-455' : 'text-gray-400'}`}>TikTok Channel</span>
                  <span className="text-base font-bold dark:text-gray-200">
                    @thaychanheng
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Slogan & Visual Banner Card */}
          <div className="relative rounded-2xl overflow-hidden border border-gray-150/80 shadow-md">
            <img 
              src={kampotImg} 
              alt="Kampot riverside scenery, Cambodia" 
              className="w-full h-[180px] object-cover filter brightness-75" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20 p-5 flex flex-col justify-end text-white">
              <p className="text-xs font-mono uppercase tracking-widest text-amber-300">Discover Cambodia</p>
              <h4 className="text-sm font-bold mt-1.5 leading-relaxed italic">
                "Travel With Thaychanheng – Discover Cambodia, Create Memories." 🇰🇭✨
              </h4>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Quick Form with Description */}
        <div className="lg:col-span-7 space-y-6">
          <div className={`p-6 md:p-8 rounded-2xl border ${isDark ? 'bg-gray-900/60 border-gray-800' : 'bg-white border-gray-150/70'} shadow-3xs space-y-6`}>
            <div className="space-y-2">
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} ${getFontHeadings(config)}`}>
                Get in Touch
              </h2>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-350' : 'text-gray-600'}`}>
                Whether you are looking for a guided tour, travel recommendations, or partnership opportunities, our team is ready to assist you. We are committed to providing reliable, friendly, and professional service to make your Cambodian adventure unforgettable.
              </p>
            </div>

            {status === 'success' ? (
              <div className="p-6 rounded-xl bg-emerald-50 text-emerald-800 space-y-3 border border-emerald-100 text-center">
                <CheckCircle className="h-10 w-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-base">Message Sent Successfully!</h4>
                <p className="text-xs text-emerald-700 max-w-sm mx-auto">
                  Thank you for reaching out to Travel With Thaychanheng. We will get in touch with you shortly at your provided email.
                </p>
                <button 
                  onClick={() => setStatus('idle')} 
                  className={`mt-2 text-xs font-bold text-white px-4 py-2 rounded-lg ${getPrimaryButtonBg(config)} transition-colors cursor-pointer`}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Your Name *
                    </label>
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Chanmony Ly"
                      className={`w-full px-3.5 py-2.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent ${
                        isDark 
                          ? 'bg-gray-950 border-gray-800 text-white' 
                          : 'bg-gray-50/50 border-gray-200 text-gray-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Email Address *
                    </label>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. chanmony@gmail.com"
                      className={`w-full px-3.5 py-2.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent ${
                        isDark 
                          ? 'bg-gray-950 border-gray-800 text-white' 
                          : 'bg-gray-50/50 border-gray-200 text-gray-900'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Message / Guide Request Details *
                  </label>
                  <textarea 
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your desired travel dates, target provinces, or custom tour requirements..."
                    className={`w-full px-3.5 py-2.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent ${
                      isDark 
                        ? 'bg-gray-950 border-gray-800 text-white' 
                        : 'bg-gray-50/50 border-gray-200 text-gray-900'
                    }`}
                  />
                </div>

                {status === 'error' && (
                  <p className="text-xs text-rose-500 font-medium">Failed to send message. Please try again soon.</p>
                )}

                <button 
                  type="submit" 
                  disabled={status === 'submitting'}
                  className={`w-full py-2.5 rounded-lg text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer ${getPrimaryButtonBg(config)} disabled:opacity-50`}
                >
                  <Send className="h-4 w-4" />
                  <span>{status === 'submitting' ? 'Transmitting message...' : 'Send Message Now'}</span>
                </button>
              </form>
            )}
          </div>

          <div className={`p-5 rounded-2xl border text-center ${isDark ? 'bg-gradient-to-r from-gray-950 to-gray-900 border-gray-800' : 'bg-gradient-to-r from-sky-50/30 to-amber-50/30 border-gray-150/70'}`}>
            <p className={`text-sm italic font-medium leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              At Travel With Thaychanheng, we believe that every journey should be meaningful, inspiring, and unforgettable. Join us in exploring the wonders of Cambodia and creating memories that last a lifetime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
