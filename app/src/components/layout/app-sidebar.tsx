import { Folder, MessageSquareText } from "lucide-react";
import { Link } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { NavGroup } from "@/components/layout/nav-group";
import { NavUser } from "@/components/layout/nav-user";
import { sidebarData } from "./data/sidebar-data";
import type { NavGroup as NavGroupType } from "./types";
import { RoleTypes, type RoleType } from "@/features/user/interfaces/user.interface";
import { useAuthStore } from "@/stores/auth";
import { useActiveProjectStore } from "@/stores/active-project";
import { Routes } from "@/routes/routes";
import { useGetResearchProjects } from "@/features/research-projects/hooks/use-research-projects";
import { useGetSavedInsights } from "@/features/saved-insights/hooks/use-saved-insights";
import { environments } from "@/config/environments";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { role } = useAuthStore();
  const { activeProjectId, activeProjectName } = useActiveProjectStore();

  const projects = useGetResearchProjects({ limit: 1 });
  const savedInsights = useGetSavedInsights({ limit: 1 });

  const navGroups: NavGroupType[] = sidebarData.navGroups.map((group) => {
    if (group.title !== "Console") return group;

    return {
      ...group,
      items: group.items.map((item) => {
        if (item.title === "My research") {
          return { ...item, badge: projects.data?.pagination.total ? String(projects.data.pagination.total) : undefined };
        }
        if (item.title === "Saved insights") {
          return { ...item, badge: savedInsights.data?.pagination.total ? String(savedInsights.data.pagination.total) : undefined };
        }
        return item;
      }),
    };
  });

  if (activeProjectId) {
    navGroups.splice(1, 0, {
      title: "Active project",
      items: [
        {
          title: activeProjectName ?? "Project",
          url: Routes.dashboard.project(activeProjectId),
          icon: Folder,
        },
        {
          title: "Sources",
          url: Routes.dashboard.project_sources(activeProjectId),
          icon: MessageSquareText,
        },
      ],
    });
  }

  const visibleGroups = navGroups.filter((group) => {
    if (!group.access) return true;
    if (!role) return false;
    return group.access.includes(role as RoleType) || role === RoleTypes.SUPER_ADMIN;
  });

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Link to={Routes.home} className="flex items-center gap-2.5 px-4 pb-1 pt-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-flame shadow-[0_2px_10px_-2px_rgba(255,69,0,0.65)]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round">
              <path d="M4 18V7" />
              <path d="M10 18V4" />
              <path d="M16 18v-8" />
              <path d="M22 18v-3" />
            </svg>
          </div>
          <div className="min-w-0 leading-tight">
            <div className="truncate font-display text-[15px] font-semibold tracking-tight text-white">{environments.APP_NAME}</div>
            <div className="truncate text-[11px] text-white/40">Reddit research</div>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {visibleGroups.map((group) => (
          <NavGroup key={group.title} {...group} />
        ))}
      </SidebarContent>
      <SidebarFooter className="px-4 pb-4 pt-2">
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
