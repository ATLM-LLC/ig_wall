import React, { useState, useEffect, useCallback } from 'react';
import { GalleryConfig, Post } from './types';
import { DEFAULT_CONFIG, generateMockPosts } from './constants';
import GalleryPage from './pages/GalleryPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import { getInstagramAuthUrl, exchangeCodeForToken, fetchInstagramPosts } from './instagram';
import { verifyGoogleCode } from './auth';
import { fetchConfig, saveConfig } from './configApi';
import { InstagramIcon, GoogleIcon } from './components/Icons';


// A simple hash-based router
const useHashNavigation = () => {
  const [currentPath, setCurrentPath] = useState(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return currentPath;
};

const App: React.FC = () => {
  // Global state
  const [config, setConfig] = useState<GalleryConfig | null>(null);
  const [posts, setPosts] = useState<Post[]>(() => generateMockPosts(50));
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Instagram connection state
  const [isInstagramConnected, setIsInstagramConnected] = useState(false);
  const [instagramUsername, setInstagramUsername] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // App loading states
  const [isAuthenticating, setIsAuthenticating] = useState<{provider: 'google' | 'instagram' | null}>({ provider: null });
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);

  const path = useHashNavigation();
  
  // --- Load initial config from server ---
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const fetchedConfig = await fetchConfig();
        setConfig(fetchedConfig);
      } catch (error) {
        console.error("Failed to load config:", error);
        setConfig(DEFAULT_CONFIG); // Fallback to default
      } finally {
        setIsLoadingConfig(false);
      }
    };
    loadConfig();
  }, []);

  // --- OAuth 2.0 Flow Handler ---
  useEffect(() => {
    const handleOauthCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');

      if (!code || !state) return;

      // Clean the URL to prevent re-triggering on refresh
      window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);

      if (state === 'instagram-auth') {
        setIsAuthenticating({ provider: 'instagram' });
        try {
          const userData = await exchangeCodeForToken(code);
          setIsInstagramConnected(true);
          setInstagramUsername(userData.username);
          const initialPosts = await fetchInstagramPosts();
          setPosts(initialPosts);
        } catch (error) {
          console.error("Instagram connection failed:", error);
          alert('Failed to connect to Instagram. Please try again.');
          setIsInstagramConnected(false);
          setInstagramUsername(null);
        } finally {
          setIsAuthenticating({ provider: null });
        }
      } else if (state === 'google-auth') {
        setIsAuthenticating({ provider: 'google' });
        try {
            const { success } = await verifyGoogleCode(code);
            if (success) {
                setIsLoggedIn(true);
                window.location.hash = '/admin';
            } else {
                throw new Error("User not authorized.");
            }
        } catch(error) {
            console.error("Google sign-in failed:", error);
            alert("Login failed. You may not be an authorized user.");
            window.location.hash = '/';
        } finally {
            setIsAuthenticating({ provider: null });
        }
      }
    };
    handleOauthCallback();
  }, []); // Run only once on component mount

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const kioskMode = params.get('kiosk') === '1';
    if (kioskMode) {
      document.body.style.cursor = 'none';
    }
  }, []);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    window.location.hash = '/';
  }, []);

  const handleSaveConfig = async (newConfig: GalleryConfig): Promise<boolean> => {
    try {
        await saveConfig(newConfig);
        setConfig(newConfig);
        return true;
    } catch (error) {
        console.error("Failed to save config:", error);
        alert("Could not save settings. Please try again.");
        return false;
    }
  };

  // --- Instagram Handlers ---
  const handleConnectInstagram = useCallback(() => {
    window.location.href = getInstagramAuthUrl();
  }, []);

  const handleDisconnectInstagram = useCallback(() => {
    setIsInstagramConnected(false);
    setInstagramUsername(null);
    setPosts(generateMockPosts(50));
  }, []);

  const handleRefreshPosts = useCallback(async () => {
     setIsRefreshing(true);
     try {
       const newPosts = await fetchInstagramPosts();
       setPosts(newPosts);
     } catch(error) {
       console.error("Failed to refresh posts:", error);
       alert('Failed to refresh posts. The connection may have been lost.');
     } finally {
        setIsRefreshing(false);
     }
  }, []);

  const renderContent = () => {
    if (isAuthenticating.provider) {
      const isGoogle = isAuthenticating.provider === 'google';
      return (
        <div className="h-full w-full flex flex-col items-center justify-center bg-gray-100 dark:bg-black text-gray-800 dark:text-gray-200">
            <div className={`scale-150 ${isGoogle ? 'text-blue-500' : 'text-pink-500'}`}>
              {isGoogle ? <GoogleIcon /> : <InstagramIcon />}
            </div>
            <p className="mt-4 text-xl font-semibold animate-pulse">
              {isGoogle ? 'Signing in with Google...' : 'Connecting to Instagram...'}
            </p>
            <p className="text-sm text-gray-500">Please wait, we're finalizing the connection.</p>
        </div>
      );
    }
    
    if (isLoadingConfig || !config) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-black text-gray-800 dark:text-gray-200">
                <p className="text-xl font-semibold animate-pulse">Loading Gallery...</p>
            </div>
        );
    }

    if (path === '#/admin') {
      if (isLoggedIn) {
        return (
          <AdminPage 
            config={config} 
            onSaveConfig={handleSaveConfig}
            onLogout={handleLogout}
            isInstagramConnected={isInstagramConnected}
            instagramUsername={instagramUsername}
            isRefreshingPosts={isRefreshing}
            onConnectInstagram={handleConnectInstagram}
            onDisconnectInstagram={handleDisconnectInstagram}
            onRefreshPosts={handleRefreshPosts}
          />
        );
      }
      return <LoginPage />;
    }
    
    return <GalleryPage config={config} posts={posts} />;
  };

  return (
    <div className="h-screen w-screen bg-gray-100 dark:bg-black font-sans">
      {renderContent()}
    </div>
  );
};

export default App;