'use client'
import React from 'react'

const EMOJIS: Record<string, string> = {
  like: '👍', love: '❤️', haha: '😂',
  wow: '😮', sad: '😢', angry: '😡',
};

export default function ReactionsListPopup({ reactionsUsers, reactionsCount }: any) {
  if (!reactionsUsers?.length) return null;

  const groups: Record<string, any[]> = {};
  for (const u of reactionsUsers) {
    const t = u.type || 'like';
    if (!groups[t]) groups[t] = [];
    groups[t].push(u);
  }

  const order = ['like', 'love', 'haha', 'wow', 'sad', 'angry'];

  return (
    <div className="absolute bottom-full left-0 mb-2 z-50 min-w-[220px] rounded-xl bg-white shadow-lg border border-slate-200 p-3">
      <div className="text-[13px] font-bold text-slate-700 mb-2">
        {reactionsCount} reaction{reactionsCount !== 1 ? 's' : ''}
      </div>
      <div className="flex flex-col gap-2">
        {order.map((type) => {
          const users = groups[type];
          if (!users) return null;
          return (
            <div key={type} className="flex items-center gap-2">
              <span className="text-base shrink-0">{EMOJIS[type] || '👍'}</span>
              <span className="text-[13px] font-medium text-slate-700">
                {users.map((u: any, i: number) => (
                  <span key={i}>{u.firstName} {u.lastName}{i < users.length - 1 ? ', ' : ''}</span>
                ))}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
