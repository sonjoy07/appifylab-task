"use client";

import React, { useEffect, useRef, useState } from 'react';
import { PostResponse } from '@/app/lib/types';
import Post from './Post';
import CreatePost from './CreatePost';
import Comments from './Comments';
import { apiFetch } from '@/app/lib/api-client';
import { getProfileAction } from '@/app/actions/auth';

interface PostsClientProps {
  initialPosts: PostResponse[];
  initialMeta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export default function PostsClient({ initialPosts, initialMeta }: PostsClientProps) {
  const [posts, setPosts] = useState<PostResponse[]>(initialPosts);
  const [meta, setMeta] = useState(initialMeta);
  const [page, setPage] = useState(initialMeta.currentPage);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ firstName: string; lastName: string; id: string } | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    getProfileAction().then((u) => {
      if (u) setCurrentUser(u);
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !isFetchingMore && page < meta.totalPages) {
          setIsFetchingMore(true);
        }
      },
      { rootMargin: '200px' }
    );

    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [isFetchingMore, page, meta.totalPages]);

  useEffect(() => {
    if (!isFetchingMore) return;

    const fetchNextPage = async () => {
      setIsLoading(true);

      const response = await apiFetch(`/api/feed?page=${page + 1}&limit=${meta.itemsPerPage}`);
      const result = await response.json();

      if (response.ok && result?.data) {
        setPosts((prev) => [...prev, ...result.data]);
        setMeta(result.meta);
        setPage(result.meta.currentPage);
      } else {
        console.error('Failed to load next page:', result);
      }

      setIsLoading(false);
      setIsFetchingMore(false);
    };

    fetchNextPage();
  }, [isFetchingMore, page, meta.itemsPerPage]);

  const handleReactionChange = (postId: string, newReaction: string | null, oldReaction: string | null) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;

        const newBreakdown = {
          like: 0,
          love: 0,
          haha: 0,
          wow: 0,
          sad: 0,
          angry: 0,
          ...post.reactionsCount.breakdown,
        };
        let newTotal = post.reactionsCount.total;
        let newReactionsUsers = [...(post.reactionsUsers ?? [])];

        if (oldReaction && oldReaction.toLowerCase() !== 'none') {
          const key = oldReaction.toLowerCase() as keyof typeof newBreakdown;
          if (newBreakdown[key] !== undefined) newBreakdown[key] = Math.max(0, newBreakdown[key] - 1);
          newTotal = Math.max(0, newTotal - 1);
          newReactionsUsers = newReactionsUsers.slice(1);
        }

        if (newReaction && newReaction.toLowerCase() !== 'none') {
          const key = newReaction.toLowerCase() as keyof typeof newBreakdown;
          if (newBreakdown[key] !== undefined) newBreakdown[key] += 1;
          newTotal += 1;
          newReactionsUsers = [
            { id: currentUser?.id ?? '', email: '', firstName: currentUser?.firstName ?? 'You', type: newReaction },
            ...newReactionsUsers,
          ];
        }

        return {
          ...post,
          currentUserReaction: newReaction && newReaction.toLowerCase() !== 'none' ? newReaction : null,
          reactionsCount: { total: newTotal, breakdown: newBreakdown },
          reactionsUsers: newReactionsUsers,
        };
      })
    );
  };

  const handleAddPost = (newPost: PostResponse) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  return (
    <div className="flex flex-col gap-5">
      <CreatePost onPostCreated={handleAddPost} />
      {posts.map((post) => (
        <div key={post.id}>
          <Post post={post} onReactionChange={(newR, oldR) => handleReactionChange(post.id, newR, oldR)} />
          <Comments postId={post.id} />
        </div>
      ))}
      <div ref={sentinelRef} className="h-4" />
      {isLoading && <div className="text-center text-sm text-slate-500">Loading more posts...</div>}
      {page >= meta.totalPages && <div className="text-center text-sm text-slate-500">No more posts.</div>}
    </div>
  );
}
