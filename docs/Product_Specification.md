Build a production-ready **multi-user SaaS web application** using **React + Vite** for the frontend and **NestJS** for the backend.

The product is an **AI-powered Reddit knowledge extraction and research platform**. Its purpose is to let users enter a **subreddit URL or a specific Reddit post URL**, automatically analyze the relevant posts and comments, extract the most important knowledge and insights, preserve references to the original Reddit content, and allow the user to ask questions about the analyzed content through an AI agent.

The core value proposition is:

> **"Understand everything important in a Reddit community or discussion without having to read hundreds or thousands of posts and comments."**

The application should be designed as a polished SaaS product rather than a simple prototype.

---



# 1. Core User Flow

A user should be able to:

1. Create an account and log in.
2. Create a new research/analysis project.
3. Enter either:
  - A subreddit URL
  - A Reddit post URL
4. Configure how much content should be analyzed.
5. Start the analysis.
6. The backend retrieves the relevant Reddit posts/comments.
7. The system processes, cleans, deduplicates, ranks, and chunks the content.
8. AI analyzes the content and extracts:
  - Important facts
  - Recurring opinions
  - Common problems
  - Solutions
  - Recommendations
  - Arguments
  - Contradictions
  - Trends
  - Frequently mentioned products/services/tools
  - User experiences
  - Important statistics or numbers mentioned by users
  - Consensus and disagreement
  - Useful insights that may not be obvious from individual comments
9. The application generates a structured knowledge report.
10. Every important claim/insight should have references to the original Reddit posts/comments that support it.
11. The user can then ask questions through an AI agent that answers **only using the analyzed Reddit knowledge**.
12. Answers should contain clickable references back to the relevant Reddit posts/comments.

The experience should feel similar to an AI research tool rather than a generic chatbot.

---



# 2. Supported Sources

The application should support two primary analysis modes.

## A. Subreddit Analysis

Example:

`https://www.reddit.com/r/startups/`

The system should analyze posts from that subreddit according to the user's filters.

The user should be able to configure:

- Maximum number of posts
- Maximum comments per post
- Sort order
- Time period
- Minimum post score
- Minimum comment score
- Whether to include replies/nested comments
- Maximum comment depth
- Whether to analyze deleted/removed content when unavailable
- Whether to include NSFW content
- Whether to include controversial posts
- Whether to prioritize highly engaged discussions
- Whether to prioritize recent content
- Whether to prioritize popular content



### Post sorting options

At minimum:

- Hot
- Top
- New
- Rising
- Most controversial

For `Top`, allow time ranges such as:

- Hour
- Day
- Week
- Month
- Year
- All time

---



# 3. Reddit Post Analysis

The user should also be able to provide a specific post URL.

Example:

`https://www.reddit.com/r/startups/comments/xxxxx/example_post/`

The system should analyze:

- Original post
- Top-level comments
- Nested replies
- Comment scores
- Relevant discussion branches

The user should be able to configure:

- Maximum comments
- Maximum comment depth
- Minimum comment score
- Whether to prioritize top comments
- Whether to analyze the entire discussion
- Whether to prioritize comments with high engagement
- Whether to include controversial viewpoints

---



# 4. Intelligent Content Selection

Do not simply take the first N comments.

The system should intelligently select the most valuable content.

For example, if the user requests 500 comments, the system should attempt to maximize information coverage by considering:

- Comment score
- Reply count
- Discussion depth
- Recency
- Semantic uniqueness
- Relevance to the original post
- Whether the comment introduces new information
- Whether it provides a personal experience
- Whether it contradicts another viewpoint
- Whether it contains a concrete recommendation
- Whether it contains useful data or evidence

Avoid analyzing hundreds of comments that all repeat the same point.

The system should identify and remove or deprioritize redundant information.

---



# 5. Analysis Pipeline

Implement the analysis as a robust pipeline.

Suggested pipeline:

### Step 1 — Data Collection

