"use client"
import React, { JSX, useState, useRef, ChangeEvent, useActionState, useEffect } from 'react';
import { createPostAction } from '@/app/actions/feed';
import { PostResponse } from '@/app/lib/types';

interface CreatePostProps {
  onPostCreated?: (post: PostResponse) => void;
}

export default function CreatePost({ onPostCreated }: CreatePostProps): JSX.Element {
  const [postText, setPostText] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [state, formAction, isPending] = useActionState(createPostAction, null);
  const createdPostIdRef = useRef<string | number | null>(null);

  useEffect(() => {
    if (!state) return;

    if (!state?.success) {
      createdPostIdRef.current = null;
    }

    if (state.success) {
      setPostText('');
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
      if (fileInputRef.current) fileInputRef.current.value = '';

      const createdPost = state.createdPost as PostResponse | undefined;
      const createdPostId = createdPost?.id;

      if (onPostCreated && createdPost && createdPostId != null && createdPostIdRef.current !== createdPostId) {
        onPostCreated(createdPost);
        createdPostIdRef.current = createdPostId;
      }
    }
  }, [state, imagePreview, onPostCreated]);


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

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    setFileError(null);
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setFileError(`File too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum size is 10MB.`);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      setSelectedImage(file);

      // Generate a temporary browser RAM string URL to display the image preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const removeSelectedImage = (): void => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview); // Clean memory block caches
    }
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset core HTML file link nodes
    }
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    console.log("Submitting newsfeed post payload details:", {
      text: postText,
      attachedFile: selectedImage
    });

    // Reset layout fields cleanly on success
    setPostText('');
    removeSelectedImage();
  };

  return (
    <div className="w-full mt-5 max-w-[620px] rounded-2xl border border-slate-100 bg-white p-5 font-sans shadow-sm">
       {state?.error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-500 border border-red-100 animate-in fade-in duration-200">
          {state.error}
        </div>
      )}
       {state?.success && state?.message && (
         <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm font-semibold text-green-600 border border-green-100 animate-in fade-in duration-200">
           {state.message}
         </div>
       )}
       {fileError && (
         <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-500 border border-red-100 animate-in fade-in duration-200">
           {fileError}
         </div>
       )}
      <form action={formAction}>
        <input
          type="file"
          ref={fileInputRef}
          name="attachedFile"
          onChange={handleImageChange}
          accept="image/*"
          className="hidden"
        />

        {/* 1. TOP WRITER TEXTAREA ROW CONTAINER */}
        <div className="flex items-start gap-3.5 mb-6">
          {/* User Profile Avatar Frame */}
          <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-amber-100 border border-slate-50">
            {/* <img
            src="https://unsplash.com"
            alt="User avatar"
            className="h-full w-full object-cover"
          /> */}
            <svg
              xmlns="http://w3.org"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-full w-full bg-slate-100 text-slate-400 p-2"
            >
              <path d="M18 21a6 6 0 0 0-12 0" />
              <circle cx="12" cy="10" r="4" />
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>

          {/* Dynamic Expanding Text Area Input */}
          <div className="relative flex-grow pt-1">
            <textarea
              ref={textareaRef}
              name="textContent"
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

        {imagePreview && (
          <div className="relative w-full mb-5 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 max-h-[360px] flex items-center justify-center animate-in fade-in zoom-in-95 duration-200">
            <img
              src={imagePreview}
              alt="Upload validation display layout"
              className="w-full h-auto object-cover"
            />
            {/* Absolute Circular X Clear Button Upper Top Right */}
            <button
              type="button"
              onClick={removeSelectedImage}
              className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/70 text-white backdrop-blur-sm hover:bg-slate-900 transition-colors cursor-pointer border border-transparent"
              title="Remove image"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <div className="flex items-center justify-between gap-1 rounded-xl bg-[#F4F7FC] p-3">


          <div className="flex items-center gap-1 sm:gap-2 flex-1">

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm font-semibold transition-colors cursor-pointer ${imagePreview ? 'bg-[#E6F7FF] text-[#1890FF]' : 'text-slate-500 hover:bg-slate-200/60'
                }`}
            >
              <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Photo</span>
            </button>

            <button type="button" className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-slate-500 hover:bg-slate-200/60 transition-colors cursor-pointer">
              <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Video</span>
            </button>


            <button type="button" className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-slate-500 hover:bg-slate-200/60 transition-colors cursor-pointer">
              <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Event</span>
            </button>


            <button type="button" className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-slate-500 hover:bg-slate-200/60 transition-colors cursor-pointer">
              <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Article</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={postText.trim().length === 0}
            className={`flex items-center gap-2 rounded-xl bg-[#1890FF] px-6 py-2.5 text-base font-bold text-white shadow-sm hover:bg-[#0050B3] transition-all cursor-pointer ${postText.trim().length === 0 ? 'opacity-70 cursor-not-allowed' : ''
              }`}
          >
            {/* Paper Airplane Send SVG Icon */}
            <svg className="h-4 w-4 transform rotate-45 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span>Post</span>
          </button>

        </div>

      </form>
    </div>
  );
}
