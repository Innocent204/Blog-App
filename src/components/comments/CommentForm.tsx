import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { useToast } from '../../components/ui/use-toast';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import { CommentFormData } from '../../types/comment.ts';

interface CommentFormProps {
  postId: string;
  parentId?: string | null;
  onCommentAdded?: () => void;
  initialValue?: string;
  autoFocus?: boolean;
  className?: string;
}

export function CommentForm({
  postId,
  parentId = null,
  onCommentAdded,
  initialValue = '',
  autoFocus = false,
  className = '',
}: CommentFormProps) {
  const [content, setContent] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast({
        title: 'Error',
        description: 'Comment cannot be empty',
        type: 'destructive',
      });
      return;
    }

    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to post a comment',
        type: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const commentData: CommentFormData = {
        content: content.trim(),
        postId: postId,
        parentId: parentId || undefined,
      };

      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await user).id}`,
        },
        body: JSON.stringify(commentData),
      });
      if (!response.ok) {
        throw new Error('Failed to post comment');
      }

      setContent('');
      toast({
        title: 'Success',
        description: 'Comment posted successfully',
        type: 'default',
      });

      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to post comment. Please try again.',
        type: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-3 ${className}`}>
      <Textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        className="min-h-[100px]"
        disabled={isSubmitting}
      />
      <div className="flex justify-end gap-2">
        {onCommentAdded && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onCommentAdded()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button 
          type="submit" 
          size="sm"
          disabled={!content.trim() || isSubmitting}
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </Button>
      </div>
    </form>
  );
}
