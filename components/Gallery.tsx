
import React, { useRef, useEffect } from 'react';
import { GalleryConfig, Post } from '../types';
import Tile from './Tile';

interface GalleryProps {
  posts: Post[];
  config: GalleryConfig;
  onTileClick: (post: Post) => void;
  isPaused: boolean;
}

const Gallery: React.FC<GalleryProps> = ({ posts, config, onTileClick, isPaused }) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || !config.scroll) {
        if (grid) {
          grid.style.transform = '';
        }
        if (animationFrameRef.current !== null) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        return;
    }

    let position = 0;
    const speed = config.scrollSpeed / 60; // pixels per frame at 60fps
    const isHorizontal = config.scrollDirection === 'horizontal';

    const animate = () => {
        position -= speed;
        const scrollSize = isHorizontal ? grid.scrollWidth / 2 : grid.scrollHeight / 2;

        if (Math.abs(position) >= scrollSize) {
            position = 0;
        }

        grid.style.transform = isHorizontal 
            ? `translateX(${position}px)` 
            : `translateY(${position}px)`;

        animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [config.scroll, config.scrollDirection, config.scrollSpeed, posts]);

  const gridStyle: React.CSSProperties = {
    gridTemplateColumns: `repeat(${config.columns}, 1fr)`,
    gridTemplateRows: `repeat(${config.rows}, 1fr)`,
    // For seamless scrolling, we need to make the container larger than the viewport
    width: config.scroll && config.scrollDirection === 'horizontal' ? '200%' : '100%',
    height: config.scroll && config.scrollDirection === 'vertical' ? '200%' : '100%',
  };
  
  const content = config.scroll ? [...posts, ...posts] : posts;

  return (
    <div className="absolute inset-0 overflow-hidden">
        <div 
            ref={gridRef}
            className={`grid h-full w-full`}
            style={gridStyle}
        >
            {content.map((post, index) => (
                <Tile
                    key={`${post.id}-${index}`}
                    post={post}
                    config={config}
                    onClick={() => onTileClick(post)}
                    isPaused={isPaused}
                />
            ))}
        </div>
    </div>
  );
};

export default Gallery;
