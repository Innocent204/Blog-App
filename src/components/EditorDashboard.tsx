import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { PostEditor } from './PostEditor';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import {
  LogOut,
  Sun,
  Moon,
  Plus,
  Edit,
  Search,
  FileText,
  Eye,
  Calendar,
  User,
  BarChart3,
  TrendingUp,
  PenTool,
  Settings,
} from 'lucide-react';
import { Post, Category } from '../types';

// Mock data for editor
const mockCategories: Category[] = [
  { id: 1, name: 'Technology', slug: 'technology' },
  { id: 2, name: 'Design', slug: 'design' },
  { id: 3, name: 'Business', slug: 'business' },
  { id: 4, name: 'Lifestyle', slug: 'lifestyle' },
];

const mockEditorPosts: Post[] = [
  {
    id: 1,
    title: 'Getting Started with React Hooks',
    excerpt: 'A comprehensive guide to understanding and using React Hooks effectively',
    content: '<p>React Hooks have revolutionized...</p>',
    category_id: 1,
    category: mockCategories[0],
    status: 'published',
    created_at: '2025-11-15T10:00:00Z',
    updated_at: '2025-11-15T10:00:00Z',
  },
  {
    id: 2,
    title: 'CSS Grid vs Flexbox',
    excerpt: 'Understanding when to use Grid and when to use Flexbox',
    content: '<p>Both are powerful layout tools...</p>',
    category_id: 2,
    category: mockCategories[1],
    status: 'draft',
    created_at: '2025-11-14T10:00:00Z',
    updated_at: '2025-11-14T10:00:00Z',
  },
  {
    id: 3,
    title: 'TypeScript Best Practices',
    excerpt: 'Write better, safer TypeScript code',
    content: '<p>TypeScript provides amazing type safety...</p>',
    category_id: 1,
    category: mockCategories[0],
    status: 'published',
    created_at: '2025-11-13T10:00:00Z',
    updated_at: '2025-11-13T10:00:00Z',
  },
];

export function EditorDashboard() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>(mockEditorPosts);
  const [categories] = useState<Category[]>(mockCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [activeTab, setActiveTab] = useState<'posts' | 'profile'>('posts');

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
        category: categories.find((c) => c.id === postData.category_id) || mockCategories[0],
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
    // setTimeout to ensure the logout state is processed before navigation
    setTimeout(() => {
      navigate('/login', { replace: true });
      toast.success('Logged out successfully');
    }, 0);
  };

  const stats = {
    total: posts.length,
    published: posts.filter((p) => p.status === 'published').length,
    drafts: posts.filter((p) => p.status === 'draft').length,
    views: 3247,
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
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-card/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
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
                  <div className="text-xs text-muted-foreground font-medium tracking-wider">EDITOR DASHBOARD</div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={toggleTheme}
                className="border-border hover:bg-muted"
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                className="border-border hover:bg-muted"
                onClick={() => window.location.href = '/editor/settings'}
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="border-border hover:bg-muted"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b border-border">
          <Button
            variant={activeTab === 'posts' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('posts')}
            className="rounded-b-none"
          >
            <FileText className="w-4 h-4 mr-2" />
            My Posts
          </Button>
          <Button
            variant={activeTab === 'profile' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('profile')}
            className="rounded-b-none"
          >
            <User className="w-4 h-4 mr-2" />
            Profile
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'posts' ? (
            <motion.div
              key="posts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="hover:shadow-lg transition-all">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm text-muted-foreground">My Posts</CardTitle>
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">{stats.total}</div>
                    <p className="text-xs text-muted-foreground mt-1">Total articles</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm text-muted-foreground">Published</CardTitle>
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Eye className="w-4 h-4 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">{stats.published}</div>
                    <p className="text-xs text-muted-foreground mt-1">Live posts</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm text-muted-foreground">Drafts</CardTitle>
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">{stats.drafts}</div>
                    <p className="text-xs text-muted-foreground mt-1">In progress</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all">
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
                      <p className="text-xs text-primary">+12.5% this week</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Search and Filters */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search your posts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-full"
                      />
                    </div>
                    <div className="flex gap-2 flex-wrap justify-center lg:justify-start">
                      <Button
                        variant={selectedCategory === null ? 'default' : 'outline'}
                        onClick={() => setSelectedCategory(null)}
                        size="sm"
                      >
                        All
                      </Button>
                      {categories.map((category) => (
                        <Button
                          key={category.id}
                          variant={selectedCategory === category.id ? 'default' : 'outline'}
                          onClick={() => setSelectedCategory(category.id)}
                          size="sm"
                        >
                          {category.name}
                        </Button>
                      ))}
                    </div>
                    <Button onClick={handleCreatePost} className="whitespace-nowrap">
                      <Plus className="w-4 h-4 mr-2" />
                      New Post
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Posts List */}
              <div className="space-y-4">
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="group hover:shadow-lg transition-all hover:border-primary/40">
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
                              <div>Updated {new Date(post.updated_at).toLocaleDateString()}</div>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditPost(post)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
                
                {filteredPosts.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg mb-2">No posts found</h3>
                      <p className="text-muted-foreground mb-4">
                        {searchQuery || selectedCategory 
                          ? "Try adjusting your filters" 
                          : "Start writing your first post"}
                      </p>
                      {!searchQuery && !selectedCategory && (
                        <Button onClick={handleCreatePost}>
                          <Plus className="w-4 h-4 mr-2" />
                          Create Post
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Editor Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-20 h-20 bg-primary/10">
                      <AvatarFallback className="text-2xl text-primary">
                        {user?.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl">{user?.name}</h3>
                      <p className="text-muted-foreground">{user?.email}</p>
                      <Badge className="mt-2 bg-primary/20 text-primary border-primary/30">
                        Editor
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-border">
                    <div>
                      <h4 className="mb-2">Statistics</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted/30 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-primary">{stats.total}</div>
                          <div className="text-sm text-muted-foreground">Total Posts</div>
                        </div>
                        <div className="bg-muted/30 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-primary">{stats.views.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">Total Views</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="mb-2">Permissions</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2 text-muted-foreground">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          Create and edit posts
                        </li>
                        <li className="flex items-center gap-2 text-muted-foreground">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          Manage categories
                        </li>
                        <li className="flex items-center gap-2 text-muted-foreground">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          Publish content
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}