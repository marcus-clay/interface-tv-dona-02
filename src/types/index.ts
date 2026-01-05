export type ContentType = 'film' | 'series';
export type QualityBadge = '4K' | 'HDR' | 'Atmos' | 'Dolby Vision' | '5.1';

export interface CastMember {
  name: string;
  role: string;
  image: string;
}

export interface Film {
  id: string;
  type: ContentType;
  title: string;
  year: number;
  duration: string;
  rating: number;
  synopsis: string;
  poster: string;
  backdrop: string;
  dominantColor: string;
  badges?: QualityBadge[];
  genres?: string[];
  match?: number;
  director?: string;
  studio?: string;
  cast?: string[] | CastMember[];
  maturity?: string;
  logo?: string;
}

export interface Episode {
  number: number;
  title: string;
  duration: string;
  synopsis: string;
  thumbnail: string;
}

export interface SeasonDetail {
  number: number;
  episodes: Episode[];
}

export interface Series {
  id: string;
  type: 'series';
  title: string;
  years: string;
  seasons: number;
  episodes: number;
  rating: number;
  genres: string[];
  creator: string;
  cast: string[];
  synopsis: string;
  poster: string;
  backdrop: string;
  dominantColor: string;
  badges?: QualityBadge[];
  maturity: string;
  seasonDetails: SeasonDetail[];
}

export interface WatchProgress {
  id: string;
  progress: number;
  currentTime: number;
  duration: number;
  updatedAt: string;
  season?: number;
  episode?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: 'Gratuit' | 'Dona+';
}
