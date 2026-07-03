'use client'
import React from 'react'

const REACTION_EMOJIS: Record<string, string> = {
  like: '👍',
  love: '❤️',
  haha: '😂',
  wow: '😮',
  sad: '😢',
  angry: '😡',
};

interface ReactionUser {
  id: string;
  firstName: string;
  lastName?: string;
  type: string;
}

interface ReactionsListPopupProps {
  reactionsUsers: ReactionUser[];
  reactionsCount: number;
}

export default function ReactionsListPopup({ reactionsUsers, reactionsCount }: ReactionsListPopupProps) {
  if (!reactionsUsers || reactionsUsers.length === 0) return null;

  const grouped: Record<string, ReactionUser[]> = {};
  reactionsUsers.forEach((u) => {
    const key = u.type?.toLowerCase() || 'like';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(u);
  });

  const reactionOrder = ['like', 'love', 'haha', 'wow', 'sad', 'angry'];

  return (
    <div className="absolute bottom-full left-0 mb-2 z-50 min-w-[220px] rounded-xl bg-white shadow-lg border border-slate-200 p-3 animate-in fade-in slide-in-from-bottom-2 duration-150">
      <div className="text-[13px] font-bold text-slate-700 mb-2">
        {reactionsCount} reaction{reactionsCount !== 1 ? 's' : ''}
      </div>
      <div className="flex flex-col gap-2">
        {reactionOrder.map((type) => {
          const users = grouped[type];
          if (!users || users.length === 0) return null;
          return (
            <div key={type} className="flex items-center gap-2">
              <span className="text-base flex-shrink-0">{REACTION_EMOJIS[type] || '👍'}</span>
              <div className="flex flex-wrap gap-x-1">
                {users.map((u, i) => (
                  <span key={i} className="text-[13px] font-medium text-slate-700">
                    {u.firstName} {u.lastName || ''}{i < users.length - 1 ? ',' : ''}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
