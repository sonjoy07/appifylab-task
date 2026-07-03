"use client";

import { useEffect, useState, useTransition } from 'react';
import { toggleReactionAction } from '@/app/actions/reactions';

type ReactionType = {
    name: string;
    emoji: string;
    colorClass: string;
};

interface ReactionSelectorProps {
    postId: string;
    initialReaction?: string | null;
    disabled?: boolean;
    onReactionChange?: (newReaction: string | null, oldReaction: string | null) => void;
}

const reactionList: ReactionType[] = [
    { name: 'Like', emoji: '👍', colorClass: 'text-[#1890FF]' },
    { name: 'Love', emoji: '❤️', colorClass: 'text-[#FF3B30]' },
    { name: 'Haha', emoji: '😆', colorClass: 'text-[#FFC107]' },
    { name: 'Wow', emoji: '😮', colorClass: 'text-[#FFC107]' },
    { name: 'Sad', emoji: '😢', colorClass: 'text-[#FFC107]' },
    { name: 'Angry', emoji: '😡', colorClass: 'text-[#FF5722]' },
];

const normalizeReaction = (reaction?: string | null): string | null => {
    if (!reaction) return null;
    const normalized = reaction.toLowerCase();
    const match = reactionList.find((react) => react.name.toLowerCase() === normalized);
    return match?.name ?? null;
};

export default function ReactionSelector({ postId, initialReaction, disabled = false, onReactionChange }: ReactionSelectorProps) {
    const [currentReaction, setCurrentReaction] = useState<string | null>(normalizeReaction(initialReaction));
    const [isHovered, setIsHovered] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        setCurrentReaction(normalizeReaction(initialReaction));
    }, [initialReaction]);

    const selectedReaction = reactionList.find((reaction) => reaction.name === currentReaction) ?? null;

    const handleSelectReaction = (type: string) => {
        if (disabled) return;
        setIsHovered(false);
        setErrorMessage(null);

        const previousReaction = currentReaction;
        const isTogglingOff = type === previousReaction;

        if (isTogglingOff) {
            setCurrentReaction(null);
            onReactionChange?.(null, previousReaction);
        } else {
            setCurrentReaction(type);
            onReactionChange?.(type, previousReaction);
        }

        startTransition(async () => {
            const result = await toggleReactionAction(postId, type);
            if (!result.success) {
                setCurrentReaction(previousReaction);
                onReactionChange?.(previousReaction, isTogglingOff ? null : type);
                setErrorMessage(result.error || 'Action not allowed.');
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
                    {reactionList.map((react) => (
                        <button
                            key={react.name}
                            type="button"
                            onClick={() => handleSelectReaction(react.name)}
                            className="transform text-xl transition-all duration-150 hover:scale-110 hover:-translate-y-1 cursor-pointer p-1"
                            title={react.name}
                        >
                            {react.emoji}
                        </button>
                    ))}
                </div>
            )}

            <button
                type="button"
                disabled={disabled}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-slate-50'} ${selectedReaction?.colorClass ?? 'text-slate-500'}`}
            >
                {selectedReaction ? (
                    <>
                        <span>{selectedReaction.emoji}</span>
                        <span className={selectedReaction.colorClass}>{selectedReaction.name.toUpperCase()}</span>
                    </>
                ) : (
                    <span>Like</span>
                )}
            </button>
        </div>
    );
}
