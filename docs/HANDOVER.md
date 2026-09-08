# Handover: Threadline — subreddit-wide analysis via Bright Data Web Unlocker

**Read this first if you're picking up where a previous session left off.** The core product (frontend + backend) is complete and working. There is exactly **one** feature gap left, blocked on an external approval (Bright Data KYC). This doc tells you what to do the moment that approval comes through, plus everything else worth knowing about this codebase's current state.

---

## 1. Current state (as of this handover)

### Frontend — done
All 11 pages from `app/docs/mockup.html` are built and wired to the real API: Dashboard, New Analysis, Analysis Progress, My Research, Project Detail (9 report tabs), Sources, Search, Saved Insights, AI Assistant, Settings, Admin. Threadline's brand theme is wired into the shadcn token system (`app/DESIGN.md`, `app/src/index.css`). Verified via live browser testing against the real API, not just typechecked. `npx tsc -b --noEmit` in `app/` is clean.

### Backend — done except one thing
- Full Prisma schema, auth, all CRUD modules, BullMQ analysis pipeline (Reddit ingestion → embeddings → knowledge extraction → topic clustering → synthesis) — all working.
- **Reddit data source**: Reddit's own API is effectively unusable for new integrations as of 2026 — self-serve OAuth app creation closed (Nov 2025), unauthenticated `.json` scraping blocked (May 2026). `api/src/integrations/reddit/services/reddit-oauth.service.ts` exists as a fallback (client-credentials OAuth) in case Reddit's formal API approval process is ever pursued, but it's not the primary path.
- **Bright Data is the real data source now**, wired in `api/src/integrations/reddit/services/bright-data-reddit.service.ts`, delegated to from `reddit.service.ts` whenever `BRIGHT_DATA_API_TOKEN` is set in `.env.staging`.
  - ✅ **Single-thread analysis** (user pastes a specific post URL) — fully working, verified end-to-end with real data producing real extracted insights. Uses Bright Data's structured "Reddit- Posts" (`gd_lvz8ah06191smkebj4`) and "Reddit- Comments" (`gd_lvzdpsdlw09j6t702`) datasets via their Datasets v3 API (`api/src/integrations/reddit/services/bright-data-client.service.ts`).
  - ❌ **Subreddit-wide analysis** (user pastes just `/r/subredditname`) — **this is the gap**. Bright Data's "Reddit- Posts" dataset only supports single-URL lookup (confirmed via their own `/datasets/{id}/metadata` endpoint — no `sort_by`/`num_of_posts`/listing fields exist). It cannot return a sorted list of many posts.

---

## 2. The plan to close the gap (do this once KYC is approved)

**The fix**: use Bright Data's separate **Web Unlocker API** product to fetch Reddit's *own* listing JSON (`https://www.reddit.com/r/{sub}/{sort}.json`) through Bright Data's residential proxy network — bypassing Reddit's bot-blocking — then parse it with the JSON-parsing code that **already exists** in `reddit.service.ts` (the pre-Bright-Data direct-Reddit implementation). No new field-mapping work needed; that parser was already correct, it just couldn't get past Reddit's block on its own.

### What's already set up
- A Web Unlocker zone exists: **`rediq_unlocker`** (type `unblocker`), created in the Bright Data dashboard.
- It uses the **same** `BRIGHT_DATA_API_TOKEN` already in `.env.staging` (confirmed working for both the Datasets API and this zone).
- **The blocker**: Bright Data returns `"Residential Failed (bad_endpoint): ... not available for immediate residential (no KYC) access mode ... fill in the KYC form"` when targeting `reddit.com` specifically. The user submitted that KYC form and is waiting on approval. **Once approved, the exact same request that failed should just work** — no code changes needed to unblock it, just re-run the verification call below.

