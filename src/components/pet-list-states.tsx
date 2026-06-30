import { MapPin, RotateCcw, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function InitialPetsState() {
  return (
    <div className="rounded-xl border border-[#0d3b66]/20 border-dashed bg-white/65 px-6 py-16 text-center">
      <MapPin className="mx-auto size-10 text-[#f15156]" />
      <h2 className="mt-4 font-black text-2xl text-[#0d3b66]">Escolha uma cidade para começar</h2>
      <p className="mx-auto mt-2 max-w-md font-semibold text-[#0d3b66]/60 text-sm leading-6">
        A busca precisa de uma cidade para encontrar pets próximos de você.
      </p>
    </div>
  );
}

export function EmptyPetsState() {
  return (
    <div className="rounded-xl border border-[#0d3b66]/20 border-dashed bg-white/65 px-6 py-16 text-center">
      <SearchX className="mx-auto size-10 text-[#f15156]" />
      <h2 className="mt-4 font-black text-2xl text-[#0d3b66]">Nenhum pet encontrado</h2>
      <p className="mx-auto mt-2 max-w-md font-semibold text-[#0d3b66]/60 text-sm leading-6">
        Tente ajustar a cidade ou remover alguns filtros.
      </p>
    </div>
  );
}

export function PetsErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="rounded-xl border border-[#f15156]/20 bg-white px-6 py-12 text-center">
      <h2 className="font-black text-2xl text-[#0d3b66]">Não foi possível buscar os pets</h2>
      <p className="mx-auto mt-2 max-w-md font-semibold text-[#0d3b66]/60 text-sm leading-6">
        {message}
      </p>
      <Button
        type="button"
        className="mt-6 h-11 rounded-full bg-[#0d3b66] px-5 font-black text-sm text-white hover:bg-[#0d3b66]/90"
        onClick={onRetry}
      >
        <RotateCcw className="size-4" />
        Tentar novamente
      </Button>
    </div>
  );
}

export function PetsLoadingGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-xl border border-[#0d3b66]/10 bg-white p-5"
        >
          <Skeleton className="-mx-5 -mt-5 aspect-[4/3] rounded-none bg-[#0d3b66]/10" />
          <Skeleton className="mt-5 h-7 w-2/3 rounded-xl bg-[#0d3b66]/10" />
          <Skeleton className="mt-3 h-4 w-full rounded-xl bg-[#0d3b66]/10" />
          <Skeleton className="mt-2 h-4 w-5/6 rounded-xl bg-[#0d3b66]/10" />
          <div className="mt-5 grid grid-cols-2 gap-2">
            <Skeleton className="h-14 rounded-xl bg-[#0d3b66]/10" />
            <Skeleton className="h-14 rounded-xl bg-[#0d3b66]/10" />
            <Skeleton className="h-14 rounded-xl bg-[#0d3b66]/10" />
            <Skeleton className="h-14 rounded-xl bg-[#0d3b66]/10" />
          </div>
        </div>
      ))}
    </div>
  );
}
