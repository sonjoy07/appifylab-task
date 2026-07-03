"use client"
import React, { JSX, useEffect, useRef, useState } from 'react'
import ReactionSelector from './ReactionSelector';
import { PostResponse } from '@/app/lib/types';
import ReactTimeAgo from "react-time-ago"
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

TimeAgo.addDefaultLocale(en);

interface PostData {
    authorName: string;
    avatarUrl: string;
    timeAgo: string;
    privacy: string;
    textContent: string;
    mediaImageUrl: string;
    commentsCount: number;
    sharesCount: number;
    reactionsPreview: string[];
}

interface MenuOption {
    label: string;
    icon: JSX.Element;
    isDanger?: boolean;
    action?: () => void;
}

export default function Post( {post}: {post: PostResponse}) {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const apiUrl = process.env.NEXT_EXTERNAL_API_URL || 'http://localhost:4000';
    console.log('post',post)
    //  post = {
    //     timeAgo: '5 minute ago',
    //     privacy: 'Public',
    //     textContent: '-Healthy Tracking App',
    //     mediaImageUrl: 'https://unsplash.com', // Restaurant setting matching reference
    //     commentsCount: 12,
    //     sharesCount: 122,
    //     reactionsPreview: [
    //         'https://unsplash.com',
    //         'https://unsplash.com',
    //         'https://unsplash.com',
    //         'https://unsplash.com',
    //     ]
    // };
    const options: MenuOption[] = [
        {
            label: 'Save Post',
            icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
            ),
        },
        {
            label: 'Turn On Notification',
            icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
            ),
        },
        {
            label: 'Hide',
            icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            label: 'Edit Post',
            icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
            ),
        },
        {
            label: 'Delete Post',
            isDanger: true,
            icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            ),
        },
    ];

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="w-full max-w-[620px] mt-5 border border-slate-100 bg-white pt-5 font-sans shadow-sm overflow-hidden">

            {/* 1. CARD HEADER (User Meta Info) */}
            <div className="flex items-center justify-between px-5 mb-4">
                <div className="flex items-center gap-3.5">
                    {/* Author Pfp */}
                    <div className="h-11 w-11 flex-shrink-0 overflow-hidden rounded-full bg-slate-100">
                        {/* <img src={post.avatarUrl} alt={post.authorName} className="h-full w-full object-cover" /> */}
                        <svg
                            xmlns="http://w3.org"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-full w-full bg-slate-100 text-slate-400 p-2"
                        >
                            <path d="M18 21a6 6 0 0 0-12 0" />
                            <circle cx="12" cy="10" r="4" />
                            <circle cx="12" cy="12" r="10" />
                        </svg>
                    </div>
                    {/* Metadata Block */}
                    <div className="flex flex-col">
                        <span className="text-[15px] font-bold text-slate-800 tracking-wide hover:text-[#1890FF] cursor-pointer transition-colors leading-tight">
                            {post.user?.firstName} {post.user?.lastName}
                        </span>
                        <span className="text-[13px] text-slate-400 font-medium mt-1">
                            <ReactTimeAgo date={new Date(post.createdAt)} locale="bn"/> . {post.privacy}
                        </span>
                    </div>
                </div>

                {/* Options Context Menu Trigger Button */}
                <div className="relative" ref={menuRef}>
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`text-slate-300 hover:text-slate-500 p-1 rounded-full cursor-pointer transition-colors ${isMenuOpen ? 'bg-slate-100 text-slate-600' : ''}`}
                    >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0 12c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z" />
                        </svg>
                    </button>

                    {isMenuOpen && (
                        <div className="absolute right-0 top-8 z-50 w-[260px] rounded-2xl border border-slate-100 bg-white p-3 font-sans shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
                            <div className="flex flex-col gap-0.5">
                                {options.map((option: MenuOption, idx: number) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={option.action}
                                        className="group flex w-full items-center gap-3.5 rounded-xl px-2.5 py-2.5 text-left font-semibold transition-all duration-150 hover:bg-slate-50 cursor-pointer"
                                    >
                                        {/* Rounded Icon Accent Circles */}
                                        <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-colors ${option.isDanger
                                            ? 'bg-red-50 text-red-500 group-hover:bg-red-500 group-hover:text-white'
                                            : 'bg-[#E6F7FF] text-[#1890FF] group-hover:bg-[#1890FF] group-hover:text-white'
                                            }`}>
                                            {option.icon}
                                        </div>

                                        {/* Action Labels */}
                                        <span className={`text-[14px] font-medium tracking-wide transition-colors ${option.isDanger
                                            ? 'text-red-500 group-hover:text-red-600'
                                            : 'text-slate-600 group-hover:text-slate-900'
                                            }`}>
                                            {option.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 2. POST DESCRIPTION TEXT */}
            <div className="px-5 mb-4">
                <p className="text-[15px] font-bold tracking-wide text-slate-800 whitespace-pre-wrap leading-relaxed">
                    {post.textContent}
                </p>
            </div>

            
            {post.mediaImageUrl && <div className="w-full px-5 mb-4">
                <div className="overflow-hidden rounded-xl border border-slate-100/50 max-h-[420px] flex items-center justify-center bg-slate-50">
                    <img
                        src={`${apiUrl}${post.mediaImageUrl}`}
                        alt="Post content visualization"
                        className="w-full h-auto object-cover"
                    />
                </div>
            </div>}

            {/* 4. METRICS ROW PANEL (Likes Overlap Cluster & Counter Stats) */}
            <div className="flex items-center justify-between border-b border-slate-100/80 px-5 pb-4 mb-1">

                {/* Left Side: Overlapping Reactions Stack */}
                <div className="flex items-center">
                    <div className="flex -space-x-2 overflow-hidden py-1">
                        {(post.reactionsUsers ?? []).map((url, idx) => (
                            <svg
                                key={idx}
                                xmlns="http://w3.org"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5 rounded-full ring-2 ring-white text-[#1890FF] bg-amber-50"
                            >
                                <circle cx="12" cy="12" r="10" />
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        ))}
                    </div>
                    {/* Reaction Extent Total Counter Badge */}
                    {post.reactionsCount?.total !== 0 &&<div className="ml-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#1890FF] text-[10px] font-bold text-white ring-2 ring-white select-none">
                        {post.reactionsCount?.total>9 ? `${post.reactionsCount?.total}+`: post.reactionsCount?.total}
                    </div>}
                </div>

                {/* Right Side: Comments and Shares Counts */}
                <div className="flex items-center gap-3.5 text-[14px] text-slate-400 font-medium select-none">
                    <span className="hover:underline cursor-pointer"><strong className="text-slate-700 font-semibold">{post.totalComments}</strong> Comment</span>
                    <span className="hover:underline cursor-pointer"><strong className="text-slate-700 font-semibold">0</strong> Share</span>
                </div>
            </div>

            {/* 5. INTERACTIVE FOOTER ACTIONS PANEL ROW */}
            <div className="grid grid-cols-3 h-12 bg-white">
                <div className={`flex items-center justify-center border-r border-slate-50 ${post.currentUserReaction?
                    'bg-[#E6F7FF]': ''}`}>
                    <ReactionSelector
                      postId={post.id}
                      initialReaction={post.currentUserReaction ?? 'Like'}
                      disabled={post.isOwner ?? false}
                    />
                </div>

                {/* Comment Action Key Trigger Button */}
                <button type="button" className="flex items-center justify-center gap-2 text-slate-500 hover:text-[#1890FF] font-semibold text-[15px] hover:bg-slate-50 transition-colors cursor-pointer border-r border-slate-50 group">
                    <svg className="h-5 w-5 text-slate-400 group-hover:text-[#1890FF] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>Comment</span>
                </button>

                {/* Share Action Key Trigger Button */}
                <button type="button" className="flex items-center justify-center gap-2 text-slate-500 hover:text-[#1890FF] font-semibold text-[15px] hover:bg-slate-50 transition-colors cursor-pointer group">
                    <svg className="h-5 w-5 text-slate-400 group-hover:text-[#1890FF] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742l4.028-2.014m0 6.542l-4.028-2.014M12 12v0m0 0v0m0 0v0m0 0v0m0 0h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Share</span>
                </button>

            </div>

        </div>
    );
}
