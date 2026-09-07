import type { FC } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetMe } from "@/features/user/hooks/use-user";
import { useForgotPassword } from "@/features/auth/hooks/use-auth";

export const SecurityPane: FC = () => {
  const me = useGetMe();
  const forgotPassword = useForgotPassword();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Password</CardTitle>
        <CardDescription>
          There's no in-session password change yet — we'll email you a reset link instead, the same flow as "forgot
          password".
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          loading={forgotPassword.isPending}
          disabled={!me.data?.email}
          onClick={() => {
            if (!me.data?.email) return;
            forgotPassword.mutate({ email: me.data.email });
          }}
        >
          Send reset link to {me.data?.email ?? "your email"}
        </Button>
      </CardContent>
    </Card>
  );
};
