import { GalleryConfig, Post } from './types';

export const DEFAULT_CONFIG: GalleryConfig = {
  rows: 3,
  columns: 5,
  scroll: false,
  scrollDirection: 'horizontal',
  scrollSpeed: 40,
  incrementalFade: true,
  incrementalFadeIntervalMs: 8000,
  incrementalFadeDurationMs: 800,
  randomHighlight: true,
  randomHighlightIntervalMs: 20000,
  modalAutocloseMs: 10000,
  overlayStyle: 'gradient',
  overlayOpacity: 0.7,
  theme: 'dark',
  fontScale: 1.0,
  timezone: 'America/Los_Angeles',
  captionWords: 12,
  useRelativeTime: false,
};

const users = [
    { username: 'UrbanExplorer', avatarUrl: 'https://i.pravatar.cc/150?u=user1' },
    { username: 'NatureLover', avatarUrl: 'https://i.pravatar.cc/150?u=user2' },
    { username: 'FoodieFinds', avatarUrl: 'https://i.pravatar.cc/150?u=user3' },
    { username: 'ArtsyLens', avatarUrl: 'https://i.pravatar.cc/150?u=user4' },
    { username: 'WanderlustAdventures', avatarUrl: 'https://i.pravatar.cc/150?u=user5' },
];

const captions = [
    "Exploring the hidden alleys of the city. Every corner tells a story.",
    "Golden hour hitting just right. Nature's beauty is unparalleled.",
    "A feast for the eyes and the soul. Absolutely delicious!",
    "Finding art in the mundane. The world is a canvas.",
    "Chasing sunsets and dreams. Another adventure in the books.",
    "Lost in the right direction. This view was worth the hike.",
    "Coffee and contemplation. The perfect start to any day.",
    "Street art that speaks volumes. Creativity is everywhere.",
    "From farm to table. Savoring the simple, fresh flavors of life.",
    "Reflections on the water. A moment of pure tranquility.",
];

export const generateMockPosts = (count: number, offset: number = 0): Post[] => {
  const posts: Post[] = [];
  for (let i = 0; i < count; i++) {
    const user = users[(i + offset) % users.length];
    const isVideo = Math.random() > 0.8; // 20% chance of being a video
    const date = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000); // within last 30 days
    
    posts.push({
      id: `mock_post_${i + 1 + offset}`,
      username: user.username,
      avatarUrl: user.avatarUrl,
      mediaType: isVideo ? 'video' : 'image',
      mediaUrl: isVideo 
        ? 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4'
        : `https://picsum.photos/seed/${i + 1 + offset}/800/800`,
      permalink: '#',
      caption: captions[(i + offset) % captions.length],
      takenAt: date.toISOString(),
    });
  }
  return posts;
};

export const mockPosts: Post[] = generateMockPosts(50);