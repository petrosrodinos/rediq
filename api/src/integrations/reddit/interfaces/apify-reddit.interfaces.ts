/**
 * Full input/output contract for the `harshmaur~reddit-scraper` Apify actor,
 * as documented in `api/docs/reddit-scraper.yaml` (input schema) and
 * `api/docs/reddit-scraper-output.json` (dataset item schema).
 */

export interface ApifyRedditStartUrl {
  url: string;
}

export type ApifySearchSort =
  | ''
  | 'relevance'
  | 'hot'
  | 'top'
  | 'new'
  | 'comments';

export type ApifySearchTime =
  | 'all'
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'year';

export type ApifyMcpMode = 'perPost' | 'summary';

export type ApifyMcpComments = 'ignore' | 'bundle' | 'separate';

export interface ApifyProxyConfiguration {
  useApifyProxy?: boolean;
  apifyProxyGroups?: string[];
  proxyUrls?: string[];
}

/** Full input schema accepted by the actor's `run-sync-get-dataset-items` / `runs` / `run-sync` endpoints. */
export interface ApifyRedditActorInput {
  searchTerms?: string[];
  searchPosts?: boolean;
  searchComments?: boolean;
  searchCommunities?: boolean;
  withinCommunity?: string;
  searchSort?: ApifySearchSort;
  searchTime?: ApifySearchTime;
  startUrls?: ApifyRedditStartUrl[];
  fastMode?: boolean;
  subredditUrls?: string[];
  postedAfter?: string;
  postedBefore?: string;
  commentedAfter?: string;
  commentedBefore?: string;
  onlyWithFlair?: boolean;
  crawlCommentsPerPost?: boolean;
  includeNSFW?: boolean;
  maxPostsCount?: number;
  maxCommentsCount?: number;
  maxCommentsPerPost?: number;
  maxCommunitiesCount?: number;
  aiAnalysis?: boolean;
  customLabels?: Record<string, string>;
  mcpConnector?: string;
  mcpMode?: ApifyMcpMode;
  mcpTarget?: string;
  mcpComments?: ApifyMcpComments;
  mcpCommentsPerPost?: number;
  mcpMessage?: string;
  mcpTool?: string;
  mcpArguments?: Record<string, unknown>;
  mcpMaxItems?: number;
  mcpServerUrl?: string;
  mcpServerToken?: string;
  proxy?: ApifyProxyConfiguration;
}

export type ApifyRedditDataType =
  | 'post'
  | 'comment'
  | 'community'
  | 'user_profile';

/**
 * One dataset item. Posts, comments, communities and user profiles share a
 * single flat shape — filter on `dataType` before reading type-specific
 * fields.
 */
export interface ApifyRedditItem {
  dataType?: ApifyRedditDataType | null;
  id?: string | null;
  parsedId?: string | null;
  url?: string | null;
  crawledAt?: string | null;
  searchTerm?: string | null;

  // Post fields
  title?: string | null;
  body?: string | null;
  bodyHtml?: string | null;
  authorName?: string | null;
  authorId?: string | null;
  parsedAuthorId?: string | null;
  communityName?: string | null;
  communityId?: string | null;
  parsedCommunityId?: string | null;
  parsedCommunityName?: string | null;
  upVotes?: number | null;
  commentsCount?: number | null;
  postUrl?: string | null;
  createdAt?: string | null;
  postType?: string | null;
  flair?: string | null;
  contentUrl?: string | null;
  images?: (string | null)[] | null;
  score?: number | null;
  upvoteRatio?: number | null;
  over18?: boolean | null;
  isSelf?: boolean | null;
  isVideo?: boolean | null;
  isGallery?: boolean | null;
  spoiler?: boolean | null;
  locked?: boolean | null;
  hidden?: boolean | null;
  archived?: boolean | null;
  pinned?: boolean | null;
  stickied?: boolean | null;
  edited?: boolean | null;
  editedAt?: string | null;
  distinguished?: string | null;
  scoreHidden?: boolean | null;
  isOriginalContent?: boolean | null;
  numCrossposts?: number | null;
  totalAwardsReceived?: number | null;
  gilded?: number | null;
  domain?: string | null;
  thumbnail?: string | null;
  urlOverriddenByDest?: string | null;
  subredditSubscribers?: number | null;
  authorFlairText?: string | null;
  authorPremium?: boolean | null;
  numDuplicates?: number | null;
  removedByCategory?: string | null;
  removedBy?: string | null;
  bannedBy?: string | null;
  removalReason?: string | null;
  modReasonTitle?: string | null;
  isRobotIndexable?: boolean | null;
  mediaType?: string | null;
  hasMedia?: boolean | null;
  galleryCount?: number | null;
  galleryImages?: (string | null)[] | null;
  mediaAssets?: Record<string, unknown>[] | null;
  videoUrl?: string | null;
  media?: Record<string, unknown> | null;
  secureMedia?: Record<string, unknown> | null;
  mediaMetadata?: Record<string, unknown> | null;
  galleryData?: Record<string, unknown> | null;
  ageHours?: number | null;
  scorePerHour?: number | null;
  commentsPerHour?: number | null;
  engagementTotal?: number | null;
  commentToScoreRatio?: number | null;
  isHighEngagement?: boolean | null;
  titleLength?: number | null;
  bodyLength?: number | null;
  wordCount?: number | null;
  outboundUrlHost?: string | null;

