const BASE_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3333";
const TOKEN_STORAGE_KEY = "find-a-friend:token";
const ORG_ID_STORAGE_KEY = "find-a-friend:org-id";
const ORG_NAME_STORAGE_KEY = "find-a-friend:org-name";

export interface ApiResponse<T> {
  data: T;
  ok: boolean;
  status: number;
  error?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${path}`;

    const token = getStoredToken();
    const headers = new Headers(options.headers);

    if (options.body !== undefined) {
      headers.set("Content-Type", "application/json");
    }

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const config: RequestInit = {
      ...options,
      credentials: "include",
      headers,
    };

    const response = await fetch(url, config);
    let data: T;

    try {
      data = await response.json();
    } catch {
      data = null as T;
    }

    if (response.status === 401) {
      redirectToLogin();
    }

    return {
      data,
      ok: response.ok,
      status: response.status,
      error: response.ok ? undefined : getErrorMessage(data, response.status),
    };
  }

  async get<T>(path: string): Promise<ApiResponse<T>> {
    return this.request<T>(path, { method: "GET" });
  }

  async post<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(path, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(path, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(path, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(path: string): Promise<ApiResponse<T>> {
    return this.request<T>(path, { method: "DELETE" });
  }
}

function getErrorMessage(data: unknown, status: number) {
  if (typeof data === "string" && data.length > 0) {
    return data;
  }

  if (data && typeof data === "object") {
    if ("cause" in data && typeof data.cause === "string") {
      return data.cause;
    }

    if ("message" in data && typeof data.message === "string") {
      return data.message;
    }

    if ("issues" in data) {
      return "Alguns campos precisam de revisão.";
    }
  }

  if (status === 401) return "Sessão expirada ou credenciais inválidas.";
  if (status === 404) return "Recurso não encontrado.";
  if (status === 409) return "Já existe um cadastro com esses dados.";

  return "Não foi possível completar a solicitação.";
}

export const api = new ApiClient(BASE_URL);

function getStoredToken() {
  if (typeof window === "undefined") return null;

  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

function redirectToLogin() {
  if (typeof window === "undefined") return;
  if (window.location.pathname === "/login") return;

  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(ORG_ID_STORAGE_KEY);
  window.localStorage.removeItem(ORG_NAME_STORAGE_KEY);
  window.location.assign("/login");
}
