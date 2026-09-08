import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { BrightDataConfig } from '../config/bright-data.config';

const API_BASE = 'https://api.brightdata.com/datasets/v3';
const POLL_INTERVAL_MS = 3000;

interface SnapshotStatus {
  status: 'starting' | 'running' | 'ready' | 'failed';
}

/**
 * Thin client for Bright Data's Web Scraper (Datasets) API v3. Reddit-specific
 * request/response shaping lives in `BrightDataRedditService` — this class
 * only knows how to trigger a collection against a dataset_id and retrieve
 * its results, sync or async.
 *
 * https://docs.brightdata.com/api-reference/web-scraper-api
 */
@Injectable()
export class BrightDataClientService {
  private readonly logger = new Logger(BrightDataClientService.name);

  constructor(private readonly config: BrightDataConfig) {}

  private authHeaders(): Record<string, string> {
    return { Authorization: `Bearer ${this.config.getApiToken()}` };
  }

  /**
   * Collects records for a dataset. Uses the real-time `/scrape` endpoint
   * (fast, meant for small/interactive lookups like URL previews) when
   * `sync` is true, otherwise the batch `/trigger` endpoint (meant for
   * larger collections, e.g. a full subreddit listing). Both can fall back
   * to polling a snapshot if Bright Data can't finish within its own
   * synchronous window.
   */
  async collect<T>(
    datasetId: string,
    input: Record<string, unknown>[],
    options?: { sync?: boolean; maxWaitMs?: number },
  ): Promise<T[]> {
    if (!this.config.hasCredentials()) {
      throw new Error('Bright Data API token is not configured.');
    }

    const sync = options?.sync ?? false;
    // Comment collection for a real, active thread can genuinely take several
    // minutes on Bright Data's end (confirmed via live testing) — this runs
    // inside an already-async background analysis job with nobody waiting on
    // it live, so it's fine to wait well beyond what an interactive request
    // (the `sync` path) should ever block for.
    const maxWaitMs = options?.maxWaitMs ?? (sync ? 20000 : 15 * 60 * 1000);
    const endpoint = sync ? 'scrape' : 'trigger';

    try {
      const response = await axios.post(
        `${API_BASE}/${endpoint}`,
        { input },
        {
          params: { dataset_id: datasetId, format: 'json' },
          headers: {
            ...this.authHeaders(),
            'Content-Type': 'application/json',
          },
          timeout: sync ? 65000 : 15000,
        },
      );

      // Synchronous success: data is already the result array.
      if (response.status === 200 && Array.isArray(response.data)) {
        return response.data as T[];
      }

      const snapshotId: string | undefined = response.data?.snapshot_id;
      if (!snapshotId) {
        throw new Error('Bright Data did not return a snapshot id to poll.');
      }

      return await this.pollAndDownload<T>(snapshotId, maxWaitMs);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Bright Data collection failed (dataset ${datasetId}): ${message}`,
      );
      throw new Error(`Bright Data request failed: ${message}`);
    }
  }

  private async pollAndDownload<T>(
    snapshotId: string,
    maxWaitMs: number,
  ): Promise<T[]> {
    const deadline = Date.now() + maxWaitMs;

    while (Date.now() < deadline) {
      const { data } = await axios.get<SnapshotStatus>(
        `${API_BASE}/progress/${snapshotId}`,
        {
          headers: this.authHeaders(),
          timeout: 10000,
        },
      );

      if (data.status === 'ready') {
        const result = await axios.get<T[]>(
          `${API_BASE}/snapshot/${snapshotId}`,
          {
            params: { format: 'json' },
            headers: this.authHeaders(),
            timeout: 30000,
          },
        );
        return Array.isArray(result.data) ? result.data : [];
      }

      if (data.status === 'failed') {
        throw new Error(`Bright Data snapshot ${snapshotId} failed.`);
      }

      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
    }

    throw new Error(
      `Bright Data snapshot ${snapshotId} did not finish in time.`,
    );
  }
}
