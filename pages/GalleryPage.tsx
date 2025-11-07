import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { GalleryConfig, Post } from '../types';
import Gallery from '../components/Gallery';
import Modal from '../components/Modal';
import { SettingsIcon } from '../components/Icons';

interface GalleryPageProps {
  config: GalleryConfig;
  posts: Post[];
}

// Helper to get a random element from an array
const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Helper to apply jitter to an interval
const jitter = (interval: number, percentage: number = 0.15): number => {
  const jitterAmount = interval * percentage * (Math.random() - 0.5) * 2;
  return interval + jitterAmount;
};

const GalleryPage: React.FC<GalleryPageProps> = ({ config, posts: allPosts }) => {
  const [visiblePosts, setVisiblePosts] = useState<Post[]>([]);
  const [highlightedPost, setHighlightedPost] = useState<Post | null>(null);
  const highlightTimeoutRef = useRef<number | null>(null);

  const availablePosts = useMemo(() => {
    const visiblePostIds = new Set(visiblePosts.map(p => p.id));
    return allPosts.filter(p => !visiblePostIds.has(p.id));
  }, [allPosts, visiblePosts]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', config.theme === 'dark');
    if (config.theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  }, [config.theme]);

  // Initialize and update the grid when config changes
  useEffect(() => {
    const gridSize = config.rows * config.columns;
    setVisiblePosts(currentVisible => {
        const currentPosts = currentVisible.slice(0, gridSize);
        const needed = gridSize - currentPosts.length;
        if (needed > 0) {
            return [...currentPosts, ...allPosts.slice(0, needed)];
        }
        return currentPosts;
    });
  }, [config.rows, config.columns, allPosts]);

  // Incremental Fade Effect
  useEffect(() => {
    if (!config.incrementalFade || !config.incrementalFadeIntervalMs) return;

    const intervalId = setInterval(() => {
      if (availablePosts.length === 0) return;

      const postToReplaceIndex = Math.floor(Math.random() * visiblePosts.length);
      const newPost = getRandomElement(availablePosts);

      setVisiblePosts(currentPosts => {
        const newPosts = [...currentPosts];
        newPosts[postToReplaceIndex] = newPost;
        return newPosts;
      });
    }, jitter(config.incrementalFadeIntervalMs));

    return () => clearInterval(intervalId);
  }, [config.incrementalFade, config.incrementalFadeIntervalMs, visiblePosts.length, availablePosts]);

  // Random Highlight Effect
  useEffect(() => {
    if (!config.randomHighlight || !config.randomHighlightIntervalMs) {
      if(highlightTimeoutRef.current) clearTimeout(highlightTimeoutRef.current)
      setHighlightedPost(null)
      return;
    };

    const showHighlight = () => {
      if (document.hidden) return; // Don't show modal if tab is not active
      const postToHighlight = getRandomElement(visiblePosts);
      setHighlightedPost(postToHighlight);

      if (config.modalAutocloseMs) {
        highlightTimeoutRef.current = window.setTimeout(() => {
          setHighlightedPost(null);
        }, jitter(config.modalAutocloseMs));
      }
    };
    
    const intervalId = setInterval(showHighlight, jitter(config.randomHighlightIntervalMs));
    
    return () => {
        clearInterval(intervalId);
        if (highlightTimeoutRef.current) clearTimeout(highlightTimeoutRef.current);
    }
  }, [config.randomHighlight, config.randomHighlightIntervalMs, config.modalAutocloseMs, visiblePosts]);
  
  // Keyboard Shortcuts (now scoped to gallery view)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 's':
          // Note: In a real app, this would message the parent to change config
          console.log("Scroll toggle disabled in gallery view. Configure in admin panel.");
          break;
        case 'f':
          console.log("Fade toggle disabled in gallery view. Configure in admin panel.");
          break;
        case 'h':
          console.log("Highlight toggle disabled in gallery view. Configure in admin panel.");
          break;
        case '.':
          e.preventDefault();
          if (highlightedPost) {
            const currentIndex = visiblePosts.findIndex(p => p.id === highlightedPost.id);
            if (currentIndex !== -1) {
              const nextIndex = (currentIndex + 1) % visiblePosts.length;
              setHighlightedPost(visiblePosts[nextIndex]);
            }
          } else if (visiblePosts.length > 0) {
            setHighlightedPost(visiblePosts[0]);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [highlightedPost, visiblePosts]);

  const handleTileClick = useCallback((post: Post) => {
    setHighlightedPost(post);
    if(highlightTimeoutRef.current) clearTimeout(highlightTimeoutRef.current);
    if (config.modalAutocloseMs) {
        highlightTimeoutRef.current = window.setTimeout(() => {
          setHighlightedPost(null);
        }, jitter(config.modalAutocloseMs));
      }
  }, [config.modalAutocloseMs]);

  const closeModal = useCallback(() => {
    setHighlightedPost(null);
    if(highlightTimeoutRef.current) clearTimeout(highlightTimeoutRef.current);
  }, []);

  return (
    <div className="h-full w-full overflow-hidden relative">
      <Gallery
        posts={visiblePosts}
        config={config}
        onTileClick={handleTileClick}
        isPaused={!!highlightedPost}
      />
      <Modal post={highlightedPost} config={config} onClose={closeModal} />
      
      <button
        onClick={() => window.location.hash = '/admin'}
        className="fixed top-4 right-4 z-30 p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full text-gray-800 dark:text-gray-200 shadow-lg hover:scale-110 transition-transform"
        aria-label="Go to admin settings"
      >
        <SettingsIcon />
      </button>
    </div>
  );
};

export default GalleryPage;