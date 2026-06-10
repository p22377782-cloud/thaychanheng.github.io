import React from 'react';
import { BlogPost, Category, Comment, ContactSubmission, Subscriber, WebConfig } from '../types';
import { 
  FileText, Image as ImageIcon, MessageSquare, Settings, Users, Mail, Plus, Trash2, Edit, Save, 
  Sparkles, ShieldCheck, LogOut, AlertCircle, RefreshCw, BarChart2, CheckCircle, HelpCircle, Eye, EyeOff, Layout, Type
} from 'lucide-react';
import angkorWatCustom from '../assets/images/angkor_wat_custom_1780726060601.png';
import ratanakiriProvinceCustom from '../assets/images/ratanakiri_province_1780726076105.png';
import kampotProvinceCustom from '../assets/images/kampot_province_1780726089419.png';
import preahSihanoukCustom from '../assets/images/preah_sihanouk_1780726105713.png';
import royalPalacePhnomPenhCustom from '../assets/images/royal_palace_skyline_phnom_penh_1781074104782.png';

interface AdminPanelProps {
  posts: BlogPost[];
  categories: Category[];
  config: WebConfig;
  submissions: ContactSubmission[];
  subscribers: Subscriber[];
  onUpdatePosts: (posts: BlogPost[]) => void;
  onUpdateCategories: (categories: Category[]) => void;
  onUpdateConfig: (config: WebConfig) => void;
  onReloadData: (authToken?: string) => void;
}

