"use server";

import { cookies } from 'next/headers';

const NEXT_EXTERNAL_API_URL = process.env.NEXT_EXTERNAL_API_URL || 'http://localhost:4000';

export interface CommentResponse {
  id: string;
  text: string;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
  };
  replies?: CommentResponse[];
}

export async function getComments(postId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;

    const response = await fetch(`${NEXT_EXTERNAL_API_URL}/posts/${postId}/comments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return { comments: [] };
    }

    const data = await response.json();
    return { comments: data };
  } catch (error) {
    console.error('>>> [GET COMMENTS API ERROR]:', error);
    return { comments: [] };
  }
}

export async function addComment(postId: string, formData: FormData) {
  const text = formData.get('text') as string;
  if (!text?.trim()) {
    return { success: false, error: 'Comment cannot be empty.' };
  }
  if (text.length > 1000) {
    return { success: false, error: 'Comment must not exceed 1000 characters.' };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;

  const response = await fetch(`${NEXT_EXTERNAL_API_URL}/posts/${postId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ text }),
  });

  const data = await response.json();
  if (!response.ok) {
    return { success: false, error: data.message || 'Failed to add comment.' };
  }

  return { success: true, comment: data };
}

export async function addReply(postId: string, commentId: string, formData: FormData) {
  const text = formData.get('text') as string;
  if (!text?.trim()) {
    return { success: false, error: 'Reply cannot be empty.' };
  }
  if (text.length > 1000) {
    return { success: false, error: 'Reply must not exceed 1000 characters.' };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;

  const response = await fetch(`${NEXT_EXTERNAL_API_URL}/posts/${postId}/comments/${commentId}/replies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ text }),
  });

  const data = await response.json();
  if (!response.ok) {
    return { success: false, error: data.message || 'Failed to add reply.' };
  }

  return { success: true, reply: data };
}
