import {
  IconAlertTriangle,
  IconHeartbeat,
  IconUser,
} from "@tabler/icons-react";
import {
  Command,
  LayoutDashboard,
  Sparkles,
  FolderSearch,
  Bookmark,
  Search,
  MessageCircleQuestion,
  Settings,
} from "lucide-react";
import { type SidebarData } from "../types";
import { Routes } from "@/routes/routes";
import { RoleTypes } from "@/features/user/interfaces/user.interface";
import { environments } from "@/config/environments";

export const sidebarData: SidebarData = {
  teams: [
    {
      name: environments.APP_NAME,
      logo: Command,
      plan: "Reddit research",
    },
  ],
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
          icon: Sparkles,
        },
        {
          title: "My research",
          url: Routes.dashboard.research,
          icon: FolderSearch,
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
          icon: MessageCircleQuestion,
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
