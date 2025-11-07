// Fix: Add Vite client types to resolve error on import.meta.env
/// <reference types="vite/client" />

// --- Google OAuth API Helpers ---

// Vite exposes environment variables from your .env file on the `import.meta.env` object.
// They MUST be prefixed with VITE_ to be exposed to the client.
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

// This must EXACTLY match one of the "Authorized redirect URIs" in your Google Cloud Console.
const GOOGLE_REDIRECT_URI = window.location.origin + window.location.pathname;

/**
 * Constructs the Google Sign-In URL to start the OAuth 2.0 flow.
 * Scopes requested are basic 'openid' for authentication and 'email' and 'profile'
 * to verify the user's identity.
 */
export const getGoogleAuthUrl = (): string => {
  if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID.startsWith('YOUR_GOOGLE_CLIENT_ID')) {
    console.error("Google Client ID is not configured. Please set VITE_GOOGLE_CLIENT_ID in your .env file.");
    alert("Admin sign-in is not configured. The developer needs to set the Google Client ID.");
    return '#';
  }
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.searchParams.append('client_id', GOOGLE_CLIENT_ID);
  url.searchParams.append('redirect_uri', GOOGLE_REDIRECT_URI);
  url.searchParams.append('response_type', 'code');
  url.searchParams.append('scope', 'openid email profile');
  // 'state' helps our app know which auth flow is returning.
  url.searchParams.append('state', 'google-auth');
  // 'access_type': 'offline' would be needed if you want a refresh token for long-term server access.
  // 'prompt': 'consent' can be useful for debugging to always force the consent screen.
  return url.toString();
};


/**
 * Verifies the Google authorization code via your backend.
 * 
 * !!! THIS IS A PLACEHOLDER FOR A BACKEND CALL !!!
 * Your backend receives this code, exchanges it for a user profile from Google,
 * and then checks if the user's email is in your `AUTHORIZED_ADMIN_EMAILS`
 * environment variable list.
 * 
 * @param code The authorization code from the Google redirect.
 * @returns A promise that resolves with whether the login was successful.
 */
export const verifyGoogleCode = async (code: string): Promise<{ success: boolean }> => {
  console.log(`[FRONTEND-STUB] Verifying Google auth code "${code.substring(0, 20)}..." with backend.`);

  /*
  // --- EXAMPLE: REAL IMPLEMENTATION ---
  const response = await fetch('/api/auth/google/callback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
  if (!response.ok) {
    return { success: false };
  }
  const data = await response.json(); // e.g., { success: true, token: 'jwt_token' }
  // You might store the returned JWT token for subsequent authenticated API calls.
  return { success: data.success };
  */

  // Simulate network delay and a successful verification.
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ success: true });
    }, 1500);
  });
};