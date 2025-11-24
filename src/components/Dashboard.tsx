import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { PostEditor } from './PostEditor';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { MainNav } from './MainNav';
import {
  LogOut,
  Sun,
  Moon,
  Plus,
  Edit,
  Trash2,
  Search,
  FileText,
  FolderOpen,
  Eye,
  TrendingUp,
  Users,
  Calendar,
  BarChart3,
  Settings,
  PenTool,
} from 'lucide-react';
import { Post, Category } from '../types';

// Mock data
const mockCategories: Category[] = [
  { id: 1, name: 'Technology', slug: 'technology' },
  { id: 2, name: 'Design', slug: 'design' },
  { id: 3, name: 'Business', slug: 'business' },
  { id: 4, name: 'Lifestyle', slug: 'lifestyle' },
];

const mockPosts: Post[] = [
  {
    id: 1,
    title: 'Getting Started with Next.js 16',
    excerpt: 'Learn the fundamentals of the latest Next.js version and explore its powerful features',
    content: '<p>Next.js 16 introduces exciting new features...</p>',
    category_id: 1,
    category: mockCategories[0],
    status: 'published',
    created_at: '2025-11-15T10:00:00Z',
    updated_at: '2025-11-15T10:00:00Z',
  },
  {
    id: 2,
    title: 'Modern UI Design Principles',
    excerpt: 'Creating beautiful and functional user interfaces with cutting-edge design patterns',
    content: '<p>Design principles that stand the test of time...</p>',
    category_id: 2,
    category: mockCategories[1],
    status: 'published',
    created_at: '2025-11-14T10:00:00Z',
    updated_at: '2025-11-14T10:00:00Z',
  },
  {
    id: 3,
    title: 'Building Scalable APIs',
    excerpt: 'Best practices for API development that scale with your business',
    content: '<p>Learn how to build APIs that scale...</p>',
    category_id: 1,
    category: mockCategories[0],
    status: 'draft',
    created_at: '2025-11-13T10:00:00Z',
    updated_at: '2025-11-13T10:00:00Z',
  },
  {
    id: 4,
    title: 'The Future of Web Development',
    excerpt: 'Exploring emerging trends and technologies shaping the web',
    content: '<p>The web is evolving rapidly...</p>',
    category_id: 1,
    category: mockCategories[0],
    status: 'published',
    created_at: '2025-11-12T10:00:00Z',
    updated_at: '2025-11-12T10:00:00Z',
  },
  {
    id: 5,
    title: 'Minimalist Design Trends',
    excerpt: 'Less is more: embracing simplicity in modern design',
    content: '<p>Minimalism in design...</p>',
    category_id: 2,
    category: mockCategories[1],
    status: 'draft',
    created_at: '2025-11-11T10:00:00Z',
    updated_at: '2025-11-11T10:00:00Z',
  },
];