Retrieve Reddit content.

### Step 2 — Normalization

Normalize:

- Posts
- Comments
- Authors
- Scores
- Timestamps
- Permalinks
- Parent/child relationships
- Subreddit information



### Step 3 — Filtering

Apply user-selected filters.

### Step 4 — Deduplication

Detect substantially duplicated or repetitive content.

### Step 5 — Relevance Ranking

Rank content based on its expected information value.

### Step 6 — Chunking

Split content into AI-friendly chunks while preserving source metadata.

Each chunk should retain references to:

- Reddit post
- Comment
- Author
- Score
- Timestamp
- URL
- Parent comment



### Step 7 — AI Extraction

Extract structured knowledge from each chunk.

### Step 8 — Knowledge Aggregation

Combine information across chunks.

Identify:

- Repeated themes
- Consensus
- Disagreement
- Contradictions
- Emerging trends
- Frequently mentioned entities
- Common experiences
- Important recommendations



### Step 9 — Final Synthesis

Generate the final knowledge report.

### Step 10 — Build Searchable Knowledge Base

Store the extracted knowledge and source references so that the AI agent can answer questions later without re-processing the entire Reddit dataset.

---



# 6. Knowledge Report

The generated report should not simply be a summary.

It should function as a **structured knowledge base**.

Possible sections:

## Executive Summary

A concise overview of everything important.

## Key Insights

The most important discoveries from the analyzed content.

Each insight should include supporting references.

## Main Topics

Automatically identify major topics discussed.

For example:

- Pricing
- Customer acquisition
- Marketing
- Product development
- Hiring

Each topic should contain:

- Summary
- Important findings
- Supporting discussions
- References



## Common Problems

Identify recurring problems users experience.

For each problem:

- Problem description
- How frequently it appears
- Common causes
- Solutions users recommend
- Supporting references



## Solutions & Recommendations

Extract actionable solutions mentioned by users.

Include:

- Recommended solution
- Why users recommend it
- Positive experiences
- Negative experiences
- Supporting references



## Consensus

Identify opinions where there appears to be broad agreement.

## Disagreements & Contradictions

Identify situations where users strongly disagree.

Show both sides and provide references.

## User Experiences

Extract meaningful first-hand experiences.

For example:

> "Several users reported that X increased conversion rates."

References should point to the specific comments/posts.

## Products, Tools & Services

Automatically detect frequently mentioned:

- Products
- SaaS tools
- Companies
- Websites
- Books
- Services
- Technologies

Show how users discuss them and link to the source discussions.

## Frequently Asked Questions

Automatically generate common questions and answers based on the analyzed content.

## Statistics & Numbers

Extract meaningful quantitative information mentioned by users.

For example:

- Prices
- Conversion rates
- Revenue
- Timeframes
- Percentages
- User counts

Every number should have a source reference.

---



# 7. Source Citations

This is a critical feature.

The AI must **never present extracted information without being able to identify where it came from**.

Every important insight should have one or more citations.

Example:

**Insight**

Users frequently report that cold email performs better when highly personalized.

**Sources**

- Reddit comment — 342 upvotes
- Reddit comment — 128 upvotes
- Reddit post — 2.1k upvotes

Each citation should link directly to the original Reddit content.

For comments, link to the **specific comment**, not just the post, whenever possible.

The UI should make citations easy to inspect.

For example:

`[1] Reddit comment · 342 points`

Clicking it opens the original Reddit comment.

---



# 8. AI Research Agent

Add a dedicated AI agent interface.

The user should be able to ask questions such as:

- "What are the most common problems people have with this?"
- "What products do people recommend?"
- "What are the biggest criticisms?"
- "What would you recommend based on these discussions?"
- "What are the arguments against this?"
- "How many people mentioned pricing?"
- "What are the most common solutions?"
- "What changed between older and newer discussions?"
- "Which opinion seems to have the strongest support?"
- "Show me the comments where people disagree."
- "Summarize what experienced users recommend."
- "What are the biggest mistakes people report making?"

