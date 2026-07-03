"use client";

import React, { useEffect, useRef, useState } from 'react';
import { PostResponse } from '@/app/lib/types';
import Post from './Post';
import CreatePost from './CreatePost';
import Comments from './Comments';
import { apiFetch } from '@/app/lib/api-client';

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
  const sentinelRef = useRef<HTMLDivElement | null>(null);

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

  const handleAddPost = (newPost: PostResponse) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  return (
    <div className="flex flex-col gap-5">
      <CreatePost onPostCreated={handleAddPost} />
      {posts.map((post) => (
        <div key={post.id}>
          <Post post={post} />
          <Comments postId={post.id} />
        </div>
      ))}
      <div ref={sentinelRef} className="h-4" />
      {isLoading && <div className="text-center text-sm text-slate-500">Loading more posts...</div>}
      {page >= meta.totalPages && <div className="text-center text-sm text-slate-500">No more posts.</div>}
    </div>
  );
}
