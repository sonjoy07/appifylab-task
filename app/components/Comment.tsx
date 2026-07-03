import React, { useEffect, useState } from 'react';
import ReactTimeAgo from 'react-time-ago';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import CommentReactionSelector from './CommentReactionSelector';
import ReactionsListPopup from './ReactionsListPopup';
import type { CommentResponse } from '@/app/lib/types';
import { apiFetch } from '@/app/lib/api-client';

TimeAgo.addDefaultLocale(en);

interface CommentProps {
    postId: string;
    comment: CommentResponse;
    showPreviousCommentsButton?: boolean;
    previousCommentsCount?: number;
    onShowPrevious?: () => void;
}

export default function Comment({
    postId,
    comment,
    showPreviousCommentsButton,
    previousCommentsCount,
    onShowPrevious,
}: CommentProps) {
    const authorName = `${comment.user?.firstName ?? ''} ${comment.user?.lastName ?? ''}`.trim() || 'Unknown User';

    const [isReplying, setReplying] = useState((comment.replies?.length ?? 0) > 0);
    const [showAllReplies, setShowAllReplies] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [isReplySubmitting, setIsReplySubmitting] = useState(false);
    const [replies, setReplies] = useState<CommentResponse[]>(comment.replies ?? []);
    const [commentData, setCommentData] = useState<CommentResponse>(comment);

    useEffect(() => {
        if ((comment.replies?.length ?? 0) > 0) {
            setReplies(comment.replies ?? []);
            setReplying(true);
        }
        setCommentData(comment);
    }, [comment]);

    const handleReplySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!replyText.trim()) return;
        setIsReplySubmitting(true);

        try {
            const response = await apiFetch(`/api/comments/reply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    postId,
                    commentId: comment.id,
                    text: replyText,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                const newReply: CommentResponse = {
                    ...data,
                    reactionsCount: { total: 0, breakdown: { like: 0, love: 0, haha: 0, wow: 0, sad: 0, angry: 0 } },
                    reactionsUsers: [],
                    currentUserReaction: null,
                };
                setReplies((prev) => [...prev, newReply]);
                setReplyText('');
                setReplying(true);
            } else {
                console.error('Reply save failed:', data);
            }
        } catch (error) {
            console.error('Reply save failed:', error);
        } finally {
            setIsReplySubmitting(false);
        }
    };

    const handleCommentReact = (reactionType: string | null) => {
        setCommentData((prev) => {
            const prevCount = prev.reactionsCount?.total ?? 0;
            const prevReaction = prev.currentUserReaction;
            let delta = 0;
            if (prevReaction && !reactionType) delta = -1;
            else if (!prevReaction && reactionType) delta = 1;
            const newTotal = Math.max(0, prevCount + delta);

            const newReactionsUsers = [...(prev.reactionsUsers ?? [])];
            if (prevReaction && prevReaction.toLowerCase() !== 'none') {
                newReactionsUsers.splice(0, 1);
            }
            if (reactionType && reactionType.toLowerCase() !== 'none') {
                newReactionsUsers.unshift({ id: '', email: '', firstName: 'You', type: reactionType });
            }

            return {
                ...prev,
                currentUserReaction: reactionType ?? null,
                reactionsCount: {
                    total: newTotal,
                    breakdown: prev.reactionsCount?.breakdown ?? { like: 0, love: 0, haha: 0, wow: 0, sad: 0, angry: 0 },
                },
                reactionsUsers: newReactionsUsers,
            };
        });
    };

    const handleReplyReact = (replyId: string, reactionType: string | null) => {
        setReplies((prev) =>
            prev.map((r) => {
                if (r.id !== replyId) return r;
                const prevCount = r.reactionsCount?.total ?? 0;
                const prevReaction = r.currentUserReaction;
                let delta = 0;
                if (prevReaction && !reactionType) delta = -1;
                else if (!prevReaction && reactionType) delta = 1;
                const newTotal = Math.max(0, prevCount + delta);

                const newReactionsUsers = [...(r.reactionsUsers ?? [])];
                if (prevReaction && prevReaction.toLowerCase() !== 'none') {
                    newReactionsUsers.splice(0, 1);
                }
                if (reactionType && reactionType.toLowerCase() !== 'none') {
                    newReactionsUsers.unshift({ id: '', email: '', firstName: 'You', type: reactionType });
                }

                return {
                    ...r,
                    currentUserReaction: reactionType ?? null,
                    reactionsCount: {
                        total: newTotal,
                        breakdown: r.reactionsCount?.breakdown ?? { like: 0, love: 0, haha: 0, wow: 0, sad: 0, angry: 0 },
                    },
                    reactionsUsers: newReactionsUsers,
                };
            })
        );
    };

    const hiddenRepliesCount = Math.max(0, replies.length - 1);
    const visibleReplies = showAllReplies ? replies : replies.slice(-1);

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

                        {(commentData.reactionsCount?.total ?? 0) > 0 && (
                            <div className="absolute -bottom-3 right-4 z-10 flex items-center gap-1 rounded-full bg-white px-2 py-0.5 shadow-sm border border-slate-100 select-none group">
                                <span className="text-[11px] bg-blue-500 rounded-full w-3.5 h-3.5 flex items-center justify-center text-white">👍</span>
                                <span className="text-[12px] font-bold text-slate-700 tracking-wide mt-0.5">
                                    {commentData.reactionsCount?.total}
                                </span>
                                {commentData.reactionsUsers && commentData.reactionsUsers.length > 0 && (
                                    <div className="hidden group-hover:block">
                                        <ReactionsListPopup
                                            reactionsUsers={commentData.reactionsUsers}
                                            reactionsCount={commentData.reactionsCount?.total ?? 0}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="mt-2 mb-4 flex items-center gap-2 pl-3 text-[13px] font-bold text-slate-700 select-none">
                        <CommentReactionSelector
                            commentId={comment.id}
                            initialReaction={commentData.currentUserReaction}
                            disabled={false}
                            onReact={handleCommentReact}
                        />
                        <span className="text-slate-400 font-normal">.</span>
                        <button
                            type="button"
                            onClick={() => setReplying((prev) => !prev)}
                            className="hover:text-[#1890FF] cursor-pointer"
                        >
                            Reply
                        </button>
                        <span className="text-slate-400 font-normal">.</span>
                        <button type="button" className="hover:text-[#1890FF] cursor-pointer">Share</button>
                        <span className="text-slate-400 font-normal ml-1">.</span>
                        <ReactTimeAgo className='text-slate-400' date={new Date(comment.createdAt)} locale="bn" />
                    </div>

                    {(isReplying || replies.length > 0) && (
                        <>
                            <div className="flex items-center gap-2.5 mt-1">
                                <div className="h-7 w-7 flex-shrink-0 overflow-hidden rounded-full bg-slate-100">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
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
                                <form onSubmit={handleReplySubmit} className="relative flex flex-grow items-center rounded-full bg-[#F0F2F5]/80 px-4 py-2">
                                    <input
                                        value={replyText}
                                        onChange={(event) => setReplyText(event.target.value)}
                                        placeholder="Write a reply"
                                        className="w-full bg-transparent text-[13px] text-slate-700 placeholder-slate-500 outline-none font-medium"
                                    />
                                </form>
                            </div>

                            {replies.length > 0 && (
                                <div className="mt-3 space-y-3">
                                    {hiddenRepliesCount > 0 && !showAllReplies && (
                                        <button
                                            type="button"
                                            onClick={() => setShowAllReplies(true)}
                                            className="ml-12 text-[13px] font-bold text-slate-500 hover:text-[#1890FF] hover:underline transition-colors cursor-pointer"
                                        >
                                            View {hiddenRepliesCount} previous repl{hiddenRepliesCount > 1 ? 'ies' : 'y'}
                                        </button>
                                    )}
                                    {visibleReplies.map((reply) => {
                                        const replyAuthor = [reply.user?.firstName ?? '', reply.user?.lastName ?? '']
                                            .filter((name): name is string => Boolean(name))
                                            .join(' ') || 'Unknown User';

                                        return (
                                            <div key={reply.id} className='flex flex-grow flex-col'>
                                                <div className="ml-11 rounded-2xl bg-[#F0F2F5]/70 px-4 py-3 text-sm">
                                                    <div className="flex items-start gap-3">
                                                        <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-slate-100">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
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
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between gap-3">
                                                                <p className="font-semibold text-slate-900">{replyAuthor}</p>
                                                                {/* <span className="text-xs text-slate-400">
                                                                    <ReactTimeAgo date={new Date(reply.createdAt)} locale="bn" />
                                                                </span> */}
                                                            </div>
                                                            <p className="mt-2 text-slate-600">{reply.text}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-2 mb-4 flex items-center gap-2 pl-3 ml-8 text-[13px] font-bold text-slate-700 select-none">
                                                    <CommentReactionSelector
                                                        commentId={reply.id}
                                                        initialReaction={reply.currentUserReaction}
                                                        disabled={false}
                                                        onReact={(type) => handleReplyReact(reply.id, type)}
                                                    />
                                                    {(reply.reactionsCount?.total ?? 0) > 0 && (
                                                        <span className="text-slate-500 relative group">
                                                            {reply.reactionsCount?.total} reaction{reply.reactionsCount?.total === 1 ? '' : 's'}
                                                            {reply.reactionsUsers && reply.reactionsUsers.length > 0 && (
                                                                <div className="hidden group-hover:block">
                                                                    <ReactionsListPopup
                                                                        reactionsUsers={reply.reactionsUsers}
                                                                        reactionsCount={reply.reactionsCount?.total ?? 0}
                                                                    />
                                                                </div>
                                                            )}
                                                        </span>
                                                    )}
                                                    <span className="text-slate-400 font-normal ml-1">.</span>
                                                    <ReactTimeAgo className='text-slate-400' date={new Date(reply.createdAt)} locale="bn" />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
