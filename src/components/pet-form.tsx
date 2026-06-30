import { Plus, Save, Trash2 } from "lucide-react";
import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  AGE_OPTIONS,
  ENERGY_OPTIONS,
  ENVIRONMENT_OPTIONS,
  INDEPENDENCY_OPTIONS,
  type Pet,
  type PetAge,
  type PetEnergyLevel,
  type PetEnvironment,
  type PetIndependencyLevel,
  type PetSize,
  petLabels,
  SIZE_OPTIONS,
} from "@/lib/pets";

export interface PetFormValues {
  name: string;
  about: string;
  age: PetAge;
  size: PetSize;
  energyLevel: PetEnergyLevel;
  independencyLevel: PetIndependencyLevel;
  environment: PetEnvironment;
  pictures: string[];
  adoptionRequirements: string[];
}

type PetFormErrors = Partial<Record<keyof PetFormValues, string>>;

const MAX_PET_PICTURES = 3;
const MAX_ADOPTION_REQUIREMENTS = 3;

export const emptyPetForm: PetFormValues = {
  name: "",
  about: "",
  age: "FILHOTE",
  size: "PEQUENO",
  energyLevel: "MEDIO",
  independencyLevel: "MEDIO",
  environment: "APARTAMENTO",
  pictures: [""],
  adoptionRequirements: [""],
};

interface PetFormProps {
  initialValues?: PetFormValues;
  loading?: boolean;
  submitLabel: string;
  loadingLabel: string;
  mode: "create" | "edit";
  onSubmit: (values: PetFormValues) => Promise<void> | void;
}

