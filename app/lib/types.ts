export interface UserMeta {
  firstName: string;
  lastName: string;
}

export interface ReactionSummary {
  total: number;
  breakdown: {
    like: number;
    love: number;
    haha: number;
    wow: number;
    sad: number;
    angry: number;
  };
}

export interface CommentResponse {
  id: string;
  text: string;
  createdAt: string;
  userId?: string;
  user: UserMeta;
  reactionsCount?: ReactionSummary;
  currentUserReaction?: string | null;
  reactionsUsers?: Array<{ id: string; email: string; firstName: string; lastName?: string; type: string }>;
  replies?: CommentResponse[];
}

export interface PostResponse {
  id: string;
  textContent: string;
  mediaImageUrl: string | null;
  createdAt: string;
  privacy: string;
  totalComments: number;
  reactionsCount: {
    total: number;
    breakdown?: {
      like: number;
      love: number;
      haha: number;
      wow: number;
      sad: number;
      angry: number;
    };
  };
  currentUserReaction?: string | null;
  reactionsUsers?: Array<{ id: string; email: string; firstName: string; lastName?: string; type: string }>;
  isOwner?: boolean;
  user: UserMeta;
  comments?: CommentResponse[];
}
