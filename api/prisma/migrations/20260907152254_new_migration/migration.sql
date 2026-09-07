-- CreateEnum
CREATE TYPE "JobEventLevel" AS ENUM ('INFO', 'WARNING', 'ERROR');

-- CreateEnum
CREATE TYPE "SentimentLabel" AS ENUM ('POSITIVE', 'NEUTRAL', 'NEGATIVE');

-- AlterTable
ALTER TABLE "analysis_jobs" ADD COLUMN     "actual_cost_usd" DOUBLE PRECISION,
ADD COLUMN     "completion_tokens" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "estimated_cost_usd" DOUBLE PRECISION,
ADD COLUMN     "prompt_tokens" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "batch_submissions" ADD COLUMN     "completion_tokens" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "cost_usd" DOUBLE PRECISION,
ADD COLUMN     "prompt_tokens" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "knowledge_insights" ADD COLUMN     "sentiment" "SentimentLabel",
ADD COLUMN     "sentiment_score" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "research_projects" ADD COLUMN     "sentiment_negative_pct" DOUBLE PRECISION,
ADD COLUMN     "sentiment_neutral_pct" DOUBLE PRECISION,
ADD COLUMN     "sentiment_positive_pct" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "saved_insights" ADD COLUMN     "collection_uuid" TEXT;

-- CreateTable
CREATE TABLE "job_events" (
    "id" TEXT NOT NULL,
    "analysis_job_uuid" TEXT NOT NULL,
    "step" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "level" "JobEventLevel" NOT NULL DEFAULT 'INFO',
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_insight_collections" (
    "id" TEXT NOT NULL,
    "user_uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "saved_insight_collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_searches" (
    "id" TEXT NOT NULL,
    "user_uuid" TEXT NOT NULL,
    "research_project_uuid" TEXT,
    "name" TEXT,
    "query" TEXT NOT NULL,
    "min_score" INTEGER,
    "time_range" "TopTimeRange",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_searches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "job_events_analysis_job_uuid_idx" ON "job_events"("analysis_job_uuid");

-- CreateIndex
CREATE INDEX "job_events_created_at_idx" ON "job_events"("created_at");

-- CreateIndex
CREATE INDEX "saved_insight_collections_user_uuid_idx" ON "saved_insight_collections"("user_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "saved_insight_collections_user_uuid_name_key" ON "saved_insight_collections"("user_uuid", "name");

-- CreateIndex
CREATE INDEX "saved_searches_user_uuid_idx" ON "saved_searches"("user_uuid");

-- CreateIndex
CREATE INDEX "saved_searches_research_project_uuid_idx" ON "saved_searches"("research_project_uuid");

-- CreateIndex
CREATE INDEX "saved_insights_collection_uuid_idx" ON "saved_insights"("collection_uuid");

-- AddForeignKey
ALTER TABLE "job_events" ADD CONSTRAINT "job_events_analysis_job_uuid_fkey" FOREIGN KEY ("analysis_job_uuid") REFERENCES "analysis_jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_insights" ADD CONSTRAINT "saved_insights_collection_uuid_fkey" FOREIGN KEY ("collection_uuid") REFERENCES "saved_insight_collections"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_insight_collections" ADD CONSTRAINT "saved_insight_collections_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_searches" ADD CONSTRAINT "saved_searches_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_searches" ADD CONSTRAINT "saved_searches_research_project_uuid_fkey" FOREIGN KEY ("research_project_uuid") REFERENCES "research_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
