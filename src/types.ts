export interface Post {
  id: string;
  username: string;
  avatarUrl: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  permalink: string;
  caption: string;
  takenAt: string; // ISO 8601 format
}

export interface GalleryConfig {
  rows: number;
  columns: number;
  scroll: boolean;
  scrollDirection: 'horizontal' | 'vertical';
  scrollSpeed: number; // pixels per second
  incrementalFade: boolean;
  incrementalFadeIntervalMs: number;
  incrementalFadeDurationMs: number;
  randomHighlight: boolean;
  randomHighlightIntervalMs: number;
  modalAutocloseMs: number;
  overlayStyle: 'gradient' | 'solid';
  overlayOpacity: number;
  theme: 'auto' | 'light' | 'dark';
  fontScale: number;
  timezone: string;
  captionWords: number;
  useRelativeTime: boolean;
}