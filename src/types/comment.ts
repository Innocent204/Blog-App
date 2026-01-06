export interface CommentType {
  id: string;
  content: string;
  userId: string;
  postId: string;
  parentId: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  user: {
    id: string;
    name: string;
    username: string;
    image: string | null;
  };
  replies?: CommentType[];
  _count?: {
    replies: number;
  };
}

export interface CreateCommentData {
  content: string;
  postId: string;
  parentId?: string | null;
}

export interface CommentFormData {
  content: string;
  postId: string;
  parentId?: string | null;
}

export interface UpdateCommentData {
  content: string;
}

export interface CommentResponse {
  success: boolean;
  data?: CommentType;
  error?: string;
}
