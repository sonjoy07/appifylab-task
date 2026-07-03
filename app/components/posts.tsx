import React, { JSX } from 'react'
import PostsClient from './PostsClient'
import { getPostsAction } from '@/app/actions/feed';

export default async function Posts() {
  const postsData = await getPostsAction(1, 10);
  console.log('post',postsData)
  return <PostsClient initialPosts={postsData.data} initialMeta={postsData.meta} />;
}
