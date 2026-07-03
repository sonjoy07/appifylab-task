export async function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const response = await fetch(input, init);

  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    }
  }

  return response;
}
