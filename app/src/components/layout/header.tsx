import { Plus, Search } from "lucide-react";
import { matchPath, useLocation, useNavigate } from "react-router-dom";
import { useSidebar } from "@/components/ui/sidebar";
import { Routes } from "@/routes/routes";
import { pageMeta } from "@/components/layout/data/page-meta";

function usePageMeta() {
  const { pathname } = useLocation();
  return pageMeta.find((entry) => matchPath({ path: entry.path, end: true }, pathname));
}

export function Header() {
  const navigate = useNavigate();
  const meta = usePageMeta();
  const { toggleSidebar } = useSidebar();

  return (
    <header className="sticky top-0 z-20 border-b border-border/80 bg-background/80 backdrop-blur-xl">
      <div className="flex h-[60px] items-center gap-3 px-4 sm:px-7">
        <button
          onClick={toggleSidebar}
          aria-label="Open navigation"
          className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-border bg-card text-foreground shadow-sm lg:hidden"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>

        <div className="min-w-0">
          <h1 className="truncate text-[15px] font-semibold tracking-tight">{meta?.title ?? "Threadline"}</h1>
          {meta?.crumb && <p className="truncate text-[11px] text-muted-foreground">{meta.crumb}</p>}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => navigate(Routes.dashboard.search)}
            className="hidden h-9 w-64 items-center gap-2 rounded-[10px] border border-border bg-card pl-3 pr-2 text-left text-muted-foreground shadow-sm transition-colors hover:border-foreground/20 md:flex"
          >
            <Search className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
            <span className="text-[13px]">Search all evidence</span>
            <kbd className="ml-auto rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">/</kbd>
          </button>

          <button
            onClick={() => navigate(Routes.dashboard.new_analysis)}
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-[10px] bg-gradient-to-b from-[#FF5A1F] to-[#FF4500] px-3.5 py-2 text-[13px] font-medium text-white shadow-[0_1px_2px_rgba(217,58,0,0.32),inset_0_1px_0_rgba(255,255,255,0.22)] transition-shadow hover:shadow-[0_3px_10px_-2px_rgba(217,58,0,0.42),inset_0_1px_0_rgba(255,255,255,0.2)] active:translate-y-px"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2.2} />
            New analysis
          </button>
        </div>
      </div>
    </header>
  );
}

Header.displayName = "Header";