The agent should answer using the analyzed Reddit dataset.

---



# 9. AI Agent Rules

The AI agent must be grounded in the analyzed Reddit content.

It should:

- Cite its sources.
- Link directly to Reddit posts/comments.
- Distinguish between facts and opinions.
- Clearly indicate when Reddit users disagree.
- Avoid presenting Reddit opinions as objective facts.
- State when the available dataset does not contain enough information.
- Never fabricate sources.
- Never fabricate Reddit comments or statistics.
- Prefer direct evidence from the dataset.
- Explain reasoning when aggregating multiple discussions.
- Use the source metadata available in the knowledge base.

If a question cannot be answered from the analyzed content, say so instead of using unrelated external knowledge.

Optionally provide a separate mode where the user explicitly allows external web knowledge, but keep this separate from the Reddit-grounded mode.

---



# 10. Conversation Memory

Each research project should have its own AI conversation.

The system should remember:

- Previous questions
- Previous answers
- Relevant sources
- User-selected context

Example:

User:

> What are the biggest problems people have with Stripe?

AI:

> The three most frequently mentioned problems are...

User:

> Which one appears most serious?

The AI should understand that "which one" refers to the previously discussed problems.

---



# 11. Research Projects

Users should have a dashboard containing their analyses.

Example:

**My Research**

- r/startups — Startup Research
- r/SaaS — SaaS Market Research
- "Best CRM for Small Businesses" — Reddit Post Analysis

Each research project should contain:

- Source URL
- Source type
- Analysis configuration
- Analysis status
- Number of posts analyzed
- Number of comments analyzed
- Date created
- Date updated
- Generated knowledge report
- AI conversation
- Source references

Allow users to:

- Rename projects
- Delete projects
- Re-run analyses
- Update an analysis
- Export results
- Continue asking questions

---



# 12. Analysis Status

Large analyses may take significant time.

Do not make the user wait on a single HTTP request.

Implement an asynchronous job architecture.

Possible states:

- Pending
- Collecting data
- Filtering
- Processing
- Generating embeddings
- Extracting knowledge
- Awaiting batch completion (Batch mode only — see Section 22)
- Synthesizing
- Completed
- Failed

The frontend should display real-time progress.

Example:

> Collecting Reddit posts — 342 / 500

> Processing comments — 4,218 / 5,000

> Extracting insights...

> Building knowledge base...

> Generating final report...

When `processingMode` is `batch`, the "Extracting knowledge" and "Synthesizing" steps are replaced by a single "Awaiting batch completion" state once the batch is submitted to OpenAI. Progress during this state should show the batch submission time and, if available, the OpenAI batch status (validating, in progress, finalizing) rather than a granular item count, since individual request progress is not observable mid-batch.

---



# 13. Search

Inside each research project, provide semantic search.

The user should be able to search:

> "people complaining about pricing"

or:

> "recommendations for getting first customers"

and retrieve the most relevant posts/comments.

Search results should display:

- Relevant excerpt
- Score
- Author
- Date
- Post title
- Subreddit
- Reddit link

---



# 14. Dashboard / UX

Create a clean, modern SaaS interface.

Suggested navigation:

### Sidebar

- Dashboard
- New Analysis
- My Research
- Saved Insights
- Search
- AI Assistant
- Settings



### Dashboard

Show:

- Recent analyses
- Analysis statistics
- Recently generated insights
- Quick "New Analysis" button



### New Analysis page

Provide:

**Source**

`[ Reddit URL input ]`

Automatically detect whether it is:

- Subreddit
- Post

Then show appropriate configuration options, including the processing mode toggle:

`Processing speed:  ( ) Standard — faster, standard cost   ( ) Batch — cheaper, up to 24h`

See Section 22 for the behavior behind this toggle.

---



# 15. Research View

The main research page should have a layout similar to an AI research application.

Suggested tabs:

