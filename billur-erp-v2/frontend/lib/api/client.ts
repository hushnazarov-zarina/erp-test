// API client — sends requests to backend from NEXT_PUBLIC_API_URL.
// Example:
// Frontend: https://crm-ui-fr.onrender.com
// Backend:  https://crm-ui-zoee.onrender.com
//
// Required frontend ENV:
// NEXT_PUBLIC_API_URL=https://crm-ui-zoee.onrender.com

const TOKEN_KEY = "billur_token";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null): void {
  if (typeof window === "undefined") return;

  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

class ApiError extends Error {
  status: number;
  code?: string;

  constructor(msg: string, status: number, code?: string) {
    super(msg);
    this.status = status;
    this.code = code;
  }
}

function buildApiUrl(path: string): string {
  // If path is already a full URL, use it directly
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // Make sure path starts with /
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  // If NEXT_PUBLIC_API_URL exists, call backend directly
  if (API_BASE_URL) {
    return `${API_BASE_URL}${cleanPath}`;
  }

  // Fallback for local/proxy usage
  return cleanPath;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  opts?: { raw?: boolean }
): Promise<T> {
  const headers: Record<string, string> = {};

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const token = getToken();

  if (token) {
    headers["x-session-token"] = token;
  }

  const res = await fetch(buildApiUrl(path), {
    method,
    credentials: "include",
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (opts?.raw) {
    return res as unknown as T;
  }

  if (!res.ok) {
    let errMsg = res.statusText;
    let errCode: string | undefined;

    try {
      const j = await res.json();
      errMsg = j.error || j.message || errMsg;
      errCode = j.code;
    } catch {
      // not JSON
    }

    throw new ApiError(errMsg, res.status, errCode);
  }

  // 204 / empty body
  const ctype = res.headers.get("content-type") || "";

  if (!ctype.includes("application/json")) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

export const api = {
  get: <T = any>(path: string) => request<T>("GET", path),

  post: <T = any>(path: string, body?: any) =>
    request<T>("POST", path, body ?? {}),

  put: <T = any>(path: string, body?: any) =>
    request<T>("PUT", path, body ?? {}),

  del: <T = any>(path: string) => request<T>("DELETE", path),

  raw: (path: string) =>
    request<Response>("GET", path, undefined, { raw: true }),
};

export { ApiError };
