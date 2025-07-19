// Cookie interface for authentication
export interface Cookie {
  name: string;
  value: string;
  domain: string;
  path: string;
  secure: boolean;
  httpOnly?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}

// Post metadata interface
export interface PostMetadata {
  id: number;
  title: string;
  subtitle?: string;
  slug: string;
  post_date: string;
  audience: string;
  email_sent_at?: string;
  type: string;
  status: string;
  word_count?: number;
  reading_time_minutes?: number;
  cover_image?: string;
  description?: string;
  canonical_url?: string;
  is_paywalled: boolean;
  free_unlock?: boolean;
  default_comment_sort?: string;
  publication_id: number;
  author?: Author;
  reactions?: PostReactions;
  stats?: PostStats;
}

// Author interface
export interface Author {
  id: number;
  name: string;
  handle: string;
  photo_url?: string;
  bio?: string;
  twitter_screen_name?: string;
  is_writer: boolean;
}

// Post reactions interface
export interface PostReactions {
  heart: number;
  laugh: number;
  like: number;
  [key: string]: number;
}

// Post statistics interface
export interface PostStats {
  comments: number;
  email_opens?: number;
  email_clicks?: number;
  web_hits?: number;
}

// Newsletter metadata interface
export interface NewsletterMetadata {
  id: number;
  name: string;
  subdomain: string;
  custom_domain?: string;
  description?: string;
  author_name: string;
  author_handle: string;
  author_id: number;
  logo_url?: string;
  hero_image?: string;
  hero_text?: string;
  twitter_screen_name?: string;
  facebook_page_url?: string;
  founded_at?: string;
  language?: string;
  explicit?: boolean;
  type: string;
  stripe_country_code?: string;
  cover_photo_url?: string;
  theme?: NewsletterTheme;
  paid_subscription_benefits?: string[];
  free_subscription_count?: number;
  paid_subscription_count?: number;
  founding_subscription_count?: number;
}

// Newsletter theme interface
export interface NewsletterTheme {
  background_pop: string;
  background_pop_rgb: string;
  background_contrast_pop: string;
  background_contrast_pop_rgb: string;
  primary_text: string;
  primary_text_rgb: string;
  secondary_text: string;
  secondary_text_rgb: string;
  tertiary_text: string;
  tertiary_text_rgb: string;
  tertiary_text_rgb_faded: string;
}

// User profile interface
export interface UserProfile {
  id: number;
  name: string;
  handle: string;
  photo_url?: string;
  bio?: string;
  location?: string;
  website?: string;
  twitter_screen_name?: string;
  is_writer: boolean;
  is_subscriber: boolean;
  subscription_count?: number;
  following_count?: number;
  follower_count?: number;
}

// Subscription interface
export interface Subscription {
  id: number;
  publication_id: number;
  publication_name: string;
  publication_subdomain: string;
  publication_logo_url?: string;
  subscription_type: 'free' | 'paid' | 'founding';
  created_at: string;
  status: 'active' | 'cancelled' | 'past_due';
}

// Podcast episode interface
export interface PodcastEpisode {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  audio_url: string;
  duration?: number;
  episode_number?: number;
  season_number?: number;
  publish_date: string;
  cover_image?: string;
  transcript?: string;
}

// Recommendation interface
export interface Recommendation {
  id: number;
  publication_id: number;
  publication_name: string;
  publication_subdomain: string;
  publication_description?: string;
  publication_logo_url?: string;
  author_name: string;
  recommendation_text?: string;
  created_at: string;
}

// Search result interface
export interface SearchResult {
  posts: PostMetadata[];
  total_count: number;
  has_more: boolean;
  next_offset?: number;
}

// API response wrapper
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

// Sorting options for posts
export type PostSorting = 'new' | 'top' | 'hot';

// Authentication options
export interface AuthOptions {
  cookiesPath?: string;
  cookies?: Cookie[];
}

// Request options
export interface RequestOptions {
  limit?: number;
  offset?: number;
  sorting?: PostSorting;
  query?: string;
}

// Error types
export class SubstackApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'SubstackApiError';
  }
}

export class AuthenticationError extends SubstackApiError {
  constructor(message: string = 'Authentication required') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

export class NotFoundError extends SubstackApiError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export class RateLimitError extends SubstackApiError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429);
    this.name = 'RateLimitError';
  }
}
