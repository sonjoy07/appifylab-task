"use client";

import React, { FormEvent, useEffect, useState } from 'react';
import Comment from './Comment';
import type { CommentResponse } from '@/app/lib/types';
import { apiFetch } from '@/app/lib/api-client';

interface CommentsProps {
  postId: string;
}

export default function Comments({ postId }: CommentsProps) {
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [showAllComments, setShowAllComments] = useState(false);
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const response = await apiFetch(`/api/comments?postId=${postId}`);
        const data = await response.json();
        setComments(Array.isArray(data) ? data : data.comments ?? []);
      } catch (error) {
        console.error('Failed to load comments:', error);
      }
    };

    loadComments();
    setShowAllComments(false);
  }, [postId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    if (!text.trim()) {
      setFeedback('Comment cannot be empty.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiFetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId, text }),
      });

      const data = await response.json();

      if (!response.ok) {
        setFeedback(data.message || 'Failed to save comment.');
      } else {
        const newComment: CommentResponse = {
          ...data,
          reactionsCount: { total: 0, breakdown: { like: 0, love: 0, haha: 0, wow: 0, sad: 0, angry: 0 } },
          reactionsUsers: [],
          currentUserReaction: null,
        };
        setComments((prev) => [...prev, newComment]);
        setText('');
        setFeedback('Comment posted successfully.');
      }
    } catch (error) {
      console.error('Comment save failed:', error);
      setFeedback('Unable to save comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[620px] rounded-b-2xl border-t border-slate-100 bg-white p-5 font-sans">
      <form onSubmit={handleSubmit} className="mb-5">
        {/* <div className="mb-4 flex items-center gap-3">
          <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-slate-100" />
          <input
            type="text"
            name="text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Write a comment and press Enter"
            className="w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-slate-300"
          />
        </div> */}
        
      <div className="mb-5 flex items-center gap-3">
        <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-slate-100">
          <svg
            xmlns="http://w3.org"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-full w-full bg-slate-100 text-slate-400 p-2"
          >
            <path d="M18 21a6 6 0 0 0-12 0" />
            <circle cx="12" cy="10" r="4" />
            <circle cx="12" cy="12" r="10" />
          </svg>
        </div>
        <div className="relative flex flex-grow items-center rounded-full bg-[#F0F2F5]/80 px-4 py-2.5">
          <input
            type="text"
            name="text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Write a comment"
            className="w-full bg-transparent text-[14px] text-slate-700 placeholder-slate-500 outline-none pr-16 font-medium"
          />
          <div className="absolute right-4 flex items-center gap-2 text-slate-400">
            <button type="button" className="hover:text-slate-600 cursor-pointer">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
            <button type="button" className="hover:text-slate-600 cursor-pointer">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      

        {/* {feedback && <div className="mt-3 text-sm text-slate-600">{feedback}</div>} */}
      </form>

      {(() => {
        const totalCount = comments.length;
        const latestComment = comments[comments.length - 1];

        const previousCommentsCount = showAllComments ? 0 : Math.max(0, totalCount - 1);
        const commentsToDisplay = showAllComments
          ? comments
          : latestComment
          ? [latestComment]
          : [];

        return (
          <>
            {commentsToDisplay.map((comment) => (
              <Comment
                key={comment.id}
                postId={postId}
                comment={comment}
                showPreviousCommentsButton={!showAllComments && previousCommentsCount > 0}
                previousCommentsCount={previousCommentsCount}
                onShowPrevious={() => setShowAllComments(true)}
              />
            ))}
          </>
        );
      })()}
    </div>
  );
}
