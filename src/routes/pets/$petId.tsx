import { createFileRoute } from "@tanstack/react-router";
import {
  Bolt,
  ChevronLeft,
  ChevronRight,
  HeartHandshake,
  Home,
  Maximize2,
  ShieldCheck,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { BackButton } from "@/components/back-button";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getPetDetails, type Pet, type PetOrganization, petLabels } from "@/lib/pets";

export const Route = createFileRoute("/pets/$petId")({
  component: PetDetailsPage,
});

function PetDetailsPage() {
  const { petId } = Route.useParams();
  const [pet, setPet] = useState<Pet | null>(null);
  const [org, setOrg] = useState<PetOrganization | null>(null);
  const [pictureIndex, setPictureIndex] = useState(0);
  const [pictureDirection, setPictureDirection] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadPet() {
      setLoading(true);
      setError("");

      try {
        const response = await getPetDetails(petId);

        if (!active) return;

        if (!response.ok) {
          setError(response.error ?? "Pet não encontrado.");
          setPet(null);
          setOrg(null);
          return;
        }

        setPet(response.data.pet);
        setOrg(response.data.org);
        setPictureIndex(0);
      } catch {
        if (active) {
          setError("Não foi possível conectar ao servidor.");
          setPet(null);
          setOrg(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadPet();

    return () => {
      active = false;
    };
  }, [petId]);

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:py-12">
        <BackButton />

        {loading ? <PetDetailsSkeleton /> : null}

        {!loading && error ? (
          <div className="mt-8 rounded-[8px] border border-[#f15156]/20 bg-white px-6 py-12 text-center">
            <h1 className="font-black text-3xl text-[#0d3b66]">Não encontramos esse pet</h1>
            <p className="mx-auto mt-3 max-w-md font-semibold text-[#0d3b66]/65 text-sm leading-6">
              {error}
            </p>
          </div>
        ) : null}

        {!loading && pet ? (
          <section className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="overflow-hidden rounded-[8px] bg-white shadow-sm">
              <PetPictureCarousel
                pet={pet}
                pictureIndex={pictureIndex}
                pictureDirection={pictureDirection}
                onPrevious={() => {
                  setPictureDirection(-1);
                  setPictureIndex((current) =>
                    getWrappedPictureIndex(current - 1, pet.pictures.length),
                  );
                }}
                onNext={() => {
                  setPictureDirection(1);
                  setPictureIndex((current) =>
                    getWrappedPictureIndex(current + 1, pet.pictures.length),
                  );
                }}
              />
              <div className="p-6 sm:p-8">
                <span className="rounded-full bg-[#f4d35e]/35 px-3 py-1 font-black text-[#0d3b66] text-xs uppercase">
                  {petLabels.status[pet.status]}
                </span>
                <h1 className="mt-4 font-black text-5xl text-[#0d3b66] leading-none">{pet.name}</h1>
                <p className="mt-5 font-semibold text-[#0d3b66]/70 text-base leading-8">
                  {pet.about ?? "Esta organização ainda não adicionou uma descrição."}
                </p>
              </div>
            </div>

            <aside className="flex flex-col gap-4">
              <div className="rounded-[8px] bg-[#0d3b66] p-6 text-white">
                <HeartHandshake className="size-8 text-[#f4d35e]" />
                <h2 className="mt-4 font-black text-2xl">Requisitos de adoção</h2>
                {pet.adoptionRequirements.length > 0 ? (
                  <ul className="mt-4 space-y-3 font-bold text-sm text-white/85 leading-6">
                    {pet.adoptionRequirements.map((requirement) => (
                      <li key={requirement}>• {requirement}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 font-bold text-sm text-white/75 leading-6">
                    Sem requisitos cadastrados.
                  </p>
                )}
              </div>

              <div className="grid gap-3 rounded-[8px] bg-white p-5 shadow-sm">
                <DetailMetric
                  icon={<Maximize2 className="size-5" />}
                  label="Porte"
                  value={petLabels.size[pet.size]}
                />
                <DetailMetric
                  icon={<Bolt className="size-5" />}
                  label="Energia"
                  value={petLabels.level[pet.energyLevel]}
                />
                <DetailMetric
                  icon={<ShieldCheck className="size-5" />}
                  label="Independência"
                  value={petLabels.level[pet.independencyLevel]}
                />
                <DetailMetric
                  icon={<Home className="size-5" />}
                  label="Ambiente"
                  value={petLabels.environment[pet.environment]}
                />
              </div>

              <AdoptionButton pet={pet} org={org} />
            </aside>
          </section>
        ) : null}
      </main>
    </AppShell>
  );
}

function PetPictureCarousel({
  pet,
  pictureDirection,
  pictureIndex,
  onPrevious,
  onNext,
}: {
  pet: Pet;
  pictureDirection: number;
  pictureIndex: number;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  const currentPicture = pet.pictures[pictureIndex];
  const hasMultiplePictures = pet.pictures.length > 1;
  const dragThreshold = 40;

  if (!currentPicture) {
    return (
      <div className="flex aspect-[16/10] items-center justify-center bg-[#f15156]/10 text-[#f15156]">
        <Home className="size-16" />
      </div>
    );
  }

  return (
    <div className="group relative aspect-[16/10] overflow-hidden">
      <AnimatePresence custom={pictureDirection} initial={false}>
        <motion.img
          key={`${pictureIndex}-${currentPicture}`}
          src={currentPicture}
          alt={`Foto ${pictureIndex + 1} de ${pet.name}`}
          custom={pictureDirection}
          initial={
            shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: pictureDirection > 0 ? 72 : -72 }
          }
          animate={{ opacity: 1, x: 0 }}
          exit={
            shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: pictureDirection > 0 ? -72 : 72 }
          }
          transition={{ duration: 0.28, ease: "easeOut" }}
          drag={hasMultiplePictures ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          onDragEnd={(_, info) => {
            if (info.offset.x <= -dragThreshold) {
              onNext();
              return;
            }

            if (info.offset.x >= dragThreshold) {
              onPrevious();
            }
          }}
          className={`absolute inset-0 size-full object-cover ${
            hasMultiplePictures ? "cursor-grab active:cursor-grabbing" : ""
          }`}
        />
      </AnimatePresence>

      {hasMultiplePictures ? (
        <>
          <CarouselButton label="Foto anterior" className="left-4" onClick={onPrevious}>
            <ChevronLeft className="size-5" />
          </CarouselButton>
          <CarouselButton label="Próxima foto" className="right-4" onClick={onNext}>
            <ChevronRight className="size-5" />
          </CarouselButton>
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-[#0d3b66]/75 px-3 py-1 font-black text-white text-xs">
            {pictureIndex + 1}/{pet.pictures.length}
          </span>
        </>
      ) : null}
    </div>
  );
}

function CarouselButton({
  children,
  className,
  label,
  onClick,
}: {
  children: ReactNode;
  className: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      aria-label={label}
      className={`pointer-events-none absolute top-1/2 inline-flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#0d3b66] opacity-0 shadow-sm transition hover:bg-white hover:text-[#f15156] group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100 ${className}`}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function AdoptionButton({ pet, org }: { pet: Pet; org: PetOrganization | null }) {
  const whatsappUrl = org?.phone
    ? createWhatsappUrl({
        petName: pet.name,
        phone: org.phone,
      })
    : null;

  if (!whatsappUrl) {
    return (
      <Button
        type="button"
        disabled
        className="h-14 rounded-full bg-[#f15156] font-black text-base text-white hover:bg-[#f15156]/90"
      >
        Quero adotar
      </Button>
    );
  }

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      className="inline-flex h-14 items-center justify-center rounded-full bg-[#f15156] px-5 font-black text-base text-white transition hover:bg-[#f15156]/90"
    >
      Quero adotar
    </a>
  );
}

function DetailMetric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-[8px] bg-[#0d3b66]/5 p-4">
      <span className="text-[#f15156]">{icon}</span>
      <div>
        <p className="font-black text-[#0d3b66]/45 text-xs uppercase">{label}</p>
        <p className="font-black text-[#0d3b66]">{value}</p>
      </div>
    </div>
  );
}

function createWhatsappUrl({ petName, phone }: { petName: string; phone: string }) {
  const phoneDigits = normalizeWhatsappPhone(phone);
  const message = `Olá! Vi o pet ${petName} no FindAFriend e gostaria de saber mais sobre a adoção.`;

  if (!phoneDigits) {
    return null;
  }

  return `https://wa.me/${phoneDigits}?text=${encodeURIComponent(message)}`;
}

function normalizeWhatsappPhone(phone: string) {
  return phone.replace(/\D/g, "");
}

function getWrappedPictureIndex(nextIndex: number, pictureCount: number) {
  if (pictureCount <= 0) {
    return 0;
  }

  return (nextIndex + pictureCount) % pictureCount;
}

function PetDetailsSkeleton() {
  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="overflow-hidden rounded-[8px] bg-white p-6">
        <Skeleton className="-mx-6 -mt-6 aspect-[16/10] rounded-none bg-[#0d3b66]/10" />
        <Skeleton className="mt-6 h-12 w-2/3 rounded-[8px] bg-[#0d3b66]/10" />
        <Skeleton className="mt-5 h-5 w-full rounded-[8px] bg-[#0d3b66]/10" />
        <Skeleton className="mt-3 h-5 w-5/6 rounded-[8px] bg-[#0d3b66]/10" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-56 rounded-[8px] bg-[#0d3b66]/10" />
        <Skeleton className="h-72 rounded-[8px] bg-[#0d3b66]/10" />
      </div>
    </div>
  );
}
