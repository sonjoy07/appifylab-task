import React,{JSX} from 'react'

interface MenuItem {
    label: string;
    isNew: boolean;
    icon: JSX.Element;
}

interface SuggestedPerson {
    id: string;
    name: string;
    role: string;
    imageUrl: string;
}

interface EventData {
    title: string;
    day: string;
    month: string;
    imageUrl: string;
    attendeesCount: number;
}
export default function LeftSidebar() {
    const menuItems: MenuItem[] = [
        {
            label: 'Learning',
            isNew: true,
            icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            label: 'Insights',
            isNew: false,
            icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                </svg>
            ),
        },
        {
            label: 'Find friends',
            isNew: false,
            icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
            ),
        },
        {
            label: 'Bookmarks',
            isNew: false,
            icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
            ),
        },
        {
            label: 'Group',
            isNew: false,
            icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
        },
        {
            label: 'Gaming',
            isNew: true,
            icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
            ),
        },
        {
            label: 'Settings',
            isNew: false,
            icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
        },
        {
            label: 'Save post',
            isNew: false,
            icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
            ),
        },
    ];
    const suggestions: SuggestedPerson[] = [
        {
            id: '1',
            name: 'Steve Jobs',
            role: 'CEO of Apple',
            imageUrl: '/people1.png',
        },
        {
            id: '2',
            name: 'Ryan Roslansky',
            role: 'CEO of Linkedin',
            imageUrl: '/people2.png',
        },
        {
            id: '3',
            name: 'Dylan Field',
            role: 'CEO of Figma',
            imageUrl: '/people3.png',
        },
    ];
    const event: EventData = {
        title: 'No more terrorism no more cry',
        day: '10',
        month: 'Jul',
        imageUrl: '/feed_event1.png', // A placeholder protest/crowd image
        attendeesCount: 17,
    };
    return (
        <div className='shrink-0 overflow-y-auto hide-scrollbar flex flex-col'>
            <aside className="w-full ml-20 mt-5 max-w-[280px] rounded-2xl border border-slate-100 bg-white p-6 font-sans shadow-sm">
                {/* Sidebar Header Title */}
                <h3 className="mb-5 text-lg font-bold tracking-tight text-slate-800">
                    Explore
                </h3>

                {/* Navigation Layout List */}
                <nav className="flex flex-col gap-1">
                    {menuItems.map((item: MenuItem, index: number) => (
                        <button
                            key={index}
                            className="group flex w-full items-center justify-between rounded-xl px-3 py-3 text-left font-medium text-slate-600 transition-all duration-150 hover:bg-slate-50 hover:text-[#1890FF] cursor-pointer"
                        >
                            {/* Left aligned: Icon & Text Label */}
                            <div className="flex items-center gap-3.5">
                                {/* Icon Container with slight mute/brighten transition */}
                                <div className="text-slate-500 transition-colors group-hover:text-[#1890FF]">
                                    {item.icon}
                                </div>
                                <span className="text-[15px] tracking-wide">
                                    {item.label}
                                </span>
                            </div>

                            {/* Right aligned: Custom Green Badge Node (Renders conditionally) */}
                            {item.isNew && (
                                <span className="rounded-md bg-[#00B96B] px-1.5 py-0.5 text-[11px] font-bold text-white tracking-wider select-none uppercase">
                                    New
                                </span>
                            )}
                        </button>
                    ))}
                </nav>
            </aside>
            <div className="w-full ml-20 mt-5 max-w-[280px] rounded-2xl border border-slate-100 bg-white p-6 font-sans shadow-sm">

                {/* Header Layout Zone */}
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-[17px] font-bold tracking-tight text-slate-800">
                        Suggested People
                    </h3>
                    <a
                        href="#"
                        className="text-sm font-semibold text-[#1890FF] hover:text-[#0050B3] transition-colors"
                    >
                        See All
                    </a>
                </div>

                {/* Suggested People Grid Rows */}
                <div className="flex flex-col gap-5">
                    {suggestions.map((person: SuggestedPerson) => (
                        <div key={person.id} className="flex items-center justify-between gap-3">

                            {/* Left Content Column: Avatar Image & Text Block */}
                            <div className="flex items-center gap-3">
                                {/* Circular Avatar Image */}
                                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-slate-100 border border-slate-50">
                                    <img
                                        src={person.imageUrl}
                                        alt={person.name}
                                        className="h-full w-full object-cover grayscale" // Grayscale applies matching image tint look
                                    />
                                </div>

                                {/* Title & Metadata Descriptions */}
                                <div className="flex flex-col">
                                    <span className="text-[12px] font-semibold text-slate-800 tracking-wide leading-tight hover:text-[#1890FF] cursor-pointer transition-colors">
                                        {person.name}
                                    </span>
                                    <span className="text-[11px] text-slate-400 font-medium mt-0.5">
                                        {person.role}
                                    </span>
                                </div>
                            </div>

                            {/* Right Action Button Column */}
                            <button
                                type="button"
                                className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-400 hover:border-[#1890FF] hover:bg-[#1890FF] hover:text-white transition-all cursor-pointer shadow-none"
                            >
                                Connect
                            </button>

                        </div>
                    ))}
                </div>

            </div>
            <div className="w-full ml-20 mt-5 max-w-[280px] rounded-2xl border border-slate-100 bg-white p-6 font-sans shadow-sm">

                {/* Header Layout Section */}
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-[17px] font-bold tracking-tight text-slate-800">
                        Events
                    </h3>
                    <a
                        href="#"
                        className="text-sm font-semibold text-[#1890FF] hover:text-[#0050B3] transition-colors"
                    >
                        See all
                    </a>
                </div>

                <div className="overflow-hidden mb-3 rounded-xl border border-slate-50 bg-white shadow-lg">

                    {/* Event Banner Image Slot */}
                    <div className="relative h-40 w-full overflow-hidden">
                        <img
                            src={event.imageUrl}
                            alt={event.title}
                            className="h-full w-full object-cover"
                        />
                    </div>

                    {/* Date and Title Grid Wrapper Section */}
                    <div className="flex items-start gap-4 p-4">

                        {/* Green Calendar Date Block */}
                        <div className="flex h-16 w-14 flex-shrink-0 flex-col items-center justify-center rounded-lg bg-[#00B96B] font-bold text-white shadow-sm select-none">
                            <span className="text-lg leading-none tracking-wide">{event.day}</span>
                            <span className="text-[13px] uppercase mt-0.5 leading-none">{event.month}</span>
                        </div>

                        {/* Event Content Title Label */}
                        <div className="flex flex-col">
                            <h4 className="text-[15px] font-bold leading-snug tracking-wide text-slate-800 hover:text-[#1890FF] cursor-pointer transition-colors line-clamp-2">
                                {event.title}
                            </h4>
                        </div>

                    </div>

                    {/* Footer Interaction Stats Panel Row */}
                    <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 bg-slate-50/30">
                        {/* People Count String */}
                        <span className="text-[13px] font-medium text-slate-400">
                            {event.attendeesCount} People Going
                        </span>

                        {/* Interactive Action Response Option Button */}
                        <button
                            type="button"
                            className="rounded-md border border-[#1890FF] bg-white px-4 py-1.5 text-sm font-semibold text-[#1890FF] hover:bg-[#1890FF] hover:text-white transition-all cursor-pointer"
                        >
                            Going
                        </button>
                    </div>

                </div>
                <div className="overflow-hidden mb-3 rounded-xl border border-slate-50 bg-white shadow-lg">

                    {/* Event Banner Image Slot */}
                    <div className="relative h-40 w-full overflow-hidden">
                        <img
                            src={event.imageUrl}
                            alt={event.title}
                            className="h-full w-full object-cover"
                        />
                    </div>

                    {/* Date and Title Grid Wrapper Section */}
                    <div className="flex items-start gap-4 p-4">

                        {/* Green Calendar Date Block */}
                        <div className="flex h-16 w-14 flex-shrink-0 flex-col items-center justify-center rounded-lg bg-[#00B96B] font-bold text-white shadow-sm select-none">
                            <span className="text-lg leading-none tracking-wide">{event.day}</span>
                            <span className="text-[13px] uppercase mt-0.5 leading-none">{event.month}</span>
                        </div>

                        {/* Event Content Title Label */}
                        <div className="flex flex-col">
                            <h4 className="text-[15px] font-bold leading-snug tracking-wide text-slate-800 hover:text-[#1890FF] cursor-pointer transition-colors line-clamp-2">
                                {event.title}
                            </h4>
                        </div>

                    </div>

                    {/* Footer Interaction Stats Panel Row */}
                    <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 bg-slate-50/30">
                        {/* People Count String */}
                        <span className="text-[13px] font-medium text-slate-400">
                            {event.attendeesCount} People Going
                        </span>

                        {/* Interactive Action Response Option Button */}
                        <button
                            type="button"
                            className="rounded-md border border-[#1890FF] bg-white px-4 py-1.5 text-sm font-semibold text-[#1890FF] hover:bg-[#1890FF] hover:text-white transition-all cursor-pointer"
                        >
                            Going
                        </button>
                    </div>

                </div>

            </div>
        </div>
    )
}
