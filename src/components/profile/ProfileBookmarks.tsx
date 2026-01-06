'use client';

import { useEffect, useState } from 'react';
import { Loader2, Bookmark, BookmarkCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import Link from 'next/link';
import { toast } from '@/components/ui/use-toast';

interface Bookmark {
  id: string;
  created_at: string;
  posts: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    created_at: string;
    author: {
      id: string;
      full_name: string;
      username: string;
      avatar_url: string | null;
    };
  };
}

export function ProfileBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const response = await fetch('/api/profile/bookmarks');
      if (!response.ok) {
        throw new Error('Failed to fetch bookmarks');
      }
      const data = await response.json();
      setBookmarks(data.bookmarks || []);
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
      setError('Failed to load bookmarks. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveBookmark = async (bookmarkId: string) => {
    setRemovingId(bookmarkId);
    try {
      const response = await fetch(`/api/bookmarks?postId=${bookmarkId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove bookmark');
      }

      // Optimistically update the UI
      setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
      
      toast({
        title: 'Bookmark removed',
        description: 'The post has been removed from your bookmarks.',
      });
    } catch (err) {
      console.error('Error removing bookmark:', err);
      toast({
        title: 'Error',
        description: 'Failed to remove bookmark. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setRemovingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-destructive/10 p-4 text-destructive">
        <p>{error}</p>
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-8 text-center">
        <Bookmark className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No bookmarks yet</h3>
        <p className="text-muted-foreground mt-2">
          Save posts to read later by clicking the bookmark icon on any post.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Bookmarks</CardTitle>
            <span className="text-sm text-muted-foreground">
              {bookmarks.length} {bookmarks.length === 1 ? 'bookmark' : 'bookmarks'}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {bookmarks.map((bookmark) => (
              <div 
                key={bookmark.id} 
                className="group relative flex items-start gap-4 rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveBookmark(bookmark.id)}
                    disabled={removingId === bookmark.id}
                    className="h-8 w-8"
                  >
                    {removingId === bookmark.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <BookmarkCheck className="h-4 w-4 text-destructive" />
                    )}
                    <span className="sr-only">Remove bookmark</span>
                  </Button>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <span>{format(new Date(bookmark.posts.created_at), 'MMM d, yyyy')}</span>
                    <span>•</span>
                    <Link 
                      href={`/profile/${bookmark.posts.author.username}`}
                      className="hover:underline hover:text-foreground"
                    >
                      {bookmark.posts.author.full_name || bookmark.posts.author.username}
                    </Link>
                  </div>
                  
                  <Link href={`/posts/${bookmark.posts.slug}`}>
                    <h3 className="font-medium text-foreground hover:underline">
                      {bookmark.posts.title}
                    </h3>
                    {bookmark.posts.excerpt && (
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {bookmark.posts.excerpt}
                      </p>
                    )}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
