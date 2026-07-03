"use client";

import { useState, useTransition } from 'react';
import { apiFetch } from '@/app/lib/api-client';

const reactionList = [
    { name: 'Like', emoji: '👍' },
    { name: 'Love', emoji: '❤️' },
    { name: 'Haha', emoji: '😆' },
    { name: 'Wow', emoji: '😮' },
    { name: 'Sad', emoji: '😢' },
    { name: 'Angry', emoji: '😡' },
];

interface CommentReactionSelectorProps {
    commentId: string;
    initialReaction?: string | null;
    disabled?: boolean;
    onReact?: (type: string | null) => void;
}

export default function CommentReactionSelector({
    commentId,
    initialReaction,
    disabled = false,
    onReact,
}: CommentReactionSelectorProps) {
    const [currentReaction, setCurrentReaction] = useState<string | null>(initialReaction ?? null);
    const [isHovered, setIsHovered] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSelectReaction = (type: string) => {
        if (disabled) return;
        setIsHovered(false);
        setErrorMessage(null);

        const previous = currentReaction;
        const newReaction = previous === type ? null : type;
        setCurrentReaction(newReaction);

        startTransition(async () => {
            try {
                const response = await apiFetch(`/api/comments/${commentId}/reactions`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type }),
                });

                const data = await response.json();

                if (!response.ok) {
                    setCurrentReaction(previous);
                    setErrorMessage(data.message || 'Action not allowed.');
                    setTimeout(() => setErrorMessage(null), 3000);
                    return;
                }

                if (data.status === 'removed') {
                    setCurrentReaction(null);
                    onReact?.(null);
                } else {
                    onReact?.(type);
                }
            } catch {
                setCurrentReaction(previous);
                setErrorMessage('Network error.');
                setTimeout(() => setErrorMessage(null), 3000);
            }
        });
    };

    const selectedReaction = reactionList.find((r) => r.name === currentReaction);

    return (
        <div
            className="relative inline-flex"
            onMouseEnter={() => !isPending && !disabled && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {errorMessage && (
                <div className="absolute bottom-10 left-0 z-50 rounded-lg bg-red-500 px-2 py-1 text-xs font-bold text-white shadow-md whitespace-nowrap">
                    {errorMessage}
                </div>
            )}

            {isHovered && (
                <div className="absolute bottom-8 left-0 z-50 flex items-center gap-1 rounded-full border border-slate-100 bg-white px-2 py-1.5 shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
                    {reactionList.map((react) => (
                        <button
                            key={react.name}
                            type="button"
                            onClick={() => handleSelectReaction(react.name)}
                            className="transform text-lg transition-all duration-150 hover:scale-110 hover:-translate-y-1 cursor-pointer p-0.5"
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
                onClick={() => selectedReaction ? handleSelectReaction(selectedReaction.name) : handleSelectReaction('Like')}
                className={`rounded-full px-2.5 py-1 text-[13px] font-bold transition cursor-pointer select-none ${
                    selectedReaction
                        ? 'bg-[#E6F7FF] text-[#1890FF]'
                        : 'text-slate-700 hover:text-[#1890FF]'
                } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
            >
                {selectedReaction ? `${selectedReaction.emoji} ${selectedReaction.name}` : 'Like'}
            </button>
        </div>
    );
}
