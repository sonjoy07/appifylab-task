"use server";

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const NEXT_EXTERNAL_API_URL = process.env.NEXT_EXTERNAL_API_URL || "http://localhost:4000";

const COOKIE_NAME = 'session_token';
const COOKIE_OPTIONS = {
  httpOnly: true,     // Protects tokens against cross-site scripting (XSS) client extraction loops
  secure: process.env.NODE_ENV === 'production', // Requires true production HTTPS certificates
  sameSite: 'strict' as const, // Block cross-site reference payload forgery completely
  maxAge: 60 * 60 * 24 * 7,    // Persistent session length duration (7 Days)
  path: '/',
};

interface LoginResponse {
  token?: string;
  accessToken?: string;
  message?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export async function registerAction(prevState: any, formData: FormData) {
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirm_password') as string;


  if (!firstName || !lastName || !email || !password || !confirmPassword ) {
    return { error: 'All fields are strictly required to create an account.' };
  }

  try {
    const response = await fetch(`${NEXT_EXTERNAL_API_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, password, confirmPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.message || 'Registration failed. User profile may already exist.' };
    }

    // Automatically drop token cookie right after creation for an immediate login experience
    if (data.token) {
      const cookieStore = await cookies(); // Await cookies for Next.js 15 consistency
      cookieStore.set(COOKIE_NAME, data.token, COOKIE_OPTIONS);
    }

    return { success: true };

  } catch (error: any) {
    console.error(">>> [REGISTER ACTION ERROR]:", error.message);
    return { error: 'Failed to establish connection to the target server engine.' };
  }
}

export async function loginAction(prevState: any, formData: FormData) {
    
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  if (!email || !password) {
    return { error: 'Please fill in all fields.' };
  }

  try {    
    const response = await fetch(`${NEXT_EXTERNAL_API_URL}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.message || 'Invalid credentials. Please try again.' };
    }

    const authData = data as LoginResponse;
    const token = authData.token ?? authData.accessToken;
    console.log('token',token)

    if (!token) {
      return { error: data.message || 'Invalid credentials. Please try again.' };
    }

    // 2. Save the session JWT token inside a secure httpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, COOKIE_OPTIONS);

    return { success: true };

  } catch (error) {
    console.error('Login API error:', error);
    return { error: 'Internal connection error. Please try again later.' };
  }
}

export async function logoutAction() {
  
  const cookieStore = await cookies();

  cookieStore.delete(COOKIE_NAME);

  redirect('/login');
}

export async function getProfileAction() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const response = await fetch(`${NEXT_EXTERNAL_API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}