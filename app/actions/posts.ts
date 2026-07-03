"use server";

import { cookies } from 'next/headers';

const NEXT_EXTERNAL_API_URL = process.env.NEXT_EXTERNAL_API_URL || "http://localhost:4000";

export interface PostResponse {
  id: string;
  textContent: string;
  mediaImageUrl: string;
  createdAt: string;
  privacy: string;
  totalComments:number;
  reactionsUsers: Array<{id:string,email:string,firstName: string,LastName: string}>
  reactionsCount:{
    total: number;
  }
  user: {
    firstName: string;
    lastName: string;
  };
  _count: {
    comments: number;
    reactions: number;
  };
}

export async function getPostsAction(): Promise<PostResponse[]> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;

    // Fetch from your external backend url
    const response = await fetch(`${NEXT_EXTERNAL_API_URL}/posts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      },
      cache: "no-store", 
    });

    if (!response.ok) {
      console.error("Failed to fetch posts from external API:", response.statusText);
      return [];
    }

    const data = await response.json();
    return (data.posts || data) as PostResponse[];

  } catch (error) {
    console.error(">>> [GET POSTS API ERROR]:", error);
    return [];
  }
}

export async function createPostAction(prevState: any, formData: FormData) {
  const textContent = formData.get("textContent") as string;
  const attachedFile = formData.get("attachedFile") as File;

  // Validate that the user actually provided content
  if (!textContent.trim() && (!attachedFile || attachedFile.size === 0)) {
    return { error: "Cannot submit an empty post. Provide text or an image." };
  }

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;
   
    const apiPayload = new FormData();
    apiPayload.append("textContent", textContent);
    
    
    if (attachedFile && attachedFile.size > 0) {
      apiPayload.append("mediaImageUrl", attachedFile);
    }

    
    const response = await fetch(`${NEXT_EXTERNAL_API_URL}/posts`, {
      method: "POST",
      headers: {
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      },
      body: apiPayload,
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: "", error: data.message || "Failed to broadcast post to server backend." };
    }

    return { success: true, 
      message: "Post created successfully!", 
      error: "" };

  } catch (error: any) {
    return { success: false, message: "",error: "Internal network connection dropped. Please try again." };
  }
}
