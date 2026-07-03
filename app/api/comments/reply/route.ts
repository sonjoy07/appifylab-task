import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const NEXT_EXTERNAL_API_URL = process.env.NEXT_EXTERNAL_API_URL || 'http://localhost:4000';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { postId, commentId, text } = body;

  if (!postId || !commentId || !text?.trim()) {
    return NextResponse.json({ message: 'postId, commentId, and text are required.' }, { status: 400 });
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
  return NextResponse.json(data, { status: response.status });
}
