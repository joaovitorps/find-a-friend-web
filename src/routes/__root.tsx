import { createRootRouteWithContext, HeadContent, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { NotFoundPage } from "@/components/not-found-page";
import { Toaster } from "@/components/ui/sonner";

import "../index.css";

export interface RouterAppContext {}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
  notFoundComponent: NotFoundPage,
  head: () => ({
    meta: [
      {
        title: "find-a-friend-web",
      },
      {
        name: "description",
        content: "find-a-friend-web is a web application",
      },
    ],
    links: [
      {
        rel: "icon",
        href: "/favicon.ico",
      },
    ],
  }),
});

function RootComponent() {
  return (
    <>
      <HeadContent />
      <div className="bg-white font-sans text-[#0d3b66]">
        <Outlet />
      </div>
      <Toaster richColors />
      <TanStackRouterDevtools position="bottom-left" />
    </>
  );
}
