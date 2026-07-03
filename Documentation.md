Title & one-liner = Social feed app with auth, posts, comments, reactions, and image uploads.

stack = Nextjs, Nestjs, postgresql,cloudeflare R2 for images

key features:
   * JWT auth for login/register/logout,session cookie,proxy.ts guard for /feed
   * Create post with text and image,privacy selector
   * Reaction option for post/comment/reply
   * three layout having individual scroll.
   
key decisions:
   * use useActionState to hide real api url from browser
   * OptionalJwtGuard on GET endpoints — unauthenticated users can see public posts, authenticated users see their own private posts too
   * use R2 to upload image cause nestjs not allowed to upload in Render site.  
   * vercel for frontend,Render for backend,Neon for postgresql
   