import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const NEXT_EXTERNAL_API_URL = process.env.NEXT_EXTERNAL_API_URL || 'http://localhost:4000';

function toAbsoluteImageUrl(url: string | null): string | null {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${NEXT_EXTERNAL_API_URL}${url}`;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const page = url.searchParams.get('page') || '1';
  const limit = url.searchParams.get('limit') || '10';

  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;

  const response = await fetch(`${NEXT_EXTERNAL_API_URL}/posts?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: 'no-store',
  });

  const data = await response.json();
  if (data?.data) {
    data.data = data.data.map((post: any) => ({
      ...post,
      mediaImageUrl: toAbsoluteImageUrl(post.mediaImageUrl),
    }));
  }
  return NextResponse.json(data, { status: response.status });
}
