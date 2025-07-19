import { ApiClient, SubstackAuth } from '../auth';
import {
  PostMetadata,
  PodcastEpisode,
  Recommendation,
  Author,
  NewsletterMetadata,
  RequestOptions,
  SearchResult,
  SubstackApiError,
  NotFoundError,
} from '../types';

export class Newsletter {
  private subdomain!: string;
  private customDomain?: string;
  private apiClient: ApiClient;
  private baseUrl: string;

  constructor(url: string, auth?: SubstackAuth) {
    this.parseUrl(url);
    this.apiClient = new ApiClient(auth);
    this.baseUrl =
      this.customDomain || `https://${this.subdomain}.substack.com`;
  }

  private parseUrl(url: string): void {
    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname;

      if (hostname.endsWith('.substack.com')) {
        this.subdomain = hostname.replace('.substack.com', '');
      } else {
        this.customDomain = `https://${hostname}`;
        // For custom domains, use the full hostname as subdomain
        this.subdomain = hostname;
      }
    } catch (error) {
      throw new SubstackApiError(`Invalid URL format: ${url}`);
    }
  }

  /**
   * Get recent posts from the newsletter
   */
  public async getPosts(options: RequestOptions = {}): Promise<PostMetadata[]> {
    const { limit = 12, offset = 0, sorting = 'new' } = options;

    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
      sort: sorting,
    });

    try {
      const response = await this.apiClient.get<any>(
        `${this.baseUrl}/api/v1/posts?${params}`
      );

      return response.posts || response;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundError(`Newsletter not found: ${this.baseUrl}`);
      }
      throw error;
    }
  }

  /**
   * Search for posts within the newsletter
   */
  public async searchPosts(
    query: string,
    options: RequestOptions = {}
  ): Promise<SearchResult> {
    const { limit = 12, offset = 0 } = options;

    const params = new URLSearchParams({
      q: query,
      limit: limit.toString(),
      offset: offset.toString(),
    });

    try {
      const response = await this.apiClient.get<any>(
        `${this.baseUrl}/api/v1/posts/search?${params}`
      );

      return {
        posts: response.posts || [],
        total_count: response.total_count || 0,
        has_more: response.has_more || false,
        next_offset: response.next_offset,
      };
    } catch (error) {
      throw new SubstackApiError(`Search failed: ${error}`);
    }
  }

  /**
   * Get podcast episodes from the newsletter
   */
  public async getPodcasts(
    options: RequestOptions = {}
  ): Promise<PodcastEpisode[]> {
    const { limit = 12, offset = 0 } = options;

    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });

    try {
      const response = await this.apiClient.get<any>(
        `${this.baseUrl}/api/v1/podcasts?${params}`
      );

      return response.podcasts || response;
    } catch (error) {
      throw new SubstackApiError(`Failed to fetch podcasts: ${error}`);
    }
  }

  /**
   * Get newsletter recommendations
   */
  public async getRecommendations(
    options: RequestOptions = {}
  ): Promise<Recommendation[]> {
    const { limit = 12, offset = 0 } = options;

    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });

    try {
      const response = await this.apiClient.get<any>(
        `${this.baseUrl}/api/v1/recommendations?${params}`
      );

      return response.recommendations || response;
    } catch (error) {
      throw new SubstackApiError(`Failed to fetch recommendations: ${error}`);
    }
  }

  /**
   * Get newsletter authors
   */
  public async getAuthors(): Promise<Author[]> {
    try {
      const response = await this.apiClient.get<any>(
        `${this.baseUrl}/api/v1/authors`
      );

      return response.authors || response;
    } catch (error) {
      throw new SubstackApiError(`Failed to fetch authors: ${error}`);
    }
  }

  /**
   * Get newsletter metadata
   */
  public async getMetadata(): Promise<NewsletterMetadata> {
    try {
      const response = await this.apiClient.get<any>(
        `${this.baseUrl}/api/v1/publication`
      );

      return response.publication || response;
    } catch (error) {
      throw new SubstackApiError(
        `Failed to fetch newsletter metadata: ${error}`
      );
    }
  }

  /**
   * Get the subdomain of the newsletter
   */
  public getSubdomain(): string {
    return this.subdomain;
  }

  /**
   * Get the base URL of the newsletter
   */
  public getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Get the URL of the newsletter
   */
  public getUrl(): string {
    return this.baseUrl;
  }

  /**
   * Set authentication for accessing paywalled content
   */
  public setAuth(auth: SubstackAuth): void {
    this.apiClient.setAuth(auth);
  }
}
