import { useState, type FC } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ConfirmationDialog from "@/components/ui/confirmation-dialog";
import { toast } from "@/hooks/use-toast";

const SUPPORT_EMAIL = "support@threadline.app";

export const AccountPane: FC = () => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Current plan</CardTitle>
          <CardDescription>There's no self-serve billing yet — every account is on the same plan today.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Badge>Researcher plan</Badge>
            <span className="text-sm text-muted-foreground">No billing configured</span>
          </div>
          <Button
            variant="secondary"
            onClick={() =>
              toast({
                title: "Plan management isn't available yet",
                description: "There's no billing system wired up — reach out if you'd like something different.",
                duration: 3000,
              })
            }
          >
            Change plan
          </Button>
        </CardContent>
      </Card>

      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-base text-destructive">Danger zone</CardTitle>
          <CardDescription>Permanently remove your account and everything in it.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={() => setIsDeleteOpen(true)}>
            Delete account
          </Button>
        </CardContent>
      </Card>

      <ConfirmationDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => {
          window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Delete my Threadline account")}`;
          setIsDeleteOpen(false);
        }}
        title="Delete your account?"
        description={`Self-serve deletion isn't available yet. Confirming will open an email to ${SUPPORT_EMAIL} so we can delete your account and data for you.`}
        confirmText="Email support"
        variant="destructive"
      />
    </div>
  );
};
