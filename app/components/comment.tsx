import React from 'react';
import ReactTimeAgo from 'react-time-ago';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

interface CommentData {
    id: string;
    text: string;
    createdAt: string;
    likesCount?: number;
    user: {
        firstName: string;
        lastName: string;
    };
}

interface CommentProps {
    comment: CommentData;
    showPreviousCommentsButton?: boolean;
    previousCommentsCount?: number;
    onShowPrevious?: () => void;
}

if (!TimeAgo.alreadyRegistered?.(en)) {
    TimeAgo.addDefaultLocale(en);
}

export default function Comment({
    comment,
    showPreviousCommentsButton,
    previousCommentsCount,
    onShowPrevious,
}: CommentProps) {
    const authorName = [comment.user?.firstName, comment.user?.lastName]
        .filter(Boolean)
        .join(' ') || 'Unknown User';

    return (
        <div className="w-full max-w-[620px] rounded-b-2xl border-t border-slate-100 bg-white font-sans mb-5">
            
            {showPreviousCommentsButton && previousCommentsCount ? (
                <div className="mb-5 px-1">
                    <button
                        type="button"
                        onClick={onShowPrevious}
                        className="text-[14px] font-bold text-slate-500 hover:text-[#1890FF] hover:underline cursor-pointer transition-colors"
                    >
                        View {previousCommentsCount} previous comment{previousCommentsCount > 1 ? 's' : ''}
                    </button>
                </div>
            ) : null}
            <div className="flex items-start gap-3">
                <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-full bg-slate-100 mt-1">
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
                <div className="flex flex-grow flex-col">
                    <div className="relative rounded-2xl bg-[#F0F2F5]/70 px-4 py-3 pb-4">
                        <span className="block text-[14px] font-bold text-slate-800 hover:text-[#1890FF] cursor-pointer transition-colors leading-tight mb-1">
                            {authorName}
                        </span>
                        <p className="text-[14px] font-medium leading-relaxed text-slate-600 break-words pr-2">
                            {comment.text}
                        </p>

                        {/* Floating Like Counts overlapping box structure */}
                        <div className="absolute -bottom-3 right-4 z-10 flex items-center gap-1 rounded-full bg-white px-2 py-0.5 shadow-sm border border-slate-100 select-none">
                            <div className="flex items-center -space-x-0.5">
                                <span className="text-[11px] bg-blue-500 rounded-full w-3.5 h-3.5 flex items-center justify-center text-white scale-90">👍</span>
                                <span className="text-[11px] bg-red-500 rounded-full w-3.5 h-3.5 flex items-center justify-center text-white scale-90">❤️</span>
                            </div>
                            <span className="text-[12px] font-bold text-slate-700 tracking-wide mt-0.5">
                                {comment.likesCount}
                            </span>
                        </div>
                    </div>

                    {/* Sub-interaction Row Links */}
                    <div className="mt-2 mb-4 flex items-center gap-2 pl-3 text-[13px] font-bold text-slate-700 select-none">
                        <button type="button" className="hover:text-[#1890FF] cursor-pointer">Like</button>
                        <span className="text-slate-400 font-normal">.</span>
                        <button type="button" className="hover:text-[#1890FF] cursor-pointer">Reply</button>
                        <span className="text-slate-400 font-normal">.</span>
                        <button type="button" className="hover:text-[#1890FF] cursor-pointer">Share</button>
                        <span className="text-slate-400 font-normal ml-1">.</span>
                        <ReactTimeAgo className='text-slate-400' date={comment.createdAt} locale="bn"/>
                    </div>

                    {/* 4. NESTED REPLY INPUT CAPSULE BOX */}
                    <div className="flex items-center gap-2.5 mt-1">
                        <div className="h-7 w-7 flex-shrink-0 overflow-hidden rounded-full bg-slate-100">
                            {/* <img src="https://unsplash.com" alt="Current user reply" className="h-full w-full object-cover" /> */}
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
                        <div className="relative flex flex-grow items-center rounded-full bg-[#F0F2F5]/80 px-4 py-2">
                            <input
                                type="text"
                                placeholder="Write a comment"
                                className="w-full bg-transparent text-[13px] text-slate-700 placeholder-slate-500 outline-none pr-14 font-medium"
                            />
                            <div className="absolute right-4 flex items-center gap-1.5 text-slate-400/80">
                                <button type="button" className="hover:text-slate-600 cursor-pointer">
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                    </svg>
                                </button>
                                <button type="button" className="hover:text-slate-600 cursor-pointer">
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <div className="min-w-0 flex-1">

                <p className="mt-4 text-sm leading-6 text-slate-700">
                    {comment.text}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-[13px] font-semibold text-slate-500">
                    <button type="button" className="hover:text-[#1890FF] transition-colors">
                        Like
                    </button>
                    <button type="button" className="hover:text-[#1890FF] transition-colors">
                        Reply
                    </button>
                    <button type="button" className="hover:text-[#1890FF] transition-colors">
                        Share
                    </button>
                </div>
            </div> */}
            </div>
         </div >
    );
}
