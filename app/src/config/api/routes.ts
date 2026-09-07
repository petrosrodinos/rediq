export const ApiRoutes = {
    health: {
        prefix: "/health",
    },
    auth: {
        email: {
            login: "/auth/email/login",
            register: "/auth/email/register",
            refresh_token: "/auth/email/refresh-token",
            admin_login_to_account: (account_uuid: string) => `/auth/email/${account_uuid}/admin-login`,
            forgot_password: "/auth/forgot-password",
            reset_password: "/auth/reset-password",
            verify_email: "/auth/verify-email",
            resend_verification_email: "/auth/resend-verification-email",
            waitlist: "/auth/email/waitlist",
        },
    },
    users: {
        prefix: "/users",
        me: "/users/me",
    },
    google_maps: {
        timezone: "/google-maps/timezone",
    },
    research_projects: {
        prefix: "/research-projects",
        by_id: (id: string) => `/research-projects/${id}`,
    },
    analysis_configurations: {
        by_research_project: (research_project_id: string) => `/research-projects/${research_project_id}/analysis-configurations`,
        by_id: (id: string) => `/analysis-configurations/${id}`,
    },
    analysis_jobs: {
        by_research_project: (research_project_id: string) => `/research-projects/${research_project_id}/analysis-jobs`,
        by_id: (id: string) => `/analysis-jobs/${id}`,
        cancel: (id: string) => `/analysis-jobs/${id}/cancel`,
        batch_submissions: (id: string) => `/analysis-jobs/${id}/batch-submissions`,
    },
    conversations: {
        by_research_project: (research_project_id: string) => `/research-projects/${research_project_id}/conversations`,
        by_id: (id: string) => `/conversations/${id}`,
        messages: (id: string) => `/conversations/${id}/messages`,
    },
    topics: {
        by_research_project: (research_project_id: string) => `/research-projects/${research_project_id}/topics`,
        by_id: (id: string) => `/topics/${id}`,
    },
    posts: {
        by_research_project: (research_project_id: string) => `/research-projects/${research_project_id}/posts`,
        by_id: (id: string) => `/posts/${id}`,
    },
    comments: {
        by_post: (post_id: string) => `/posts/${post_id}/comments`,
        by_id: (id: string) => `/comments/${id}`,
    },
    knowledge_insights: {
        by_research_project: (research_project_id: string) => `/research-projects/${research_project_id}/knowledge-insights`,
        by_id: (id: string) => `/knowledge-insights/${id}`,
    },
    knowledge_chunks: {
        by_research_project: (research_project_id: string) => `/research-projects/${research_project_id}/knowledge-chunks`,
    },
    export: {
        by_research_project: (research_project_id: string) => `/research-projects/${research_project_id}/export`,
    },
    search: {
        by_research_project: (research_project_id: string) => `/research-projects/${research_project_id}/search`,
    },
    documents: {
        prefix: "/documents",
        by_id: (id: string) => `/documents/${id}`,
    },
    saved_insights: {
        prefix: "/saved-insights",
        by_id: (id: string) => `/saved-insights/${id}`,
    },
}