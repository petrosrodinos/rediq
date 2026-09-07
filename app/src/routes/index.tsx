import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/routes/protected-route";
import SignIn from "@/pages/auth/pages/sign-in";
import SignUp from "@/pages/auth/pages/sign-up";
import AuthLayout from "@/pages/auth/layout";
import AdminLayout from "@/pages/admin/layout";
import AdminHealthPage from "@/pages/admin/pages/health";
import AdminUsersPage from "@/pages/admin/pages/users";
import AdminAlertsPage from "@/pages/admin/pages/alerts";
import ConsoleLayout from "@/pages/console/layout";
import DashboardPage from "@/pages/dashboard";
import NewAnalysisPage from "@/pages/new-analysis";
import AnalysisProgressPage from "@/pages/analysis-progress";
import ResearchListPage from "@/pages/research";
import ProjectDetailPage from "@/pages/research/pages/project";
import SourcesPage from "@/pages/research/pages/project/pages/sources";
import SavedInsightsPage from "@/pages/saved-insights";
import SearchPage from "@/pages/search";
import AssistantPage from "@/pages/assistant";
import SettingsPage from "@/pages/settings";
import AboutPage from "@/pages/about";
import { RoleTypes } from "@/features/user/interfaces/user.interface";
import { Routes as RoutePaths } from "@/routes/routes";

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/auth"
        element={
          <ProtectedRoute loggedIn={false}>
            <AuthLayout />
          </ProtectedRoute>
        }
      >
        <Route path="sign-up" element={<SignUp />} />
        <Route path="sign-in" element={<SignIn />} />
        <Route index element={<Navigate to="/auth/sign-in" replace />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute loggedIn={true} requiredRoles={[RoleTypes.ADMIN, RoleTypes.SUPER_ADMIN]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="health" element={<AdminHealthPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="alerts" element={<AdminAlertsPage />} />
        <Route index element={<Navigate to={RoutePaths.admin.health} replace />} />
      </Route>

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute loggedIn={true}>
            <ConsoleLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="new-analysis" element={<NewAnalysisPage />} />
        <Route path="analysis-jobs/:jobId" element={<AnalysisProgressPage />} />
        <Route path="research" element={<ResearchListPage />} />
        <Route path="research/:projectId" element={<ProjectDetailPage />} />
        <Route path="research/:projectId/sources" element={<SourcesPage />} />
        <Route path="saved" element={<SavedInsightsPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="assistant" element={<AssistantPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path={RoutePaths.about} element={<AboutPage />} />

      <Route path="/" element={<Navigate to="/auth/sign-in" replace />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
