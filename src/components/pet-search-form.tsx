import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  AGE_OPTIONS,
  ENERGY_OPTIONS,
  INDEPENDENCY_OPTIONS,
  type PetAge,
  type PetEnergyLevel,
  type PetIndependencyLevel,
  type PetSize,
  petLabels,
  SIZE_OPTIONS,
} from "@/lib/pets";
import type { OrganizationCity } from "@/lib/organizations";

export interface PetSearchValues {
  city: string;
  age?: PetAge;
  size?: PetSize;
  energyLevel?: PetEnergyLevel;
  independencyLevel?: PetIndependencyLevel;
}

interface PetSearchFormProps {
  values: PetSearchValues;
  cityOptions?: OrganizationCity[];
  loading?: boolean;
  onSearch: (values: PetSearchValues) => void;
  onClear: () => void;
}

export function PetSearchForm({
  values,
  cityOptions = [],
  loading = false,
  onSearch,
  onClear,
}: PetSearchFormProps) {
  const [draft, setDraft] = useState(values);
  const [showCityOptions, setShowCityOptions] = useState(false);

  useEffect(() => {
    setDraft(values);
  }, [values]);

  const citySuggestions = useMemo(() => {
    const searchTerm = draft.city.trim().toLocaleLowerCase("pt-BR");

    if (!searchTerm) {
      return cityOptions;
    }

    return cityOptions.filter((option) => {
      const cityMatches = option.city.toLocaleLowerCase("pt-BR").includes(searchTerm);
      const organizationMatches = option.organizations.some((organization) =>
        organization.name.toLocaleLowerCase("pt-BR").includes(searchTerm),
      );

      return cityMatches || organizationMatches;
    });
  }, [cityOptions, draft.city]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setShowCityOptions(false);
    onSearch({
      ...draft,
      city: draft.city.trim(),
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-[#0d3b66]/10 bg-white p-4 shadow-sm sm:p-5"
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(180px,1.2fr)_repeat(4,minmax(130px,1fr))_auto] lg:items-end">
        <div className="relative grid gap-2">
          <label htmlFor="city-search" className="font-black text-[#0d3b66]/55 text-xs uppercase">
            Cidade
          </label>
          <Input
            id="city-search"
            value={draft.city}
            onBlur={() => setShowCityOptions(false)}
            onChange={(event) => {
              setDraft((current) => ({ ...current, city: event.target.value }));
              setShowCityOptions(true);
            }}
            onFocus={() => setShowCityOptions(true)}
            placeholder="Ex.: Recife"
            className="h-12 rounded-xl border-[#0d3b66]/15 bg-[#fff7ed] px-4 font-bold text-[#0d3b66] text-sm placeholder:text-[#0d3b66]/35"
          />
          {showCityOptions && citySuggestions.length > 0 ? (
            <div className="absolute top-full z-20 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-[#0d3b66]/10 bg-white p-1 shadow-xl">
              {citySuggestions.map((option) => (
                <button
                  key={option.city}
                  type="button"
                  className="grid w-full gap-1 rounded-lg px-3 py-2 text-left transition hover:bg-[#fff7ed] focus-visible:bg-[#fff7ed] focus-visible:outline-none"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    setDraft((current) => ({ ...current, city: option.city }));
                    setShowCityOptions(false);
                  }}
                >
                  <span className="font-black text-[#0d3b66] text-sm">{option.city}</span>
                  <span className="line-clamp-2 font-semibold text-[#0d3b66]/50 text-[11px] leading-4">
                    {option.organizations.map((organization) => organization.name).join(", ")}
                  </span>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <FilterSelect
          label="Idade"
          value={draft.age ?? ""}
          onChange={(age) =>
            setDraft((current) => ({
              ...current,
              age: age as PetAge | undefined,
            }))
          }
          options={AGE_OPTIONS.map((age) => ({
            value: age,
            label: petLabels.age[age],
          }))}
        />

        <FilterSelect
          label="Porte"
          value={draft.size ?? ""}
          onChange={(size) =>
            setDraft((current) => ({
              ...current,
              size: size as PetSize | undefined,
            }))
          }
          options={SIZE_OPTIONS.map((size) => ({
            value: size,
            label: petLabels.size[size],
          }))}
        />

        <FilterSelect
          label="Energia"
          value={draft.energyLevel ?? ""}
          onChange={(energyLevel) =>
            setDraft((current) => ({
              ...current,
              energyLevel: energyLevel as PetEnergyLevel | undefined,
            }))
          }
          options={ENERGY_OPTIONS.map((level) => ({
            value: level,
            label: petLabels.level[level],
          }))}
        />

        <FilterSelect
          label="Independência"
          value={draft.independencyLevel ?? ""}
          onChange={(independencyLevel) =>
            setDraft((current) => ({
              ...current,
              independencyLevel: independencyLevel as PetIndependencyLevel | undefined,
            }))
          }
          options={INDEPENDENCY_OPTIONS.map((level) => ({
            value: level,
            label: petLabels.level[level],
          }))}
        />

        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={loading}
            className="h-12 rounded-full bg-[#0d3b66] px-5 font-black text-sm text-white hover:bg-[#0d3b66]/90"
          >
            <Search className="size-4" />
            {loading ? "Buscando" : "Buscar"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="h-12 rounded-full px-4 font-black text-[#0d3b66] text-sm hover:bg-[#0d3b66]/5"
            onClick={() => {
              const emptyValues: PetSearchValues = { city: "" };
              setDraft(emptyValues);
              setShowCityOptions(false);
              onClear();
            }}
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>
    </form>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string | undefined) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="font-black text-[#0d3b66]/55 text-xs uppercase">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value || undefined)}
        className="h-12 w-full rounded-xl border border-[#0d3b66]/15 bg-[#fff7ed] px-3 font-bold text-[#0d3b66] text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-[#0d3b66]/25"
      >
        <option value="">Todos</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
