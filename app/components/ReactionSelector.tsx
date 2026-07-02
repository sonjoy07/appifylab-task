"use client";

import React, { JSX, useState, useTransition } from 'react';
import { toggleReactionAction } from '@/app/actions/reactions';

interface ReactionType {
    name: string;
    emoji: string;
    colorClass: string;
    icon: JSX.Element;
}

interface ReactionSelectorProps {
    postId: string;
    initialReaction?: string;
}

export default function ReactionSelector({ postId, initialReaction = 'Like' }: ReactionSelectorProps): JSX.Element {
    const [currentReaction, setCurrentReaction] = useState<string>('Like');
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const reactionList: ReactionType[] = [
        {
            name: 'Like', emoji: '👍', colorClass: 'text-[#1890FF]', icon: (<svg xmlns="http://w3.org" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-[#1890FF]">
                <path d="M7.5 21H4.5A1.5 1.5 0 0 1 3 19.5v-7A1.5 1.5 0 0 1 4.5 11h3V21Zm13.06-8.24-1.25 5A2.25 2.25 0 0 1 17.1 19.5H9V11l3.58-5.36A1.5 1.5 0 0 1 15 6.5V9h4a2.25 2.25 0 0 1 2.25 2.25c0 .17-.02.34-.06.51Z" />
            </svg>)
        },
        {
            name: 'Love', emoji: '❤️', colorClass: 'text-[#FF3B30]', icon: (<svg xmlns="http://w3.org" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-[#FF3B30]">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>)
        },
        {
            name: 'Haha', emoji: '😆', colorClass: 'text-[#FFC107]', icon: (<svg xmlns="http://w3.org" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-[#FFC107]">
                <path fillRule="evenodd" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Zm-4-12.5a.75.75 0 0 1 .53-.22c.792.004 1.472.483 1.83 1.15a.75.75 0 1 1-1.33.69c-.114-.21-.35-.36-.63-.362a.75.75 0 0 1-.4-.128L8 10.5h-.5Zm8.53-.22a.75.75 0 0 1 0 1.06l-.53.53v-.13c.002.28-.148.517-.36.63a.75.75 0 1 1-.69-1.33c.667-.358 1.146-1.038 1.15-1.83a.75.75 0 0 1 .43-.13ZM6 14a6 6 0 0 0 12 0H6Z" clipRule="evenodd" />
            </svg>)
        },
        {
            name: 'Wow', emoji: '😮', colorClass: 'text-[#FFC107]', icon: (<svg xmlns="http://w3.org" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-[#FFC107]">
                <path fillRule="evenodd" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Zm-2.5-11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm-2.5 7a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" clipRule="evenodd" />
            </svg>
            )
        },
        {
            name: 'Sad', emoji: '😢', colorClass: 'text-[#FFC107]', icon: (<svg xmlns="http://w3.org" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-[#FFC107]">
                <path fillRule="evenodd" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10ZM9.5 9.5a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Zm5 0a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Zm.147 6.147a.75.75 0 0 0-1.06 0 3.25 3.25 0 0 1-4.594 0 .75.75 0 1 0-1.06 1.06 4.75 4.75 0 0 0 6.714 0 .75.75 0 0 0 0-1.06ZM8.5 14.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" clipRule="evenodd" />
            </svg>
            )
        },
        {
            name: 'Angry', emoji: '😡', colorClass: 'text-[#FF5722]', icon: (<svg xmlns="http://w3.org" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-[#FF5722]">
                <path fillRule="evenodd" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10ZM8.97 8.47a.75.75 0 0 1 1.06 0L11 9.44l.97-.97a.75.75 0 1 1 1.06 1.06l-1.5 1.5a.75.75 0 0 1-1.06 0l-1.5-1.5a.75.75 0 0 1 0-1.06Zm5.06 0a.75.75 0 0 1 1.06 0l1.5 1.5a.75.75 0 0 1-1.06 1.06l-.97-.97-.97.97a.75.75 0 1 1-1.06-1.06l1.5-1.5ZM8.25 15.5a3.75 3.75 0 0 1 7.5 0 .75.75 0 0 1-1.5 0 2.25 2.25 0 0 0-4.5 0 .75.75 0 0 1-1.5 0Z" clipRule="evenodd" />
            </svg>
            )
        },
    ];

    const handleSelectReaction = (type: string) => {
        setIsHovered(false);
        setErrorMessage(null);

        // Optimistically update the UI to make it feel instant
        const previousReaction = currentReaction;
        setCurrentReaction(type);

        startTransition(async () => {
            const result = await toggleReactionAction(postId, type);

            if (!result.success) {
                // If the server blocks it (e.g. self-reaction), roll back the change and flash the warning
                setCurrentReaction(previousReaction);
                setErrorMessage(result.error || "Action not allowed.");

                // Hide the toast validation message automatically after 3 seconds
                setTimeout(() => setErrorMessage(null), 3000);
            }
        });
    };

    return (
        <div
            className="relative"
            onMouseEnter={() => !isPending && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {errorMessage && (
                <div className="absolute bottom-12 left-0 right-0 z-50 rounded-lg bg-red-500 p-2 text-center text-xs font-bold text-white shadow-md animate-in fade-in slide-in-from-bottom-2">
                    {errorMessage}
                </div>
            )}
            {isHovered && (
                <div className="absolute bottom-10 left-0 z-50 flex items-center gap-2 rounded-full border border-slate-100 bg-white p-2 shadow-xl animate-in fade-in slide-in-from-bottom-3 duration-200">
                    {['Like', 'Love', 'Haha', 'Wow'].map((type) => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => handleSelectReaction(type)}
                            className="transform text-xl transition-all duration-150 hover:scale-130 hover:-translate-y-1 cursor-pointer p-1"
                        >
                            {type === 'Like' && '👍'}
                            {type === 'Love' && '❤️'}
                            {type === 'Haha' && '😆'}
                            {type === 'Wow' && '😮'}
                        </button>
                    ))}

                    <button
                        type="button"
                        disabled={isPending}
                        className="flex w-full items-center justify-center gap-2 h-12 text-slate-500 font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        <span>
                            {currentReaction === 'Like' && '👍'}
                            {currentReaction === 'Love' && '❤️'}
                            {currentReaction === 'Haha' && '😆'}
                            {currentReaction === 'Wow' && '😮'}
                        </span>
                        <span className={currentReaction !== 'Like' ? 'text-[#1890FF] font-bold' : ''}>
                            {currentReaction}
                        </span>
                    </button>

                    {/* {reactionList.map((react) => (
                        <button
                            key={react.name}
                            type="button"
                            onClick={() => {
                                setCurrentReaction(react.name);
                                setIsHovered(false);
                            }}
                            className="transform text-xl transition-all duration-150 hover:scale-130 hover:-translate-y-1 cursor-pointer p-1"
                            title={react.name}
                        >
                            {react.emoji}
                        </button>
                    ))} */}
                </div>
            )}

            {/* CORE BUTTON ON THE POST COMPONENT */}
            <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 text-slate-500 font-semibold rounded-lg hover:bg-slate-50"
            >
                <span>{reactionList.find(r => r.name === currentReaction)?.emoji}</span>
                <span className={reactionList.find(r => r.name === currentReaction)?.colorClass}>
                    {currentReaction}
                </span>
            </button>

        </div>
    );
}
