import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Search } from "lucide-react";

import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/pets/")({
  component: PetsIndexPage,
});

function PetsIndexPage() {
  return (
    <AppShell>
      <main className="mx-auto flex min-h-[calc(100svh-5rem)] w-full max-w-3xl flex-col items-center justify-center px-5 py-12 text-center">
        <Search className="size-12 text-[#f15156]" />
        <h1 className="mt-5 font-black text-4xl text-[#0d3b66] leading-none">
          Busque pets pela página inicial
        </h1>
        <p className="mt-4 font-semibold text-[#0d3b66]/65 text-sm leading-6">
          A listagem usa filtros por cidade, idade, porte, energia e independência.
        </p>
        <Link
          to="/"
          search={{}}
          className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#0d3b66] px-5 font-black text-sm text-white transition hover:bg-[#0d3b66]/90"
        >
          <ArrowLeft className="size-4" />
          Ir para busca
        </Link>
      </main>
    </AppShell>
  );
}
