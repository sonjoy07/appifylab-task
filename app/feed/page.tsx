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
    <div className='h-screen flex flex-col overflow-hidden bg-[#F0F2F5]'>
      <Header />
      <div className='flex flex-1 overflow-hidden'>
        <LeftSidebar />
        <div className='shrink-1 overflow-y-auto hide-scrollbar flex flex-col ml-8 mt-5 -z-0'>
          <Story />
          <PostsClient initialPosts={postsData.data} initialMeta={postsData.meta} />
        </div>
        <RightSidebar />
      </div>
    </div>
  );
}