export function Dashboard() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>(mockPosts);

  const [categories] = useState<Category[]>(mockCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === null || post.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreatePost = () => {
    setEditingPost(null);
    setIsEditing(true);
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setIsEditing(true);
  };

  const handleDeletePost = (postId: number) => {
    setPosts(posts.filter((p) => p.id !== postId));
    toast.success('Post deleted successfully');
  };

  const handleSavePost = (postData: Partial<Post>) => {
    if (postData.id) {
      setPosts(posts.map((p) => (p.id === postData.id ? { ...p, ...postData } as Post : p)));
      toast.success('Post updated successfully');
    } else {
      const newPost: Post = {
        id: Math.max(...posts.map((p) => p.id)) + 1,
        title: postData.title || '',
        excerpt: postData.excerpt || '',
        content: postData.content || '',
        category_id: postData.category_id || 1,
        category: categories.find((c) => c.id === postData.category_id),
        status: postData.status || 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setPosts([newPost, ...posts]);
      toast.success('Post created successfully');
    }
    setIsEditing(false);
    setEditingPost(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const stats = {
    total: posts.length,
    published: posts.filter((p) => p.status === 'published').length,
    drafts: posts.filter((p) => p.status === 'draft').length,
    categories: categories.length,
    views: 12453,
    growth: 23.5,
  };

  if (isEditing) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-5xl mx-auto">
          <PostEditor
            post={editingPost}
            categories={categories}
            onSave={handleSavePost}
            onCancel={() => {
              setIsEditing(false);
              setEditingPost(null);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-card/80 border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-blue-500/30 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                <div className="relative w-10 h-10 bg-gradient-to-br from-primary to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-all duration-300">
                  <div className="flex items-center gap-0.5">
                    <PenTool className="w-4 h-4 text-white" strokeWidth={2.5} />
                    <FileText className="w-3.5 h-3.5 text-white/80" strokeWidth={2} />
                  </div>
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <h2 className="text-xl font-bold bg-gradient-to-r from-primary via-blue-400 to-cyan-400 bg-clip-text text-transparent">BlogCMS</h2>
                <div className="text-xs text-muted-foreground font-medium tracking-wider">ADMIN DASHBOARD</div>
                <p className="text-sm text-muted-foreground">Welcome back, <span className="text-primary">{user?.name}</span></p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={toggleTheme}
                className="border-primary/20 hover:bg-primary/10"
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                className="border-primary/20 hover:bg-primary/10"
                onClick={() => window.location.href = '/dashboard/settings'}
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="border-primary/20 hover:bg-primary/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-card to-card/50 border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-muted-foreground">Total Posts</CardTitle>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stats.total}</div>
                <p className="text-xs text-muted-foreground mt-1">All content</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-card to-card/50 border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-muted-foreground">Published</CardTitle>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Eye className="w-4 h-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stats.published}</div>
                <p className="text-xs text-muted-foreground mt-1">Live on site</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-card to-card/50 border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-muted-foreground">Total Views</CardTitle>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BarChart3 className="w-4 h-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stats.views.toLocaleString()}</div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-primary" />
                  <p className="text-xs text-primary">+{stats.growth}% this month</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-card to-card/50 border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-muted-foreground">Categories</CardTitle>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FolderOpen className="w-4 h-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stats.categories}</div>
                <p className="text-xs text-muted-foreground mt-1">Content types</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <Card className="border-primary/20 bg-gradient-to-r from-card to-card/50">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search posts by title or excerpt..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-input-background border-primary/20 focus:border-primary w-full"
                  />
                </div>
                <div className="flex gap-2 flex-wrap justify-center lg:justify-start">
                  <Button
                    variant={selectedCategory === null ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(null)}
                    className={selectedCategory === null ? 'bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20' : 'border-primary/20'}
                    size="sm"
                  >
                    All
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? 'default' : 'outline'}
                      onClick={() => setSelectedCategory(category.id)}
                      className={selectedCategory === category.id ? 'bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20' : 'border-primary/20'}
                      size="sm"
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
                <Button 
                  onClick={handleCreatePost}
                  className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 whitespace-nowrap"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Post
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Posts List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
                layout
              >
                <Card className="group hover:border-primary/40 transition-all border-primary/20 bg-gradient-to-br from-card to-card/50 hover:shadow-lg hover:shadow-primary/5">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3 mb-3 flex-wrap">
                          <h3 className="text-xl group-hover:text-primary transition-colors">
                            {post.title}
                          </h3>
                          <div className="flex gap-2 items-center">
                            <Badge 
                              variant={post.status === 'published' ? 'default' : 'secondary'}
                              className={post.status === 'published' ? 'bg-primary/20 text-primary border-primary/30' : ''}
                            >
                              {post.status}
                            </Badge>
                            <Badge variant="outline" className="border-primary/30 text-muted-foreground">
                              {post.category?.name}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-3 line-clamp-2">{post.excerpt}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(post.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {Math.floor(Math.random() * 1000 + 100)} views
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEditPost(post)}
                          className="border-primary/20 hover:bg-primary/10 hover:border-primary/40"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeletePost(post.id)}
                          className="border-destructive/20 hover:bg-destructive/10 hover:border-destructive/40"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <MainNav />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
