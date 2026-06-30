import { Link, useRouterState } from "@tanstack/react-router";
import { Heart, LogIn, PawPrint, Plus, Search, TriangleAlert } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { ComponentType, ReactNode } from "react";
import { AppLogo } from "@/components/app-logo";
import { Button } from "@/components/ui/button";
import { clearOrgSession, getStoredOrgId } from "@/lib/auth";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: ReactNode;
}

type HeaderRoute = "/" | "/pets/mine" | "/login";
type HeaderCtaRoute = "/pets/new" | "/register";

interface HeaderNavLinkProps {
  active: boolean;
  activeClassName?: string;
  className?: string;
  icon: ComponentType<{ className?: string }>;
  inactiveClassName?: string;
  label: string;
  search?: Record<string, never>;
  to: HeaderRoute;
}

interface HeaderCtaLinkProps {
  active: boolean;
  activeBackgroundClassName: string;
  activeTextClassName: string;
  className?: string;
  icon: ComponentType<{ className?: string }>;
  inactiveClassName: string;
  label: string;
  to: HeaderCtaRoute;
}

export function AppShell({ children }: AppShellProps) {
  const orgId = getStoredOrgId();
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const activeSection = getActiveHeaderSection(pathname);

  function handleLogout() {
    clearOrgSession();
    window.location.assign("/");
  }

  return (
    <div className="min-h-svh bg-[#fff7ed] text-[#0d3b66]">
      <header className="border-[#0d3b66]/10 border-b bg-white/90">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <AppLogo />
          </Link>

          {/* 404 showcase */}
          <Link
            to="/dummy-404-example"
            className="group relative inline-flex items-center justify-center rounded-full border border-[#0d3b66]/20 border-dashed px-3 py-1.5 font-bold text-[#0d3b66]/25 text-sm transition hover:justify-start hover:border-[#f15156]/40 hover:text-[#f15156]"
          >
            <TriangleAlert className="size-4 shrink-0" />
            <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 ease-out group-hover:ml-2 group-hover:max-w-96 group-hover:opacity-100">
              Veja nossa página de erro 404
            </span>
          </Link>

          <nav className="flex items-center gap-2">
            <HeaderNavLink
              to="/"
              search={{}}
              active={activeSection === "search"}
              className="hidden sm:inline-flex"
              icon={Search}
              label="Buscar pets"
            />

            {orgId ? (
              <>
                <HeaderNavLink
                  to="/pets/mine"
                  active={activeSection === "mine"}
                  activeClassName="bg-[#f15156]"
                  icon={Heart}
                  inactiveClassName="text-[#0d3b66]/60 hover:text-[#f15156]"
                  label="Meus pets"
                />
                <HeaderCtaLink
                  to="/pets/new"
                  active={activeSection === "new"}
                  activeBackgroundClassName="bg-[#f4d35e]"
                  activeTextClassName="text-[#0d3b66]"
                  icon={Plus}
                  inactiveClassName="text-[#0d3b66]/60 hover:text-[#f4d35e]"
                  label="Novo pet"
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="h-10 rounded-full bg-transparent px-4 font-extrabold text-[#0d3b66]/60 text-sm hover:bg-transparent hover:text-[#f15156]"
                  onClick={handleLogout}
                >
                  Sair
                </Button>
              </>
            ) : (
              <>
                <HeaderNavLink
                  to="/login"
                  active={activeSection === "login"}
                  icon={LogIn}
                  label="Entrar"
                />
                <HeaderCtaLink
                  to="/register"
                  active={activeSection === "register"}
                  activeBackgroundClassName="bg-[#0d3b66]"
                  activeTextClassName="text-white"
                  className="hidden sm:inline-flex"
                  icon={PawPrint}
                  inactiveClassName="text-[#0d3b66]/60 hover:text-[#0d3b66]"
                  label="Cadastrar ONG"
                />
              </>
            )}
          </nav>
        </div>
      </header>

      {children}
    </div>
  );
}

function HeaderNavLink({
  active,
  activeClassName = "bg-[#0d3b66]",
  className,
  icon: Icon,
  inactiveClassName = "text-[#0d3b66]/60 hover:text-[#0d3b66]",
  label,
  search,
  to,
}: HeaderNavLinkProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Link
      to={to}
      search={search}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative inline-flex h-10 items-center justify-center gap-2 overflow-hidden rounded-full px-4 font-extrabold text-sm transition",
        active ? "text-white" : inactiveClassName,
        className,
      )}
    >
      {active ? (
        <motion.span
          layoutId="header-active-tab"
          initial={false}
          className={cn("absolute inset-0 rounded-full", activeClassName)}
          transition={
            shouldReduceMotion ? { duration: 0 } : { type: "spring", bounce: 0.18, duration: 0.42 }
          }
        />
      ) : null}
      <Icon className="relative z-10 size-4" />
      <span className="relative z-10">{label}</span>
    </Link>
  );
}

function HeaderCtaLink({
  active,
  activeBackgroundClassName,
  activeTextClassName,
  className,
  icon: Icon,
  inactiveClassName,
  label,
  to,
}: HeaderCtaLinkProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Link
      to={to}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative inline-flex h-10 items-center justify-center gap-2 overflow-hidden rounded-full px-4 font-extrabold text-sm transition",
        active ? cn("shadow-sm", activeTextClassName) : inactiveClassName,
        className,
      )}
    >
      {active ? (
        <motion.span
          layoutId="header-active-tab"
          initial={false}
          className={cn("absolute inset-0 rounded-full", activeBackgroundClassName)}
          transition={
            shouldReduceMotion ? { duration: 0 } : { type: "spring", bounce: 0.18, duration: 0.42 }
          }
        />
      ) : null}
      <motion.span
        animate={
          shouldReduceMotion
            ? undefined
            : {
                scale: [1, 1.03, 1],
                y: [0, -3, 0],
              }
        }
        transition={{
          duration: 0.45,
          ease: "easeOut",
          repeat: Infinity,
          repeatDelay: 5,
        }}
        className="relative z-10 inline-flex items-center justify-center gap-2"
      >
        <Icon className="size-4" />
        {label}
      </motion.span>
    </Link>
  );
}

function getActiveHeaderSection(pathname: string) {
  if (pathname === "/login") {
    return "login";
  }

  if (pathname === "/register") {
    return "register";
  }

  if (pathname === "/pets/new") {
    return "new";
  }

  if (pathname === "/pets/mine" || pathname.endsWith("/edit")) {
    return "mine";
  }

  return "search";
}
