import React from 'react';
import { BlogPost, Comment, WebConfig, Category } from '../types';
import { ArrowLeft, Calendar, User, Eye, Send, ShieldAlert, CheckCircle, Video, Trash2, Heart, MessageSquare, Phone, Mail, DollarSign, MapPin, UserCheck } from 'lucide-react';

interface BlogReaderProps {
  post: BlogPost;
  allPosts: BlogPost[];
  config: WebConfig;
  onBack: () => void;
  onSelectPost: (post: BlogPost) => void;
  onCommentAdded: (postId: string, comment: Comment) => void;
}

export function BlogReader({ post, allPosts, config, onBack, onSelectPost, onCommentAdded }: BlogReaderProps) {
  const [commentAuthor, setCommentAuthor] = React.useState('');
  const [commentEmail, setCommentEmail] = React.useState('');
  const [commentText, setCommentText] = React.useState('');
  const [commentsList, setCommentsList] = React.useState<Comment[]>(post.comments || []);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState('');
  const [isLiked, setIsLiked] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(Math.floor(Math.random() * 80) + 12);
  
  // Interactive Booking / Inquiry Form states
  const [inquiryName, setInquiryName] = React.useState('');
  const [inquiryEmail, setInquiryEmail] = React.useState('');
  const [inquiryMessage, setInquiryMessage] = React.useState('');
  const [inquirySuccess, setInquirySuccess] = React.useState(false);
  const [sendingInquiry, setSendingInquiry] = React.useState(false);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryEmail.trim()) return;
    setSendingInquiry(true);
    setTimeout(() => {
      setInquirySuccess(true);
      setSendingInquiry(false);
      setInquiryName('');
      setInquiryEmail('');
      setInquiryMessage('');
      // Dismiss success status after 5 secs
      setTimeout(() => setInquirySuccess(false), 5000);
    }, 800);
  };

  // Sync state if post changes
  React.useEffect(() => {
    setCommentsList(post.comments || []);
    setIsLiked(false);
    setLikeCount(Math.floor(Math.random() * 80) + 12);
  }, [post]);

  // Handle comment submit
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentAuthor || !commentText) {
      setSubmitError('Name and comment text are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError('');
      const res = await fetch(`/api/posts/${post.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: commentAuthor,
          email: commentEmail,
          content: commentText
        })
      });
      const data = await res.json();
      if (res.ok) {
        onCommentAdded(post.id, data);
        setCommentsList([...commentsList, data]);
        setCommentAuthor('');
        setCommentEmail('');
        setCommentText('');
      } else {
        setSubmitError(data.error || 'Failed to submit comment');
      }
    } catch {
      setSubmitError('Failed to speak to the server. Please check connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simple delete comment option
  const handleDeleteComment = async (commentId: string) => {
    try {
      const res = await fetch(`/api/posts/${post.id}/comments/${commentId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setCommentsList(commentsList.filter(c => c.id !== commentId));
      }
    } catch {
      console.error('Failed to delete comment');
    }
  };

  // Filter 2 other related posts of same category
  const relatedPosts = allPosts
    .filter(p => p.id !== post.id && p.state === 'published' && p.category === post.category)
    .slice(0, 2);

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

  const getPrimaryText = () => {
    switch (config.primaryColor) {
      case 'sky-blue': return 'text-sky-600';
      case 'earth-clay': return 'text-amber-700';
      case 'forest-pine': return 'text-emerald-700';
      case 'sunset-rose': return 'text-rose-600';
      default: return 'text-sky-600';
    }
  };

  // Safe markdown viewer parser
  const renderMarkdown = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();

      // Heading 3
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} className={`text-xl font-bold text-gray-900 mt-6 mb-3 ${getHeadingFont()}`}>
            {trimmed.replace('### ', '')}
          </h3>
        );
      }
      // Heading 4
      if (trimmed.startsWith('#### ')) {
        return (
          <h4 key={idx} className="text-lg font-semibold text-gray-800 mt-5 mb-2 font-sans">
            {trimmed.replace('#### ', '')}
          </h4>
        );
      }
      // Heading 2
      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={idx} className={`text-2xl font-bold text-gray-900 mt-8 mb-4 ${getHeadingFont()}`}>
            {trimmed.replace('## ', '')}
          </h2>
        );
      }
      // Bullet lists
      if (trimmed.startsWith('* ')) {
        return (
          <ul key={idx} className="list-disc pl-6 py-1 text-gray-700 text-sm">
            <li>{trimmed.replace('* ', '')}</li>
          </ul>
        );
      }
      // Bullet alternate
      if (trimmed.startsWith('*   ')) {
        return (
          <ul key={idx} className="list-disc pl-6 py-1 text-gray-700 text-sm">
            <li>{trimmed.replace('*   ', '')}</li>
          </ul>
        );
      }
      // Block tip quotes
      if (trimmed.startsWith('*Tip:')) {
        return (
          <div key={idx} className="my-4 p-4 rounded-lg bg-sky-50 text-sky-800 text-xs italic border-l-4 border-sky-600">
            {trimmed}
          </div>
        );
      }
      // Number lists
      if (/^\d+\./.test(trimmed)) {
        return (
          <ol key={idx} className="list-decimal pl-6 py-1 text-gray-750 text-sm">
            <li>{trimmed.replace(/^\d+\.\s*/, '')}</li>
          </ol>
        );
      }
      // Paragraph spacer or inline strong formatting
      if (trimmed === '') {
        return <div key={idx} className="h-3" />;
      }

      // Convert inline **strong** tags cleanly
      const parts = trimmed.split('**');
      if (parts.length > 2) {
        return (
          <p key={idx} className="text-gray-700 text-sm leading-relaxed mb-3">
            {parts.map((p, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="text-gray-900 font-semibold">{p}</strong> : p)}
          </p>
        );
      }

      return (
        <p key={idx} className="text-gray-700 text-sm leading-relaxed mb-3">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Back trigger button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to travel spot listing</span>
        </button>
      </div>

      {/* Main Container */}
      <article className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs p-6 md:p-8 space-y-6">
        {/* Header tags */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-sky-50 text-sky-700 tracking-wide uppercase border border-sky-100">
            {post.category}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-mono">
            <Calendar className="h-3.5 w-3.5" />
            <span>Published: {post.date}</span>
            <span className="mx-1">•</span>
            <Eye className="h-3.5 w-3.5" />
            <span>{post.viewCount} unique reads</span>
          </div>
        </div>

        {/* Title */}
        <h1 className={`text-2.5xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight ${getHeadingFont()}`}>
          {post.title}
        </h1>

        {/* Author Card line */}
        <div className="flex justify-between items-center py-4 border-y border-gray-100">
          <div className="flex items-center gap-3">
            <img
              src={post.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80'}
              alt={post.author?.name}
              referrerPolicy="no-referrer"
              className="h-10 w-10 rounded-full object-cover border border-gray-100"
            />
            <div>
              <p className="text-sm font-semibold text-gray-900">{post.author?.name}</p>
              <p className="text-xs text-gray-400 font-mono">Travel Writer, {post.author?.role || 'Contributor'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsLiked(!isLiked);
                setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
              }}
              className={`p-2 rounded-full border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
                isLiked 
                  ? 'bg-rose-50 border-rose-200 text-rose-600' 
                  : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{likeCount}</span>
            </button>
          </div>
        </div>

        {/* Featured Big Image with referrerPolicy */}
        <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-50 border border-zinc-205/65 shadow-sm group">
          <img
            src={post.featuredImage || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='}
            alt={post.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-101"
          />
        </div>

        {/* If Tour post, render an exceptional interactive Tour Guide Showcase & Contact card */}
        {post.isTour && (
          <div id="tour-package-details-widget" className="bg-emerald-50/50 rounded-xl border border-emerald-100 p-5 md:p-6 space-y-6">
            <div className="flex flex-col md:flex-row gap-6 md:items-start md:justify-between border-b border-emerald-100/85 pb-5">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-emerald-800 tracking-widest uppercase bg-emerald-100/80 px-2.5 py-1 rounded-md">
                  Guaranteed Local Tour Package
                </span>
                <h3 className="text-xl font-bold text-gray-900 mt-1">Meet Your Certified Province Guide</h3>
                <p className="text-xs text-gray-500 max-w-md">
                  This tour is fully organized and guided by a certified, ministry-licensed local expert in Cambodia. Savor authentic regional secrets and local safety.
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-xs flex flex-col items-center md:items-end justify-center">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Guaranteed Rate</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-2xl font-extrabold text-emerald-700">{post.tourPrice}</span>
                </div>
                <span className="text-3xs text-gray-500 font-mono mt-1">No hidden fees • Direct guide payment</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
              {/* Left Column: Direct Contact & Guide Profile */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-white p-3.5 rounded-xl border border-emerald-100/60 shadow-3xs">
                  <img
                    src={post.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80'}
                    alt={post.author?.name}
                    referrerPolicy="no-referrer"
                    className="h-12 w-12 rounded-full object-cover border-2 border-emerald-100"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-gray-950 flex items-center gap-1">
                      {post.author?.name}
                      <span className="bg-sky-100 text-sky-800 text-[9px] font-bold px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                        <UserCheck className="h-2.5 w-2.5" /> Licensed
                      </span>
                    </h4>
                    <p className="text-xs text-gray-500 font-mono">Mobile & Telegram Responder</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">Fast-Connect Channels</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <a 
                      href={`tel:${post.contactPhone}`} 
                      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-2.5 rounded-lg justify-center shadow-xs transition-colors"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      <span>Call {post.contactPhone}</span>
                    </a>
                    <a 
                      href={`mailto:${post.contactEmail}`} 
                      className="flex items-center gap-2 bg-white hover:bg-zinc-50 text-gray-800 border border-zinc-200/80 text-xs font-semibold px-3 py-2.5 rounded-lg justify-center shadow-3xs transition-colors"
                    >
                      <Mail className="h-3.5 w-3.5 text-sky-600" />
                      <span>Email Guide</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Column: Mini Interactive Booking form */}
              <div className="bg-white p-4.5 rounded-xl border border-emerald-100/70 shadow-3xs space-y-3">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide flex items-center gap-1.5">
                  <Send className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Send direct inquiry to {post.author?.name}</span>
                </h4>

                {inquirySuccess ? (
                  <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-150 text-emerald-800 text-xs flex items-center gap-2 animate-fade-in">
                    <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-bold">Inquiry Sent Successfully!</p>
                      <p className="text-[11px] text-emerald-700 mt-0.5">The guide has received your request and will contact you via phone or email shortly.</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-2.5">
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="text" 
                        required
                        placeholder="Your Name" 
                        value={inquiryName}
                        onChange={(e) => setInquiryName(e.target.value)}
                        className="bg-gray-50 border border-gray-200 text-xs text-gray-800 rounded-md p-2 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 w-full outline-hidden"
                      />
                      <input 
                        type="email" 
                        required
                        placeholder="Your Email" 
                        value={inquiryEmail}
                        onChange={(e) => setInquiryEmail(e.target.value)}
                        className="bg-gray-50 border border-gray-200 text-xs text-gray-800 rounded-md p-2 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 w-full outline-hidden"
                      />
                    </div>
                    <textarea 
                      rows={2}
                      placeholder={`Tell ${post.author?.name} about your group, travel dates, and requirements...`}
                      value={inquiryMessage}
                      onChange={(e) => setInquiryMessage(e.target.value)}
                      className="bg-gray-50 border border-gray-200 text-xs text-gray-800 rounded-md p-2 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 w-full max-h-20 outline-hidden"
                    />
                    <button 
                      type="submit"
                      disabled={sendingInquiry}
                      className="w-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {sendingInquiry ? (
                        <span>Sending Booking...</span>
                      ) : (
                        <>
                          <span>Submit Booking Request</span>
                          <Send className="h-3 w-3" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Core Markdown Body Render */}
        <div className="prose max-w-none text-gray-800 leading-relaxed font-sans pt-2">
          {renderMarkdown(post.content)}
        </div>

        {/* Embedded Video If Provided */}
        {post.embeddedVideoUrl && (
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <h3 className={`text-base font-bold text-gray-900 flex items-center gap-1.5 ${getHeadingFont()}`}>
              <Video className="h-5 w-5 text-sky-600" />
              <span>Featured Travel Tour Video</span>
            </h3>
            {/* Render video embeds or placeholder link */}
            {post.embeddedVideoUrl.includes('youtube.com') || post.embeddedVideoUrl.includes('youtu.be') ? (
              <div className="aspect-video w-full rounded-xl overflow-hidden shadow-xs border border-gray-100">
                <iframe
                  src={post.embeddedVideoUrl.replace('watch?v=', 'embed/')}
                  title="Travel Video"
                  className="w-full h-full"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <a 
                href={post.embeddedVideoUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="inline-flex items-center gap-2 text-sm text-sky-600 font-semibold underline"
              >
                Watch Video Tour on Youtube
              </a>
            )}
          </div>
        )}

        {/* Gallery Section */}
        {post.galleryImages && post.galleryImages.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-gray-100">
            <h3 className={`text-base font-bold text-gray-900 ${getHeadingFont()}`}>
              Story Photographic Gallery
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {post.galleryImages.map((img, idx) => (
                <div key={idx} className="relative aspect-video overflow-hidden rounded-lg bg-gray-50 border border-gray-200">
                  <img
                    src={img}
                    alt="Travel gallery frame"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover hover:scale-102 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Article footer tags list */}
        <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-100">
          <span className="text-xs text-gray-400 font-bold font-mono">Tagged Keywords:</span>
          {post.tags?.map((tag, idx) => (
            <span key={idx} className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-50 text-gray-500 border border-gray-200/50">
              #{tag}
            </span>
          ))}
        </div>
      </article>

      {/* Related articles recommendations */}
      {relatedPosts.length > 0 && (
        <section className="space-y-4">
          <h2 className={`text-xl font-bold text-gray-900 tracking-tight ${getHeadingFont()}`}>
            Related Cambodian Journeys
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedPosts.map((colPost) => (
              <div
                key={colPost.id}
                onClick={() => onSelectPost(colPost)}
                className="group cursor-pointer bg-white p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all flex gap-4"
              >
                <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-50">
                  <img
                    src={colPost.featuredImage || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='}
                    alt={colPost.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <span className="text-3xs font-extrabold uppercase tracking-wide text-sky-600 block mb-1">
                      {colPost.category}
                    </span>
                    <h3 className="font-semibold text-sm text-gray-900 group-hover:text-sky-600 line-clamp-2 leading-snug">
                      {colPost.title}
                    </h3>
                  </div>
                  <span className="text-xs text-gray-400 font-mono block">Published: {colPost.date}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. COMMENT INTEGRATION HOOK */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="h-5 w-5 text-gray-500" />
          <h3 className={`text-xl font-bold text-gray-900 tracking-tight ${getHeadingFont()}`}>
            Traveler Discussion ({commentsList?.length || 0})
          </h3>
        </div>

        {/* Real Comments list */}
        {commentsList && commentsList.length > 0 ? (
          <div className="space-y-4">
            {commentsList.map((com) => (
              <div key={com.id} className="p-4 rounded-xl bg-gray-50 border border-gray-150/40 relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <div className="h-8 w-8 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-xs">
                      {com.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-900">{com.author}</span>
                      <span className="text-4xs text-gray-400 font-mono ml-2">{com.date}</span>
                    </div>
                  </div>

                  {/* Approve/Delete simulation helpers for testing ease */}
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleDeleteComment(com.id)}
                      className="text-gray-400 hover:text-rose-500 p-1.5 cursor-pointer rounded-full hover:bg-rose-50 transition-colors"
                      title="Delete Comment"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-700 text-sm pl-9 leading-relaxed">{com.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic pb-2">No comments posted yet. Start the travel conversation below!</p>
        )}

        {/* Comment Input form */}
        <div className="border-t border-gray-100 pt-6">
          <h4 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">Leave an authentic reply</h4>
          <form onSubmit={handleCommentSubmit} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Your Name *</label>
                <input
                  type="text"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  placeholder="e.g. Dararith Hem"
                  required
                  className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Your Email (private)</label>
                <input
                  type="email"
                  value={commentEmail}
                  onChange={(e) => setCommentEmail(e.target.value)}
                  placeholder="e.g. dararith@outlook.com"
                  className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Your Comment *</label>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={3}
                placeholder="What did you think of our itinerary tips? Share your opinion..."
                required
                className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-sky-500"
              ></textarea>
            </div>

            {submitError && (
              <p className="text-xs text-rose-500">{submitError}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-5 py-2.5 text-white font-semibold rounded-lg text-sm inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all ${getPrimaryBg()}`}
            >
              <Send className="h-4 w-4" />
              <span>{isSubmitting ? 'Posting...' : 'Post Traveler Comment'}</span>
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
