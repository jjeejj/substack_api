import { ApiClient, SubstackAuth } from '../auth';
import {
  UserProfile,
  Subscription,
  SubstackApiError,
  NotFoundError,
} from '../types';

export class User {
  private username: string;
  private originalUsername: string;
  private apiClient: ApiClient;
  private profile?: UserProfile;
  public wasRedirected: boolean = false;
  private followRedirects: boolean;

  constructor(
    username: string,
    auth?: SubstackAuth,
    followRedirects: boolean = true
  ) {
    this.username = username;
    this.originalUsername = username;
    this.followRedirects = followRedirects;
    this.apiClient = new ApiClient(auth);
  }

  /**
   * Get user profile information
   */
  public async getProfile(): Promise<UserProfile> {
    if (this.profile) {
      return this.profile;
    }

    try {
      const response = await this.apiClient.get<any>(
        `https://substack.com/api/v1/users/${this.username}`
      );

      this.profile = response.user || response;
      if (!this.profile) {
        throw new SubstackApiError('Failed to fetch user profile');
      }
      return this.profile;
    } catch (error) {
      if (error instanceof NotFoundError && this.followRedirects) {
        // Try to resolve handle redirect
        const newHandle = await this.resolveHandleRedirect();
        if (newHandle) {
          this.username = newHandle;
          this.wasRedirected = true;
          return this.getProfile(); // Retry with new handle
        }
      }
      throw new SubstackApiError(`Failed to fetch user profile: ${error}`);
    }
  }

  /**
   * Get raw user data
   */
  public async getRawData(): Promise<any> {
    try {
      const response = await this.apiClient.get<any>(
        `https://substack.com/api/v1/users/${this.username}/raw`
      );

      return response;
    } catch (error) {
      if (error instanceof NotFoundError && this.followRedirects) {
        const newUsername = await this.resolveHandleRedirect();
        if (newUsername) {
          this.username = newUsername;
          this.wasRedirected = true;
          return this.getRawData();
        }
      }
      throw new SubstackApiError(`Failed to fetch raw user data: ${error}`);
    }
  }

  /**
   * Get user subscriptions
   */
  public async getSubscriptions(): Promise<Subscription[]> {
    try {
      const response = await this.apiClient.get<any>(
        `https://substack.com/api/v1/users/${this.username}/subscriptions`
      );

      return response.subscriptions || response;
    } catch (error) {
      throw new SubstackApiError(
        `Failed to fetch user subscriptions: ${error}`
      );
    }
  }

  /**
   * Get user ID
   */
  public async getId(): Promise<number> {
    const profile = await this.getProfile();
    return profile.id;
  }

  /**
   * Get user name
   */
  public async getName(): Promise<string> {
    const profile = await this.getProfile();
    return profile.name;
  }

  /**
   * Get user handle/username
   */
  public getUsername(): string {
    return this.username;
  }

  /**
   * Get original username (before any redirects)
   */
  public getOriginalUsername(): string {
    return this.originalUsername;
  }

  /**
   * Check if user is a writer
   */
  public async isWriter(): Promise<boolean> {
    const profile = await this.getProfile();
    return profile.is_writer;
  }

  /**
   * Check if user is a subscriber
   */
  public async isSubscriber(): Promise<boolean> {
    const profile = await this.getProfile();
    return profile.is_subscriber;
  }

  /**
   * Get user bio
   */
  public async getBio(): Promise<string | undefined> {
    const profile = await this.getProfile();
    return profile.bio;
  }

  /**
   * Get user photo URL
   */
  public async getPhotoUrl(): Promise<string | undefined> {
    const profile = await this.getProfile();
    return profile.photo_url;
  }

  /**
   * Get user location
   */
  public async getLocation(): Promise<string | undefined> {
    const profile = await this.getProfile();
    return profile.location;
  }

  /**
   * Get user website
   */
  public async getWebsite(): Promise<string | undefined> {
    const profile = await this.getProfile();
    return profile.website;
  }

  /**
   * Get user Twitter handle
   */
  public async getTwitterHandle(): Promise<string | undefined> {
    const profile = await this.getProfile();
    return profile.twitter_screen_name;
  }

  /**
   * Get subscription count
   */
  public async getSubscriptionCount(): Promise<number | undefined> {
    const profile = await this.getProfile();
    return profile.subscription_count;
  }

  /**
   * Get following count
   */
  public async getFollowingCount(): Promise<number | undefined> {
    const profile = await this.getProfile();
    return profile.following_count;
  }

  /**
   * Get follower count
   */
  public async getFollowerCount(): Promise<number | undefined> {
    const profile = await this.getProfile();
    return profile.follower_count;
  }

  /**
   * Resolve handle redirect manually
   */
  private async resolveHandleRedirect(): Promise<string | null> {
    try {
      // Try to get redirect information from Substack's redirect API
      const response = await this.apiClient.get<any>(
        `https://substack.com/api/v1/users/${this.originalUsername}/redirect`
      );

      return response.new_handle || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Set authentication
   */
  public setAuth(auth: SubstackAuth): void {
    this.apiClient.setAuth(auth);
  }
}

/**
 * Resolve handle redirect manually (standalone function)
 */
export async function resolveHandleRedirect(
  oldHandle: string
): Promise<string | null> {
  try {
    const apiClient = new ApiClient();
    const response = await apiClient.get<any>(
      `https://substack.com/api/v1/users/${oldHandle}/redirect`
    );

    return response.new_handle || null;
  } catch (error) {
    return null;
  }
}
