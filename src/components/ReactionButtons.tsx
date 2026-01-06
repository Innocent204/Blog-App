// src/components/ReactionButtons.tsx
'use client';

import { useState, useEffect } from 'react';
import { Heart, Zap, ThumbsUp, Lightbulb } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
import { getPostReactions, getUserReaction, addReaction, removeReaction } from '../lib/api/reactions';
import { useAuth } from '../contexts/SupabaseAuthContext';

type ReactionType = 'like' | 'love' | 'celebrate' | 'insightful';

const REACTIONS: { type: ReactionType; icon: React.ReactNode; label: string }[] = [
  { type: 'like', icon: <ThumbsUp className="h-4 w-4" />, label: 'Like' },
  { type: 'love', icon: <Heart className="h-4 w-4" />, label: 'Love' },
  { type: 'celebrate', icon: <Zap className="h-4 w-4" />, label: 'Celebrate' },
  { type: 'insightful', icon: <Lightbulb className="h-4 w-4" />, label: 'Insightful' },
];

interface ReactionButtonsProps {
  postId: string;
  className?: string;
}

export function ReactionButtons({ postId, className }: ReactionButtonsProps) {
  const { user } = useAuth();
  const [reactions, setReactions] = useState<{ type: string; count: number }[]>([]);
  const [userReaction, setUserReaction] = useState<ReactionType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadReactions = async () => {
      try {
        const [reactionsData, userReactionData] = await Promise.all([
          getPostReactions(postId),
          user ? getUserReaction(postId, user.id) : null
        ]);
        
        setReactions(reactionsData);
        setUserReaction(userReactionData);
      } catch (error) {
        console.error('Error loading reactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadReactions();
  }, [postId, user]);

  const handleReaction = async (type: ReactionType) => {
    if (!user) return;

    try {
      const isRemoving = userReaction === type;
      
      if (isRemoving) {
        await removeReaction(postId, user.id, type);
        setUserReaction(null);
        setReactions(prev => 
          prev.map(r => 
            r.type === type 
              ? { ...r, count: Math.max(0, r.count - 1) } 
              : r
          ).filter(r => r.count > 0)
        );
      } else {
        if (userReaction) {
          await removeReaction(postId, user.id, userReaction);
          setReactions(prev => 
            prev.map(r => 
              r.type === userReaction 
                ? { ...r, count: Math.max(0, r.count - 1) } 
                : r
            ).filter(r => r.count > 0)
          );
        }
        
        await addReaction(postId, user.id, type);
        setUserReaction(type);
        setReactions(prev => {
          const existing = prev.find(r => r.type === type);
          if (existing) {
            return prev.map(r => 
              r.type === type ? { ...r, count: r.count + 1 } : r
            );
          }
          return [...prev, { type, count: 1 }];
        });
      }
    } catch (error) {
      console.error('Error updating reaction:', error);
    }
  };

  if (isLoading) {
    return <div className={cn('flex gap-2', className)}>Loading reactions...</div>;
  }

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {REACTIONS.map(({ type, icon, label }) => {
        const count = reactions.find(r => r.type === type)?.count || 0;
        const isActive = userReaction === type;
        
        return (
          <Button
            key={type}
            variant={isActive ? 'default' : 'outline'}
            size="sm"
            className={cn('gap-1.5', isActive && 'bg-primary/10 text-primary')}
            onClick={() => handleReaction(type as ReactionType)}
            disabled={!user}
            title={!user ? 'Sign in to react' : label}
          >
            {icon}
            {count > 0 && <span>{count}</span>}
          </Button>
        );
      })}
    </div>
  );
}