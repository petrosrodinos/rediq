import { Folder, MessageSquareText } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { NavGroup } from "@/components/layout/nav-group";
import { NavUser } from "@/components/layout/nav-user";
import { TeamSwitcher } from "@/components/layout/team-switcher";
import { sidebarData } from "./data/sidebar-data";
import type { NavGroup as NavGroupType } from "./types";
import { RoleTypes, type RoleType } from "@/features/user/interfaces/user.interface";
import { useAuthStore } from "@/stores/auth";
import { useActiveProjectStore } from "@/stores/active-project";
import { Routes } from "@/routes/routes";
import { useGetResearchProjects } from "@/features/research-projects/hooks/use-research-projects";
import { useGetSavedInsights } from "@/features/saved-insights/hooks/use-saved-insights";

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
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        {visibleGroups.map((group) => (
          <NavGroup key={group.title} {...group} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
