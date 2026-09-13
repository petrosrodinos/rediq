import {
  IconAlertTriangle,
  IconHeartbeat,
  IconUser,
} from "@tabler/icons-react";
import {
  LayoutDashboard,
  Plus,
  AlignLeft,
  Bookmark,
  Search,
  MessageSquare,
  Settings,
} from "lucide-react";
import { type SidebarData } from "../types";
import { Routes } from "@/routes/routes";
import { RoleTypes } from "@/features/user/interfaces/user.interface";

export const sidebarData: SidebarData = {
  navGroups: [
    {
      title: "Console",
      items: [
        {
          title: "Dashboard",
          url: Routes.dashboard.root,
          icon: LayoutDashboard,
        },
        {
          title: "New analysis",
          url: Routes.dashboard.new_analysis,
          icon: Plus,
        },
        {
          title: "My research",
          url: Routes.dashboard.research,
          icon: AlignLeft,
        },
        {
          title: "Saved insights",
          url: Routes.dashboard.saved,
          icon: Bookmark,
        },
        {
          title: "Search",
          url: Routes.dashboard.search,
          icon: Search,
        },
        {
          title: "AI assistant",
          url: Routes.dashboard.assistant,
          icon: MessageSquare,
        },
      ],
    },
    {
      title: "Settings",
      items: [
        {
          title: "Settings",
          url: Routes.dashboard.settings,
          icon: Settings,
        },
      ],
    },
    {
      access: [RoleTypes.ADMIN],
      title: "Admin",
      items: [
        {
          title: "Health",
          url: Routes.admin.health,
          icon: IconHeartbeat,
        },
        {
          title: "Users",
          url: Routes.admin.users,
          icon: IconUser,
        },
        {
          title: "Alerts",
          url: Routes.admin.alerts,
          icon: IconAlertTriangle,
        },
      ],
    },
  ],
};
