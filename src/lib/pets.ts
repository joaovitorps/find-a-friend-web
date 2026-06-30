import { api } from "./api";

export const AGE_OPTIONS = ["FILHOTE", "ADULTO", "IDOSO"] as const;
export const SIZE_OPTIONS = ["PEQUENO", "MEDIO", "GRANDE"] as const;
export const ENERGY_OPTIONS = ["BAIXO", "MEDIO", "ALTO"] as const;
export const INDEPENDENCY_OPTIONS = ["BAIXO", "MEDIO", "ALTO"] as const;
export const ENVIRONMENT_OPTIONS = [
  "AMBIENTE_AMPLO",
  "APARTAMENTO",
  "AMBIENTE_CONTROLADO",
  "AR_LIVRE",
] as const;
export const STATUS_OPTIONS = ["DRAFT", "PUBLISHED"] as const;

export type PetAge = (typeof AGE_OPTIONS)[number];
export type PetSize = (typeof SIZE_OPTIONS)[number];
export type PetEnergyLevel = (typeof ENERGY_OPTIONS)[number];
export type PetIndependencyLevel = (typeof INDEPENDENCY_OPTIONS)[number];
export type PetEnvironment = (typeof ENVIRONMENT_OPTIONS)[number];
export type PetStatus = (typeof STATUS_OPTIONS)[number];

export interface Pet {
  id: string;
  orgId: string;
  name: string;
  about: string | null;
  status: PetStatus;
  age: PetAge;
  size: PetSize;
  energyLevel: PetEnergyLevel;
  independencyLevel: PetIndependencyLevel;
  environment: PetEnvironment;
  pictures: string[];
  adoptionRequirements: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface PetOrganization {
  name: string;
  phone: string;
}

export interface PetFilters {
  city: string;
  age?: PetAge;
  size?: PetSize;
  energyLevel?: PetEnergyLevel;
  independencyLevel?: PetIndependencyLevel;
}

export interface CreatePetInput {
  name: string;
  about: string | null;
  status: PetStatus;
  age: PetAge;
  size: PetSize;
  energyLevel: PetEnergyLevel;
  independencyLevel: PetIndependencyLevel;
  environment: PetEnvironment;
  pictures: string[];
  adoptionRequirements: string[];
}

export type UpdatePetInput = Partial<Omit<CreatePetInput, "status">>;

export const petLabels = {
  age: {
    FILHOTE: "Filhote",
    ADULTO: "Adulto",
    IDOSO: "Idoso",
  },
  size: {
    PEQUENO: "Pequeno",
    MEDIO: "Médio",
    GRANDE: "Grande",
  },
  level: {
    BAIXO: "Baixo",
    MEDIO: "Médio",
    ALTO: "Alto",
  },
  environment: {
    AMBIENTE_AMPLO: "Ambiente amplo",
    APARTAMENTO: "Apartamento",
    AMBIENTE_CONTROLADO: "Ambiente controlado",
    AR_LIVRE: "Ar livre",
  },
  status: {
    DRAFT: "Rascunho",
    PUBLISHED: "Publicado",
  },
} satisfies {
  age: Record<PetAge, string>;
  size: Record<PetSize, string>;
  level: Record<PetEnergyLevel | PetIndependencyLevel, string>;
  environment: Record<PetEnvironment, string>;
  status: Record<PetStatus, string>;
};

export function fetchPets(filters: PetFilters) {
  const searchParams = new URLSearchParams();

  searchParams.set("city", filters.city);
  appendOptional(searchParams, "age", filters.age);
  appendOptional(searchParams, "size", filters.size);
  appendOptional(searchParams, "energyLevel", filters.energyLevel);
  appendOptional(searchParams, "independencyLevel", filters.independencyLevel);

  return api.get<{ pets: Pet[] }>(`/pets?${searchParams.toString()}`);
}

export function fetchMyPets() {
  return api.get<{ pets: Pet[] }>("/pets/mine");
}

export function getPetDetails(petId: string) {
  return api.get<{ pet: Pet; org: PetOrganization }>(`/pets/${petId}`);
}

export function createPet(input: CreatePetInput) {
  return api.post<{ success: true }>("/pets", input);
}

export function updatePet(petId: string, input: UpdatePetInput) {
  return api.put<null>(`/pets/${petId}`, input);
}

export function deletePet(petId: string) {
  return api.delete<null>(`/pets/${petId}`);
}

export function publishPet(petId: string) {
  return api.patch<null>(`/pets/${petId}/publish`);
}

function appendOptional(searchParams: URLSearchParams, key: string, value?: string) {
  if (value) {
    searchParams.set(key, value);
  }
}
