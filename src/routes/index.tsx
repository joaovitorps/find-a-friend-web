import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { AppShell } from "@/components/app-shell";
import { PetCard } from "@/components/pet-card";
import {
  EmptyPetsState,
  InitialPetsState,
  PetsErrorState,
  PetsLoadingGrid,
} from "@/components/pet-list-states";
import { PetSearchForm, type PetSearchValues } from "@/components/pet-search-form";
import { getStoredOrgId } from "@/lib/auth";
import {
  AGE_OPTIONS,
  deletePet,
  ENERGY_OPTIONS,
  fetchPets,
  INDEPENDENCY_OPTIONS,
  type Pet,
  publishPet,
  SIZE_OPTIONS,
} from "@/lib/pets";

const searchSchema = z.object({
  city: z.string().optional().catch(""),
  age: z.enum(AGE_OPTIONS).optional().catch(undefined),
  size: z.enum(SIZE_OPTIONS).optional().catch(undefined),
  energyLevel: z.enum(ENERGY_OPTIONS).optional().catch(undefined),
  independencyLevel: z.enum(INDEPENDENCY_OPTIONS).optional().catch(undefined),
});

export const Route = createFileRoute("/")({
  validateSearch: (search) => searchSchema.parse(search),
  component: HomeComponent,
});

function HomeComponent() {
  const navigate = Route.useNavigate();
  const search = Route.useSearch();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [publishingPetId, setPublishingPetId] = useState<string | null>(null);
  const [deletingPetId, setDeletingPetId] = useState<string | null>(null);

  const hasCity = Boolean(search.city?.trim());
  const orgId = getStoredOrgId();

  const filters = useMemo<PetSearchValues>(
    () => ({
      city: search.city ?? "",
      age: search.age,
      size: search.size,
      energyLevel: search.energyLevel,
      independencyLevel: search.independencyLevel,
    }),
    [search.age, search.city, search.energyLevel, search.independencyLevel, search.size],
  );

  const loadPets = useCallback(async () => {
    if (!hasCity || !search.city) {
      setPets([]);
      setError("");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetchPets({
        city: search.city,
        age: search.age,
        size: search.size,
        energyLevel: search.energyLevel,
        independencyLevel: search.independencyLevel,
      });

      if (!response.ok) {
        setPets([]);
        setError(response.error ?? "Erro ao buscar pets.");
        return;
      }

      setPets(response.data.pets);
    } catch {
      setPets([]);
      setError("Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  }, [hasCity, search.age, search.city, search.energyLevel, search.independencyLevel, search.size]);

  useEffect(() => {
    void loadPets();
  }, [loadPets]);

  async function handlePublish(petId: string) {
    setPublishingPetId(petId);

    try {
      const response = await publishPet(petId);

      if (!response.ok) {
        toast.error(response.error ?? "Não foi possível publicar o pet.");
        return;
      }

      setPets((currentPets) =>
        currentPets.map((pet) => (pet.id === petId ? { ...pet, status: "PUBLISHED" } : pet)),
      );
      toast.success("Pet publicado.");
    } catch {
      toast.error("Não foi possível conectar ao servidor.");
    } finally {
      setPublishingPetId(null);
    }
  }

  async function handleDelete(petId: string) {
    setDeletingPetId(petId);

    try {
      const response = await deletePet(petId);

      if (!response.ok) {
        toast.error(response.error ?? "Não foi possível excluir o pet.");
        return;
      }

      setPets((currentPets) => currentPets.filter((pet) => pet.id !== petId));
      toast.success("Pet excluído.");
    } catch {
      toast.error("Não foi possível conectar ao servidor.");
    } finally {
      setDeletingPetId(null);
    }
  }

  return (
    <AppShell>
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-8 sm:px-8 lg:py-12">
        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
          <div>
            <p className="font-black text-[#f15156] text-sm uppercase tracking-wide">
              Adoção responsável
            </p>
            <h1 className="mt-3 max-w-3xl font-black text-5xl text-[#0d3b66] leading-[0.95] sm:text-6xl">
              Encontre um amigo perto de você
            </h1>
            <p className="mt-4 max-w-2xl font-semibold text-[#0d3b66]/65 text-base leading-7">
              Busque por cidade e filtre por perfil para encontrar pets que combinem com sua rotina.
            </p>
          </div>
          <div className="rounded-xl bg-[#f15156] p-5 text-white">
            <p className="font-black text-4xl leading-none">{hasCity ? pets.length : 0}</p>
            <p className="mt-2 font-bold text-sm text-white/85">
              {hasCity ? "pets encontrados nesta busca" : "informe uma cidade para buscar"}
            </p>
          </div>
        </section>

        <PetSearchForm
          values={filters}
          loading={loading}
          onSearch={(values) =>
            navigate({
              search: {
                city: values.city || undefined,
                age: values.age,
                size: values.size,
                energyLevel: values.energyLevel,
                independencyLevel: values.independencyLevel,
              },
            })
          }
          onClear={() => navigate({ search: {} })}
        />

        {!hasCity ? <InitialPetsState /> : null}
        {hasCity && loading ? <PetsLoadingGrid /> : null}
        {hasCity && !loading && error ? (
          <PetsErrorState message={error} onRetry={loadPets} />
        ) : null}
        {hasCity && !loading && !error && pets.length === 0 ? <EmptyPetsState /> : null}
        {hasCity && !loading && !error && pets.length > 0 ? (
          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pets.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                canPublish={Boolean(orgId && pet.orgId === orgId)}
                canManage={Boolean(orgId && pet.orgId === orgId)}
                publishing={publishingPetId === pet.id}
                deleting={deletingPetId === pet.id}
                onPublish={handlePublish}
                onDelete={handleDelete}
              />
            ))}
          </section>
        ) : null}
      </main>
    </AppShell>
  );
}
