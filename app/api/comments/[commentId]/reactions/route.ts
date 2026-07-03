import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const NEXT_EXTERNAL_API_URL = process.env.NEXT_EXTERNAL_API_URL || 'http://localhost:4000';

export async function POST(req: NextRequest, { params }: { params: Promise<{ commentId: string }> }) {
  const { commentId } = await params;
  const body = await req.json();
  const type = body?.type?.toLowerCase();

  if (!commentId || !type) {
    return NextResponse.json({ message: 'commentId and reaction type are required.' }, { status: 400 });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;

  const response = await fetch(`${NEXT_EXTERNAL_API_URL}/comments/${commentId}/reactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ type }),
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
