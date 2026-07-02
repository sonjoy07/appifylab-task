import React from 'react'

interface StoryItem {
    id: string;
    userName: string;
    storyImageUrl: string;
    userAvatarUrl: string;
}
export default function Story() {
    const stories: StoryItem[] = [
        {
            id: '1',
            userName: 'Ryan Roslansky',
            storyImageUrl: 'https://unsplash.com',
            userAvatarUrl: 'https://unsplash.com',
        },
        {
            id: '2',
            userName: 'Ryan Roslansky',
            storyImageUrl: 'https://unsplash.com',
            userAvatarUrl: 'https://unsplash.com',
        },
        {
            id: '3',
            userName: 'Ryan Roslansky',
            storyImageUrl: 'https://unsplash.com',
            userAvatarUrl: 'https://unsplash.com',
        },
    ];
    return (
        <div className="relative flex w-full items-center gap-3 overflow-visible py-2">

            {/* 1. LEFT CARD: "YOUR STORY" CREATION NODE */}
            <div className="relative h-44 w-32 flex-shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-200 shadow-sm cursor-pointer group">
                {/* Background Half Image */}
                <div className="h-2/3 w-full overflow-hidden">
                    <img
                        src="https://unsplash.com"
                        alt="Your portrait"
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                </div>
                {/* Lower Slate Block Label */}
                <div className="absolute bottom-0 inset-x-0 h-1/3 bg-[#0F1E36] flex items-end justify-center pb-2 px-1">
                    <span className="text-[12px] font-bold tracking-wide text-white text-center select-none">
                        Your Story
                    </span>
                </div>
                {/* Floating Add Plus Action Button Icon */}
                <div className="absolute top-[66.6%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-[#1890FF] border-2 border-[#0F1E36] text-white shadow-md">
                    <svg className="h-4 w-4 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                </div>
            </div>

            {/* 2. REPEATING MIDDLE CARDS: ACTIVE USER STORIES */}
            {stories.map((story: StoryItem) => (
                <div
                    key={story.id}
                    className="relative h-44 w-32 flex-shrink-0 overflow-hidden rounded-xl bg-slate-900 border border-transparent shadow-sm cursor-pointer group"
                >
                    {/* Main Full-Size Story Render Image */}
                    <img
                        src={story.storyImageUrl}
                        alt={`${story.userName} story`}
                        className="h-full w-full object-cover opacity-85 group-hover:scale-105 group-hover:opacity-100 transition-all duration-200"
                    />

                    {/* Subtle dark gradient overlay so text stays perfectly readable */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>

                    {/* Absolute Top Right Avatar Badge Circle */}
                    <div className="absolute top-2 right-2 z-20 h-7 w-7 overflow-hidden rounded-full border-2 border-white shadow-md">
                        <img
                            src={story.userAvatarUrl}
                            alt={story.userName}
                            className="h-full w-full object-cover"
                        />
                    </div>

                    {/* Absolute Lower Boundary Username Label */}
                    <div className="absolute bottom-3 left-2 right-2 z-20">
                        <p className="text-[12px] font-bold tracking-wide text-white truncate drop-shadow-sm">
                            {story.userName}
                        </p>
                    </div>
                </div>
            ))}

            {/* 3. ABSOLUTE FLOATING NEXT/ARROW NAVIGATION LINK BUTTON */}
            <button
                type="button"
                className="absolute -right-3 top-1/2 -translate-y-1/2 z-30 flex h-7 w-7 items-center justify-center rounded-full bg-[#1890FF] text-white shadow-md hover:bg-[#0050B3] transition-colors cursor-pointer border border-transparent"
            >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </button>

        </div>
    )
}
