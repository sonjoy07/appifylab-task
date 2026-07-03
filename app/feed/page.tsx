import React from 'react';
import Header from '../components/Header';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import Story from '../components/Story';
import PostsClient from '../components/PostsClient';
import { getPostsAction } from '@/app/actions/feed';

export default async function page() {
  const postsData = await getPostsAction(1, 10);

  return (
    <div className='bg-[#F0F2F5]'>
      <Header />
      <div className='flex'>
        <LeftSidebar />
        <div className='flex flex-col ml-8 mt-5'>
          <Story />
          <PostsClient initialPosts={postsData.data} initialMeta={postsData.meta} />
        </div>
        <RightSidebar />
      </div>
    </div>
  );
}
