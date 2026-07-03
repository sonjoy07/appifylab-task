"use server";

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const NEXT_EXTERNAL_API_URL = process.env.NEXT_EXTERNAL_API_URL || "http://localhost:4000";

export interface ReactionActionResponse {
  success: boolean;
  error?: string;
  message?: string;
}

export async function toggleReactionAction(
  postId: string, 
  reactionType: string
): Promise<ReactionActionResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;

    if (!token) {
      return { success: false, error: "You must be signed in to react to a post." };
    }

    // 1. Submit the payload to your external API backend
    const normalizedType = reactionType.toLowerCase();
    const response = await fetch(`${NEXT_EXTERNAL_API_URL}/posts/${postId}/reactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ type: normalizedType }),
    });

    const data = await response.json();

    // 2. Handle Server-Side Validation Errors
    // Your backend API should check: if (post.authorId === currentUserId) return 403 error
    if (!response.ok) {
      return { 
        success: false, 
        error: data.message || "Failed to process reaction." 
      };
    }

    // 3. Purge cached layouts to display the new updated count values instantly
    revalidatePath('/feed');
    return { success: true, message: "Reaction updated successfully!" };

  } catch (error) {
    console.error(">>> [TOGGLE REACTION API ERROR]:", error);
    return { success: false, error: "Network error occurred. Please try again." };
  }
}
