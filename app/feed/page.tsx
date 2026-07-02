import Image from 'next/image'
import React, { JSX } from 'react'
import Header from '../components/Header';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import CreatePost from '../components/CreatePost';
import Posts from '../components/Posts';
import Story from '../components/Story';


export default function page(): JSX.Element {
    return (
        <div className='bg-[#F0F2F5]'>
           <Header/>
            <div className='flex'>
                <LeftSidebar/>
                <div className='flex flex-col ml-4 mt-5'>
                    <Story/>
                    <CreatePost/>
                    <Posts/>
                </div>
                <RightSidebar/>
            </div>
        </div>
    )
}
