import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import {
  Cookie,
  SubstackApiError,
  AuthenticationError,
  NotFoundError,
  RateLimitError,
} from '../types';

export class SubstackAuth {
  private cookies: Cookie[] = [];
  private cookieString: string = '';

  constructor(cookiesPath?: string, cookies?: Cookie[]) {
    if (cookiesPath) {
      this.loadCookiesFromFile(cookiesPath);
    } else if (cookies) {
      this.cookies = cookies;
      this.cookieString = this.formatCookies();
    }
  }

  private loadCookiesFromFile(cookiesPath: string): void {
    try {
      const fs = require('fs');
      const cookiesData = fs.readFileSync(cookiesPath, 'utf8');
      this.cookies = JSON.parse(cookiesData);
      this.cookieString = this.formatCookies();
    } catch (error) {
      throw new SubstackApiError(
        `Failed to load cookies from ${cookiesPath}: ${error}`
      );
    }
  }

  private formatCookies(): string {
    return this.cookies
      .map(cookie => `${cookie.name}=${cookie.value}`)
      .join('; ');
  }

  public getCookieString(): string {
    return this.cookieString;
  }

  public isAuthenticated(): boolean {
    return (
      this.cookies.length > 0 &&
      this.cookies.some(cookie => cookie.name === 'substack.sid')
    );
  }
}

export class ApiClient {
  private client: AxiosInstance;
  private auth?: SubstackAuth;

  constructor(auth?: SubstackAuth) {
    this.auth = auth;
    this.client = axios.create({
      timeout: 30000,
      headers: {
        'User-Agent': 'SubstackAPI-TS/1.0.0',
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for authentication
    this.client.interceptors.request.use(config => {
      if (this.auth && this.auth.isAuthenticated()) {
        config.headers.Cookie = this.auth.getCookieString();
      }
      return config;
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      error => {
        if (error.response) {
          const { status, data } = error.response;
          switch (status) {
            case 401:
              throw new AuthenticationError(
                data?.message || 'Authentication required'
              );
            case 404:
              throw new NotFoundError(data?.message || 'Resource not found');
            case 429:
              throw new RateLimitError(data?.message || 'Rate limit exceeded');
            default:
              throw new SubstackApiError(
                data?.message || `HTTP ${status} error`,
                status
              );
          }
        }
        throw new SubstackApiError(`Network error: ${error.message}`);
      }
    );
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get(url, config);
    return response.data;
  }

  public async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.post(url, data, config);
    return response.data;
  }

  public setAuth(auth: SubstackAuth): void {
    this.auth = auth;
  }

  public getAuth(): SubstackAuth | undefined {
    return this.auth;
  }
}
