export interface User {
  id: string; // Changed from number to string to match Supabase's UUID
  name: string;
  email: string;
  role: 'admin' | 'editor';
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  category_id: number;
  category?: Category;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  author?: User;
}