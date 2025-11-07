// Fix: Add Vite client types to resolve error on import.meta.env
/// <reference types="vite/client" />

import { Post } from './types';
import { generateMockPosts } from './constants';

// --- Instagram API Helpers ---
// Vite exposes environment variables from your .env file on the `import.meta.env` object.
// They MUST be prefixed with VITE_ to be exposed to the client.
// Example: VITE_INSTAGRAM_APP_ID
const INSTAGRAM_APP_ID = import.meta.env.VITE_INSTAGRAM_APP_ID || 'YOUR_INSTAGRAM_APP_ID';

// This must EXACTLY match one of the "Valid OAuth Redirect URIs" in your App's settings.
const INSTAGRAM_REDIRECT_URI = window.location.origin + window.location.pathname;

/**
 * Constructs the Instagram authorization URL to start the OAuth 2.0 flow.
 * Scopes requested are for the Instagram Graph API (for Business/Creator accounts):
 * - instagram_basic: To read a user's profile info and media.
 * - pages_show_list: To identify the Instagram Business Account linked to a Facebook Page.
 */
export const getInstagramAuthUrl = (): string => {
  if (!INSTAGRAM_APP_ID || INSTAGRAM_APP_ID === 'YOUR_INSTAGRAM_APP_ID') {
    console.error("Instagram App ID is not configured. Please set VITE_INSTAGRAM_APP_ID in your .env file.");
    alert("Instagram integration is not configured. The developer needs to set the Instagram App ID.");
    return '#'; // Return a non-functional link
  }
  const scope = 'instagram_basic,pages_show_list';
  const url = new URL('https://api.instagram.com/oauth/authorize');
  url.searchParams.append('client_id', INSTAGRAM_APP_ID);
  url.searchParams.append('redirect_uri', INSTAGRAM_REDIRECT_URI);
  url.searchParams.append('scope', scope);
  url.searchParams.append('response_type', 'code');
  // The 'state' parameter is crucial for security (CSRF protection) and for our app
  // to know which authentication flow is returning.
  url.searchParams.append('state', 'instagram-auth');
  return url.toString();
};

/**
 * Exchanges the authorization code for a long-lived access token via your backend.
 * 
 * !!! THIS IS A PLACEHOLDER FOR A BACKEND CALL !!!
 * In a real application, this function would make a POST request to YOUR server.
 * Your server would then securely make a POST request to the Instagram API, including
 * your App Secret, to get the token. The server should store the token securely.
 * 
 * @param code The authorization code from the Instagram redirect.
 * @returns A promise that resolves with the connected user's basic data.
 */
export const exchangeCodeForToken = async (code: string): Promise<{ username: string }> => {
  console.log(`[FRONTEND-STUB] Exchanging authorization code "${code.substring(0, 20)}..." for an access token.`);
  
  /* 
  // --- EXAMPLE: REAL IMPLEMENTATION ---
  const response = await fetch('/api/auth/instagram/callback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || 'Failed to exchange code for token.');
  }
  const data = await response.json();
  return data; // e.g., { username: 'some_user' }
  */

  // Simulate network delay and a successful response from the backend.
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ username: 'ConnectedUser' });
    }, 1500);
  });
};

/**
 * Fetches the latest Instagram posts for the connected user via your backend.
 * 
 * !!! THIS IS A PLACEHOLDER FOR A BACKEND CALL !!!
 * In a real application, this function would make a GET request to your server.
 * Your server would then use the securely stored access token to make a call to the
 * Instagram Graph API to retrieve the latest media.
 * 
 * @returns A promise that resolves with an array of posts.
 */
export const fetchInstagramPosts = async (): Promise<Post[]> => {
    console.log('[FRONTEND-STUB] Fetching latest posts from Instagram via backend...');

    /*
    // --- EXAMPLE: REAL IMPLEMENTATION ---
    const response = await fetch('/api/instagram/posts');
    if (!response.ok) {
        throw new Error('Failed to fetch Instagram posts.');
    }
    const data = await response.json();
    return data.posts;
    */

    // Simulate network delay and a successful response from the backend with new posts.
    return new Promise(resolve => {
        setTimeout(() => {
            const randomOffset = Math.floor(Math.random() * 1000);
            resolve(generateMockPosts(50, randomOffset));
        }, 1500);
    });
};