-- CreateEnum
CREATE TYPE "AuthRole" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN', 'SUPPORT');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('LOGO', 'BANNER', 'IMAGE', 'VIDEO', 'AUDIO', 'PDF', 'DOCUMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "SourcePlatform" AS ENUM ('REDDIT');

-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('COMMUNITY', 'THREAD');

-- CreateEnum
CREATE TYPE "PostSortOrder" AS ENUM ('HOT', 'TOP', 'NEW', 'RISING', 'CONTROVERSIAL');

-- CreateEnum
CREATE TYPE "TopTimeRange" AS ENUM ('HOUR', 'DAY', 'WEEK', 'MONTH', 'YEAR', 'ALL');

-- CreateEnum
CREATE TYPE "ProcessingMode" AS ENUM ('STANDARD', 'BATCH');

-- CreateEnum
CREATE TYPE "AnalysisStatus" AS ENUM ('PENDING', 'COLLECTING_DATA', 'FILTERING', 'PROCESSING', 'GENERATING_EMBEDDINGS', 'EXTRACTING_KNOWLEDGE', 'AWAITING_BATCH_COMPLETION', 'SYNTHESIZING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "BatchSubmissionStatus" AS ENUM ('VALIDATING', 'IN_PROGRESS', 'FINALIZING', 'COMPLETED', 'FAILED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "InsightType" AS ENUM ('KEY_INSIGHT', 'PROBLEM', 'SOLUTION', 'OPINION', 'CONSENSUS', 'CONTRADICTION', 'USER_EXPERIENCE', 'PRODUCT_MENTION', 'FAQ', 'STATISTIC', 'TREND', 'RECOMMENDATION', 'ARGUMENT');

-- CreateEnum
CREATE TYPE "ConversationMode" AS ENUM ('GROUNDED', 'EXTERNAL_ALLOWED');

-- CreateEnum
CREATE TYPE "MessageRole" AS ENUM ('USER', 'ASSISTANT', 'SYSTEM');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "role" "AuthRole" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "user_uuid" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "user_uuid" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL DEFAULT 'LOGO',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "research_projects" (
    "id" TEXT NOT NULL,
    "user_uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "AnalysisStatus" NOT NULL DEFAULT 'PENDING',
    "posts_analyzed" INTEGER NOT NULL DEFAULT 0,
    "comments_analyzed" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "research_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "research_sources" (
    "id" TEXT NOT NULL,
    "research_project_uuid" TEXT NOT NULL,
    "platform" "SourcePlatform" NOT NULL DEFAULT 'REDDIT',
    "source_type" "SourceType" NOT NULL,
    "url" TEXT NOT NULL,
    "community" TEXT NOT NULL,
    "external_post_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "research_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analysis_configurations" (
    "id" TEXT NOT NULL,
    "research_project_uuid" TEXT NOT NULL,
    "processing_mode" "ProcessingMode" NOT NULL DEFAULT 'STANDARD',
    "sort_order" "PostSortOrder" NOT NULL DEFAULT 'HOT',
    "top_time_range" "TopTimeRange",
    "max_posts" INTEGER,
    "max_comments_per_post" INTEGER,
    "max_comments" INTEGER,
    "max_comment_depth" INTEGER,
    "min_post_score" INTEGER,
    "min_comment_score" INTEGER,
    "include_replies" BOOLEAN NOT NULL DEFAULT true,
    "include_nsfw" BOOLEAN NOT NULL DEFAULT false,
    "include_controversial" BOOLEAN NOT NULL DEFAULT true,
    "analyze_deleted_when_unavailable" BOOLEAN NOT NULL DEFAULT false,
    "prioritize_engagement" BOOLEAN NOT NULL DEFAULT false,
    "prioritize_recent" BOOLEAN NOT NULL DEFAULT false,
    "prioritize_popular" BOOLEAN NOT NULL DEFAULT false,
    "prioritize_top_comments" BOOLEAN NOT NULL DEFAULT true,
    "analyze_entire_discussion" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "analysis_configurations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analysis_jobs" (
    "id" TEXT NOT NULL,
    "research_project_uuid" TEXT NOT NULL,
    "analysis_configuration_uuid" TEXT NOT NULL,
    "status" "AnalysisStatus" NOT NULL DEFAULT 'PENDING',
    "current_step" TEXT,
    "posts_processed" INTEGER NOT NULL DEFAULT 0,
    "posts_total" INTEGER NOT NULL DEFAULT 0,
    "comments_processed" INTEGER NOT NULL DEFAULT 0,
    "comments_total" INTEGER NOT NULL DEFAULT 0,
    "error_message" TEXT,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "analysis_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "batch_submissions" (
    "id" TEXT NOT NULL,
    "analysis_job_uuid" TEXT NOT NULL,
    "openai_batch_id" TEXT NOT NULL,
    "status" "BatchSubmissionStatus" NOT NULL DEFAULT 'VALIDATING',
    "request_file_id" TEXT,
    "response_file_id" TEXT,
    "error_file_id" TEXT,
    "submitted_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "batch_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "research_project_uuid" TEXT NOT NULL,
    "platform" "SourcePlatform" NOT NULL DEFAULT 'REDDIT',
    "external_id" TEXT NOT NULL,
    "community" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT,
    "body" TEXT,
    "url" TEXT NOT NULL,
    "permalink" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "upvote_ratio" DOUBLE PRECISION,
    "num_comments" INTEGER NOT NULL DEFAULT 0,
    "flair" TEXT,
    "is_nsfw" BOOLEAN NOT NULL DEFAULT false,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "is_removed" BOOLEAN NOT NULL DEFAULT false,
    "posted_at" TIMESTAMP(3) NOT NULL,
    "fetched_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "research_project_uuid" TEXT NOT NULL,
    "post_uuid" TEXT NOT NULL,
    "external_id" TEXT NOT NULL,
    "parent_external_id" TEXT,
    "parent_comment_uuid" TEXT,
    "author" TEXT,
    "body" TEXT,
    "score" INTEGER NOT NULL DEFAULT 0,
    "depth" INTEGER NOT NULL DEFAULT 0,
    "permalink" TEXT NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "is_removed" BOOLEAN NOT NULL DEFAULT false,
    "posted_at" TIMESTAMP(3) NOT NULL,
    "fetched_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "knowledge_chunks" (
    "id" TEXT NOT NULL,
    "research_project_uuid" TEXT NOT NULL,
    "analysis_job_uuid" TEXT NOT NULL,
    "post_uuid" TEXT,
    "comment_uuid" TEXT,
    "content" TEXT NOT NULL,
    "token_count" INTEGER,
    "chunk_index" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "knowledge_chunks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "embeddings" (
    "id" TEXT NOT NULL,
    "research_project_uuid" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "dimensions" INTEGER NOT NULL,
    "vector" DOUBLE PRECISION[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "post_uuid" TEXT,
    "comment_uuid" TEXT,
    "knowledge_chunk_uuid" TEXT,
    "knowledge_insight_uuid" TEXT,

    CONSTRAINT "embeddings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "knowledge_insights" (
    "id" TEXT NOT NULL,
    "research_project_uuid" TEXT NOT NULL,
    "analysis_job_uuid" TEXT,
    "topic_uuid" TEXT,
    "type" "InsightType" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "confidence_score" DOUBLE PRECISION,
    "supporting_count" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "knowledge_insights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topics" (
    "id" TEXT NOT NULL,
    "research_project_uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "summary" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "citations" (
    "id" TEXT NOT NULL,
    "knowledge_insight_uuid" TEXT NOT NULL,
    "post_uuid" TEXT,
    "comment_uuid" TEXT,
    "knowledge_chunk_uuid" TEXT,
    "excerpt" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "citations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversations" (
    "id" TEXT NOT NULL,
    "research_project_uuid" TEXT NOT NULL,
    "user_uuid" TEXT NOT NULL,
    "title" TEXT,
    "mode" "ConversationMode" NOT NULL DEFAULT 'GROUNDED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversation_messages" (
    "id" TEXT NOT NULL,
    "conversation_uuid" TEXT NOT NULL,
    "role" "MessageRole" NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversation_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_citations" (
    "id" TEXT NOT NULL,
    "conversation_message_uuid" TEXT NOT NULL,
    "post_uuid" TEXT,
    "comment_uuid" TEXT,
    "knowledge_insight_uuid" TEXT,
    "excerpt" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_citations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_insights" (
    "id" TEXT NOT NULL,
    "user_uuid" TEXT NOT NULL,
    "research_project_uuid" TEXT NOT NULL,
    "knowledge_insight_uuid" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_insights_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_phone_idx" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_id_idx" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_token_hash_key" ON "password_reset_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "password_reset_tokens_user_uuid_idx" ON "password_reset_tokens"("user_uuid");

-- CreateIndex
CREATE INDEX "password_reset_tokens_expires_at_idx" ON "password_reset_tokens"("expires_at");

-- CreateIndex
CREATE INDEX "documents_user_uuid_idx" ON "documents"("user_uuid");

-- CreateIndex
CREATE INDEX "documents_id_idx" ON "documents"("id");

-- CreateIndex
CREATE INDEX "research_projects_user_uuid_idx" ON "research_projects"("user_uuid");

-- CreateIndex
CREATE INDEX "research_projects_status_idx" ON "research_projects"("status");

-- CreateIndex
CREATE UNIQUE INDEX "research_sources_research_project_uuid_key" ON "research_sources"("research_project_uuid");

-- CreateIndex
CREATE INDEX "research_sources_research_project_uuid_idx" ON "research_sources"("research_project_uuid");

-- CreateIndex
CREATE INDEX "analysis_configurations_research_project_uuid_idx" ON "analysis_configurations"("research_project_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "analysis_jobs_analysis_configuration_uuid_key" ON "analysis_jobs"("analysis_configuration_uuid");

-- CreateIndex
CREATE INDEX "analysis_jobs_research_project_uuid_idx" ON "analysis_jobs"("research_project_uuid");

-- CreateIndex
CREATE INDEX "analysis_jobs_status_idx" ON "analysis_jobs"("status");

-- CreateIndex
CREATE UNIQUE INDEX "batch_submissions_openai_batch_id_key" ON "batch_submissions"("openai_batch_id");

-- CreateIndex
CREATE INDEX "batch_submissions_analysis_job_uuid_idx" ON "batch_submissions"("analysis_job_uuid");

-- CreateIndex
CREATE INDEX "batch_submissions_status_idx" ON "batch_submissions"("status");

-- CreateIndex
CREATE INDEX "posts_research_project_uuid_idx" ON "posts"("research_project_uuid");

-- CreateIndex
CREATE INDEX "posts_community_idx" ON "posts"("community");

-- CreateIndex
CREATE INDEX "posts_score_idx" ON "posts"("score");

-- CreateIndex
CREATE UNIQUE INDEX "posts_research_project_uuid_external_id_key" ON "posts"("research_project_uuid", "external_id");

-- CreateIndex
CREATE INDEX "comments_research_project_uuid_idx" ON "comments"("research_project_uuid");

-- CreateIndex
CREATE INDEX "comments_post_uuid_idx" ON "comments"("post_uuid");

-- CreateIndex
CREATE INDEX "comments_parent_comment_uuid_idx" ON "comments"("parent_comment_uuid");

-- CreateIndex
CREATE INDEX "comments_score_idx" ON "comments"("score");

-- CreateIndex
CREATE UNIQUE INDEX "comments_research_project_uuid_external_id_key" ON "comments"("research_project_uuid", "external_id");

-- CreateIndex
CREATE INDEX "knowledge_chunks_research_project_uuid_idx" ON "knowledge_chunks"("research_project_uuid");

-- CreateIndex
CREATE INDEX "knowledge_chunks_analysis_job_uuid_idx" ON "knowledge_chunks"("analysis_job_uuid");

-- CreateIndex
CREATE INDEX "knowledge_chunks_post_uuid_idx" ON "knowledge_chunks"("post_uuid");

-- CreateIndex
CREATE INDEX "knowledge_chunks_comment_uuid_idx" ON "knowledge_chunks"("comment_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "embeddings_post_uuid_key" ON "embeddings"("post_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "embeddings_comment_uuid_key" ON "embeddings"("comment_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "embeddings_knowledge_chunk_uuid_key" ON "embeddings"("knowledge_chunk_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "embeddings_knowledge_insight_uuid_key" ON "embeddings"("knowledge_insight_uuid");

-- CreateIndex
CREATE INDEX "embeddings_research_project_uuid_idx" ON "embeddings"("research_project_uuid");

-- CreateIndex
CREATE INDEX "knowledge_insights_research_project_uuid_idx" ON "knowledge_insights"("research_project_uuid");

-- CreateIndex
CREATE INDEX "knowledge_insights_analysis_job_uuid_idx" ON "knowledge_insights"("analysis_job_uuid");

-- CreateIndex
CREATE INDEX "knowledge_insights_topic_uuid_idx" ON "knowledge_insights"("topic_uuid");

-- CreateIndex
CREATE INDEX "knowledge_insights_type_idx" ON "knowledge_insights"("type");

-- CreateIndex
CREATE INDEX "topics_research_project_uuid_idx" ON "topics"("research_project_uuid");

-- CreateIndex
CREATE INDEX "citations_knowledge_insight_uuid_idx" ON "citations"("knowledge_insight_uuid");

-- CreateIndex
CREATE INDEX "citations_post_uuid_idx" ON "citations"("post_uuid");

-- CreateIndex
CREATE INDEX "citations_comment_uuid_idx" ON "citations"("comment_uuid");

-- CreateIndex
CREATE INDEX "conversations_research_project_uuid_idx" ON "conversations"("research_project_uuid");

-- CreateIndex
CREATE INDEX "conversations_user_uuid_idx" ON "conversations"("user_uuid");

-- CreateIndex
CREATE INDEX "conversation_messages_conversation_uuid_idx" ON "conversation_messages"("conversation_uuid");

-- CreateIndex
CREATE INDEX "message_citations_conversation_message_uuid_idx" ON "message_citations"("conversation_message_uuid");

-- CreateIndex
CREATE INDEX "saved_insights_user_uuid_idx" ON "saved_insights"("user_uuid");

-- CreateIndex
CREATE INDEX "saved_insights_research_project_uuid_idx" ON "saved_insights"("research_project_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "saved_insights_user_uuid_knowledge_insight_uuid_key" ON "saved_insights"("user_uuid", "knowledge_insight_uuid");

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research_projects" ADD CONSTRAINT "research_projects_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research_sources" ADD CONSTRAINT "research_sources_research_project_uuid_fkey" FOREIGN KEY ("research_project_uuid") REFERENCES "research_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analysis_configurations" ADD CONSTRAINT "analysis_configurations_research_project_uuid_fkey" FOREIGN KEY ("research_project_uuid") REFERENCES "research_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analysis_jobs" ADD CONSTRAINT "analysis_jobs_research_project_uuid_fkey" FOREIGN KEY ("research_project_uuid") REFERENCES "research_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analysis_jobs" ADD CONSTRAINT "analysis_jobs_analysis_configuration_uuid_fkey" FOREIGN KEY ("analysis_configuration_uuid") REFERENCES "analysis_configurations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch_submissions" ADD CONSTRAINT "batch_submissions_analysis_job_uuid_fkey" FOREIGN KEY ("analysis_job_uuid") REFERENCES "analysis_jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_research_project_uuid_fkey" FOREIGN KEY ("research_project_uuid") REFERENCES "research_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_research_project_uuid_fkey" FOREIGN KEY ("research_project_uuid") REFERENCES "research_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_uuid_fkey" FOREIGN KEY ("post_uuid") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_comment_uuid_fkey" FOREIGN KEY ("parent_comment_uuid") REFERENCES "comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "knowledge_chunks" ADD CONSTRAINT "knowledge_chunks_research_project_uuid_fkey" FOREIGN KEY ("research_project_uuid") REFERENCES "research_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "knowledge_chunks" ADD CONSTRAINT "knowledge_chunks_analysis_job_uuid_fkey" FOREIGN KEY ("analysis_job_uuid") REFERENCES "analysis_jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "knowledge_chunks" ADD CONSTRAINT "knowledge_chunks_post_uuid_fkey" FOREIGN KEY ("post_uuid") REFERENCES "posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "knowledge_chunks" ADD CONSTRAINT "knowledge_chunks_comment_uuid_fkey" FOREIGN KEY ("comment_uuid") REFERENCES "comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "embeddings" ADD CONSTRAINT "embeddings_research_project_uuid_fkey" FOREIGN KEY ("research_project_uuid") REFERENCES "research_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "embeddings" ADD CONSTRAINT "embeddings_post_uuid_fkey" FOREIGN KEY ("post_uuid") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "embeddings" ADD CONSTRAINT "embeddings_comment_uuid_fkey" FOREIGN KEY ("comment_uuid") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "embeddings" ADD CONSTRAINT "embeddings_knowledge_chunk_uuid_fkey" FOREIGN KEY ("knowledge_chunk_uuid") REFERENCES "knowledge_chunks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "embeddings" ADD CONSTRAINT "embeddings_knowledge_insight_uuid_fkey" FOREIGN KEY ("knowledge_insight_uuid") REFERENCES "knowledge_insights"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "knowledge_insights" ADD CONSTRAINT "knowledge_insights_research_project_uuid_fkey" FOREIGN KEY ("research_project_uuid") REFERENCES "research_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "knowledge_insights" ADD CONSTRAINT "knowledge_insights_analysis_job_uuid_fkey" FOREIGN KEY ("analysis_job_uuid") REFERENCES "analysis_jobs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "knowledge_insights" ADD CONSTRAINT "knowledge_insights_topic_uuid_fkey" FOREIGN KEY ("topic_uuid") REFERENCES "topics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topics" ADD CONSTRAINT "topics_research_project_uuid_fkey" FOREIGN KEY ("research_project_uuid") REFERENCES "research_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "citations" ADD CONSTRAINT "citations_knowledge_insight_uuid_fkey" FOREIGN KEY ("knowledge_insight_uuid") REFERENCES "knowledge_insights"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "citations" ADD CONSTRAINT "citations_post_uuid_fkey" FOREIGN KEY ("post_uuid") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "citations" ADD CONSTRAINT "citations_comment_uuid_fkey" FOREIGN KEY ("comment_uuid") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "citations" ADD CONSTRAINT "citations_knowledge_chunk_uuid_fkey" FOREIGN KEY ("knowledge_chunk_uuid") REFERENCES "knowledge_chunks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_research_project_uuid_fkey" FOREIGN KEY ("research_project_uuid") REFERENCES "research_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_messages" ADD CONSTRAINT "conversation_messages_conversation_uuid_fkey" FOREIGN KEY ("conversation_uuid") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_citations" ADD CONSTRAINT "message_citations_conversation_message_uuid_fkey" FOREIGN KEY ("conversation_message_uuid") REFERENCES "conversation_messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_citations" ADD CONSTRAINT "message_citations_post_uuid_fkey" FOREIGN KEY ("post_uuid") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_citations" ADD CONSTRAINT "message_citations_comment_uuid_fkey" FOREIGN KEY ("comment_uuid") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_citations" ADD CONSTRAINT "message_citations_knowledge_insight_uuid_fkey" FOREIGN KEY ("knowledge_insight_uuid") REFERENCES "knowledge_insights"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_insights" ADD CONSTRAINT "saved_insights_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_insights" ADD CONSTRAINT "saved_insights_research_project_uuid_fkey" FOREIGN KEY ("research_project_uuid") REFERENCES "research_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_insights" ADD CONSTRAINT "saved_insights_knowledge_insight_uuid_fkey" FOREIGN KEY ("knowledge_insight_uuid") REFERENCES "knowledge_insights"("id") ON DELETE CASCADE ON UPDATE CASCADE;
