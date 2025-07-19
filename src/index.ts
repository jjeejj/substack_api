// Main exports
export { Newsletter } from './newsletter';
export { Post } from './post';
export { User, resolveHandleRedirect } from './user';
export { SubstackAuth, ApiClient } from './auth';

// Type exports
export * from './types';

// Re-export commonly used types for convenience
export type {
  PostMetadata,
  NewsletterMetadata,
  UserProfile,
  Subscription,
  PodcastEpisode,
  Recommendation,
  Author,
  Cookie,
  RequestOptions,
  SearchResult,
  PostSorting,
  AuthOptions
} from './types';