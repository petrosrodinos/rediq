import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { ApifyConfig } from '../config/apify.config';
import {
  ApifyRedditActorInput,
  ApifyRedditItem,
  ApifyRunInfo,
} from '../interfaces/apify-reddit.interfaces';

const API_BASE = 'https://api.apify.com/v2';
const TERMINAL_RUN_STATUSES = new Set(['SUCCEEDED', 'FAILED', 'TIMED-OUT', 'ABORTED']);
const POLL_INTERVAL_MS = 3000;

/**
 * Thin client for the Apify REST API, scoped to running the
 * `harshmaur~reddit-scraper` actor (see `api/docs/reddit-scraper.yaml`) and
 * reading back its dataset. Reddit-specific request/response shaping lives
 * in `ApifyRedditService` — this class only knows how to run the actor
 * (sync or async) and fetch its results.
 *
 * https://docs.apify.com/api/v2
 */
@Injectable()
export class ApifyClientService {
  private readonly logger = new Logger(ApifyClientService.name);

  constructor(private readonly config: ApifyConfig) {}

  private get actorPath(): string {
    return `/acts/${this.config.getActorId()}`;
  }

  private tokenParam(): Record<string, string> {
    const token = this.config.getApiToken();
    if (!token) {
      throw new Error('Apify API token is not configured.');
    }
    return { token };
  }

  /**
   * Runs the actor and waits for it to finish, returning its dataset items
   * directly. Apify caps how long this endpoint will block server-side, so
   * it's meant for small/interactive lookups (e.g. a single post/subreddit
   * preview for `detectSource`) — use `runAndWaitForItems` for larger jobs.
   */
  async runSyncGetDatasetItems(
    input: ApifyRedditActorInput,
  ): Promise<ApifyRedditItem[]> {
    try {
      const response = await axios.post<ApifyRedditItem[]>(
        `${API_BASE}${this.actorPath}/run-sync-get-dataset-items`,
        input,
        {
          params: this.tokenParam(),
          headers: { 'Content-Type': 'application/json' },
          timeout: 120000,
        },
      );
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      throw this.wrapError('run-sync-get-dataset-items', error);
    }
  }

  /**
   * Starts an async actor run and returns its run info (id + dataset id) without waiting.
   * 60s timeout: Apify's `/runs` trigger endpoint has been observed taking well over 15s to
   * respond under load (confirmed via live testing), and this only runs inside the already-async
   * background ingestion pipeline (see `runAndWaitForItems`), so nobody is waiting on it live.
   */
  async runActor(input: ApifyRedditActorInput): Promise<ApifyRunInfo> {
    try {
      const response = await axios.post<{ data: ApifyRunInfo }>(
        `${API_BASE}${this.actorPath}/runs`,
        input,
        {
          params: this.tokenParam(),
          headers: { 'Content-Type': 'application/json' },
          timeout: 60000,
        },
      );
      return response.data.data;
    } catch (error) {
      throw this.wrapError('runs', error);
    }
  }

  /** Fetches the current status/metadata of a previously started run. */
  async getRun(runId: string): Promise<ApifyRunInfo> {
    try {
      const response = await axios.get<{ data: ApifyRunInfo }>(
        `${API_BASE}/actor-runs/${runId}`,
        { params: this.tokenParam(), timeout: 10000 },
      );
      return response.data.data;
    } catch (error) {
      throw this.wrapError('actor-runs', error);
    }
  }

  /** Fetches all items from a dataset (e.g. a finished run's `defaultDatasetId`). */
  async getDatasetItems(datasetId: string): Promise<ApifyRedditItem[]> {
    try {
      const response = await axios.get<ApifyRedditItem[]>(
        `${API_BASE}/datasets/${datasetId}/items`,
        {
          params: { ...this.tokenParam(), format: 'json', clean: true },
          timeout: 60000,
        },
      );
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      throw this.wrapError('dataset items', error);
    }
  }

  /**
   * Starts an async run and polls it to completion, then downloads its
   * dataset. Use this for larger collection jobs (e.g. a full subreddit
   * scrape with per-post comments) that could exceed `run-sync`'s
   * server-side wait window.
   */
  async runAndWaitForItems(
    input: ApifyRedditActorInput,
    maxWaitMs = 15 * 60 * 1000,
  ): Promise<ApifyRedditItem[]> {
    const run = await this.runActor(input);
    const deadline = Date.now() + maxWaitMs;
    let current = run;

    while (
      !TERMINAL_RUN_STATUSES.has(current.status) &&
      Date.now() < deadline
    ) {
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
      current = await this.getRun(run.id);
    }

    if (current.status !== 'SUCCEEDED') {
      throw new Error(
        `Apify run ${run.id} did not succeed (status: ${current.status}).`,
      );
    }

    return this.getDatasetItems(current.defaultDatasetId);
  }

  private wrapError(operation: string, error: unknown): Error {
    const message = error instanceof Error ? error.message : 'Unknown error';
    this.logger.error(`Apify ${operation} request failed: ${message}`);
    return new Error(`Apify request failed (${operation}): ${message}`);
  }
}
