import { ERROR_MESSAGES } from '../constants';

import type { HeatmapData } from './dataUtils';

/**
 * Global request manager to prevent duplicate requests
 * This is a singleton that exists outside React's lifecycle
 */
class RequestManager {
  private static instance: RequestManager;
  private pendingRequests: Map<string, Promise<HeatmapData>> = new Map();
  private cachedData: Map<string, HeatmapData> = new Map();
  private activeController: AbortController | null = null;

  private constructor() {}

  public static getInstance(): RequestManager {
    if (!RequestManager.instance) {
      RequestManager.instance = new RequestManager();
    }
    return RequestManager.instance;
  }

  /**
   * Fetch data with caching and request deduplication
   */
  public async fetchData(
    url: string,
    cacheKey: string,
    options: RequestInit = {}
  ): Promise<HeatmapData> {
    // 1. If the data is in cache, return it immediately
    if (this.cachedData.has(cacheKey)) {
      return this.cachedData.get(cacheKey)!;
    }

    // 2. If there's a pending request for this URL, return the existing promise
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey)!;
    }

    // 3. Cancel any other requests
    this.cancelAllRequests();

    // 4. Create a new abort controller for this request
    this.activeController = new AbortController();
    options.signal = this.activeController.signal;

    // 5. Create and store the new request promise
    const requestPromise = fetch(url, options)
      .then(response => {
        if (!response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('text/html')) {
            throw new Error(ERROR_MESSAGES.HTML_CONTENT(response.status));
          }
          throw new Error(ERROR_MESSAGES.HTTP_ERROR(response.status));
        }
        return response.text();
      })
      .then(text => {
        if (
          text.trim().startsWith('<!DOCTYPE') ||
          text.trim().startsWith('<html')
        ) {
          throw new Error(ERROR_MESSAGES.HTML_RESPONSE);
        }
        const data = JSON.parse(text) as HeatmapData;

        // Store in cache
        this.cachedData.set(cacheKey, data);

        // Remove from pending
        this.pendingRequests.delete(cacheKey);

        return data;
      })
      .catch(error => {
        // Remove from pending on error
        this.pendingRequests.delete(cacheKey);
        throw error;
      });

    // Store the promise
    this.pendingRequests.set(cacheKey, requestPromise);

    return requestPromise;
  }

  /**
   * Cancel all ongoing requests
   */
  private cancelAllRequests(): void {
    if (this.activeController) {
      this.activeController.abort();
      this.activeController = null;
    }
  }

  /**
   * Invalidate cache for a specific key
   */
  public invalidateCache(cacheKey: string): void {
    this.cachedData.delete(cacheKey);
  }

  /**
   * Clear the entire cache
   */
  public clearCache(): void {
    this.cachedData.clear();
  }
}

export default RequestManager.getInstance();
