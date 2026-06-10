import React from 'react';
import { BlogPost, Category, WebConfig } from '../types';
import { Search, Calendar, User, Eye, ArrowRight, X, Clock, Phone, Mail, DollarSign } from 'lucide-react';

interface BlogListProps {
  posts: BlogPost[];
  categories: Category[];
  config: WebConfig;
  selectedPost: BlogPost | null;
  onSelectPost: (post: BlogPost) => void;
  selectedCategoryName: string;
  onSelectCategoryName: (name: string) => void;
  searchValue: string;
  onSearchValueChange: (val: string) => void;
}

export function BlogList({
  posts,
  categories,
  config,
  onSelectPost,
  selectedCategoryName,
  onSelectCategoryName,
  searchValue,
  onSearchValueChange
}: BlogListProps) {
  const [selectedTag, setSelectedTag] = React.useState<string>('');

  const published = posts.filter(p => p.state === 'published');

  // Multi-criteria filter calculation
  const filteredPosts = published.filter(p => {
    const matchesSearch = searchValue 
      ? p.title.toLowerCase().includes(searchValue.toLowerCase()) || p.summary.toLowerCase().includes(searchValue.toLowerCase()) || p.content.toLowerCase().includes(searchValue.toLowerCase())
      : true;

    const matchesCategory = selectedCategoryName 
      ? p.category.toLowerCase() === selectedCategoryName.toLowerCase()
      : true;

    const matchesTag = selectedTag
      ? p.tags.some(t => t.toLowerCase() === selectedTag.toLowerCase())
      : true;

    return matchesSearch && matchesCategory && matchesTag;
  });

  // Collect all unique tags for interactive filtering
  const allTags = React.useMemo(() => {
    const tagsSet = new Set<string>();
    published.forEach(p => p.tags?.forEach(t => tagsSet.add(t)));
    return Array.from(tagsSet);
  }, [published]);

  // Read time calculator
  const calcReadTime = (content: string) => {
    const words = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 220));
  };

  const getHeadingFont = () => {
    if (config.fontHeadings === 'Playfair Display') return 'font-serif';
    if (config.fontHeadings === 'Space Grotesk') return 'font-grotesk';
    return 'font-sans';
  };

  const getPrimaryBg = () => {
    switch (config.primaryColor) {
      case 'sky-blue': return 'bg-sky-600 text-white hover:bg-sky-700';
      case 'earth-clay': return 'bg-amber-700 text-white hover:bg-amber-800';
      case 'forest-pine': return 'bg-emerald-700 text-white hover:bg-emerald-800';
      case 'sunset-rose': return 'bg-rose-600 text-white hover:bg-rose-700';
      default: return 'bg-sky-600 text-white hover:bg-sky-700';
    }
  };

  const getActiveTabClass = (catName: string) => {
    const isCurrent = (catName === 'all' && !selectedCategoryName) || (selectedCategoryName.toLowerCase() === catName.toLowerCase());
    if (isCurrent) {
      switch (config.primaryColor) {
        case 'sky-blue': return 'bg-sky-600 text-white shadow-xs';
        case 'earth-clay': return 'bg-amber-700 text-white shadow-xs';
        case 'forest-pine': return 'bg-emerald-700 text-white shadow-xs';
        case 'sunset-rose': return 'bg-rose-600 text-white shadow-xs';
        default: return 'bg-sky-600 text-white';
      }
    }
    return 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Search and Hero heading */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
        <h1 className={`text-3xl md:text-4xl font-bold text-gray-900 tracking-tight ${getHeadingFont()}`}>
          Travel Catalog & Postings
        </h1>
        <p className="text-gray-500 text-sm">
          Browse Cambodian architectural wonders, budget hacks, culture insights, and street food.
        </p>

        {/* Search bar inside list */}
        <div className="relative max-w-lg mx-auto">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchValueChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white shadow-xs text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
            placeholder="Search from keywords, titles or locations..."
          />
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
          {searchValue && (
            <button 
              onClick={() => onSearchValueChange('')} 
              className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main filter systems */}
      <div className="space-y-6 mb-10">
        {/* Categories Tab Selector */}
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => onSelectCategoryName('')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${getActiveTabClass('all')}`}
          >
            All Destinations
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategoryName(cat.name)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${getActiveTabClass(cat.name)}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Tag Filters */}
        <div className="flex flex-wrap justify-center items-center gap-2 max-w-4xl mx-auto pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-400 font-medium font-mono">Popular tags:</span>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
              className={`px-2.5 py-1 rounded-full text-xs cursor-pointer transition-colors ${
                selectedTag.toLowerCase() === tag.toLowerCase()
                  ? 'bg-sky-100 text-sky-800 border border-sky-300 font-semibold'
                  : 'bg-gray-100 hover:bg-gray-250 text-gray-600 border border-transparent'
              }`}
            >
              #{tag}
            </button>
          ))}
          {(selectedCategoryName || selectedTag || searchValue) && (
            <button
              onClick={() => {
                onSelectCategoryName('');
                setSelectedTag('');
                onSearchValueChange('');
              }}
              className="inline-flex items-center gap-1 text-xs text-rose-500 hover:text-rose-700 font-semibold pl-2 cursor-pointer"
            >
              <X className="h-3 w-3" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Search & filtered output summary */}
      <div className="text-xs text-gray-400 font-mono mb-4 text-center">
        Showing {filteredPosts.length} matches of {published.length} travel posts
      </div>

      {/* Blog Cards Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="group cursor-pointer bg-white rounded-xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-gray-50">
                  <img
                    src={post.featuredImage || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md text-xs font-semibold text-sky-750 border border-sky-100">
                    {post.category}
                  </div>
                  {post.isTour && post.tourPrice && (
                    <div id="tour-price-overlay-badge" className="absolute top-3 right-3 bg-emerald-600 text-white px-2.5 py-1 rounded-md text-xs font-bold shadow-sm flex items-center gap-0.5 animate-pulse">
                      <DollarSign className="h-3.5 w-3.5" />
                      <span>{post.tourPrice}</span>
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {calcReadTime(post.content)} min
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-sky-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                    {post.summary}
                  </p>

                  {/* Specific Guide Details Card inside BlogList */}
                  {post.isTour && (
                    <div 
                      className="bg-emerald-50/70 p-3 rounded-lg border border-emerald-100/70 flex flex-col gap-2 mt-2 pointer-events-auto" 
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-gray-700">
                        <a 
                          href={`tel:${post.contactPhone}`} 
                          className="flex items-center gap-1.5 bg-white hover:bg-emerald-100/30 border border-emerald-200/80 px-2 py-1.5 rounded-lg justify-center transition-colors text-emerald-800"
                          title="Call Guide"
                        >
                          <Phone className="h-3 w-3 text-emerald-600" />
                          <span>{post.contactPhone}</span>
                        </a>
                        <a 
                          href={`mailto:${post.contactEmail}`} 
                          className="flex items-center gap-1.5 bg-white hover:bg-emerald-100/30 border border-emerald-200/80 px-2 py-1.5 rounded-lg justify-center transition-colors text-emerald-800 truncate"
                          title="Email Guide"
                        >
                          <Mail className="h-3 w-3 text-emerald-600" />
                          <span className="truncate">Email ME</span>
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {post.tags?.map((t, i) => (
                      <span key={i} className="text-3xs px-2 py-0.5 rounded-full bg-gray-50 text-gray-500 font-mono">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={post.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80'}
                    alt={post.author?.name}
                    referrerPolicy="no-referrer"
                    className="h-6 w-6 rounded-full object-cover"
                  />
                  <span className="text-xs text-gray-750 font-medium">Guide: {post.author?.name}</span>
                </div>
                <span className="text-xs font-semibold text-sky-600 inline-flex items-center gap-1 group-hover:translate-x-1 transition-all">
                  View package
                  <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-xl space-y-3 max-w-xl mx-auto">
          <p className="text-gray-600 text-base">We found no travel posts matching your search filters.</p>
          <button
            onClick={() => {
              onSelectCategoryName('');
              setSelectedTag('');
              onSearchValueChange('');
            }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer ${getPrimaryBg()}`}
          >
            Clear Search & Filters
          </button>
        </div>
      )}
    </div>
  );
}
