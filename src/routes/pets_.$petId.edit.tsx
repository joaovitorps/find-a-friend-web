import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { BackButton } from "@/components/back-button";
import { PetForm, type PetFormValues, petToFormValues } from "@/components/pet-form";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getStoredOrgId } from "@/lib/auth";
import { getPetDetails, type Pet, updatePet } from "@/lib/pets";

export const Route = createFileRoute("/pets_/$petId/edit")({
  component: EditPetPage,
});

function EditPetPage() {
  const { petId } = Route.useParams();
  const navigate = useNavigate();
  const orgId = getStoredOrgId();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loadingPet, setLoadingPet] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadPet() {
      setLoadingPet(true);
      setError("");

      try {
        const response = await getPetDetails(petId);

        if (!active) return;

        if (!response.ok) {
          setError(response.error ?? "Pet não encontrado.");
          setPet(null);
          return;
        }

        setPet(response.data.pet);
      } catch {
        if (active) {
          setError("Não foi possível conectar ao servidor.");
          setPet(null);
        }
      } finally {
        if (active) setLoadingPet(false);
      }
    }

    void loadPet();

    return () => {
      active = false;
    };
  }, [petId]);

  async function handleSubmit(form: PetFormValues) {
    setSaving(true);

    try {
      const response = await updatePet(petId, {
        name: form.name.trim(),
        about: form.about.trim() ? form.about.trim() : null,
        age: form.age,
        size: form.size,
        energyLevel: form.energyLevel,
        independencyLevel: form.independencyLevel,
        environment: form.environment,
        pictures: form.pictures
          .map((item) => item.trim())
          .filter(Boolean)
          .slice(0, 3),
        adoptionRequirements: form.adoptionRequirements
          .map((item) => item.trim())
          .filter(Boolean)
          .slice(0, 3),
      });

      if (!response.ok) {
        toast.error(response.error ?? "Não foi possível atualizar o pet.");
        return;
      }

      toast.success("Pet atualizado.");
      navigate({ to: "/pets/mine" });
    } catch {
      toast.error("Não foi possível conectar ao servidor.");
    } finally {
      setSaving(false);
    }
  }

  const canEdit = Boolean(orgId && pet && pet.orgId === orgId);

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 lg:py-12">
        <BackButton fallback="/pets/mine" />

        <section className="mt-8 rounded-xl bg-white p-5 shadow-sm sm:p-8">
          <div className="max-w-2xl">
            <p className="font-black text-[#f15156] text-sm uppercase tracking-wide">
              Área da organização
            </p>
            <h1 className="mt-3 font-black text-4xl text-[#0d3b66] leading-none sm:text-5xl">
              Editar pet
            </h1>
            <p className="mt-4 font-semibold text-[#0d3b66]/65 text-sm leading-6">
              Atualize os dados públicos do pet. Alterações são salvas como edição direta.
            </p>
          </div>

          {!orgId ? (
            <div className="mt-8 rounded-xl border border-[#f15156]/20 bg-[#fff7ed] p-6">
              <h2 className="font-black text-2xl text-[#0d3b66]">Faça login para editar pets</h2>
              <p className="mt-2 font-semibold text-[#0d3b66]/65 text-sm leading-6">
                A edição precisa de uma organização autenticada.
              </p>
              <Button
                type="button"
                className="mt-5 h-11 rounded-full bg-[#0d3b66] px-5 font-black text-sm text-white hover:bg-[#0d3b66]/90"
                onClick={() => navigate({ to: "/login" })}
              >
                Entrar
              </Button>
            </div>
          ) : null}

          {orgId && loadingPet ? <EditPetSkeleton /> : null}

          {orgId && !loadingPet && error ? (
            <div className="mt-8 rounded-xl border border-[#f15156]/20 bg-[#fff7ed] p-6">
              <h2 className="font-black text-2xl text-[#0d3b66]">
                Não foi possível carregar o pet
              </h2>
              <p className="mt-2 font-semibold text-[#0d3b66]/65 text-sm leading-6">{error}</p>
            </div>
          ) : null}

          {orgId && !loadingPet && pet && !canEdit ? (
            <div className="mt-8 rounded-xl border border-[#f15156]/20 bg-[#fff7ed] p-6">
              <h2 className="font-black text-2xl text-[#0d3b66]">
                Esse pet pertence a outra organização
              </h2>
              <p className="mt-2 font-semibold text-[#0d3b66]/65 text-sm leading-6">
                Apenas a organização dona do cadastro pode editar este pet.
              </p>
            </div>
          ) : null}

          {canEdit && pet ? (
            <PetForm
              key={pet.id}
              mode="edit"
              initialValues={petToFormValues(pet)}
              loading={saving}
              submitLabel="Salvar alterações"
              loadingLabel="Salvando..."
              onSubmit={handleSubmit}
            />
          ) : null}
        </section>
      </main>
    </AppShell>
  );
}

function EditPetSkeleton() {
  return (
    <div className="mt-8 grid gap-6">
      <div className="grid gap-5 md:grid-cols-2">
        <Skeleton className="h-12 rounded-xl bg-[#0d3b66]/10" />
        <Skeleton className="h-12 rounded-xl bg-[#0d3b66]/10" />
      </div>
      <Skeleton className="h-32 rounded-xl bg-[#0d3b66]/10" />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-12 rounded-xl bg-[#0d3b66]/10" />
        <Skeleton className="h-12 rounded-xl bg-[#0d3b66]/10" />
        <Skeleton className="h-12 rounded-xl bg-[#0d3b66]/10" />
        <Skeleton className="h-12 rounded-xl bg-[#0d3b66]/10" />
      </div>
    </div>
  );
}
