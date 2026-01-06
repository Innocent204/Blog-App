import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { CommentType } from '../../types/comment';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { MessageSquare, Reply, Trash2 } from 'lucide-react';
import { CommentForm } from './CommentForm';

interface CommentProps {
  comment: CommentType;
  currentUserId: string | undefined;
  onReply: (parentId: string) => void;
  onDelete: (commentId: string) => void;
  level?: number;
}

export function Comment({ 
  comment, 
  currentUserId, 
  onReply, 
  onDelete, 
  level = 0 
}: CommentProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  const hasReplies = comment.replies && comment.replies.length > 0;
  const isAuthor = currentUserId === comment.userId;
  const userInitial = comment.user?.name?.[0] || comment.user?.username?.[0] || 'U';

  return (
    <div 
      className={`mt-4 ${level > 0 ? 'ml-8 border-l-2 pl-4 border-gray-200 dark:border-gray-700' : ''}`}
      style={{ marginLeft: `${level * 1.5}rem` }}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={comment.user?.image || ''} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {userInitial.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {comment.user?.name || comment.user?.username || 'Anonymous'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
              </div>
              {isAuthor && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6"
                  onClick={() => onDelete(comment.id)}
                >
                  <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="sr-only">Delete comment</span>
                </Button>
              )}
            </div>
            <p className="mt-1 text-sm">{comment.content}</p>
            
            <div className="mt-2 flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-xs gap-1"
                onClick={() => {
                  onReply(comment.id);
                  setIsReplying(!isReplying);
                }}
              >
                <Reply className="h-3.5 w-3.5" />
                Reply
              </Button>
              
              {hasReplies && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-xs gap-1"
                  onClick={() => setShowReplies(!showReplies)}
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  {showReplies ? 'Hide replies' : `Show replies (${comment.replies?.length})`}
                </Button>
              )}
            </div>
          </div>
          
          {isReplying && (
            <div className="mt-3 ml-2">
              <CommentForm 
                postId={comment.postId} 
                parentId={comment.id} 
                onCommentAdded={() => setIsReplying(false)}
                autoFocus
              />
            </div>
          )}
        </div>
      </div>
      
      {hasReplies && showReplies && (
        <div className="mt-2">
          {comment.replies?.map((reply: unknown) => (
            <Comment
              key={(reply as CommentType).id}
              comment={reply as CommentType}
              currentUserId={currentUserId}
              onReply={onReply}
              onDelete={onDelete}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
