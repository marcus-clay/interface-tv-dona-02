export type ContentType = 'film' | 'series';

export type QualityBadge = '4K' | 'HDR' | 'Atmos' | 'Dolby Vision' | '5.1';

export interface CastMember {
  id: string;
  name: string;
  role: 'actor' | 'director' | 'creator';
  character?: string;
  avatar: string;
}

export interface Film {
  id: string;
  type: 'film';
  title: string;
  year: number;
  duration: string;           // "3h 00m"
  rating: number;             // 8.5
  genres: string[];
  director: string;
  cast: string[];             // Names for display
  castDetails?: CastMember[]; // Detailed objects if needed
  synopsis: string;
  poster: string;             // Vertical 2:3 URL
  backdrop: string;           // Horizontal 16:9 URL
  dominantColor: string;      // Hex for ambient effects
  badges: QualityBadge[];
  maturity: string;           // "R", "PG-13"
  logo?: string;              // Title treatment URL
  trailerUrl?: string;
}

export interface Episode {
  number: number;
  title: string;
  duration: string;
  synopsis: string;
  thumbnail: string;
}

export interface Season {
  number: number;
  episodes: Episode[];
}

export interface Series {
  id: string;
  type: 'series';
  title: string;
  years: string;              // "2008-2013"
  seasons: number;            // Total count
  episodes: number;           // Total count
  rating: number;
  genres: string[];
  creator: string;
  cast: string[];
  synopsis: string;
  poster: string;
  backdrop: string;
  dominantColor: string;
  badges: QualityBadge[];
  maturity: string;
  seasonDetails: Season[];
  logo?: string;
}

export type ContentItem = Film | Series;

export interface WatchProgress {
  id: string;
  progress: number;           // 0 to 1
  currentTime: number;        // seconds
  duration: number;           // seconds
  updatedAt: string;          // ISO date
  season?: number;            // For series
  episode?: number;           // For series
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: 'basic' | 'standard' | 'premium';
}

export interface SearchResults {
  films: Film[];
  series: Series[];
  people: CastMember[]; // Simplified for now
}