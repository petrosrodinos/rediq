import { Routes } from "@/routes/routes";

export interface PageMeta {
  path: string;
  title: string;
  crumb: string;
}

export const pageMeta: PageMeta[] = [
  { path: Routes.dashboard.root, title: "Dashboard", crumb: "Workspace overview" },
  { path: Routes.dashboard.new_analysis, title: "New analysis", crumb: "Point Threadline at a source" },
  { path: "/dashboard/analysis-jobs/:jobId", title: "Analysis progress", crumb: "Running collection and analysis" },
  { path: Routes.dashboard.research, title: "My research", crumb: "All projects" },
  { path: "/dashboard/research/:projectId/sources", title: "Sources", crumb: "Project sources" },
  { path: "/dashboard/research/:projectId", title: "Research project", crumb: "Project overview" },
  { path: Routes.dashboard.saved, title: "Saved insights", crumb: "Insights you've kept" },
  { path: Routes.dashboard.search, title: "Search", crumb: "Search all evidence" },
  { path: Routes.dashboard.assistant, title: "AI assistant", crumb: "Ask about your evidence" },
  { path: Routes.dashboard.settings, title: "Settings", crumb: "Account and workspace settings" },
  { path: Routes.admin.health, title: "Health", crumb: "System status" },
  { path: Routes.admin.users, title: "Users", crumb: "Manage users" },
  { path: Routes.admin.alerts, title: "Alerts", crumb: "System alerts" },
];
