"use server";

import { cookies } from 'next/headers';
import { PostResponse } from '@/app/lib/types';

const NEXT_EXTERNAL_API_URL = process.env.NEXT_EXTERNAL_API_URL || 'http://localhost:4000';

function toAbsoluteImageUrl(url: string | null): string | null {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${NEXT_EXTERNAL_API_URL}${url}`;
}

export interface PaginatedPosts {
  data: PostResponse[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export async function getPostsAction(page = 1, limit = 10): Promise<PaginatedPosts> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;

    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    const response = await fetch(`${NEXT_EXTERNAL_API_URL}/posts?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Failed to fetch posts from external API:', response.statusText);
      return {
        data: [],
        meta: { totalItems: 0, itemCount: 0, itemsPerPage: limit, totalPages: 0, currentPage: page },
      };
    }

    const data = await response.json();
    const posts = data as PaginatedPosts;
    if (posts.data) {
      posts.data = posts.data.map((post) => ({
        ...post,
        mediaImageUrl: toAbsoluteImageUrl(post.mediaImageUrl),
      }));
    }
    return posts;
  } catch (error) {
    console.error('>>> [GET POSTS API ERROR]:', error);
    return {
      data: [],
      meta: { totalItems: 0, itemCount: 0, itemsPerPage: limit, totalPages: 0, currentPage: page },
    };
  }
}

export async function createPostAction(prevState: any, formData: FormData) {
  const textContent = formData.get('textContent') as string;
  const attachedFile = formData.get('attachedFile') as File;

  if (!textContent.trim() && (!attachedFile || attachedFile.size === 0)) {
    return { error: 'Cannot submit an empty post. Provide text or an image.' };
  }

  if (textContent.length > 5000) {
    return { error: 'Post text must not exceed 5000 characters.' };
  }

  if (attachedFile && attachedFile.size > 5 * 1024 * 1024) {
    return { error: `File too large (${(attachedFile.size / (1024 * 1024)).toFixed(1)}MB). Maximum size is 5MB.` };
  }

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;

    const apiPayload = new FormData();
    apiPayload.append('textContent', textContent);

    if (attachedFile && attachedFile.size > 0) {
      apiPayload.append('image', attachedFile);
    }

    const response = await fetch(`${NEXT_EXTERNAL_API_URL}/posts`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: apiPayload,
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: '', error: data.message || 'Failed to broadcast post to server backend.' };
    }

    return { success: true, message: 'Post created successfully!', error: '', createdPost: { ...data, mediaImageUrl: toAbsoluteImageUrl(data.mediaImageUrl) } };
  } catch (error: any) {
    return { success: false, message: '', error: 'Internal network connection dropped. Please try again.' };
  }
}
