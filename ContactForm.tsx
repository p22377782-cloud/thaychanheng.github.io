import React from 'react';
import { Send, CheckCircle, Mail, MapPin, Phone, MessageSquare, Compass, Globe } from 'lucide-react';
import { WebConfig } from '../types';

interface ContactFormProps {
  config: WebConfig;
}

export function ContactForm({ config }: ContactFormProps) {
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

  const getHeadingFont = () => {
    if (config.fontHeadings === 'Playfair Display') return 'font-serif';
    if (config.fontHeadings === 'Space Grotesk') return 'font-grotesk';
    return 'font-sans';
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
        <h1 className={`text-3xl font-extrabold text-gray-900 tracking-tight ${getHeadingFont()}`}>
          Get in Touch with Us
        </h1>
        <p className="text-gray-500 text-sm">
          Have an advertising inquiry, feedback about our Cambodia itineraries, or want to collaborate? Write us a message below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info blocks */}
        <div className="md:col-span-1 space-y-6">
          <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-xs space-y-4">
            <h3 className="font-semibold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-1.5 text-sm uppercase tracking-wide">
              <Compass className="h-4 w-4 text-sky-600" />
              <span>Blog Headquarters</span>
            </h3>

            <div className="space-y-4 text-sm text-gray-650 font-sans">
              <div className="flex gap-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <span>Preah Ang Duong St, Sangkat Wat Phnom, Phnom Penh, Cambodia</span>
              </div>
              <div className="flex gap-3">
                <Mail className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <span>hello@travelwiththaychanheng.com</span>
              </div>
              <div className="flex gap-3">
                <Phone className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <span>+855 (0) 23 980 411</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-tr from-sky-600 to-sky-400 text-white rounded-xl shadow-xs space-y-3">
            <h4 className="font-bold flex items-center gap-1.5 text-sm">
              <Globe className="h-4.5 w-4.5" />
              <span>Let's collaborate!</span>
            </h4>
            <p className="text-xs text-sky-50 leading-relaxed">
              We create sponsored campaigns, culinary reviews, and travel agency consulting, guiding beautiful digital reach worldwide.
            </p>
          </div>
        </div>

        {/* Form panel */}
        <div className="md:col-span-2 bg-white rounded-xl border border-gray-100 shadow-xs p-6 md:p-8">
          {status === 'success' ? (
            <div className="text-center py-10 space-y-4">
              <div className="inline-flex p-3 bg-emerald-50 rounded-full text-emerald-600">
                <CheckCircle className="h-10 w-10" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Message Transmitted Successfully!</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
                Thank you for reaching out to **Travel with Thaychanheng**. Our editorial team reviews submissions daily and will follow up shortly at your email.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className={`mt-4 px-5 py-2 text-white font-semibold rounded-lg text-sm cursor-pointer transition-colors ${getPrimaryBg()}`}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-widest mb-1.5">Your Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sophy Ly"
                    required
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-widest mb-1.5">Email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. sophy.ly@domain.com"
                    required
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-widest mb-1.5">Consultation Notes / message *</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  placeholder="Tell us what you are planning, of any custom marketing offer or travel query..."
                  required
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-sky-500"
                ></textarea>
              </div>

              {status === 'error' && (
                <p className="text-xs text-rose-500">Failed to submit your message. Please check connection and retry.</p>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className={`w-full py-3 px-6 text-white text-sm font-semibold rounded-lg cursor-pointer flex items-center justify-center gap-2 transition-colors disabled:opacity-50 ${getPrimaryBg()}`}
              >
                <Send className="h-4.5 w-4.5" />
                <span>{status === 'submitting' ? 'Submitting message...' : 'Send Message Now'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
