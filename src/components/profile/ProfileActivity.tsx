'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

type ActivityType = 'reaction' | 'bookmark' | 'comment' | 'post';

interface ActivityItem {
  id: string;
  type: ActivityType;
  created_at: string;
  post_id?: string;
  post_title?: string;
  post_slug?: string;
  reaction_type?: string;
  comment_content?: string;
}

export function ProfileActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('/api/profile/activity');
        if (!response.ok) {
          throw new Error('Failed to fetch activities');
        }
        const data = await response.json();
        setActivities(data.activities || []);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError('Failed to load activities. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'reaction':
        return '👍';
      case 'bookmark':
        return '🔖';
      case 'comment':
        return '💬';
      case 'post':
        return '✏️';
      default:
        return '•';
    }
  };

  const getActivityText = (activity: ActivityItem) => {
    const postLink = activity.post_slug ? (
      <Link 
        href={`/posts/${activity.post_slug}`} 
        className="font-medium text-primary hover:underline"
      >
        {activity.post_title || 'post'}
      </Link>
    ) : 'a post';

    switch (activity.type) {
      case 'reaction':
        return (
          <>
            You reacted with {activity.reaction_type} to {postLink}
          </>
        );
      case 'bookmark':
        return <>You bookmarked {postLink}</>;
      case 'comment':
        return (
          <>
            You commented on {postLink}: "{activity.comment_content?.substring(0, 100)}
            {activity.comment_content && activity.comment_content.length > 100 ? '...' : ''}"
          </>
        );
      case 'post':
        return <>You published {postLink}</>;
      default:
        return 'Unknown activity';
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

  if (activities.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-8 text-center">
        <p className="text-muted-foreground">No activities yet. Start engaging with content!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Your Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {activities.map((activity) => (
              <div key={activity.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-lg">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="mt-2 h-full w-px bg-border" />
                </div>
                <div className="flex-1 pb-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      {getActivityText(activity)}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