- Overview
- Key Insights
- Topics
- Problems
- Solutions
- Opinions
- Products
- Statistics
- Sources
- AI Assistant

The AI Assistant should be available as a persistent panel or dedicated tab.

---



# 16. Source Explorer

Create a source browser showing all analyzed Reddit content.

Each source should display:

- Post/comment title or excerpt
- Author
- Score
- Date
- Source type
- Parent post
- URL
- Topics
- Extracted insights

Allow sorting/filtering by:

- Score
- Date
- Relevance
- Source type
- Topic

---



# 17. Data Model

Use PostgreSQL with Prisma.

Design a production-quality schema.

At minimum, consider entities such as:

- User
- ResearchProject
- ResearchSource
- RedditPost
- RedditComment
- AnalysisJob
- AnalysisConfiguration
- BatchSubmission
- KnowledgeChunk
- KnowledgeInsight
- Topic
- Citation
- Conversation
- ConversationMessage
- Embedding
- SavedInsight

Design relationships appropriately.

`AnalysisConfiguration` should include a `processingMode: 'standard' | 'batch'` field (see Section 22). When an `AnalysisJob` runs in batch mode, it should be linked to one or more `BatchSubmission` records tracking the OpenAI batch id, submission/completion timestamps, status, and request/response file references, so a job can be resumed or reconciled if the worker restarts while a batch is in flight.

The system should support multiple users from the beginning.

---



# 18. Multi-User Authorization

The application must be multi-user.

Implement proper authorization and ownership checks in NestJS.

---



# 19. Backend Architecture

Use NestJS with a modular architecture.

Suggested modules:

- AuthModule
- UsersModule
- ResearchModule
- RedditModule
- AnalysisModule
- AI Module
- KnowledgeModule
- SearchModule
- ConversationsModule
- JobsModule
- BillingModule
- ExportModule

Use clean separation of concerns.

Do not put all logic inside controllers.

---



# 20. Background Processing

Use a queue-based architecture for expensive tasks.

Redis can be used for job queues.

The architecture should allow:

- Multiple workers
- Retry failed jobs
- Job progress
- Concurrency limits
- Rate limiting
- Graceful failure handling

The system should be designed so Reddit ingestion and AI processing can scale independently.

---



# 21. AI Architecture

Use an LLM abstraction layer so the application is not tightly coupled to one provider.

The system should support:

- OpenAI initially
- Potentially other providers later

The abstraction layer should support two execution strategies behind the same interface:

- **Standard** — synchronous/streaming Chat Completions calls, used for real-time extraction.
- **Batch** — OpenAI Batch API submissions, used for asynchronous, lower-cost extraction.

The active strategy is selected per analysis via a user-facing toggle. See Section 22 for details.

Implement structured AI outputs wherever possible.

Do not rely on free-form model output for important database operations.

Use schemas for things such as:

- Insights
- Topics
- Claims
- Citations
- Statistics
- Recommendations
- Contradictions

---



# 22. AI Processing Mode Toggle (Standard vs. Batch)

The application should let the user choose how the AI extraction/synthesis steps (Steps 7–9 of the pipeline) are executed, via a simple toggle exposed at analysis configuration time.

## Standard Mode (default)

- Uses synchronous/streaming OpenAI Chat Completions calls.
- Results typically available within minutes.
- Full per-token pricing.
- Best for smaller subreddits/posts, or when the user wants fast results.
- Compatible with the granular real-time progress reporting described in Section 12.

## Batch Mode (OpenAI Batch API)

