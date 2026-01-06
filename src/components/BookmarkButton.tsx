// src/components/BookmarkButton.tsx
'use client';

import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
import { toggleBookmark, isPostBookmarked } from '@/lib/api/bookmarks';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';

interface BookmarkButtonProps {
  postId: string;
  className?: string;
  variant?: 'icon' | 'text';
}

export function BookmarkButton({ 
  postId, 
  className,
  variant = 'icon'
}: BookmarkButtonProps) {
  const { user } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkBookmark = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        const bookmarked = await isPostBookmarked(postId, user.id);
        setIsBookmarked(bookmarked);
      } catch (error) {
        console.error('Error checking bookmark:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkBookmark();
  }, [postId, user]);

  const handleBookmark = async () => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to save bookmarks',
      });
      return;
    }

    try {
      const newBookmarkState = await toggleBookmark(postId, user.id);
      setIsBookmarked(newBookmarkState);
      
      toast({
        title: newBookmarkState ? 'Bookmark added' : 'Bookmark removed',
      });
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast({
        title: 'Error',
        description: 'Failed to update bookmark',
        type: 'destructive',
      });
    }
  };

  if (isLoading) {
  }

  return (
    <Button
      variant={variant === 'icon' ? 'ghost' : 'outline'}
      size={variant === 'icon' ? 'icon' : 'sm'}
      className={cn(
        variant === 'icon' ? 'h-10 w-10' : 'gap-2',
        isBookmarked && 'text-amber-500 hover:text-amber-600',
        className
      )}
      onClick={handleBookmark}
      title={isBookmarked ? 'Remove bookmark' : 'Save to bookmarks'}
    >
      {isBookmarked ? (
        <BookmarkCheck className="h-5 w-5" />
      ) : (
        <Bookmark className="h-5 w-5" />
      )}
      {variant === 'text' && (
        <span>{isBookmarked ? 'Saved' : 'Save'}</span>
      )}
    </Button>
  );
}