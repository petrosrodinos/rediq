import { useEffect, useState, type FC } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSwitch } from "@/components/ui/theme-switch";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Routes } from "@/routes/routes";
import { environments } from "@/config/environments";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { label: "Process", href: "#process" },
  { label: "Features", href: "#features" },
  { label: "Principles", href: "#principles" },
];

export const Logomark: FC<{ className?: string }> = ({ className }) => (
  <div className={className ?? "flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-flame shadow-[0_2px_10px_-2px_rgba(255,69,0,0.5)]"}>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round">
      <path d="M4 18V7" />
      <path d="M10 18V4" />
      <path d="M16 18v-8" />
      <path d="M22 18v-3" />
    </svg>
  </div>
);

const NavLink: FC<{ href: string; children: string }> = ({ href, children }) => (
  <a href={href} className="group relative px-3 py-2 text-[13.5px] text-muted-foreground transition-colors hover:text-foreground">
    {children}
    <span className="absolute inset-x-3 -bottom-px h-px origin-left scale-x-0 bg-flame transition-transform duration-300 ease-out group-hover:scale-x-100" />
  </a>
);

export const LandingHeader: FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl transition-[box-shadow,border-color] duration-300",
        scrolled ? "border-border shadow-[0_8px_24px_-16px_rgba(0,0,0,0.4)]" : "border-transparent shadow-none",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to={Routes.home} className="flex items-center gap-2.5">
          <Logomark />
          <span className="font-display text-[15px] font-semibold tracking-tight">{environments.APP_NAME}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {SECTIONS.map((section) => (
            <NavLink key={section.href} href={section.href}>
              {section.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-1 md:flex">
          <ThemeSwitch />
          <Link to={Routes.auth.sign_in} className="px-3 py-2 text-[13.5px] font-medium text-muted-foreground transition-colors hover:text-foreground">
            Sign in
          </Link>
          <Button asChild size="sm" className="ml-1 shadow-[0_4px_18px_-6px_rgba(255,69,0,0.55)]">
            <Link to={Routes.auth.sign_up}>Start free</Link>
          </Button>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeSwitch />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2.5">
                  <Logomark />
                  {environments.APP_NAME}
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 px-4">
                {SECTIONS.map((section) => (
                  <a key={section.href} href={section.href} className="rounded-lg px-3 py-2.5 text-[14.5px] text-foreground transition-colors hover:bg-secondary">
                    {section.label}
                  </a>
                ))}
              </div>
              <div className="mt-4 flex flex-col gap-2 border-t border-border px-4 pt-4 pb-4">
                <Button asChild variant="outline">
                  <Link to={Routes.auth.sign_in}>Sign in</Link>
                </Button>
                <Button asChild>
                  <Link to={Routes.auth.sign_up}>Start free</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;