- Uses the [OpenAI Batch API](https://platform.openai.com/docs/guides/batch) to submit all extraction, aggregation, and synthesis prompts for an analysis as a single batched job instead of individual synchronous calls.
- Roughly 50% lower token cost than Standard mode, in exchange for asynchronous completion — the OpenAI batch window is up to 24 hours, though it often completes sooner.
- Best for large subreddit analyses, cost-sensitive users, or non-urgent research where the user does not need results immediately.
- Not compatible with sub-step-level real-time progress (no partial streaming); progress reporting instead reflects batch submission and completion, plus normal progress for the non-AI pipeline steps (collection, filtering, ranking, chunking).

## Toggle Behavior

- Exposed in the New Analysis configuration UI (Section 14) as something like:

  > **Processing speed:** `( ) Standard — faster, standard cost` `( ) Batch — cheaper, up to 24h`

- Persisted per analysis as `AnalysisConfiguration.processingMode: 'standard' | 'batch'`.
- The AI Module should route extraction/aggregation/synthesis calls through the Standard or Batch strategy based on this field, without any other part of the pipeline needing to know which strategy is active.
- If a batch submission fails, expires, or is only partially fulfilled, the system should retry the unresolved items (falling back to Standard mode for those items is acceptable) rather than failing the entire analysis.
- Users should be able to see whether a given analysis ran in Standard or Batch mode from the research project view, and the estimated/actual AI cost should reflect the mode used (see Section 26).

---



# 23. Retrieval-Augmented Generation

The AI assistant should use RAG.

Store embeddings for:

- Reddit posts
- Reddit comments
- Knowledge chunks
- Extracted insights

When a user asks a question:

1. Understand the query.
2. Retrieve relevant knowledge.
3. Retrieve supporting Reddit sources.
4. Construct the AI context.
5. Generate an answer.
6. Attach citations to the answer.
7. Return clickable source references.

The retrieval system should avoid unnecessarily sending the entire dataset to the LLM.

---



# 24. Knowledge Graph / Relationships

Where useful, model relationships between:

- Topics
- Problems
- Solutions
- Products
- Opinions
- Claims
- Sources

For example:

`Problem → Solution → Supporting Comments`

or:

`Product → Positive Opinions → Negative Opinions → Sources`

This should allow the UI to eventually provide deeper exploration of the extracted knowledge.

---



# 25. Export

Allow users to export their research.

At minimum:

- Markdown
- PDF
- JSON

The exported report should preserve source links.

Example:

> Insight: Users frequently recommend X for Y.
>
> Sources:
>
> - Reddit comment
> - Reddit post
> - Reddit comment

---



# 26. Cost & Token Optimization

The system should be designed with AI cost efficiency in mind.

Do not send redundant Reddit content to the LLM.

Use techniques such as:

- Deduplication
- Chunking
- Semantic clustering
- Hierarchical summarization
- Embeddings
- Cached analysis
- Incremental processing
- Batch processing via the OpenAI Batch API for cost-insensitive or large analyses (see Section 22), at roughly half the per-token cost of standard calls

For large subreddits, use a multi-stage process:

**Reddit content → Filtering → Ranking → Clustering → Summarization → Knowledge extraction → Final synthesis**

Avoid processing thousands of repetitive comments independently when they contain essentially the same information.

---



# 27. Reddit API / Data Acquisition

Create a dedicated Reddit integration layer.

Do not scatter Reddit API logic throughout the application.

The Reddit integration should handle:

- Authentication
- Rate limits
- Pagination
- Retries
- API errors
- Deleted content
- Removed content
- Comment trees
- Permalinks
- Score information

Make the integration replaceable so another Reddit data provider can be added later if necessary.

---



# 28. Security

Implement standard production security practices.

Include:

- Secure authentication
- Password hashing
- JWT/session management
- Authorization guards
- Input validation
- Rate limiting
- API protection
- Secure secrets management
- Protection against prompt injection from Reddit content

Treat Reddit content as **untrusted input**.

A Reddit comment must never be able to manipulate the system into:

- Executing tools
- Revealing system prompts
- Accessing another user's data
- Bypassing authorization
- Changing application state

The AI pipeline should explicitly separate **instructions** from **untrusted Reddit content**.

---



# 29. Observability

Include structured logging and error handling.

Track:

- Analysis duration
- Number of posts/comments processed
- AI calls
- Token usage
- Estimated AI cost
- Failed jobs
- Queue status
- API errors
- Reddit API rate limits

This information should be available to administrators.

---



# 30. Admin Panel

Create an admin area for platform administrators.

Include:

- Users
- Research projects
- Analysis jobs
- AI usage
- Token consumption
- Estimated costs
- System errors
- Queue status
- Reddit API usage

---



# 31. Billing Architecture

Prepare the application for SaaS billing.

Design usage limits around:

- Analyses per month
- Reddit posts analyzed
- Comments analyzed
- AI tokens
- Storage

Do not necessarily implement payments initially, but structure the backend so Stripe billing can be added without major architectural changes.

---



# 32. Important Product Principle

The application is **not simply an AI summarizer**.

The primary product is:

> **A searchable, source-backed knowledge layer over Reddit discussions.**

The user should be able to go from:

**Thousands of Reddit discussions**

→ **Structured knowledge**

→ **Evidence-backed insights**

→ **Ask questions**

→ **Trace every answer back to the original Reddit discussion.**

Trust and traceability are critical.

---



# 33. Technical Requirements

Frontend:

- React
- Vite
- TypeScript
- Modern component architecture
- Responsive design
- React Query / TanStack Query or equivalent
- Strong loading/error/empty states

Backend:

- NestJS
- TypeScript
- Prisma
- PostgreSQL
- Redis
- Queue system such as BullMQ
- REST API initially

Infrastructure should be designed so that workers and API instances can scale independently.

---



# 34. Code Quality

Write production-quality code.

Requirements:

- Strong TypeScript typing
- DTO validation
- Proper error handling
- Modular architecture
- Dependency injection
- Repository/service separation where appropriate
- No unnecessary duplication
- Environment-based configuration
- Database migrations
- Proper indexes
- Pagination
- API documentation
- Unit tests for critical services
- Integration tests for important flows

Avoid creating a huge monolithic service.

---



# 35. Important UX Details

The application should clearly communicate what the AI knows and where that information came from.

Whenever possible, provide:

- Citation badges
- Source previews
- "View on Reddit" actions
- Confidence/relevance indicators
- Number of supporting sources
- Number of users/comments supporting an insight
- Contradictory evidence

For example:

**Most users recommend X**

`Supported by 27 discussions`

`[View sources]`

This makes the product much more useful for research and decision-making.

---



# 36. Initial MVP

Build the first version around the following flow:

### MVP Flow

1. User signs up.
2. User enters a subreddit or Reddit post URL.
3. User configures:
  - Number of posts
  - Number of comments
  - Sort order
  - Time range
  - Minimum score
  - Processing mode (Standard or Batch — see Section 22)
4. System retrieves Reddit content.
5. System processes the content asynchronously.
6. AI extracts structured knowledge.
7. System generates a research report.
8. User can browse the report.
9. Every major insight contains source citations.
10. User can ask questions about the research.
11. AI answers using RAG.
12. AI answers contain clickable Reddit references.
13. User can save the research project and return later.

Do not overcomplicate the MVP with unnecessary features before this core experience works extremely well.

---



# 37. Deliverables

Build the application as a complete full-stack project.

Provide:

1. React/Vite frontend
2. NestJS backend
3. Prisma schema
4. PostgreSQL database configuration
5. Redis/queue configuration
6. Reddit integration
7. AI integration
8. RAG pipeline
9. Authentication
10. Multi-user authorization
11. Background analysis jobs
12. Research dashboard
13. Knowledge report UI
14. AI research agent
15. Citation/source system
16. Environment configuration
17. Database migrations
18. Seed data where useful
19. Tests for critical functionality
20. README with complete local development instructions

The code should be organized so that the MVP can later evolve into a production SaaS without requiring a major rewrite.

Before implementing, define the architecture, database schema, API contracts, analysis pipeline, and frontend page/component structure. Then implement the MVP in logical stages.