export interface UserMeta {
  firstName: string;
  lastName: string;
}

export interface CommentResponse {
  id: string;
  text: string;
  createdAt: string;
  user: UserMeta;
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
  isOwner?: boolean;
  user: UserMeta;
  comments?: CommentResponse[];
}