  // Comment fields
  commentUpVotes?: number | null;
  commentCreatedAt?: string | null;
  postId?: string | null;
  parsedPostId?: string | null;
  postTitle?: string | null;
  postUpVotes?: number | null;
  postCommentsCount?: number | null;
  postCreatedAt?: string | null;
  subredditName?: string | null;
  subredditId?: string | null;
  parsedSubredditId?: string | null;
  parentId?: string | null;
  parsedParentId?: string | null;
  parentKind?: 'post' | 'comment' | null;
  authorFullname?: string | null;
  depth?: number | null;
  controversiality?: number | null;
  isSubmitter?: boolean | null;
  collapsed?: boolean | null;
  collapsedReason?: string | null;

  // Community fields
  name?: string | null;
  description?: string | null;
  descriptionHtml?: string | null;
  publicDescription?: string | null;
  publicDescriptionHtml?: string | null;
  membersCount?: number | null;
  onlineUsersCount?: number | null;
  communityIcon?: string | null;
  bannerImage?: string | null;
  nsfw?: boolean | null;
  subredditType?: string | null;
  submissionType?: string | null;
  restrictPosting?: boolean | null;
  restrictCommenting?: boolean | null;
  advertiserCategory?: string | null;
  lang?: string | null;
  linkFlairEnabled?: boolean | null;
  wikiEnabled?: boolean | null;
  headerTitle?: string | null;
  submitText?: string | null;
  quarantine?: boolean | null;
  allowImages?: boolean | null;
  allowVideos?: boolean | null;
  allowVideogifs?: boolean | null;
  allowGalleries?: boolean | null;
  allowPolls?: boolean | null;
  spoilersEnabled?: boolean | null;
  originalContentTagEnabled?: boolean | null;
  suggestedCommentSort?: string | null;
  whitelistStatus?: string | null;
  rules?: Record<string, unknown>[] | null;

  // User profile fields
  username?: string | null;
  totalKarma?: number | null;
  linkKarma?: number | null;
  commentKarma?: number | null;
  awardeeKarma?: number | null;
  awarderKarma?: number | null;
  isGold?: boolean | null;
  isMod?: boolean | null;
  isEmployee?: boolean | null;
  hasVerifiedEmail?: boolean | null;
  verified?: boolean | null;
  iconImg?: string | null;
  snoovatarImg?: string | null;
  acceptFollowers?: boolean | null;
  bio?: string | null;
  followersCount?: number | null;
  bannerImg?: string | null;
  isNsfw?: boolean | null;
  previousNames?: (string | null)[] | null;
  profileTitle?: string | null;
  profileDescription?: string | null;
  profileVisibility?: string | null;
  hideFromRobots?: boolean | null;
  profileUrl?: string | null;

  // AI Analysis / Custom Labels add-ons (only populated when explicitly enabled)
  sentimentLabel?: string | null;
  sentimentScore?: number | null;
  intent?: string | null;
  emotion?: string | null;
  entities?: (string | null)[] | null;
  relevanceScore?: number | null;
  contentCategory?: string | null;
  customLabels?: Record<string, unknown> | null;
}

export type ApifyRunStatus =
  | 'READY'
  | 'RUNNING'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'TIMED-OUT'
  | 'ABORTED';

export interface ApifyRunInfo {
  id: string;
  actId: string;
  status: ApifyRunStatus;
  defaultDatasetId: string;
  startedAt: string;
  finishedAt?: string | null;
}
