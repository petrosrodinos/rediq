import type { FC } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfilePane } from "./components/profile-pane";
import { AccountPane } from "./components/account-pane";
import { UsagePane } from "./components/usage-pane";
import { SecurityPane } from "./components/security-pane";

const TABS = ["profile", "account", "usage", "security"] as const;
type SettingsTab = (typeof TABS)[number];

const isSettingsTab = (value: string | null): value is SettingsTab => !!value && (TABS as readonly string[]).includes(value);

const SettingsPage: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab: SettingsTab = isSettingsTab(searchParams.get("tab")) ? (searchParams.get("tab") as SettingsTab) : "profile";

  return (
    <div className="mx-auto max-w-[860px] space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your profile, plan, usage and security.</p>
      </div>

      <Tabs
        value={tab}
        onValueChange={(value) => {
          const next = new URLSearchParams(searchParams);
          next.set("tab", value);
          setSearchParams(next, { replace: true });
        }}
      >
        <TabsList className="w-full justify-start overflow-x-auto sm:w-auto">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfilePane />
        </TabsContent>
        <TabsContent value="account">
          <AccountPane />
        </TabsContent>
        <TabsContent value="usage">
          <UsagePane />
        </TabsContent>
        <TabsContent value="security">
          <SecurityPane />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
