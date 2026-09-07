export const Routes = {
    about: "/about",
    auth: {
        sign_in: "/auth/sign-in",
        sign_up: "/auth/sign-up",
    },
    admin: {
        health: "/admin/health",
        users: "/admin/users",
        alerts: "/admin/alerts",
    },
    dashboard: {
        root: "/dashboard",
        new_analysis: "/dashboard/new-analysis",
        analysis_job: (jobId: string) => `/dashboard/analysis-jobs/${jobId}`,
        research: "/dashboard/research",
        project: (projectId: string) => `/dashboard/research/${projectId}`,
        project_tab: (projectId: string, tab: string) => `/dashboard/research/${projectId}?tab=${tab}`,
        project_sources: (projectId: string) => `/dashboard/research/${projectId}/sources`,
        saved: "/dashboard/saved",
        search: "/dashboard/search",
        assistant: "/dashboard/assistant",
        settings: "/dashboard/settings",
        settings_tab: (tab: string) => `/dashboard/settings?tab=${tab}`,
    },
};
