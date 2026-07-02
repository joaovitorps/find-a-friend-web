import { api } from "./api";

export interface OrganizationCity {
  city: string;
  organizations: Array<{
    id: string;
    name: string;
  }>;
}

export function fetchOrganizationCities() {
  return api.get<{ cities: OrganizationCity[] }>("/organizations/cities");
}
