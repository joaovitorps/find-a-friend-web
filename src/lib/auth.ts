import { api } from "./api";

const TOKEN_STORAGE_KEY = "find-a-friend:token";
const ORG_ID_STORAGE_KEY = "find-a-friend:org-id";
const ORG_NAME_STORAGE_KEY = "find-a-friend:org-name";

export interface LoginResponse {
  org: {
    id: string;
    name: string;
  };
  token: string;
}

export interface LoginParams {
  email: string;
  password: string;
}

export interface RegisterParams {
  name: string;
  email: string;
  password: string;
  ownerName: string;
  phone: string;
  address: {
    number: string;
    street: string;
    neighborhood: string;
    city: string;
    state: string;
  };
}

export function login(params: LoginParams) {
  return api.post<LoginResponse>("/sessions", params);
}

export function register(params: RegisterParams) {
  return api.post<{ success: true }>("/organizations", params);
}

export function getOrgIdFromToken(token: string) {
  try {
    const [, payload] = token.split(".");

    if (!payload) return null;

    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = window.atob(normalizedPayload);
    const parsed = JSON.parse(json) as { sub?: string };

    return parsed.sub ?? null;
  } catch {
    return null;
  }
}

export function saveOrgSession(response: LoginResponse) {
  const orgId = response.org.id || getOrgIdFromToken(response.token);

  if (!orgId) return null;

  window.localStorage.setItem(TOKEN_STORAGE_KEY, response.token);
  window.localStorage.setItem(ORG_ID_STORAGE_KEY, orgId);
  window.localStorage.setItem(ORG_NAME_STORAGE_KEY, response.org.name);

  return orgId;
}

export function getStoredOrgId() {
  return window.localStorage.getItem(ORG_ID_STORAGE_KEY);
}

export function getStoredOrgName() {
  return window.localStorage.getItem(ORG_NAME_STORAGE_KEY);
}

export function getStoredToken() {
  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function clearOrgSession() {
  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(ORG_ID_STORAGE_KEY);
  window.localStorage.removeItem(ORG_NAME_STORAGE_KEY);
}