### Step 1 — Verify the zone is unblocked
```bash
cd api
node -e '
require("dotenv").config({ path: ".env.staging" });
const token = process.env.BRIGHT_DATA_API_TOKEN;
(async () => {
  const res = await fetch("https://api.brightdata.com/request", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ zone: "rediq_unlocker", url: "https://www.reddit.com/r/vandwellers/hot.json?limit=5", format: "raw" }),
  });
  console.log(res.status);
  console.log((await res.text()).slice(0, 1000));
})();
'
```
If this returns real Reddit listing JSON (an object with `data.children[]`, same shape Reddit's public API always returned) instead of the KYC error, you're unblocked — proceed.

### Step 2 — Wire the env var
Add to `api/.env.template` and `api/.env.staging`:
```
BRIGHT_DATA_UNLOCKER_ZONE=rediq_unlocker
```
Register it (same pattern as `BRIGHT_DATA_API_TOKEN`) in:
- `api/src/shared/config/env/env.validation.ts` — add `BRIGHT_DATA_UNLOCKER_ZONE: z.string().optional(),` to the Zod schema.
- `api/src/shared/config/env/index.ts` — add `BRIGHT_DATA_UNLOCKER_ZONE: process.env.BRIGHT_DATA_UNLOCKER_ZONE,` to the factory.

**Do not skip this.** There's a real bug we already hit once: env vars added only to `.env.staging`/`.env.template` but not to these two files get silently dropped by `ConfigService.get()` — a whole debugging session was lost to this exact mistake. See §4 below.

### Step 3 — Add the Unlocker transport to `BrightDataConfig`
In `api/src/integrations/reddit/config/bright-data.config.ts`, add:
```ts
getUnlockerZone(): string | undefined {
  return this.configService.get<string>('BRIGHT_DATA_UNLOCKER_ZONE') || undefined;
}
hasUnlockerZone(): boolean {
  return !!this.getUnlockerZone();
}
```

### Step 4 — Add a fetch-via-Unlocker method
In `api/src/integrations/reddit/services/bright-data-client.service.ts`, add a method that POSTs to `https://api.brightdata.com/request` with `{ zone, url, format: "raw" }` and returns the parsed JSON body (Reddit's `.json` endpoints return JSON as raw text — `JSON.parse()` the response). Mirror the existing `collect()` method's error handling style.

### Step 5 — Route `fetchSubredditPosts` and `detectSource`'s subreddit branch through it
This is the important architectural decision: **don't** try to make `BrightDataRedditService` do this — its whole design is built around the structured datasets, which are wrong for this use case. Instead, modify **`reddit.service.ts`** (the original file, which already has a fully correct `fetchSubredditPosts()` implementation using `SORT_MAP`, pagination via `after` cursor, and the private `mapPost()`/`request()` methods) so that its private `resolveRequestContext()` / `request()` method has a **third** option:

```
if brightDataConfig.hasUnlockerZone() → fetch the target reddit.com URL through Bright Data's Unlocker (Step 4's method), parse the returned JSON exactly like the current unauthenticated-fetch path already does
else if redditConfig.hasOAuthCredentials() → oauth.reddit.com (existing)
else → www.reddit.com direct (existing, now mostly dead due to Reddit's blocking)
```

Then in `RedditService.fetchSubredditPosts()` and `detectSource()`'s community branch: **prefer the Unlocker-routed path over `BrightDataRedditService`** when `hasUnlockerZone()` is true, since it's the only one that actually supports listings. Keep `BrightDataRedditService.fetchPostWithComments()`/`detectSource(THREAD)` as the primary path for single-post lookups (already proven, richer data, embedded comments) — only the subreddit-listing case needs to change transport.

### Step 6 — Test end-to-end
Create a project with a plain subreddit URL (not a specific thread) and confirm `posts_processed` climbs past 1 during a run — that's the signal this actually works now (previously it always capped at exactly 1).

---

## 3. Known environment gotchas (learned the hard way this session — don't relearn them)

1. **`nest start --watch` does not reliably restart on this Windows setup.** After editing API source, the watcher sometimes recompiles but fails to fully kill the old process before restarting, hitting `EADDRINUSE` and silently leaving the *old* code still running on port 3000 while the crash log gets buried. **After every backend code change, don't trust the watcher — manually verify**: check what PID is on port 3000 (`netstat -ano | grep :3000`), and if in doubt, kill it and start a fresh `npm run start:staging` in `api/`, then confirm `/health`'s `uptime_ms` is small (proving it's actually the new process).

2. **`.env.staging` points at the same Redis and Postgres as production.** This is intentional per the user, not a mistake to "fix." It means:
   - **Queue names are already suffixed per-`NODE_ENV`** (`api/src/core/queues/queues.constants.ts` — `analysis-pipeline-staging` locally, bare `analysis-pipeline` only in real production) so local job processing doesn't race the production worker. If you add any *other* BullMQ queue, apply the same suffix pattern.
   - **Any research project/job you create while testing lands in the real production database.** Clean up test data you create (`DELETE /research-projects/:id` cascades everything). Don't leave test rows lying around.

3. **There may be another live session/deployment also touching this repo and its shared Redis/DB.** If a job you create never seems to get processed by your own local server (check its own console output — you should see log lines for it), that's the signal something else grabbed it, not that your code is broken.

4. **Env var checklist**: any new `.env.staging` entry needs registering in *both* `api/src/shared/config/env/index.ts` (the raw factory) *and* `api/src/shared/config/env/env.validation.ts` (the Zod schema) — the schema uses `.safeParse()` in strip mode, so a var present in the `.env` file but missing from the schema silently vanishes from what `ConfigService.get()` can see, even though `process.env` still has it. This cost a long debugging session once already.

---

## 4. Where things live
- Reddit/Bright Data integration: `api/src/integrations/reddit/`
- Analysis pipeline: `api/src/background/analysis/`
- Frontend pages: `app/src/pages/` (one folder per mockup page)
- Design tokens: `app/DESIGN.md`, `app/src/index.css`
- Mockup reference: `app/docs/mockup.html`
