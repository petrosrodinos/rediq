export const BULL_BOARD_ADAPTER = 'BULL_BOARD_ADAPTER';

/**
 * Non-production environments share the same Redis instance as production
 * (same REDIS_URL in .env.staging/.env.local), so a local/staging queue
 * consumer would otherwise compete with the production worker for the same
 * jobs. Suffixing the queue name for every environment except production
 * gives each one its own isolated queue in that shared Redis, with zero
 * config needed on the production deployment itself.
 */
const QUEUE_ENV_SUFFIX =
  process.env.NODE_ENV && process.env.NODE_ENV !== 'production'
    ? `-${process.env.NODE_ENV}`
    : '';

export const ANALYSIS_QUEUE_NAME = `analysis-pipeline${QUEUE_ENV_SUFFIX}`;
export const ANALYSIS_JOB_NAME = 'process-analysis';

export interface AnalysisQueueJobData {
  analysisJobUuid: string;
}
