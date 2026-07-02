import React, { JSX } from 'react'
import Post from './Post'
import Comments from './Comments'
import { getPostsAction, PostResponse } from '@/app/actions/posts';


export default async function Posts() {
  const posts: PostResponse[] = await getPostsAction();
  console.log('posts',posts)
  return (
   posts?.data?.length !== 0 && posts?.data?.map((post:PostResponse,key:number)=>( <div key={key}>
      <Post post={post}/>
      <Comments/>
    </div>))
  )
}