export function PetForm({
  initialValues = emptyPetForm,
  loading = false,
  submitLabel,
  loadingLabel,
  mode,
  onSubmit,
}: PetFormProps) {
  const [form, setForm] = useState<PetFormValues>(initialValues);
  const [errors, setErrors] = useState<PetFormErrors>({});

  function updateField<K extends keyof PetFormValues>(field: K, value: PetFormValues[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const nextErrors = validatePetForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    void onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-6">
      <div className="grid gap-5 md:grid-cols-2">
        <TextField
          label="Nome"
          value={form.name}
          error={errors.name}
          placeholder="Amora"
          onChange={(value) => updateField("name", value)}
        />
        <SelectField
          label="Idade"
          value={form.age}
          options={AGE_OPTIONS.map((age) => ({
            value: age,
            label: petLabels.age[age],
          }))}
          onChange={(value) => updateField("age", value as PetAge)}
        />
      </div>

      <label className="grid gap-2">
        <span className="font-black text-[#0d3b66]/55 text-sm uppercase">Sobre</span>
        <textarea
          value={form.about}
          onChange={(event) => updateField("about", event.target.value)}
          placeholder="Conte um pouco sobre a personalidade do pet"
          className="min-h-32 rounded-[8px] border border-[#0d3b66]/15 bg-[#fff7ed] px-4 py-3 font-bold text-[#0d3b66] text-sm leading-6 outline-none transition placeholder:text-[#0d3b66]/35 focus-visible:ring-2 focus-visible:ring-[#0d3b66]/25"
        />
      </label>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <SelectField
          label="Porte"
          value={form.size}
          options={SIZE_OPTIONS.map((size) => ({
            value: size,
            label: petLabels.size[size],
          }))}
          onChange={(value) => updateField("size", value as PetSize)}
        />
        <SelectField
          label="Energia"
          value={form.energyLevel}
          options={ENERGY_OPTIONS.map((level) => ({
            value: level,
            label: petLabels.level[level],
          }))}
          onChange={(value) => updateField("energyLevel", value as PetEnergyLevel)}
        />
        <SelectField
          label="Independência"
          value={form.independencyLevel}
          options={INDEPENDENCY_OPTIONS.map((level) => ({
            value: level,
            label: petLabels.level[level],
          }))}
          onChange={(value) => updateField("independencyLevel", value as PetIndependencyLevel)}
        />
        <SelectField
          label="Ambiente"
          value={form.environment}
          options={ENVIRONMENT_OPTIONS.map((environment) => ({
            value: environment,
            label: petLabels.environment[environment],
          }))}
          onChange={(value) => updateField("environment", value as PetEnvironment)}
        />
      </div>

      <StringListField
        label="Fotos"
        helper={`Informe até ${MAX_PET_PICTURES} URLs de imagens. Deixe vazio para usar o fallback visual.`}
        maxItems={MAX_PET_PICTURES}
        values={form.pictures}
        error={errors.pictures}
        onChange={(values) => updateField("pictures", values)}
      />

      <StringListField
        label="Requisitos de adoção"
        helper={`Informe até ${MAX_ADOPTION_REQUIREMENTS} requisitos. Ex.: casa telada, entrevista, termo de adoção.`}
        maxItems={MAX_ADOPTION_REQUIREMENTS}
        values={form.adoptionRequirements}
        error={errors.adoptionRequirements}
        onChange={(values) => updateField("adoptionRequirements", values)}
      />

      <Button
        type="submit"
        disabled={loading}
        className="h-14 rounded-full bg-[#f15156] font-black text-base text-white hover:bg-[#f15156]/90 md:w-fit md:px-8"
      >
        {mode === "create" ? <Plus className="size-5" /> : <Save className="size-5" />}
        {loading ? loadingLabel : submitLabel}
      </Button>
    </form>
  );
}

export function petToFormValues(pet: Pet): PetFormValues {
  return {
    name: pet.name,
    about: pet.about ?? "",
    age: pet.age,
    size: pet.size,
    energyLevel: pet.energyLevel,
    independencyLevel: pet.independencyLevel,
    environment: pet.environment,
    pictures: pet.pictures.length > 0 ? pet.pictures.slice(0, MAX_PET_PICTURES) : [""],
    adoptionRequirements:
      pet.adoptionRequirements.length > 0
        ? pet.adoptionRequirements.slice(0, MAX_ADOPTION_REQUIREMENTS)
        : [""],
  };
}

function TextField({
  label,
  value,
  error,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  error?: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="font-black text-[#0d3b66]/55 text-sm uppercase">{label}</span>
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 rounded-[8px] border-[#0d3b66]/15 bg-[#fff7ed] px-4 font-bold text-[#0d3b66] text-sm placeholder:text-[#0d3b66]/35"
      />
      {error ? <span className="font-bold text-red-500 text-sm">{error}</span> : null}
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="font-black text-[#0d3b66]/55 text-sm uppercase">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 rounded-[8px] border border-[#0d3b66]/15 bg-[#fff7ed] px-3 font-bold text-[#0d3b66] text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-[#0d3b66]/25"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function StringListField({
  label,
  helper,
  maxItems,
  values,
  error,
  onChange,
}: {
  label: string;
  helper: string;
  maxItems: number;
  values: string[];
  error?: string;
  onChange: (values: string[]) => void;
}) {
  const canAddMore = values.length < maxItems;

  function updateValue(index: number, value: string) {
    onChange(values.map((item, itemIndex) => (itemIndex === index ? value : item)));
  }

  function removeValue(index: number) {
    const nextValues = values.filter((_, itemIndex) => itemIndex !== index);
    onChange(nextValues.length > 0 ? nextValues : [""]);
  }

  return (
    <div className="grid gap-3">
      <div>
        <p className="font-black text-[#0d3b66]/55 text-sm uppercase">{label}</p>
        <p className="mt-1 font-semibold text-[#0d3b66]/55 text-sm">{helper}</p>
      </div>

      {values.map((value, index) => (
        <div key={index} className="flex gap-2">
          <Input
            value={value}
            onChange={(event) => updateValue(index, event.target.value)}
            className="h-12 rounded-[8px] border-[#0d3b66]/15 bg-[#fff7ed] px-4 font-bold text-[#0d3b66] text-sm"
          />
          <Button
            type="button"
            variant="ghost"
            className="h-12 rounded-full px-4 text-[#0d3b66] hover:bg-[#0d3b66]/5"
            onClick={() => removeValue(index)}
            aria-label={`Remover ${label.toLowerCase()}`}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}

      {error ? <span className="font-bold text-red-500 text-sm">{error}</span> : null}

      <Button
        type="button"
        variant="ghost"
        disabled={!canAddMore}
        className="h-11 w-fit rounded-full px-4 font-black text-[#0d3b66] text-sm hover:bg-[#0d3b66]/5"
        onClick={() => {
          if (canAddMore) onChange([...values, ""]);
        }}
      >
        <Plus className="size-4" />
        {canAddMore ? "Adicionar" : `Limite de ${maxItems}`}
      </Button>
    </div>
  );
}

function validatePetForm(form: PetFormValues) {
  const errors: PetFormErrors = {};

  if (!form.name.trim()) errors.name = "Nome é obrigatório.";
  if (form.pictures.length > MAX_PET_PICTURES) {
    errors.pictures = `Adicione no máximo ${MAX_PET_PICTURES} fotos.`;
  }
  if (form.adoptionRequirements.length > MAX_ADOPTION_REQUIREMENTS) {
    errors.adoptionRequirements = `Adicione no máximo ${MAX_ADOPTION_REQUIREMENTS} requisitos.`;
  }
  if (form.adoptionRequirements.map((item) => item.trim()).filter(Boolean).length === 0) {
    errors.adoptionRequirements = "Adicione ao menos um requisito.";
  }

  return errors;
}
