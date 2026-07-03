'use client'
import React, { useState } from 'react'
interface SuggestedUser {
    name: string;
    role: string;
    company: string;
    avatarUrl: string;
}
interface FriendItem {
    id: string;
    name: string;
    role: string;
    imageUrl: string;
    isOnline: boolean;
    lastActive?: string; // Optional timestamp label
}

export default function RightSidebar() {
    const user: SuggestedUser = {
        name: 'Radovan SkillArena',
        role: 'Founder & CEO',
        company: 'Trophy',
        avatarUrl: '/Avatar.png',
    };
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Mock data mapping the exact details shown in your reference image
    const friends: FriendItem[] = [
        {
            id: '1',
            name: 'Steve Jobs',
            role: 'CEO of Apple',
            imageUrl: '/people1.png',
            isOnline: false,
            lastActive: '5 minute ago',
        },
        {
            id: '2',
            name: 'Ryan Roslansky',
            role: 'CEO of Linkedin',
            imageUrl: '/people2.png',
            isOnline: true,
        },
        {
            id: '3',
            name: 'Dylan Field',
            role: 'CEO of Figma',
            imageUrl: '/people3.png',
            isOnline: true,
        },
        {
            id: '1',
            name: 'Steve Jobs',
            role: 'CEO of Apple',
            imageUrl: '/people1.png',
            isOnline: false,
            lastActive: '5 minute ago',
        },
        {
            id: '2',
            name: 'Ryan Roslansky',
            role: 'CEO of Linkedin',
            imageUrl: '/people2.png',
            isOnline: true,
        },
        {
            id: '3',
            name: 'Dylan Field',
            role: 'CEO of Figma',
            imageUrl: '/people3.png',
            isOnline: true,
        },
        {
            id: '1',
            name: 'Steve Jobs',
            role: 'CEO of Apple',
            imageUrl: '/people2.png',
            isOnline: false,
            lastActive: '5 minute ago',
        },
        {
            id: '2',
            name: 'Ryan Roslansky',
            role: 'CEO of Linkedin',
            imageUrl: '/people1.png',
            isOnline: true,
        },
        {
            id: '3',
            name: 'Dylan Field',
            role: 'CEO of Figma',
            imageUrl: '/people3.png',
            isOnline: true,
        },
    ];

    // Filter friends list based on capsule input search query
    const filteredFriends = friends.filter(friend =>
        friend.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return (
        <div className='overflow-y-auto hide-scrollbar flex flex-col ml-5 mt-5 mr-20'>
            <div className="w-full max-w-[340px] rounded-2xl border border-slate-100 bg-white p-6 font-sans shadow-sm">

                {/* 1. HEADER SECTION */}
                <div className="flex items-center justify-between">
                    <h3 className="text-[17px] font-bold tracking-tight text-slate-800">
                        You Might Like
                    </h3>
                    <a
                        href="#"
                        className="text-sm font-semibold text-[#1890FF] hover:text-[#0050B3] transition-colors"
                    >
                        See All
                    </a>
                </div>

                {/* Thin Horizontal Splitter Rule */}
                <hr className="my-5 border-t border-slate-100/80" />

                {/* 2. USER PROFILE PANEL ROW */}
                <div className="flex items-center gap-4 mb-6">
                    {/* Rounded Profile Avatar Image Container */}
                    <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-full bg-slate-100 border border-slate-50">
                        <img
                            src={user.avatarUrl}
                            alt={user.name}
                            className="h-full w-full object-cover"
                        />
                    </div>

                    {/* Identity Details Block */}
                    <div className="flex flex-col">
                        <span className="text-[15px] font-bold text-slate-800 tracking-wide hover:text-[#1890FF] cursor-pointer transition-colors leading-snug">
                            {user.name}
                        </span>
                        <span className="text-[13px] text-slate-400 font-medium mt-0.5">
                            {user.role} <span className="lowercase text-slate-400 font-normal">at</span> {user.company}
                        </span>
                    </div>
                </div>

                {/* 3. INTERACTIVE ACTIONS ZONE FOOTER */}
                <div className="flex items-center gap-3">
                    {/* Ignore Action Button Option */}
                    <button
                        type="button"
                        className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors cursor-pointer text-center"
                    >
                        Ignore
                    </button>

                    {/* Primary Blue Follow Button Option */}
                    <button
                        type="button"
                        className="flex-1 rounded-xl bg-[#3B82F6] py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#1D4ED8] transition-colors cursor-pointer text-center"
                    >
                        Follow
                    </button>
                </div>

            </div>
            <div className="w-full mt-5 max-w-[340px] rounded-2xl border border-slate-100 bg-white p-6 font-sans shadow-sm">

                {/* 1. HEADER TITLE SECTION */}
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-[17px] font-bold tracking-tight text-slate-800">
                        Your Friends
                    </h3>
                    <a
                        href="#"
                        className="text-sm font-semibold text-[#1890FF] hover:text-[#0050B3] transition-colors"
                    >
                        See All
                    </a>
                </div>

                {/* 2. CAPSULE INPUT SEARCH BAR */}
                <div className="relative flex items-center bg-[#F0F2F5]/80 rounded-full h-11 px-4 mb-6 border border-transparent focus-within:border-slate-200 focus-within:bg-white transition-all">
                    <svg className="h-4 w-4 text-slate-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="input search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent w-full text-sm outline-none placeholder-slate-400 text-slate-700"
                    />
                </div>

                {/* 3. FRIENDS ROW DATA GRID */}
                <div className="flex flex-col gap-5">
                    {filteredFriends.map((friend: FriendItem) => (
                        <div key={friend.id} className="flex items-center justify-between gap-4 group cursor-pointer">

                            {/* Left Box: Avatar image and profile metadata descriptors */}
                            <div className="flex items-center gap-3.5 min-w-0">
                                {/* Rounded Pfp Frame */}
                                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-slate-100 border border-slate-50">
                                    <img
                                        src={friend.imageUrl}
                                        alt={friend.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>

                                {/* Text Meta Container */}
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[15px] font-bold text-slate-800 tracking-wide truncate group-hover:text-[#1890FF] transition-colors leading-tight">
                                        {friend.name}
                                    </span>
                                    <span className="text-[13px] text-slate-400 font-medium mt-1 truncate">
                                        {friend.role}
                                    </span>
                                </div>
                            </div>

                            {/* Right Box: Status Indicator Channel (Timestamp text OR Green Online Dot) */}
                            <div className="flex-shrink-0 text-right">
                                {friend.isOnline ? (
                                    /* Pure Green Active Indicator Dot */
                                    <div className="h-2.5 w-2.5 rounded-full bg-[#00B96B] shadow-sm mr-1"></div>
                                ) : (
                                    /* Last Active Time Label */
                                    <p className="text-[11px] text-slate-400/80 font-medium leading-tight max-w-[55px] break-words">
                                        {friend.lastActive}
                                    </p>
                                )}
                            </div>

                        </div>
                    ))}

                    {/* Empty state callback lookup wrapper if filter misses */}
                    {filteredFriends.length === 0 && (
                        <p className="text-center text-sm text-slate-400 py-2 select-none">No friends found</p>
                    )}
                </div>

            </div>
        </div>
    )
}
