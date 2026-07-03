import React, { useEffect, useState } from 'react';
import ReactTimeAgo from 'react-time-ago';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

TimeAgo.addDefaultLocale(en);

interface CommentData {
    id: string;
    text: string;
    createdAt: string;
    likesCount?: number;
    currentUserReaction?: string | null;
    user: {
        firstName: string;
        lastName: string;
    };
    replies?: CommentData[];
}

interface CommentProps {
    postId: string;
    comment: CommentData;
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
    const [replies, setReplies] = useState<CommentData[]>(comment.replies ?? []);
    const [likesCount, setLikesCount] = useState(comment.likesCount ?? 0);
    const [liked, setLiked] = useState(comment.currentUserReaction === 'like');
    const [isLiking, setIsLiking] = useState(false);
    const [replyLikeCounts, setReplyLikeCounts] = useState<{ [key: string]: number }>({});
    const [replyLiked, setReplyLiked] = useState<{ [key: string]: boolean }>({});
    const [replyLiking, setReplyLiking] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        if ((comment.replies?.length ?? 0) > 0) {
            setReplies(comment.replies ?? []);
            setReplying(true);
        }

        setLikesCount(comment.likesCount ?? 0);
        setLiked(comment.currentUserReaction === 'like');

        const counts: { [key: string]: number } = {};
        const likedMap: { [key: string]: boolean } = {};
        (comment.replies ?? []).forEach((reply) => {
            counts[reply.id] = reply.likesCount ?? 0;
            likedMap[reply.id] = reply.currentUserReaction === 'like';
        });
        setReplyLikeCounts(counts);
        setReplyLiked(likedMap);
    }, [comment.replies, comment.likesCount, comment.currentUserReaction]);

    const handleReplySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!replyText.trim()) return;
        setIsReplySubmitting(true);

        try {
            const response = await fetch(`/api/comments/reply`, {
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
                setReplies((prev) => [...prev, data]);
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

    const handleLikeClick = async () => {
        if (isLiking) return;
        setIsLiking(true);

        try {
            const response = await fetch(`/api/comments/${comment.id}/reactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ type: 'like' }),
            });

            const data = await response.json();
            if (response.ok) {
                if (data.status === 'removed') {
                    setLiked(false);
                    setLikesCount((count) => Math.max(0, count - 1));
                } else if (data.status === 'added') {
                    setLiked(true);
                    setLikesCount((count) => count + 1);
                } else if (data.status === 'updated') {
                    setLiked(true);
                    setLikesCount((count) => count + 1);
                }
            } else {
                console.error('Like request failed:', data);
            }
        } catch (error) {
            console.error('Like request failed:', error);
        } finally {
            setIsLiking(false);
        }
    };

    const handleReplyLikeClick = async (replyId: string) => {
        if (replyLiking[replyId]) return;
        setReplyLiking((prev) => ({ ...prev, [replyId]: true }));

        try {
            const response = await fetch(`/api/comments/${replyId}/reactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ type: 'like' }),
            });

            const data = await response.json();
            if (response.ok) {
                if (data.status === 'removed') {
                    setReplyLiked((prev) => ({ ...prev, [replyId]: false }));
                    setReplyLikeCounts((prev) => ({ ...prev, [replyId]: Math.max(0, (prev[replyId] ?? 0) - 1) }));
                } else {
                    setReplyLiked((prev) => ({ ...prev, [replyId]: true }));
                    setReplyLikeCounts((prev) => ({ ...prev, [replyId]: (prev[replyId] ?? 0) + 1 }));
                }
            } else {
                console.error('Reply like request failed:', data);
            }
        } catch (error) {
            console.error('Reply like request failed:', error);
        } finally {
            setReplyLiking((prev) => ({ ...prev, [replyId]: false }));
        }
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

                        {/* Floating Like Counts overlapping box structure */}
                        <div className="absolute -bottom-3 right-4 z-10 flex items-center gap-1 rounded-full bg-white px-2 py-0.5 shadow-sm border border-slate-100 select-none">
                            <div className="flex items-center -space-x-0.5">
                                <span className="text-[11px] bg-blue-500 rounded-full w-3.5 h-3.5 flex items-center justify-center text-white scale-90">👍</span>
                                <span className="text-[11px] bg-red-500 rounded-full w-3.5 h-3.5 flex items-center justify-center text-white scale-90">❤️</span>
                            </div>
                            <span className="text-[12px] font-bold text-slate-700 tracking-wide mt-0.5">
                                {likesCount}
                            </span>
                        </div>
                    </div>

                    {/* Sub-interaction Row Links */}
                    <div className="mt-2 mb-4 flex items-center gap-2 pl-3 text-[13px] font-bold text-slate-700 select-none">
                        <button
                            type="button"
                            onClick={handleLikeClick}
                            disabled={isLiking}
                            className={`rounded-full px-2 py-1 transition cursor-pointer ${liked ? 'bg-[#E6F7FF] text-[#1890FF]' : 'text-slate-700 hover:text-[#1890FF]'}`}
                        >
                            {liked ? 'Liked' : 'Like'}
                        </button>
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
                                            <div className='flex flex-grow flex-col'><div key={reply.id} className="ml-11 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
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
                                                            <span className="text-xs text-slate-400">
                                                                <ReactTimeAgo date={new Date(reply.createdAt)} locale="bn" />
                                                            </span>
                                                        </div>
                                                        <p className="mt-2 text-slate-600">{reply.text}</p>
                                                    </div>
                                                </div>
                                                {/* </div> */}


                                            </div>
                                                <div className="mt-2 mb-4 flex items-center gap-2 pl-3 ml-8 text-[13px] font-bold text-slate-700 select-none">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleReplyLikeClick(reply.id)}
                                                        disabled={replyLiking[reply.id]}
                                                        className={`rounded-full px-2 py-1 transition cursor-pointer ${replyLiked[reply.id] ? 'bg-[#E6F7FF] text-[#1890FF]' : 'text-slate-700 hover:text-[#1890FF]'}`}
                                                    >
                                                        {replyLiked[reply.id] ? 'Liked' : 'Like'}
                                                    </button>
                                                    {(replyLikeCounts[reply.id] ?? 0) > 0 && (
                                                        <span className="text-slate-500">{replyLikeCounts[reply.id]} like{(replyLikeCounts[reply.id] ?? 0) === 1 ? '' : 's'}</span>
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
