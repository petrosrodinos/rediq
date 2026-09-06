# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React + Vite + TypeScript (frontend); NestJS + TypeScript + Prisma + PostgreSQL + Redis + BullMQ (backend); REST API initially. LLM provider: OpenAI, behind a provider-agnostic abstraction layer supporting both Standard (synchronous) and OpenAI Batch API execution.

## Users

Primary users are people trying to make sense of a Reddit community or a long Reddit discussion without reading hundreds or thousands of posts and comments themselves — e.g. founders and marketers researching a market (r/startups, r/SaaS), or someone comparing options before a decision ("Best CRM for Small Businesses"). Multi-user/organization support is a first-class requirement, so the product is used by individuals and by teams doing research together.

## Product Purpose

Let a user point the product at a subreddit or a specific Reddit post, and have it retrieve, clean, and analyze the discussion, extract the important facts, opinions, problems, solutions, recommendations, trends, and disagreements, and produce a structured, source-cited knowledge report. The user can then ask an AI research agent follow-up questions that are answered only from the analyzed content, with every answer traceable back to the originating Reddit post or comment. Success means a user can go from "thousands of Reddit discussions" to "evidence-backed insights they can trust and verify" without reading the raw threads themselves.

## Positioning

Not an AI summarizer. The product is a searchable, source-backed knowledge layer over Reddit discussions: every insight, claim, and statistic must carry a citation back to the specific Reddit post or comment that supports it, and the AI agent must refuse to answer, or say so explicitly, when the analyzed dataset doesn't contain the answer rather than falling back on general knowledge. This traceability is the mechanism a plain "summarize this subreddit" tool doesn't offer.

## Operating Context

Core flow: sign up → create a research project → enter a subreddit URL or a Reddit post URL → configure scope (post/comment counts, sort order, time range, score thresholds, depth, NSFW/controversial inclusion, etc.) and processing mode (Standard vs. Batch) → analysis runs as an async background job with visible progress states → system produces a knowledge report (executive summary, key insights, topics, problems, solutions, consensus/disagreements, user experiences, products/tools, FAQ, statistics) → user browses the report and/or asks the AI research agent questions, with conversation memory per project → user can save, re-run, export (Markdown/PDF/JSON), rename, or delete the project, and browse a source explorer of everything that was analyzed.

## Capabilities and Constraints

- Two source types: subreddit analysis and single Reddit post/thread analysis, each with its own configurable filters.
- Intelligent content selection rather than "first N comments": ranks by score, reply count, depth, recency, semantic uniqueness, relevance, novelty, and evidence, and dedupes repetitive content.
- A defined 10-step analysis pipeline: collection → normalization → filtering → deduplication → relevance ranking → chunking → AI extraction → knowledge aggregation → synthesis → searchable knowledge base.
- AI extraction/synthesis runs through a provider-agnostic LLM abstraction layer with structured outputs, supporting two execution strategies selectable per analysis via a toggle: Standard (synchronous, faster, full cost) and Batch (OpenAI Batch API, ~50% cheaper, up to 24h turnaround).
- RAG-backed AI research agent: answers are grounded only in the analyzed Reddit dataset, must cite sources, distinguish fact from opinion, surface disagreement, and explicitly say when the dataset can't answer a question; an optional separate mode may allow external web knowledge, kept distinct from the grounded mode.
- Every insight, claim, and statistic requires one or more citations linking directly to the originating Reddit post/comment, down to the specific comment where possible.
- Async job architecture (queue-based, e.g. BullMQ/Redis) with real-time progress states, since analyses can be large and slow; workers and API instances scale independently.
- Multi-tenant from the start: users, memberships/organizations, and NestJS-level authorization/ownership checks.
- Reddit content is treated as untrusted input; the AI pipeline must separate instructions from Reddit content and resist prompt injection attempting to exfiltrate data, escalate privilege, or change state.
- Semantic search within a project, an admin panel (usage, cost, queue/job health), observability (token usage, AI cost, job/queue status), and an architecture prepared for Stripe billing (usage limits on analyses/posts/comments/tokens/storage) without payments necessarily implemented yet.
- Undecided / explicitly out of scope for now: actual pricing/plans, payment processing, and any additional Reddit data provider beyond the primary Reddit API integration (the integration layer should be built replaceable).

## Evidence on Hand

None yet. No real Reddit analyses, sample reports, branding, or customer evidence exist at this stage — the spec is a build brief, not a validated product. Future work must not fabricate testimonials, sample insights, or usage numbers.

## Product Principles

1. Never present an insight, claim, or number without a traceable citation back to the source Reddit post or comment.
2. Prefer intelligent, deduplicated, ranked content selection over brute-force "read everything" processing.
3. The AI agent stays grounded in the analyzed dataset — it says "I don't know" rather than filling gaps with outside knowledge, and never presents Reddit opinion as objective fact.
4. Treat all Reddit content as untrusted input the AI pipeline must not let manipulate the system or its instructions.
5. Design for AI cost efficiency by default (dedup, chunking, clustering, caching, and an optional cheaper batch-processing mode) rather than treating cost as an afterthought.
