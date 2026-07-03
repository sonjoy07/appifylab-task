"use server";

import { cookies } from 'next/headers';
import { PostResponse } from '@/app/lib/types';

const NEXT_EXTERNAL_API_URL = process.env.NEXT_EXTERNAL_API_URL || 'http://localhost:4000';

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
    return data as PaginatedPosts;
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

    return { success: true, message: 'Post created successfully!', error: '', createdPost: data };
  } catch (error: any) {
    return { success: false, message: '', error: 'Internal network connection dropped. Please try again.' };
  }
}
