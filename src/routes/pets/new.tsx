import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { BackButton } from "@/components/back-button";
import { PetForm, type PetFormValues } from "@/components/pet-form";
import { Button } from "@/components/ui/button";
import { getStoredOrgId } from "@/lib/auth";
import { type CreatePetInput, createPet } from "@/lib/pets";

export const Route = createFileRoute("/pets/new")({
  component: NewPetPage,
});

function NewPetPage() {
  const navigate = useNavigate();
  const orgId = getStoredOrgId();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(form: PetFormValues) {
    if (!orgId) return;

    const input: CreatePetInput = {
      name: form.name.trim(),
      about: form.about.trim() ? form.about.trim() : null,
      status: "DRAFT",
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
    };

    setLoading(true);

    try {
      const response = await createPet(input);

      if (!response.ok) {
        toast.error(response.error ?? "Não foi possível cadastrar o pet.");
        return;
      }

      toast.success("Pet cadastrado como rascunho.");
      navigate({ to: "/pets/mine" });
    } catch {
      toast.error("Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 lg:py-12">
        <BackButton />

        <section className="mt-8 rounded-xl bg-white p-5 shadow-sm sm:p-8">
          <div className="max-w-2xl">
            <p className="font-black text-[#f15156] text-sm uppercase tracking-wide">
              Área da organização
            </p>
            <h1 className="mt-3 font-black text-4xl text-[#0d3b66] leading-none sm:text-5xl">
              Cadastrar novo pet
            </h1>
            <p className="mt-4 font-semibold text-[#0d3b66]/65 text-sm leading-6">
              O pet será criado como rascunho. Depois, publique pelo card na listagem.
            </p>
          </div>

          {!orgId ? (
            <div className="mt-8 rounded-xl border border-[#f15156]/20 bg-[#fff7ed] p-6">
              <h2 className="font-black text-2xl text-[#0d3b66]">Faça login para cadastrar pets</h2>
              <p className="mt-2 font-semibold text-[#0d3b66]/65 text-sm leading-6">
                A criação precisa de uma organização autenticada.
              </p>
              <Button
                type="button"
                className="mt-5 h-11 rounded-full bg-[#0d3b66] px-5 font-black text-sm text-white hover:bg-[#0d3b66]/90"
                onClick={() => navigate({ to: "/login" })}
              >
                Entrar
              </Button>
            </div>
          ) : (
            <PetForm
              mode="create"
              loading={loading}
              submitLabel="Cadastrar pet"
              loadingLabel="Cadastrando..."
              onSubmit={handleSubmit}
            />
          )}
        </section>
      </main>
    </AppShell>
  );
}