export function AdminPanel({ 
  posts, 
  categories, 
  config, 
  submissions, 
  subscribers, 
  onUpdatePosts, 
  onUpdateCategories, 
  onUpdateConfig,
  onReloadData
}: AdminPanelProps) {
  // Authentication status
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loginError, setLoginError] = React.useState('');
  const [token, setToken] = React.useState(() => localStorage.getItem('admin_session_token') || '');

  // Admin credentials setup state
  const [newUsername, setNewUsername] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');

  // Active admin tab
  const [activeTab, setActiveTab] = React.useState<'posts' | 'write' | 'media' | 'categories' | 'comments' | 'submissions' | 'subscribers' | 'settings'>('posts');

  // Currently editing post state
  const [editingPost, setEditingPost] = React.useState<BlogPost | null>(null);

  // Magic AI writer popup state
  const [aiPrompt, setAiPrompt] = React.useState('');
  const [aiCategory, setAiCategory] = React.useState('Destinations');
  const [aiTone, setAiTone] = React.useState('Inspirational');
  const [isAiLoading, setIsAiLoading] = React.useState(false);

  // SEO auditor state
  const [focusKeywords, setFocusKeywords] = React.useState('');
  const [isSeoAuditing, setIsSeoAuditing] = React.useState(false);

  // New Category form state
  const [newCatName, setNewCatName] = React.useState('');
  const [newCatDesc, setNewCatDesc] = React.useState('');

  // Config settings form
  const [settingsForm, setSettingsForm] = React.useState<WebConfig>({ ...config });

  // Token-embedded API fetch helper
  const authFetch = async (url: string, options: any = {}) => {
    const currentToken = token || localStorage.getItem('admin_session_token') || '';
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${currentToken}`
    };
    return fetch(url, { ...options, headers });
  };

  // Mount-time Session verification hook
  React.useEffect(() => {
    const savedToken = localStorage.getItem('admin_session_token');
    if (savedToken) {
      fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${savedToken}` }
      })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Session is invalid or has expired');
      })
      .then(data => {
        setIsAuthenticated(true);
        setUsername(data.username);
        setToken(savedToken);
        onReloadData(savedToken);
      })
      .catch(() => {
        localStorage.removeItem('admin_session_token');
        setIsAuthenticated(false);
      });
    }
  }, []);

  // Stock Media Library items
  const mediaLibrary = [
    { name: 'Angkor Wat (Siem Reap)', url: angkorWatCustom },
    { name: 'Ratanakiri Province Yeak Laom Lake', url: ratanakiriProvinceCustom },
    { name: 'Kampot River Sunset', url: kampotProvinceCustom },
    { name: 'Preah Sihanouk Koh Rong Cove', url: preahSihanoukCustom },
    { name: 'Royal Palace in Phnom Penh', url: royalPalacePhnomPenhCustom },
    { name: 'Khmer Curry Amok bowl', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80' }
  ];

  // Sync setting form
  React.useEffect(() => {
    setSettingsForm({ ...config });
  }, [config]);

  // Handle Real server-authenticated Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('admin_session_token', data.token);
        setToken(data.token);
        setIsAuthenticated(true);
        setUsername(data.username);
        setLoginError('');
        // Sync subscriber and consultation database instantly
        onReloadData(data.token);
      } else {
        setLoginError(data.error || 'Invalid user handle name or security passcode.');
      }
    } catch (err) {
      setLoginError('CMS Portal connection error. Please try again.');
    }
  };

  // Create new blank post action
  const handleCreateNewPost = () => {
    const freshPost: BlogPost = {
      id: `post-${Date.now()}`,
      title: '',
      slug: '',
      summary: '',
      content: '',
      featuredImage: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80',
      author: {
        name: username === 'editor' ? 'Thaychanheng Editor' : 'Thaychanheng Admin',
        role: username === 'editor' ? 'Editor' : 'Admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'
      },
      date: new Date().toISOString().split('T')[0],
      category: categories[0]?.name || 'Destinations',
      tags: ['Cambodia', 'Tour'],
      state: 'draft',
      viewCount: 0,
      comments: [],
      galleryImages: []
    };
    setEditingPost(freshPost);
    setActiveTab('write');
  };

  // Edit existing post select action
  const handleEditSelect = (post: BlogPost) => {
    setEditingPost({ ...post });
    setActiveTab('write');
  };

  // Save current editing post to backend
  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    // Build automated slug structure
    const slug = editingPost.slug || editingPost.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const cleanPost = {
      ...editingPost,
      slug
    };

    try {
      const res = await authFetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanPost)
      });
      if (res.ok) {
        const saved = await res.json();
        // Update local memory list
        const index = posts.findIndex(p => p.id === saved.id);
        const updatedList = [...posts];
        if (index !== -1) {
          updatedList[index] = saved;
        } else {
          updatedList.unshift(saved);
        }
        onUpdatePosts(updatedList);
        setEditingPost(null);
        setActiveTab('posts');
      }
    } catch {
      alert('Failed to save post to datastore.');
    }
  };

  // Delete blog post action
  const handleDeletePost = async (id: string) => {
    if (!confirm('Are you absolutely sure you want to delete this travel post?')) return;
    try {
      const res = await authFetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        onUpdatePosts(posts.filter(p => p.id !== id));
      }
    } catch {
      alert('Failed to delete post.');
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    try {
      const res = await authFetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        onUpdateCategories(categories.filter(c => c.id !== id));
      }
    } catch {
      alert('Failed to delete category.');
    }
  };

  // Add Category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;

    const freshCat: Category = {
      id: `cat-${Date.now()}`,
      name: newCatName,
      slug: newCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: newCatDesc
    };

    try {
      const res = await authFetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(freshCat)
      });
      if (res.ok) {
        const saved = await res.json();
        onUpdateCategories([...categories, saved]);
        setNewCatName('');
        setNewCatDesc('');
      }
    } catch {
      alert('Failed to save category');
    }
  };

  // Save Config Settings
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await authFetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsForm)
      });
      if (res.ok) {
        onUpdateConfig(settingsForm);
        alert('Website customization configuration saved perfectly!');
      }
    } catch {
      alert('Failed to save configuration settings.');
    }
  };

  // Change Admin Passcode & Credentials
  const handleUpdateCredentials = async () => {
    if (!newUsername || !newPassword) return;
    try {
      const res = await authFetch('/api/auth/change-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newUsername, newPassword })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert('Admin portal credentials updated successfully. You remain logged in.');
        setUsername(newUsername);
        setNewUsername('');
        setNewPassword('');
      } else {
        alert(data.error || 'Failed to update credentials.');
      }
    } catch (err) {
      alert('CMS connection error. Could not save credentials.');
    }
  };

  // Run Magic AI Writer with Gemini
  const handleAiWriter = async () => {
    if (!aiPrompt) return;
    try {
      setIsAiLoading(true);
      const res = await authFetch('/api/gemini/ai-writer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt,
          category: aiCategory,
          tone: aiTone
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        // Set values inside form editor
        setEditingPost(prev => {
          if (!prev) return null;
          return {
            ...prev,
            title: data.title || '',
            summary: data.summary || '',
            content: data.content || '',
            tags: data.suggestedTags || ['AI', 'Cambodia'],
            category: aiCategory
          };
        });
        setAiPrompt('');
        alert('Gemini generated a beautiful draft layout for you successfully!');
      }
    } catch {
      alert('Gemini service connection error. Please retry.');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Run SEO Auditor with Gemini
  const handleSeoAudit = async () => {
    if (!editingPost || !editingPost.title || !editingPost.content) {
      alert('Please fill in at least Title and Content before auditing.');
      return;
    }

    try {
      setIsSeoAuditing(true);
      const res = await authFetch('/api/gemini/generate-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editingPost.title,
          content: editingPost.content,
          focusKeywords
        })
      });

      const data = await res.json();
      if (res.ok) {
        setEditingPost(prev => {
          if (!prev) return null;
          return {
            ...prev,
            seoScore: data.seoScore || 80,
            seoSuggestions: data.suggestions || [],
            metaTitle: prev.metaTitle || data.metaTitle || `${prev.title} - Tourist Spot`,
            metaDescription: prev.metaDescription || data.metaDescription || data.keywordAnalysis?.currentDensityFeedback
          };
        });
        alert('SEO audit analysis complete!');
      }
    } catch {
      alert('SEO analysis connection helper failed.');
    } finally {
      setIsSeoAuditing(false);
    }
  };

  // Change submission status
  const handleSubmissionStatusChange = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'new' ? 'read' : currentStatus === 'read' ? 'replied' : 'new';
    try {
      const res = await authFetch(`/api/submissions/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        onReloadData();
      }
    } catch {
      console.error('Failed to update submission status');
    }
  };

  // Delete submission
  const handleDeleteSubmission = async (id: string) => {
    try {
      const res = await authFetch(`/api/submissions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        onReloadData();
      }
    } catch {
      console.error('Failed to delete submission');
    }
  };

  // Helper colors
  const getAccentBg = () => {
    switch (config.primaryColor) {
      case 'sky-blue': return 'bg-sky-600 hover:bg-sky-700 text-white';
      case 'earth-clay': return 'bg-amber-700 hover:bg-amber-800 text-white';
      case 'forest-pine': return 'bg-emerald-700 hover:bg-emerald-800 text-white';
      case 'sunset-rose': return 'bg-rose-600 hover:bg-rose-700 text-white';
      default: return 'bg-sky-600 hover:bg-sky-700 text-white';
    }
  };

  const getAccentText = () => {
    switch (config.primaryColor) {
      case 'sky-blue': return 'text-sky-600';
      case 'earth-clay': return 'text-amber-700';
      case 'forest-pine': return 'text-emerald-700';
      case 'sunset-rose': return 'text-rose-600';
      default: return 'text-sky-600';
    }
  };

  // 1. LOGIN SCREEN IN CASE NOT AUTHENTICATED
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-2xl border border-gray-150 p-6 shadow-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-sky-50 rounded-full text-sky-600">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 font-grotesk tracking-tight">Thaychanheng CMS Portal</h2>
          <p className="text-gray-500 text-xs">
            Authenticate using secure local editing credentials.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-3xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">User Handle / Name</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin or editor"
              required
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-sky-500 text-gray-800 font-mono"
            />
          </div>

          <div>
            <label className="block text-3xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Security Pass Code</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="e.g. admin123"
              required
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-sky-500 text-gray-800 font-mono"
            />
          </div>

          <div className="p-3 bg-amber-50 rounded-lg border border-amber-100 flex gap-2 text-xs text-amber-800 font-mono leading-relaxed">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <div>
              <strong>Quick Guide:</strong> Use <u>admin</u> as default user handle and <u>admin123</u> as default security passcode (you can customize these credentials inside the Settings panel).
            </div>
          </div>

          {loginError && (
            <p className="text-xs text-rose-500 font-medium font-mono">{loginError}</p>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-gray-900 text-white rounded-lg cursor-pointer text-sm font-semibold hover:bg-gray-800 transition-colors"
          >
            Access Dashboard
          </button>
        </form>
      </div>
    );
  }

  // 2. MAIN CMS AREA
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-5 gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-grotesk text-gray-900 tracking-tight">CMS Portal Dashboard</h1>
          <p className="text-xs text-gray-500">
            Welcome, <strong className="text-gray-800 font-mono">@{username}</strong> (Super Administrator). Live updates synced.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              const currentToken = token || localStorage.getItem('admin_session_token') || '';
              onReloadData(currentToken);
              alert('Durable JSON database state refreshed from disk!');
            }}
            className="p-2 border border-gray-250 cursor-pointer rounded-lg hover:bg-gray-50 text-gray-550 inline-flex items-center gap-1.5 text-xs font-semibold"
            title="Reload disk copy"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Sync</span>
          </button>
          
          <button
            onClick={async () => {
              const currentToken = token || localStorage.getItem('admin_session_token');
              if (currentToken) {
                try {
                  await fetch('/api/auth/logout', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${currentToken}` }
                  });
                } catch (e) {
                  console.error('Logout failed background', e);
                }
              }
              localStorage.removeItem('admin_session_token');
              setToken('');
              setIsAuthenticated(false);
            }}
            className="p-2 border border-rose-200 text-rose-600 rounded-lg cursor-pointer hover:bg-rose-50 inline-flex items-center gap-1.5 text-xs font-semibold"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side Rail for navigation */}
        <div className="lg:col-span-1 space-y-1.5">
          {[
            { id: 'posts', title: 'Blog Registry', icon: <FileText className="h-4.5 w-4.5" /> },
            { id: 'write', title: 'HTML Editor', icon: <Plus className="h-4.5 w-4.5" /> },
            { id: 'media', title: 'Stock Library', icon: <ImageIcon className="h-4.5 w-4.5" /> },
            { id: 'categories', title: 'Categories / Tags', icon: <Type className="h-4.5 w-4.5" /> },
            { id: 'comments', title: 'Moderator Board', icon: <MessageSquare className="h-4.5 w-4.5" /> },
            { id: 'submissions', title: 'Contact Mailbox', icon: <Mail className="h-4.5 w-4.5" /> },
            { id: 'subscribers', title: 'Subscribed List', icon: <Users className="h-4.5 w-4.5" /> },
            { id: 'settings', title: 'Full Customizer', icon: <Settings className="h-4.5 w-4.5" /> }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as any);
                if (item.id !== 'write') setEditingPost(null);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeTab === item.id 
                  ? 'bg-gray-900 text-white shadow-xs' 
                  : 'text-gray-650 hover:bg-gray-100 hover:text-black'
              }`}
            >
              {item.icon}
              <span>{item.title}</span>
            </button>
          ))}

          {/* Quick Stats overview */}
          <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/70 text-xs mt-6 space-y-2">
            <h4 className="font-bold text-gray-700 flex items-center gap-1 font-mono uppercase tracking-wide">
              <BarChart2 className="h-3.5 w-3.5" />
              <span>Realtime Stats</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-gray-500 font-mono mt-1">
              <div>Posts: <strong className="text-gray-900">{posts.length}</strong></div>
              <div>Subscribers: <strong className="text-gray-900">{subscribers.length}</strong></div>
              <div>Mails: <strong className="text-gray-900">{submissions.length}</strong></div>
              <div>Total views: <strong className="text-gray-900">{posts.reduce((acc, p) => acc + (p.viewCount || 0), 0)}</strong></div>
            </div>
          </div>
        </div>

        {/* Right content module panels */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 p-5 md:p-6 shadow-2xs min-h-[500px]">
          
          {/* TAB 1: BLOG REGISTRY */}
          {activeTab === 'posts' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                <h3 className="font-semibold text-lg font-grotesk text-gray-900">Manage Published / Draft Posts</h3>
                <button
                  onClick={handleCreateNewPost}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold inline-flex items-center gap-1 cursor-pointer ${getAccentBg()}`}
                >
                  <Plus className="h-4 w-4" />
                  <span>Create New Post</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-500 font-sans border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 uppercase text-3xs font-bold text-gray-400">
                      <th className="py-2.5">Post Details</th>
                      <th className="py-2.5">Category</th>
                      <th className="py-2.5">Views</th>
                      <th className="py-2.5">Status</th>
                      <th className="py-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((post) => (
                      <tr key={post.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <img src={post.featuredImage || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='} alt="Cover" className="h-10 w-16 object-cover rounded-md border border-gray-100 flex-shrink-0" />
                            <div>
                              <p className="font-bold text-gray-900 text-sm">{post.title || 'Untitled Draft'}</p>
                              <p className="text-xs text-gray-400 font-mono italic">Date: {post.date}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 font-semibold text-gray-700">{post.category}</td>
                        <td className="py-3 font-mono text-gray-700">{post.viewCount || 0}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-4xs font-bold ${
                            post.state === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {post.state?.toUpperCase() || 'DRAFT'}
                          </span>
                        </td>
                        <td className="py-3 text-right space-x-1">
                          <button
                            onClick={() => handleEditSelect(post)}
                            className="p-1.5 text-sky-600 hover:bg-sky-50 rounded-md cursor-pointer inline-flex items-center"
                            title="Edit Post"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-md cursor-pointer inline-flex items-center"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: POST WRITER EDITOR (WYSIWYG simulation with Magic AI assistant) */}
          {activeTab === 'write' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <h3 className="font-semibold text-lg font-grotesk text-gray-900">
                  {editingPost?.title ? 'Edit Travel Post' : 'Compose Beautiful Travel Blog'}
                </h3>
                <button
                  onClick={() => {
                    setEditingPost(null);
                    setActiveTab('posts');
                  }}
                  className="px-2.5 py-1 text-xs border border-gray-200 hover:bg-gray-50 rounded-md cursor-pointer"
                >
                  Discard / Cancel
                </button>
              </div>

              {/* MAGIC AI WRITING HELPER SECTION */}
              <div className="bg-gradient-to-tr from-sky-50 to-sky-100/50 p-4 rounded-xl border border-sky-100 space-y-3">
                <div className="flex items-center gap-1.5 text-sky-850 font-bold text-sm">
                  <Sparkles className="h-5 w-5 text-sky-600 animate-spin" />
                  <span>Gemini Instant Travel Writer Assistant</span>
                </div>
                <p className="text-xs text-sky-700 leading-relaxed max-w-2xl">
                  Bypass writers-block! Provide an idea (e.g. "Visiting Kep's famous crab docks at sundown") - Gemini will generate optimized titles, hashtags, and a formatted Markdown draft layout structure!
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Enter travel idea or prompt details..."
                    className="flex-grow px-3.5 py-2 text-xs border border-sky-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 text-gray-800"
                  />
                  <div className="flex gap-2">
                    <select
                      value={aiCategory}
                      onChange={(e) => setAiCategory(e.target.value)}
                      className="px-2 py-2 border border-sky-200 rounded-lg bg-white text-xs text-gray-800"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                    <select
                      value={aiTone}
                      onChange={(e) => setAiTone(e.target.value)}
                      className="px-2 py-2 border border-sky-200 rounded-lg bg-white text-xs text-gray-805"
                    >
                      <option value="Inspirational">Inspirational</option>
                      <option value="Adventurous">Adventurous</option>
                      <option value="Budget friendly">Budget Friendly</option>
                      <option value="Scholarly/Historic">Historic</option>
                    </select>

                    <button
                      onClick={handleAiWriter}
                      disabled={isAiLoading || !aiPrompt}
                      className="whitespace-nowrap px-4 py-2 bg-sky-600 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center justify-center gap-1 disabled:opacity-50 hover:bg-sky-700"
                    >
                      {isAiLoading ? 'Writing...' : 'Generate Blog Layout'}
                    </button>
                  </div>
                </div>
              </div>

              {/* POST FORM COMPONENT */}
              <form onSubmit={handleSavePost} className="space-y-4">
                {/* Lazy-populate if nothing started */}
                {!editingPost && (
                  <div className="text-center py-10 bg-gray-50 border border-dashed border-gray-205 rounded-xl space-y-2">
                    <p className="text-xs text-gray-500">Please draft parameters below or hit the create trigger.</p>
                    <button
                      type="button"
                      onClick={handleCreateNewPost}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer ${getAccentBg()}`}
                    >
                      Bootstrap New Blank Draft
                    </button>
                  </div>
                )}

                {editingPost && (
                  <div className="space-y-4">
                    {/* Title */}
                    <div>
                      <label className="block text-3xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Article Title *</label>
                      <input
                        type="text"
                        value={editingPost.title}
                        onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                        placeholder="e.g. Discovering Cambodian secrets..."
                        required
                        className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 text-gray-800 font-semibold"
                      />
                    </div>

                    {/* Meta slug and summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-3xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">SEO Slug path (optional auto-build)</label>
                        <input
                          type="text"
                          value={editingPost.slug}
                          onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                          placeholder="e.g. travel-guide-cambodia"
                          className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg bg-gray-50 text-gray-700 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-3xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Featured Showcase image url</label>
                        <input
                          type="text"
                          value={editingPost.featuredImage}
                          onChange={(e) => setEditingPost({ ...editingPost, featuredImage: e.target.value })}
                          placeholder="Image URL"
                          required
                          className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg text-gray-700 font-sans"
                        />
                      </div>
                    </div>

                    {/* Summary */}
                    <div>
                      <label className="block text-3xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Search Engine Snippet summary (Brief description) *</label>
                      <input
                        type="text"
                        value={editingPost.summary}
                        onChange={(e) => setEditingPost({ ...editingPost, summary: e.target.value })}
                        placeholder="Snippet featured under title in search listings"
                        required
                        className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg text-gray-750"
                      />
                    </div>

                    {/* Content writer Markdown */}
                    <div>
                      <label className="block text-3xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        Post Content Body (Support custom titles, ## headers, * lists, tip quotes) *
                      </label>
                      <textarea
                        value={editingPost.content}
                        onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                        rows={12}
                        required
                        className="w-full px-3.5 py-3 text-sm border border-gray-200 rounded-lg text-gray-800 font-mono bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-transparent transition-all"
                        placeholder="Write in clean markdown. e.g. ## Traveling Tips..."
                      ></textarea>
                    </div>

                    {/* Category, tags, embedded video */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-3xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Category *</label>
                        <select
                          value={editingPost.category}
                          onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                          className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg text-gray-800"
                        >
                          {categories.map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-3xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Tags (comma split)</label>
                        <input
                          type="text"
                          value={editingPost.tags?.join(', ') || ''}
                          onChange={(e) => setEditingPost({ ...editingPost, tags: e.target.value.split(',').map(t => t.trim()) })}
                          placeholder="e.g. spot, cambodia, guide"
                          className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg text-gray-800"
                        />
                      </div>
                      <div>
                        <label className="block text-3xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Embedded Youtube link Video (optional)</label>
                        <input
                          type="text"
                          value={editingPost.embeddedVideoUrl || ''}
                          onChange={(e) => setEditingPost({ ...editingPost, embeddedVideoUrl: e.target.value })}
                          placeholder="YouTube Video URL"
                          className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg text-gray-800"
                        />
                      </div>
                    </div>

                    {/* Publishing state & scheduled configurations */}
                    <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Publish States</h4>
                      <div className="flex flex-wrap gap-4 text-xs font-semibold">
                        <label className="inline-flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="state"
                            checked={editingPost.state === 'published'}
                            onChange={() => setEditingPost({ ...editingPost, state: 'published' })}
                            className="text-sky-600 focus:ring-sky-500"
                          />
                          <span>Published (Visible publicly)</span>
                        </label>
                        <label className="inline-flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="state"
                            checked={editingPost.state === 'draft'}
                            onChange={() => setEditingPost({ ...editingPost, state: 'draft' })}
                            className="text-sky-600 focus:ring-sky-500"
                          />
                          <span>Save as Draft</span>
                        </label>
                        <label className="inline-flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="state"
                            checked={editingPost.state === 'scheduled'}
                            onChange={() => setEditingPost({ ...editingPost, state: 'scheduled' })}
                            className="text-sky-600 focus:ring-sky-500"
                          />
                          <span>Scheduled publication</span>
                        </label>
                      </div>

                      {editingPost.state === 'scheduled' && (
                        <div className="pt-2 max-w-xs">
                          <label className="block text-4xs font-bold text-gray-450 uppercase mb-1">Pick date to publish</label>
                          <input
                            type="date"
                            value={editingPost.scheduledDate || ''}
                            onChange={(e) => setEditingPost({ ...editingPost, scheduledDate: e.target.value })}
                            className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs"
                          />
                        </div>
                      )}
                    </div>

                    {/* SEO AUDITING BOX */}
                    <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="h-4.5 w-4.5 text-sky-600 animate-bounce" />
                        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Google Gemini SEO Auditor</h4>
                      </div>
                      <p className="text-3xs text-gray-500 leading-relaxed">
                        Input focus keywords and let Gemini analyze title length, headings, and keyword density feedback!
                      </p>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={focusKeywords}
                          onChange={(e) => setFocusKeywords(e.target.value)}
                          placeholder="e.g. travel, cambodia itinerary, budget"
                          className="flex-grow px-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-white"
                        />
                        <button
                          type="button"
                          onClick={handleSeoAudit}
                          disabled={isSeoAuditing}
                          className="whitespace-nowrap px-4 py-1.5 bg-gray-900 hover:bg-black text-white rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          {isSeoAuditing ? 'Auditing...' : 'Evaluate SEO Score'}
                        </button>
                      </div>

                      {editingPost.seoScore !== undefined && (
                        <div className="mt-3 p-3 bg-white rounded-lg border border-gray-150 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold font-mono text-gray-500">Suggested Score:</span>
                            <span className={`px-2 py-0.5 rounded-full font-extrabold text-xs ${
                              editingPost.seoScore > 90 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                            }`}>{editingPost.seoScore}/100</span>
                          </div>
                          
                          {editingPost.seoSuggestions && editingPost.seoSuggestions.length > 0 && (
                            <div className="space-y-1">
                              <span className="block text-4xs font-bold text-gray-400 uppercase">Actionable Steps:</span>
                              <ul className="list-disc pl-5 text-gray-650 text-3xs space-y-1">
                                {editingPost.seoSuggestions.map((s, sIdx) => <li key={sIdx}>{s}</li>)}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* SAVE BUTTONS */}
                    <div className="flex gap-2 pt-4">
                      <button
                        type="submit"
                        className={`px-6 py-2.5 rounded-lg text-xs font-bold inline-flex items-center gap-1 cursor-pointer transition-colors shadow-sm ${getAccentBg()}`}
                      >
                        <Save className="h-4 w-4" />
                        <span>Save and Commit Changes</span>
                      </button>
                    </div>

                  </div>
                )}
              </form>
            </div>
          )}

          {/* TAB 3: STOCK MEDIA LIBRARY */}
          {activeTab === 'media' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-gray-150">
                <h3 className="font-semibold text-lg font-grotesk text-gray-900">Digital Media Assets Library</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Manage photorealistic media assets. Click any scenic photo below to automatically copy its direct URL to copy/paste into composition headers!
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {mediaLibrary.map((med, i) => (
                  <div 
                    key={i} 
                    onClick={() => {
                      navigator.clipboard.writeText(med.url);
                      alert(`URL Copied to Clipboard!\n\n${med.url}`);
                    }}
                    className="group cursor-pointer bg-gray-50 rounded-lg overflow-hidden border border-gray-150 relative"
                  >
                    <div className="relative aspect-video">
                      <img src={med.url} alt={med.name} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-center p-2 text-white text-4xs font-semibold">
                        <span>Copy Image URL to Clipboard</span>
                      </div>
                    </div>
                    <div className="p-2 text-center">
                      <p className="text-3xs text-gray-800 font-bold truncate">{med.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CATEGORY / TAG COMPONENT EDITOR */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="pb-3 border-b border-gray-150">
                <h3 className="font-semibold text-lg font-grotesk text-gray-900">Manage Post Categories</h3>
                <p className="text-xs text-gray-500">Organize Travel with Thaychanheng topics cleanly.</p>
              </div>

              {/* Add category inline */}
              <form onSubmit={handleAddCategory} className="bg-gray-50 p-4 rounded-xl border border-gray-150 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="md:col-span-1">
                  <label className="block text-4xs font-bold text-gray-500 uppercase mb-1.5">New Category Title *</label>
                  <input
                    type="text"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="e.g. Guest Guides"
                    required
                    className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-4xs font-bold text-gray-500 uppercase mb-1.5">Short description</label>
                  <input
                    type="text"
                    value={newCatDesc}
                    onChange={(e) => setNewCatDesc(e.target.value)}
                    placeholder="Brief scope text..."
                    className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
                  />
                </div>
                <div className="md:col-span-1">
                  <button
                    type="submit"
                    className={`w-full py-1.5 rounded-lg text-xs font-bold cursor-pointer inline-flex items-center justify-center gap-1 ${getAccentBg()}`}
                  >
                    <Plus className="h-4 w-4" />
                    <span>Insert Category</span>
                  </button>
                </div>
              </form>

              {/* List table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-500 font-sans border-collapse">
                  <thead>
                    <tr className="border-b border-gray-150 uppercase text-4xs font-bold text-gray-400">
                      <th className="py-2">Category Name</th>
                      <th className="py-2">Slug</th>
                      <th className="py-2">Description</th>
                      <th className="py-2 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat) => (
                      <tr key={cat.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="py-2.5 font-bold text-gray-900">{cat.name}</td>
                        <td className="py-2.5 font-mono text-gray-500">/{cat.slug}</td>
                        <td className="py-2.5 text-gray-600 max-w-sm truncate">{cat.description || 'No description listed'}</td>
                        <td className="py-2.5 text-right">
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="p-1 text-rose-500 hover:bg-rose-50 rounded-md cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: COMMENT BOARD */}
          {activeTab === 'comments' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-gray-150">
                <h3 className="font-semibold text-lg font-grotesk text-gray-900">Apsara Comment Moderation</h3>
                <p className="text-xs text-gray-500 mt-1">Review traveler interactions submitted across various blog posts.</p>
              </div>

              <div className="space-y-4">
                {posts.flatMap(p => (p.comments || []).map(com => ({ ...com, postTitle: p.title, postId: p.id }))).length > 0 ? (
                  posts.flatMap(p => (p.comments || []).map(com => ({ ...com, postTitle: p.title, postId: p.id }))).map((com) => (
                    <div key={com.id} className="p-4 rounded-xl bg-gray-50 border border-gray-150/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                      <div>
                        <p className="text-xs font-semibold text-sky-650 font-mono mb-1">Post: "{com.postTitle}"</p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-900">{com.author}</span>
                          <span className="text-4xs text-gray-400 font-mono">({com.email || 'no email'})</span>
                        </div>
                        <p className="text-xs text-gray-700 mt-1 max-w-lg leading-relaxed">{com.content}</p>
                      </div>

                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={async () => {
                            try {
                              const res = await authFetch(`/api/posts/${com.postId}/comments/${com.id}`, { method: 'DELETE' });
                              if (res.ok) onReloadData();
                            } catch { alert('Delete failed'); }
                          }}
                          className="px-2 py-1 text-3xs border border-rose-200 text-rose-600 rounded-md hover:bg-rose-50 cursor-pointer inline-flex items-center gap-1 font-semibold"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 italic py-6 text-center bg-gray-50 rounded-lg">No comments filed on any travel post.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: CONTACT MAILBOX */}
          {activeTab === 'submissions' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-gray-150">
                <h3 className="font-semibold text-lg font-grotesk text-gray-900">Direct Consultation Mailbox</h3>
                <p className="text-xs text-gray-500">Track questions sent via website contacts.</p>
              </div>

              <div className="space-y-4">
                {submissions && submissions.length > 0 ? (
                  submissions.map((sub) => (
                    <div key={sub.id} className="p-4 rounded-xl border border-gray-150 bg-white shadow-3xs hover:bg-gray-50/50 transition-colors relative space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-900">{sub.name}</span>
                            <span className={`px-2 py-0.5 rounded-full text-5xs font-bold font-mono tracking-widest ${
                              sub.status === 'new' ? 'bg-sky-50 text-sky-700 border border-sky-200' :
                              sub.status === 'read' ? 'bg-gray-100 text-gray-600' : 'bg-emerald-50 text-emerald-700'
                            }`}>{sub.status?.toUpperCase() || 'NEW'}</span>
                          </div>
                          <p className="text-4xs text-gray-400 font-mono mt-0.5">Email address: {sub.email} | Sent: {new Date(sub.date).toLocaleString()}</p>
                        </div>

                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleSubmissionStatusChange(sub.id, sub.status)}
                            className="px-2 py-1 border border-gray-200 hover:bg-gray-150 rounded-lg text-3xs font-semibold cursor-pointer"
                            title="Toggle status"
                          >
                            Mark: {sub.status === 'new' ? 'Read' : sub.status === 'read' ? 'Replied' : 'New'}
                          </button>
                          <button
                            onClick={() => handleDeleteSubmission(sub.id)}
                            className="p-1 hover:bg-rose-50 text-rose-500 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-700 font-sans border border-gray-100 leading-relaxed max-w-2xl">
                        {sub.message}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 italic text-center py-6 bg-gray-50 rounded-lg">Consultation mailbox is empty.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 7: NEWSLETTER SUBSCRIBERS */}
          {activeTab === 'subscribers' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-150">
                <div>
                  <h3 className="font-semibold text-lg font-grotesk text-gray-900">Newsletter Subscribers Registry</h3>
                  <p className="text-xs text-gray-500">Capture list for email marketing campaigns.</p>
                </div>
                <button
                  onClick={() => {
                    const emails = subscribers.map(s => s.email).join('\n');
                    navigator.clipboard.writeText(emails);
                    alert('Copied all email addresses to clipboard!');
                  }}
                  className="px-3 py-1.5 bg-gray-900 text-white hover:bg-black rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Copy CSV list to Clipboard
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-500 border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 uppercase text-4xs font-bold text-gray-400">
                      <th className="py-2">Subscriber Email</th>
                      <th className="py-2">Capture Date</th>
                      <th className="py-2 text-right font-mono">ID Target</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map((subs) => (
                      <tr key={subs.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="py-2 text-sm font-semibold text-gray-900 font-mono">{subs.email}</td>
                        <td className="py-2 text-gray-555 font-mono">{subs.date || '2026-06-03'}</td>
                        <td className="py-2 text-right text-gray-400 font-mono font-bold">{subs.id}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 8: WEBSITE FULL CUSTOMIZER STYLE OPTIONS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="pb-3 border-b border-gray-150">
                <h3 className="font-semibold text-lg font-grotesk text-gray-900">Customizer Controls Style Sheet</h3>
                <p className="text-xs text-gray-500 mt-1">Shift visual look, feel, color palette, headings instantly without rendering lines of scripts.</p>
              </div>

              <form onSubmit={handleSaveConfig} className="space-y-5">
                {/* Brand names config */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-3xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Site / Brand Name *</label>
                    <input
                      type="text"
                      value={settingsForm.siteName}
                      onChange={(e) => setSettingsForm({ ...settingsForm, siteName: e.target.value })}
                      required
                      className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg text-gray-800 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-3xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Logo Anchor Text *</label>
                    <input
                      type="text"
                      value={settingsForm.logoText}
                      onChange={(e) => setSettingsForm({ ...settingsForm, logoText: e.target.value })}
                      required
                      className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg text-gray-800"
                    />
                  </div>
                </div>

                {/* Primary color selection accent */}
                <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                  <span className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Aesthetic Accent Palette Switch</span>
                  <div className="flex flex-wrap gap-4 text-xs font-semibold">
                    {[
                      { id: 'sky-blue', label: 'Sky Turquoise Blue', class: 'bg-sky-500' },
                      { id: 'earth-clay', label: 'Phnom Penh Earth Clay/Orange', class: 'bg-amber-700' },
                      { id: 'forest-pine', label: 'Cardamom Forest Pine Green', class: 'bg-emerald-700' },
                      { id: 'sunset-rose', label: 'Mekong Sunset Rose Pink', class: 'bg-rose-500' }
                    ].map((col) => (
                      <label key={col.id} className="inline-flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="primaryColor"
                          checked={settingsForm.primaryColor === col.id}
                          onChange={() => setSettingsForm({ ...settingsForm, primaryColor: col.id })}
                          className="text-sky-600 focus:ring-sky-500"
                        />
                        <span className={`w-3 h-3 rounded-full ${col.class}`}></span>
                        <span>{col.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Theme and typography font selection pairing */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-3xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Display Font Pairing (Headers)</label>
                    <select
                      value={settingsForm.fontHeadings}
                      onChange={(e) => setSettingsForm({ ...settingsForm, fontHeadings: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg text-gray-800"
                    >
                      <option value="Space Grotesk">Space Grotesk (Tech Modern)</option>
                      <option value="Playfair Display">Playfair Display (Classy Editorial)</option>
                      <option value="Inter">Inter (Swiss Clean Minimalist)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-3xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Layout structures</label>
                    <select
                      value={settingsForm.layoutTheme}
                      onChange={(e) => setSettingsForm({ ...settingsForm, layoutTheme: e.target.value as any })}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg text-gray-800"
                    >
                      <option value="classic">Classic Blog Feed</option>
                      <option value="modern">Modern Clean Bento</option>
                      <option value="masonry">Visual Gallery Highlight</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-3xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Light / Dark basic mode</label>
                    <select
                      value={settingsForm.theme}
                      onChange={(e) => setSettingsForm({ ...settingsForm, theme: e.target.value as any })}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg text-gray-800"
                    >
                      <option value="light">Refined Soft White Mode</option>
                      <option value="dark">Immersive Charcoal Dark</option>
                    </select>
                  </div>
                </div>

                {/* Description and Credits text */}
                <div>
                  <label className="block text-3xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Meta Description Site pitch *</label>
                  <textarea
                    value={settingsForm.description}
                    onChange={(e) => setSettingsForm({ ...settingsForm, description: e.target.value })}
                    rows={2}
                    required
                    className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg text-gray-750"
                  ></textarea>
                </div>

                {/* Social Handles */}
                <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 space-y-4">
                  <span className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Social Handles & Profile URLs</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-gray-500 mb-1">Facebook Handle Profile link</label>
                      <input
                        type="text"
                        value={settingsForm.socialLinks?.facebook || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, socialLinks: { ...settingsForm.socialLinks, facebook: e.target.value } })}
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-500 mb-1">Instagram Handle Profile link</label>
                      <input
                        type="text"
                        value={settingsForm.socialLinks?.instagram || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, socialLinks: { ...settingsForm.socialLinks, instagram: e.target.value } })}
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-500 mb-1">TikTok Handle Profile link</label>
                      <input
                        type="text"
                        value={settingsForm.socialLinks?.tiktok || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, socialLinks: { ...settingsForm.socialLinks, tiktok: e.target.value } })}
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-500 mb-1">YouTube Channel URL link</label>
                      <input
                        type="text"
                        value={settingsForm.socialLinks?.youtube || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, socialLinks: { ...settingsForm.socialLinks, youtube: e.target.value } })}
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit trigger button */}
                <button
                  type="submit"
                  className={`px-5 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-xs ${getAccentBg()}`}
                >
                  Save and Apply Customizations
                </button>
              </form>

              {/* ADMIN ACCOUNT SECURITY SETTING PANEL */}
              <div className="p-4 rounded-xl border border-rose-150 bg-rose-50/20 space-y-4 mt-8">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-rose-600" />
                  <span className="block text-xs font-bold text-rose-800 uppercase tracking-wider">Passcode Credentials Security Setup (Private Admin Setup)</span>
                </div>
                <p className="text-3xs text-gray-500 leading-relaxed max-w-2xl">
                  Update the global administrator login passphrase passcode. Upon updating, other active editor sessions will be securely expired and only you will have access using these credentials. Be sure to note down your new password passcode securely!
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-gray-500 mb-1 font-semibold">New User Handle Name</label>
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="e.g. administrator"
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1 font-semibold">New Passphrase Passcode</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="e.g. safeSecret123"
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-lg bg-white"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleUpdateCredentials}
                  disabled={!newUsername || !newPassword}
                  className="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 cursor-pointer disabled:opacity-50 transition-colors"
                >
                  Update Security Credentials
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
