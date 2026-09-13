import type { FC } from "react";
import { Link } from "react-router-dom";
import { Routes } from "@/routes/routes";
import { environments } from "@/config/environments";
import { Logomark } from "./landing-header";

export const LandingFooter: FC = () => {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-[13px] text-muted-foreground sm:flex-row">
        <span className="flex items-center gap-2">
          <Logomark className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] bg-flame" />
          {environments.APP_NAME} © {new Date().getFullYear()}
        </span>
        <div className="flex items-center gap-6">
          <Link to={Routes.about} className="hover:text-foreground">
            About
          </Link>
          <Link to={Routes.auth.sign_in} className="hover:text-foreground">
            Sign in
          </Link>
          <Link to={Routes.auth.sign_up} className="hover:text-foreground">
            Sign up
          </Link>
        </div>
      </div>
    </footer>
  );
};
