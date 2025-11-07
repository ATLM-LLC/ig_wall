
import React, { useState, useEffect, useRef } from 'react';
import { GalleryConfig, Post } from '../types';

interface TileProps {
  post: Post;
  config: GalleryConfig;
  onClick: () => void;
  isPaused: boolean;
}

const timeAgo = (isoDate: string): string => {
  const date = new Date(isoDate);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 5) return "just now";
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return Math.floor(seconds) + "s ago";
};

const Tile: React.FC<TileProps> = ({ post, config, onClick, isPaused }) => {
  const [isFading, setIsFading] = useState(false);
  const prevPostId = useRef(post.id);
  const videoRef = useRef<HTMLVideoElement>(null);
  const tileRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  // Lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // Preload when 200px away from viewport
    );

    const currentRef = tileRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Incremental fade effect
  useEffect(() => {
    if (prevPostId.current !== post.id) {
      setIsFading(true);
      const timer = setTimeout(() => {
        setIsFading(false);
        prevPostId.current = post.id;
      }, config.incrementalFadeDurationMs);
      return () => clearTimeout(timer);
    }
  }, [post.id, config.incrementalFadeDurationMs]);

  // Pause/play video when modal opens/closes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPaused) {
      video.pause();
    } else {
      video.play().catch(error => {
        // Autoplay was prevented. This is common in browsers.
        // The `muted` prop should generally allow it.
      });
    }
  }, [isPaused]);

  const truncateCaption = (caption: string, words: number) => {
    return caption.split(' ').slice(0, words).join(' ') + (caption.split(' ').length > words ? '...' : '');
  };
  
  const formattedDate = config.useRelativeTime 
    ? timeAgo(post.takenAt) 
    : new Date(post.takenAt).toLocaleString(undefined, {
        timeZone: config.timezone,
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });

  const overlayOpacityStyle = {
    backgroundColor: config.overlayStyle === 'solid' ? `rgba(0, 0, 0, ${config.overlayOpacity})` : undefined,
  };
  
  const textStyle = {
    fontSize: `${config.fontScale}rem`,
  };

  return (
    <div
      ref={tileRef}
      className="relative h-full w-full overflow-hidden group cursor-pointer bg-gray-200 dark:bg-gray-800"
      onClick={onClick}
    >
      {isInView && (
        <div 
          className={`absolute inset-0 transition-opacity duration-${config.incrementalFadeDurationMs} ease-in-out`}
          style={{ opacity: isFading ? 0 : 1 }}
        >
          {post.mediaType === 'image' ? (
            <img src={post.mediaUrl} alt={post.caption} className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <video
              ref={videoRef}
              src={post.mediaUrl}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            />
          )}
        </div>
      )}

      <div
        className={`absolute bottom-0 left-0 right-0 h-1/5 p-4 text-white flex items-end transition-opacity duration-300 group-hover:opacity-100 ${config.overlayStyle === 'gradient' ? 'bg-gradient-to-t from-black/80 via-black/50 to-transparent' : ''}`}
        style={overlayOpacityStyle}
      >
        <div className="flex items-center gap-3 w-full" style={textStyle}>
          <img src={post.avatarUrl} alt={post.username} className="w-10 h-10 rounded-full flex-shrink-0 border-2 border-white/50" />
          <div className="overflow-hidden">
            <p className="font-bold text-sm truncate">{post.username}</p>
            <p className="text-xs text-white/80 leading-tight">
              {truncateCaption(post.caption, config.captionWords)}
            </p>
            <p className="text-xs text-white/60 mt-1">{formattedDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Tile);
