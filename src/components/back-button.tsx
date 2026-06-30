import { ArrowLeft } from "lucide-react";
import type { MouseEvent } from "react";

export function BackButton({ fallback = "/" }: { fallback?: string }) {
  function handleBack(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    window.location.assign(fallback);
  }

  return (
    <a
      href={fallback}
      className="inline-flex w-fit items-center gap-2 font-black text-[#0d3b66] text-sm hover:underline"
      onClick={handleBack}
    >
      <ArrowLeft className="size-4" />
      Voltar
    </a>
  );
}
