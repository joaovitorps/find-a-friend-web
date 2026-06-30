import { useNavigate } from "@tanstack/react-router";
import { Home, MapPin, Search } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PawIcon } from "@/components/paw-icon";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <AppShell>
      <main className="mx-auto flex min-h-[calc(100svh-5rem)] w-full max-w-6xl items-center px-5 py-10 sm:px-8 lg:py-16">
        <section className="grid w-full gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-center">
          <div>
            <div className="flex items-center gap-3 font-black text-[#f15156] text-sm uppercase tracking-wide">
              <PawIcon className="size-7" />
              Rota farejada sem sucesso
            </div>

            <h1 className="mt-5 max-w-3xl font-black text-6xl text-[#0d3b66] leading-[0.9] sm:text-7xl lg:text-8xl">
              404
            </h1>
            <p className="mt-4 max-w-2xl font-black text-3xl text-[#0d3b66] leading-tight sm:text-4xl">
              Esse caminho saiu para passear.
            </p>
            <p className="mt-5 max-w-2xl font-semibold text-[#0d3b66]/65 text-base leading-7">
              A página que você tentou abrir não existe ou mudou de lugar. Volte para a busca e
              encontre um amigo de verdade por perto.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                className="h-12 rounded-full bg-[#f15156] px-6 font-black text-sm text-white hover:bg-[#f15156]/90"
                onClick={() => navigate({ to: "/", search: {} })}
              >
                <Search className="size-4" />
                Buscar pets
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="h-12 rounded-full px-6 font-black text-[#0d3b66] text-sm hover:bg-[#0d3b66]/5"
                onClick={() => navigate({ to: "/", search: {} })}
              >
                <Home className="size-4" />
                Voltar ao início
              </Button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-sm">
            <div className="absolute -top-10 -right-10 size-32 rounded-full bg-[#f4d35e]/45" />
            <div className="absolute -bottom-12 -left-10 size-36 rounded-full bg-[#f15156]/15" />
            <div className="relative">
              <div className="flex aspect-square items-center justify-center rounded-xl bg-[#fff7ed] text-[#f15156]">
                <PawIcon className="w-2/3 max-w-48" />
              </div>
              <div className="mt-5 grid gap-3">
                <div className="flex items-center gap-3 rounded-xl bg-[#0d3b66]/5 p-4">
                  <MapPin className="size-5 text-[#f15156]" />
                  <div>
                    <p className="font-black text-[#0d3b66] text-sm">Última pista</p>
                    <p className="mt-1 font-semibold text-[#0d3b66]/60 text-xs leading-5">
                      Nenhum pet conhecido mora neste endereço.
                    </p>
                  </div>
                </div>
                <div className="rounded-xl bg-[#0d3b66] p-4 text-white">
                  <p className="font-black text-sm">Boa notícia</p>
                  <p className="mt-1 font-semibold text-white/75 text-xs leading-5">
                    A busca principal ainda sabe onde procurar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
