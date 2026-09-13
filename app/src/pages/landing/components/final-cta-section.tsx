import type { FC } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Routes } from "@/routes/routes";
import { environments } from "@/config/environments";

export const FinalCtaSection: FC = () => {
  return (
    <section className="border-t border-border bg-night text-white">
      <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:py-24">
        <h2 className="font-display mx-auto max-w-[18ch] text-[30px] font-semibold tracking-tight sm:text-[36px]">Start your first analysis in {environments.APP_NAME}.</h2>
        <p className="mx-auto mt-3 max-w-[46ch] text-[15px] text-white/55">Paste a thread and get a cited report back — public threads only.</p>
        <div className="mt-8 flex justify-center">
          <Button asChild size="lg">
            <Link to={Routes.auth.sign_up}>
              Start free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
