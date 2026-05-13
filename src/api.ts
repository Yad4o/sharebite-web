import type { AuthToken, FoodPost, FoodRequest, Notification, RequestStatus, User } from "./types";

const BASE = "";

function getToken(): string | null {
  return localStorage.getItem("sb_token");
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail ?? `HTTP ${res.status}`);
  }
  return res.json();
}

// Auth
export async function register(data: {
  name: string; email: string; password: string; role: string; address?: string;
}): Promise<AuthToken> {
  const res = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handle(res);
}

export async function login(email: string, password: string): Promise<AuthToken> {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handle(res);
}

export async function getMe(): Promise<User> {
  const res = await fetch(`${BASE}/auth/me`, { headers: authHeaders() });
  return handle(res);
}

// Food posts
export async function listPosts(params?: {
  category?: string; vegetarian?: boolean; skip?: number; limit?: number;
}): Promise<FoodPost[]> {
  const q = new URLSearchParams();
  if (params?.category) q.set("category", params.category);
  if (params?.vegetarian !== undefined) q.set("vegetarian", String(params.vegetarian));
  if (params?.skip !== undefined) q.set("skip", String(params.skip));
  if (params?.limit !== undefined) q.set("limit", String(params.limit));
  const res = await fetch(`${BASE}/food/posts?${q}`);
  return handle(res);
}

export async function getPost(id: number): Promise<FoodPost> {
  const res = await fetch(`${BASE}/food/posts/${id}`);
  return handle(res);
}

export async function getMyPosts(): Promise<FoodPost[]> {
  const res = await fetch(`${BASE}/food/posts/my`, { headers: authHeaders() });
  return handle(res);
}

export async function createPost(form: FormData): Promise<FoodPost> {
  const res = await fetch(`${BASE}/food/posts`, {
    method: "POST",
    headers: authHeaders(),
    body: form,
  });
  return handle(res);
}

export async function deletePost(id: number): Promise<void> {
  const res = await fetch(`${BASE}/food/posts/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

// Requests
export async function listRequests(): Promise<FoodRequest[]> {
  const res = await fetch(`${BASE}/requests/`, { headers: authHeaders() });
  return handle(res);
}

export async function myDeliveries(): Promise<FoodRequest[]> {
  const res = await fetch(`${BASE}/requests/deliveries/mine`, { headers: authHeaders() });
  return handle(res);
}

export async function createRequest(data: {
  food_post_id: number; note?: string; delivery_address?: string;
}): Promise<FoodRequest> {
  const res = await fetch(`${BASE}/requests/`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handle(res);
}

export async function updateRequestStatus(id: number, status: RequestStatus): Promise<FoodRequest> {
  const res = await fetch(`${BASE}/requests/${id}/status`, {
    method: "PATCH",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return handle(res);
}

// Notifications
export async function listNotifications(): Promise<Notification[]> {
  const res = await fetch(`${BASE}/notifications/`, { headers: authHeaders() });
  return handle(res);
}

export async function getUnreadCount(): Promise<number> {
  const res = await fetch(`${BASE}/notifications/unread-count`, { headers: authHeaders() });
  const data = await handle<{ count: number }>(res);
  return data.count;
}

export async function markAllRead(): Promise<void> {
  await fetch(`${BASE}/notifications/read-all`, { method: "PATCH", headers: authHeaders() });
}
