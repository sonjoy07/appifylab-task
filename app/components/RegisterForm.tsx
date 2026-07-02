'use client';
import Image from "next/image";
import { JSX, useActionState, useEffect } from "react";
import { registerAction } from "../actions/auth";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
    const router = useRouter();
    const [state, formAction, isPending] = useActionState(registerAction, null);

    useEffect(() => {
        if (state?.success) {
            router.push('/feed');
        }
    }, [state, router]);

    return (
        <div className="flex z-999 w-full flex-col justify-center px-10 ml-8 lg:w-1/3 lg:px-10 xl:px-10 bg-white">
            <div className="mx-auto w-full max-w-md">
                <div className="mb-6 mt-8 flex items-center justify-center gap-2">
                    <Image
                        className="flex flex-col dark:invert items-center"
                        src="/logo.svg"
                        alt="Next.js logo"
                        width={180}
                        height={40}
                    />
                </div>
                <div className="mb-10 text-center">
                    <p className="mt-2 text-slate-600">Get Started Now
                    </p>
                    <h4 className="text-2xl tracking-tight">Registration</h4>
                </div>
                <div>
                    <button
                        type="button"
                        className="flex w-full items-center justify-center gap-1 rounded-md border border-slate-100 bg-white px-2 py-3 text-sm font-semibold text-slate-700  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 cursor-pointer mb-8 focus-visible:outline-slate-600 transition"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" width="24" height="24" xmlns="http://w3.org">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                        </svg>
                        <span>Register with google</span>
                    </button>
                </div>

                <div className="relative flex items-center py-2 mb-10">
                    <div className="flex-grow border border-slate-200"></div>
                    <span className="mx-2 flex-shrink text-xs font-large  tracking-wider text-slate-400 select-none">
                        Or
                    </span>
                    <div className="flex-grow border border-slate-200"></div>
                </div>

                {state?.error && (
                    <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-500 border border-red-100">
                        {state.error}
                    </div>
                )}
                <form action={formAction} className="space-y-6">
                    <div>
                        <label htmlFor="firstname" className="block text-sm font-medium text-slate-700">
                            First Name
                        </label>
                        <div className="mt-1">
                            <input
                                id="firstname"
                                name="firstName"
                                type="text"
                                autoComplete="given-name"
                                required
                                className="block w-full rounded-md border border-slate-100 px-3 py-4 text-slate-900  focus:border-blue-500 focus:outline-none focus:ring-0 focus:ring-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                            Last Name
                        </label>
                        <div className="mt-1">
                            <input
                                id="lastname"
                                name="lastName"
                                type="text"
                                autoComplete="family-name"
                                required
                                className="block w-full rounded-md border border-slate-100 px-3 py-4 text-slate-900  focus:border-blue-500 focus:outline-none focus:ring-0 focus:ring-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                            Email
                        </label>
                        <div className="mt-1">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="block w-full rounded-md border border-slate-100 px-3 py-4 text-slate-900  focus:border-blue-500 focus:outline-none focus:ring-0 focus:ring-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                                Password
                            </label>
                        </div>
                        <div className="mt-1">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="block w-full rounded-md border border-slate-100 px-3 py-4 text-slate-900  focus:border-blue-500 focus:outline-none focus:ring-0 focus:ring-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                               Repeat Password
                            </label>
                        </div>
                        <div className="mt-1">
                            <input
                                id="confirm_password"
                                name="confirm_password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="block w-full rounded-md border border-slate-100 px-3 py-4 text-slate-900  focus:border-blue-500 focus:outline-none focus:ring-0 focus:ring-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="radio"
                                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700 select-none mr-8">
                                I agree to terms & conditions
                            </label>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-[#1890FF] px-4 py-3 text-md cursor-pointer font-semibold text-white shadow-sm hover:bg-[#1890FF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1890FF] transition"
                        >
                            Register now
                        </button>
                    </div>
                    <div className="mb-2 pb-10">
                        <p className="mt-20 text-md text-slate-600">
                            Already have an account?{' '}
                            <a
                                href="#"
                                className="font-medium text-[#1890FF] hover:text-[#0073e6] transition-colors duration-200"
                            >
                                Login here
                            </a>
                        </p>
                    </div>
                </form>

            </div>
        </div>
    )
}

