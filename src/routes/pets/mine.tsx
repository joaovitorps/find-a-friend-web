import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { BackButton } from "@/components/back-button";
import { PetCard } from "@/components/pet-card";
import { EmptyPetsState, PetsErrorState, PetsLoadingGrid } from "@/components/pet-list-states";
import { Button } from "@/components/ui/button";
import { getStoredOrgId } from "@/lib/auth";
import { deletePet, fetchMyPets, type Pet, publishPet } from "@/lib/pets";

export const Route = createFileRoute("/pets/mine")({
  component: MyPetsPage,
});

function MyPetsPage() {
  const navigate = Route.useNavigate();
  const orgId = getStoredOrgId();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [publishingPetId, setPublishingPetId] = useState<string | null>(null);
  const [deletingPetId, setDeletingPetId] = useState<string | null>(null);

  const loadPets = useCallback(async () => {
    if (!orgId) {
      setPets([]);
      setError("");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetchMyPets();

      if (!response.ok) {
        setPets([]);
        setError(response.error ?? "Erro ao buscar seus pets.");
        return;
      }

      setPets(response.data.pets);
    } catch {
      setPets([]);
      setError("Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  }, [orgId]);

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
        <BackButton />

        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-end">
          <div>
            <p className="font-black text-[#f15156] text-sm uppercase tracking-wide">
              Área da organização
            </p>
            <h1 className="mt-3 font-black text-5xl text-[#0d3b66] leading-[0.95] sm:text-6xl">
              Gerencie os pets da sua organização
            </h1>
            <p className="mt-4 max-w-2xl font-semibold text-[#0d3b66]/65 text-base leading-7">
              Veja todos os pets cadastrados pela sua organização.
            </p>
          </div>

          <Button
            type="button"
            className="h-12 rounded-full bg-[#f15156] px-5 font-black text-sm text-white hover:bg-[#f15156]/90"
            onClick={() => navigate({ to: "/pets/new" })}
          >
            <Heart className="size-4" />
            Cadastrar pet
          </Button>
        </section>

        {!orgId ? (
          <div className="rounded-[8px] border border-[#f15156]/20 bg-white p-6">
            <h2 className="font-black text-2xl text-[#0d3b66]">Faça login para ver seus pets</h2>
            <p className="mt-2 font-semibold text-[#0d3b66]/65 text-sm leading-6">
              Essa área usa a organização salva no login.
            </p>
            <Link
              to="/login"
              className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-[#0d3b66] px-5 font-black text-sm text-white transition hover:bg-[#0d3b66]/90"
            >
              Entrar
            </Link>
          </div>
        ) : null}

        {orgId && loading ? <PetsLoadingGrid /> : null}
        {orgId && !loading && error ? <PetsErrorState message={error} onRetry={loadPets} /> : null}
        {orgId && !loading && !error && pets.length === 0 ? <EmptyPetsState /> : null}
        {orgId && !loading && !error && pets.length > 0 ? (
          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pets.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                canPublish
                canManage
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
