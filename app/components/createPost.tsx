"use client"
import React, { JSX, useState, useRef, ChangeEvent } from 'react';

export default function CreatePost(): JSX.Element {
  const [postText, setPostText] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-expand function for the textarea container box
  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    const val = e.target.value;
    setPostText(val);

    if (textareaRef.current) {
      // Reset height instantly to recalculate scroll heights properly
      textareaRef.current.style.height = 'auto';
      // Set to current inner text container size bounds (up to a max of 250px)
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 250)}px`;
    }
  };

  return (
    <div className="w-full mt-5 max-w-[620px] rounded-2xl border border-slate-100 bg-white p-5 font-sans shadow-sm">
      
      {/* 1. TOP WRITER TEXTAREA ROW CONTAINER */}
      <div className="flex items-start gap-3.5 mb-6">
        {/* User Profile Avatar Frame */}
        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-amber-100 border border-slate-50">
          <img
            src="https://unsplash.com"
            alt="User avatar"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Dynamic Expanding Text Area Input */}
        <div className="relative flex-grow pt-1">
          <textarea
            ref={textareaRef}
            rows={1}
            value={postText}
            onChange={handleTextareaChange}
            placeholder="Write something ..."
            className="w-full resize-none text-[16px] text-slate-700 outline-none bg-transparent placeholder-slate-400 font-medium leading-relaxed overflow-y-auto pr-8"
            style={{ minHeight: '32px' }}
          />
          
          {/* Small Decorative Edit Pencil Icon */}
          {postText.length === 0 && (
            <div className="absolute right-2 top-2 pointer-events-none text-slate-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* 2. LOWER BLUE INTERACTION ROW FOOTER PANEL */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#F4F7FC] p-3">
        
        {/* Media Attach Options Left Aligned Group */}
        <div className="flex items-center gap-1 sm:gap-4 flex-wrap">
          {/* Photo Button Option */}
          <button type="button" className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-slate-500 hover:bg-slate-200/60 transition-colors cursor-pointer">
            <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Photo</span>
          </button>

          {/* Video Button Option */}
          <button type="button" className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-slate-500 hover:bg-slate-200/60 transition-colors cursor-pointer">
            <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>Video</span>
          </button>

          {/* Event Button Option */}
          <button type="button" className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-slate-500 hover:bg-slate-200/60 transition-colors cursor-pointer">
            <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Event</span>
          </button>

          {/* Article Button Option */}
          <button type="button" className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-slate-500 hover:bg-slate-200/60 transition-colors cursor-pointer">
            <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Article</span>
          </button>
        </div>

        {/* Primary Blue Share Post Send Action Button Right Aligned */}
        <button
          type="button"
          disabled={postText.trim().length === 0}
          className={`flex items-center gap-2 rounded-xl bg-[#1890FF] px-6 py-2.5 text-base font-bold text-white shadow-sm hover:bg-[#0050B3] transition-all cursor-pointer ${
            postText.trim().length === 0 ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {/* Paper Airplane Send SVG Icon */}
          <svg className="h-4 w-4 transform rotate-45 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          <span>Post</span>
        </button>

      </div>

    </div>
  );
}
