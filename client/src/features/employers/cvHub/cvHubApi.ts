// API helpers for the CV Hub feature. All authenticated calls use cookie auth
// (credentials: "include"), matching the rest of the project's fetch usage.
import type {
  CvHub,
  HubStatus,
  PaginatedHubs,
  PaginatedSubmissions,
  PublicHub,
  SubmissionFilter,
  SubmitCvPayload,
} from "./types";

const BASE = `${import.meta.env.VITE_API_URL}/api/v1/cv-hub`;

// Throws with the server-provided message so callers can surface it in a toast.
async function handle<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as any)?.message || "Something went wrong");
  }
  return data as T;
}

const json = { "Content-Type": "application/json" };

/* ---- Hubs (employer) ---- */

export async function listHubs(params: {
  search?: string;
  status?: "all" | HubStatus;
  page?: number;
  limit?: number;
}): Promise<PaginatedHubs> {
  const q = new URLSearchParams({
    search: params.search ?? "",
    status: params.status ?? "all",
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 9),
  });
  const res = await fetch(`${BASE}?${q}`, { credentials: "include" });
  return handle<PaginatedHubs>(res);
}

export async function getHub(id: string): Promise<CvHub> {
  const res = await fetch(`${BASE}/${id}`, { credentials: "include" });
  return handle<CvHub>(res);
}

export async function createHub(body: {
  name: string;
  description?: string;
  status?: HubStatus;
}): Promise<CvHub> {
  const res = await fetch(BASE, {
    method: "POST",
    credentials: "include",
    headers: json,
    body: JSON.stringify(body),
  });
  return handle<CvHub>(res);
}

export async function updateHub(
  id: string,
  body: { name?: string; description?: string; status?: HubStatus },
): Promise<CvHub> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: json,
    body: JSON.stringify(body),
  });
  return handle<CvHub>(res);
}

export async function deleteHub(id: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  await handle(res);
}

/* ---- Submissions (employer) ---- */

export async function listSubmissions(
  hubId: string,
  params: {
    search?: string;
    filter?: SubmissionFilter;
    page?: number;
    limit?: number;
  },
): Promise<PaginatedSubmissions> {
  const q = new URLSearchParams({
    search: params.search ?? "",
    filter: params.filter ?? "all",
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 10),
  });
  const res = await fetch(`${BASE}/${hubId}/submissions?${q}`, {
    credentials: "include",
  });
  return handle<PaginatedSubmissions>(res);
}

export async function deleteSubmission(submissionId: string): Promise<void> {
  const res = await fetch(`${BASE}/submissions/${submissionId}`, {
    method: "DELETE",
    credentials: "include",
  });
  await handle(res);
}

/* ---- Public (candidate, no auth) ---- */

export async function getPublicHub(slug: string): Promise<PublicHub> {
  const res = await fetch(`${BASE}/public/${slug}`);
  return handle<PublicHub>(res);
}

export async function submitToHub(
  slug: string,
  payload: SubmitCvPayload,
): Promise<void> {
  const res = await fetch(`${BASE}/public/${slug}/submit`, {
    method: "POST",
    headers: json,
    body: JSON.stringify(payload),
  });
  await handle(res);
}

// The public share URL a candidate opens (QR target / copy-link value).
export function buildShareUrl(slug: string): string {
  return `${window.location.origin}/cv-hub/${slug}`;
}
