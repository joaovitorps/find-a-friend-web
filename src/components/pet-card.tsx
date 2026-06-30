import { AlertDialog } from "@base-ui/react/alert-dialog";
import { Link } from "@tanstack/react-router";
import { Bolt, CheckCircle2, Home, Maximize2, Pencil, ShieldCheck, Trash2 } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

import { type Pet, petLabels } from "@/lib/pets";

interface PetCardProps {
  pet: Pet;
  canPublish?: boolean;
  canManage?: boolean;
  publishing?: boolean;
  deleting?: boolean;
  onPublish?: (petId: string) => void;
  onDelete?: (petId: string) => void;
}

export function PetCard({
  pet,
  canPublish = false,
  canManage = false,
  publishing = false,
  deleting = false,
  onPublish,
  onDelete,
}: PetCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const imageUrl = pet.pictures[0];

  return (
    <motion.article
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="flex h-full flex-col overflow-hidden rounded-[8px] border border-[#0d3b66]/10 bg-white shadow-sm"
    >
      <Link
        to="/pets/$petId"
        params={{ petId: pet.id }}
        className="block focus-visible:outline-2 focus-visible:outline-[#0d3b66] focus-visible:outline-offset-2"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`Foto de ${pet.name}`}
            className="aspect-[4/3] w-full object-cover"
          />
        ) : (
          <div className="flex aspect-[4/3] w-full items-center justify-center bg-[#f15156]/10 text-[#f15156]">
            <Home className="size-12" />
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link
              to="/pets/$petId"
              params={{ petId: pet.id }}
              className="font-black text-2xl text-[#0d3b66] leading-tight hover:underline"
            >
              {pet.name}
            </Link>
            <p className="mt-1 font-bold text-[#0d3b66]/55 text-sm">
              {petLabels.status[pet.status]}
            </p>
          </div>
          <span className="rounded-full bg-[#f4d35e]/35 px-3 py-1 font-black text-[#0d3b66] text-xs uppercase tracking-wide">
            {petLabels.age[pet.age]}
          </span>
        </div>

        {pet.about ? (
          <p className="line-clamp-3 font-semibold text-[#0d3b66]/70 text-sm leading-6">
            {pet.about}
          </p>
        ) : (
          <p className="font-semibold text-[#0d3b66]/45 text-sm leading-6">
            Sem descrição cadastrada.
          </p>
        )}

        <dl className="grid grid-cols-2 gap-2 font-bold text-[#0d3b66]/75 text-sm">
          <PetMetric
            icon={<Maximize2 className="size-4" />}
            label="Porte"
            value={petLabels.size[pet.size]}
          />
          <PetMetric
            icon={<Bolt className="size-4" />}
            label="Energia"
            value={petLabels.level[pet.energyLevel]}
          />
          <PetMetric
            icon={<ShieldCheck className="size-4" />}
            label="Independência"
            value={petLabels.level[pet.independencyLevel]}
          />
          <PetMetric
            icon={<Home className="size-4" />}
            label="Ambiente"
            value={petLabels.environment[pet.environment]}
          />
        </dl>

        {canPublish || canManage ? (
          <div className="mt-auto grid gap-2">
            {canPublish && pet.status === "DRAFT" ? (
              <Button
                type="button"
                className="h-11 rounded-full bg-[#0d3b66] font-black text-sm text-white hover:bg-[#0d3b66]/90"
                disabled={publishing}
                onClick={() => onPublish?.(pet.id)}
              >
                <CheckCircle2 className="size-4" />
                {publishing ? "Publicando..." : "Publicar pet"}
              </Button>
            ) : null}

            {canManage ? (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/pets/$petId/edit"
                  params={{ petId: pet.id }}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#0d3b66]/5 font-black text-[#0d3b66] text-sm transition hover:bg-[#0d3b66]/10"
                >
                  <Pencil className="size-4" />
                  Editar
                </Link>

                <DeletePetDialog
                  petName={pet.name}
                  deleting={deleting}
                  onConfirm={() => onDelete?.(pet.id)}
                />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </motion.article>
  );
}

function DeletePetDialog({
  petName,
  deleting,
  onConfirm,
}: {
  petName: string;
  deleting: boolean;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger
        render={
          <Button
            type="button"
            variant="destructive"
            className="h-11 rounded-full bg-red-50 font-black text-red-600 text-sm hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-red-500 focus-visible:outline-offset-2"
          />
        }
      >
        <Trash2 className="size-4" />
        Excluir
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className="fixed inset-0 z-50 bg-[#0d3b66]/40" />
        <AlertDialog.Viewport className="fixed inset-0 z-50 flex items-center justify-center p-5">
          <AlertDialog.Popup className="w-full max-w-md rounded-[8px] bg-white p-6 text-[#0d3b66] shadow-xl outline-none">
            <AlertDialog.Title className="font-black text-2xl">
              Excluir {petName}?
            </AlertDialog.Title>
            <AlertDialog.Description className="mt-3 font-semibold text-[#0d3b66]/65 text-sm leading-6">
              Essa ação remove o cadastro do pet e não pode ser desfeita.
            </AlertDialog.Description>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <AlertDialog.Close
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-11 rounded-full px-5 font-black text-[#0d3b66] text-sm hover:bg-[#0d3b66]/5"
                  />
                }
              >
                Cancelar
              </AlertDialog.Close>
              <Button
                type="button"
                variant="destructive"
                disabled={deleting}
                className="h-11 rounded-full px-5"
                onClick={onConfirm}
              >
                <Trash2 className="size-4" />
                {deleting ? "Excluindo..." : "Excluir pet"}
              </Button>
            </div>
          </AlertDialog.Popup>
        </AlertDialog.Viewport>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

function PetMetric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-[8px] bg-[#0d3b66]/5 p-3">
      <dt className="flex items-center gap-1.5 font-black text-[#0d3b66]/45 text-[11px] uppercase">
        {icon}
        {label}
      </dt>
      <dd className="mt-1 leading-tight">{value}</dd>
    </div>
  );
}
