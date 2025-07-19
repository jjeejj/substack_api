import { ApiClient, SubstackAuth } from '../auth';
import { PostMetadata, SubstackApiError, ApiResponse } from '../types';

export class Post {
  private url: string;
  private subdomain!: string;
  private slug!: string;
  private apiClient: ApiClient;
  private baseUrl: string;
  private metadata?: PostMetadata;

  constructor(url: string, auth?: SubstackAuth) {
    this.url = url;
    this.parseUrl(url);
    this.apiClient = new ApiClient(auth);
    this.baseUrl = `https://${this.subdomain}.substack.com`;
  }

  private parseUrl(url: string): void {
    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname;
      const pathname = parsedUrl.pathname;

      if (hostname.endsWith('.substack.com')) {
        this.subdomain = hostname.replace('.substack.com', '');
      } else {
        // Handle custom domains
        this.subdomain = hostname.split('.')[0];
      }

      // Extract slug from pathname (e.g., /p/post-slug -> post-slug)
      const match = pathname.match(/\/p\/([^/]+)/);
      if (match) {
        this.slug = match[1];
      } else {
        throw new SubstackApiError(`Invalid post URL format: ${url}`);
      }
    } catch (error) {
      throw new SubstackApiError(`Invalid URL format: ${url}`);
    }
  }

  /**
   * Get post metadata
   */
  public async getMetadata(): Promise<PostMetadata> {
    if (this.metadata) {
      return this.metadata;
    }

    const response = await this.apiClient.get<ApiResponse<PostMetadata>>(
      `${this.baseUrl}/api/v1/posts/${this.slug}`
    );

    this.metadata = response.data;
    if (!this.metadata) {
      throw new SubstackApiError('Failed to fetch post metadata');
    }
    return this.metadata;
  }

  /**
   * Get post HTML content
   */
  public async getContent(): Promise<string> {
    try {
      // First get metadata to check if post is paywalled
      const metadata = await this.getMetadata();

      if (
        metadata.is_paywalled &&
        !this.apiClient.getAuth()?.isAuthenticated()
      ) {
        throw new SubstackApiError(
          'This post is paywalled and requires authentication'
        );
      }

      const response = await this.apiClient.get<any>(
        `${this.baseUrl}/api/v1/posts/${this.slug}/content`
      );

      return response.body_html || response.content || response;
    } catch (error) {
      throw new SubstackApiError(`Failed to fetch post content: ${error}`);
    }
  }

  /**
   * Check if the post is paywalled
   */
  public async isPaywalled(): Promise<boolean> {
    const metadata = await this.getMetadata();
    return metadata.is_paywalled;
  }

  /**
   * Get the post title
   */
  public async getTitle(): Promise<string> {
    const metadata = await this.getMetadata();
    return metadata.title;
  }

  /**
   * Get the post subtitle
   */
  public async getSubtitle(): Promise<string | undefined> {
    const metadata = await this.getMetadata();
    return metadata.subtitle;
  }

  /**
   * Get the post author
   */
  public async getAuthor(): Promise<any> {
    const metadata = await this.getMetadata();
    return metadata.author;
  }

  /**
   * Get the post publication date
   */
  public async getPublishDate(): Promise<string> {
    const metadata = await this.getMetadata();
    return metadata.post_date;
  }

  /**
   * Get the post word count
   */
  public async getWordCount(): Promise<number | undefined> {
    const metadata = await this.getMetadata();
    return metadata.word_count;
  }

  /**
   * Get the post reading time in minutes
   */
  public async getReadingTime(): Promise<number | undefined> {
    const metadata = await this.getMetadata();
    return metadata.reading_time_minutes;
  }

  /**
   * Get the post reactions
   */
  public async getReactions(): Promise<any> {
    const metadata = await this.getMetadata();
    return metadata.reactions;
  }

  /**
   * Get the post statistics
   */
  public async getStats(): Promise<any> {
    const metadata = await this.getMetadata();
    return metadata.stats;
  }

  /**
   * Get the post URL
   */
  public getUrl(): string {
    return this.url;
  }

  /**
   * Get the post slug
   */
  public getSlug(): string {
    return this.slug;
  }

  /**
   * Get the subdomain
   */
  public getSubdomain(): string {
    return this.subdomain;
  }

  /**
   * Set authentication for accessing paywalled content
   */
  public setAuth(auth: SubstackAuth): void {
    this.apiClient.setAuth(auth);
  }

  /**
   * Get the full post data (metadata + content)
   */
  public async getFullPost(): Promise<{
    metadata: PostMetadata;
    content: string;
  }> {
    const [metadata, content] = await Promise.all([
      this.getMetadata(),
      this.getContent(),
    ]);

    return { metadata, content };
  }
}
