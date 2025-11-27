export type Platform = 'instagram' | 'twitter' | 'linkedin' | 'youtube' | 'tiktok';
export type ContentType = 'post' | 'reel' | 'story' | 'article' | 'video';

export interface Post {
  id: string;
  title: string;
  date: Date;
  platform: Platform;
  type: ContentType;
  notes?: string;
  mediaUrl?: string; // Placeholder for image/video preview
  status: 'draft' | 'scheduled' | 'published';
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isPast: boolean;
}
