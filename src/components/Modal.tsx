import React, { useEffect, useRef } from 'react';
import { GalleryConfig, Post } from '../types';
import { XIcon } from './Icons';

interface ModalProps {
  post: Post | null;
  config: GalleryConfig;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ post, config, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    }

    if (post) {
      window.addEventListener('keydown', handleKeydown);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      window.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [post, onClose]);

  if (!post) return null;
  
  const formattedDate = new Date(post.takenAt).toLocaleString(undefined, {
    timeZone: config.timezone,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center animate-fadeIn p-4">
      <div 
        ref={modalRef}
        className="relative bg-white dark:bg-gray-900 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 p-2 text-white bg-black/30 rounded-full hover:bg-black/50"
          aria-label="Close modal"
        >
          <XIcon />
        </button>
        
        <div className="w-full md:w-2/3 flex-shrink-0 bg-black flex items-center justify-center">
            {post.mediaType === 'image' ? (
              <img src={post.mediaUrl} alt={post.caption} className="max-h-[90vh] w-auto object-contain" />
            ) : (
              <video src={post.mediaUrl} className="max-h-[90vh] w-auto" controls autoPlay muted loop playsInline />
            )}
        </div>
        
        <div className="w-full md:w-1/3 p-6 flex flex-col overflow-y-auto">
          <div className="flex items-center mb-4">
            <img src={post.avatarUrl} alt={post.username} className="w-12 h-12 rounded-full mr-4 border-2 border-gray-300 dark:border-gray-600" />
            <div>
              <a href={post.permalink} target="_blank" rel="noopener noreferrer" className="font-bold text-lg text-gray-800 dark:text-gray-100 hover:underline">{post.username}</a>
              <p className="text-sm text-gray-500 dark:text-gray-400">{formattedDate}</p>
            </div>
          </div>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-base">
            {post.caption}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Modal;