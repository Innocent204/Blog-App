// src/lib/api/reactions.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export type ReactionType = 'like' | 'love' | 'celebrate' | 'insightful';

export interface ReactionCount {
  type: ReactionType;
  count: number;
}

export async function getPostReactions(postId: string): Promise<ReactionCount[]> {
  try {
    // First, get all reactions for the post
    const { data: reactions, error } = await supabase
      .from('reactions')
      .select('type')
      .eq('post_id', postId);

    if (error) {
      console.error('Error fetching reactions:', error);
      return [];
    }

    if (!reactions) return [];

    // Manually count reactions by type
    const reactionCounts = reactions.reduce<Record<ReactionType, number>>(
      (acc, { type }) => {
        if (type in acc) {
          acc[type as ReactionType]++;
        } else {
          acc[type as ReactionType] = 1;
        }
        return acc;
      },
      { like: 0, love: 0, celebrate: 0, insightful: 0 }
    );

    // Convert to array of { type, count } objects and filter out zero counts
    return Object.entries(reactionCounts)
      .map(([type, count]) => ({
        type: type as ReactionType,
        count,
      }))
      .filter(({ count }) => count > 0);
  } catch (error) {
    console.error('Error in getPostReactions:', error);
    return [];
  }
}

export async function getUserReaction(postId: string, userId: string): Promise<ReactionType | null> {
  try {
    const { data, error } = await supabase
      .from('reactions')
      .select('type')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data?.type || null;
  } catch (error) {
    console.error('Error in getUserReaction:', error);
    return null;
  }
}

export async function addReaction(postId: string, userId: string, type: ReactionType): Promise<void> {
  try {
    const { error } = await supabase
      .from('reactions')
      .upsert(
        { post_id: postId, user_id: userId, type },
        { onConflict: 'post_id,user_id,type' }
      );

    if (error) throw error;
  } catch (error) {
    console.error('Error in addReaction:', error);
    throw error;
  }
}

export async function removeReaction(postId: string, userId: string, type: ReactionType): Promise<void> {
  try {
    const { error } = await supabase
      .from('reactions')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId)
      .eq('type', type);

    if (error) throw error;
  } catch (error) {
    console.error('Error in removeReaction:', error);
    throw error;
  }
}