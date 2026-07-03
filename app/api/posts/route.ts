import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const NEXT_EXTERNAL_API_URL = process.env.NEXT_EXTERNAL_API_URL || 'http://localhost:4000';

function toAbsoluteImageUrl(url: string | null): string | null {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${NEXT_EXTERNAL_API_URL}${url}`;
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;

  const formData = await req.formData();

  const response = await fetch(`${NEXT_EXTERNAL_API_URL}/posts`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  const data = await response.json();
  if (data?.mediaImageUrl) {
    data.mediaImageUrl = toAbsoluteImageUrl(data.mediaImageUrl);
  }
  return NextResponse.json(data, { status: response.status });
}
