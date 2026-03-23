const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  post_count: number;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  snippet: string | null;
  read_time_minutes: number;
  published_at: string | null;
  featured: boolean;
  links?: { label: string; url: string }[];
  created_at: string;
  updated_at: string;
  categories: { id: string; name: string; slug: string }[];
}

export async function getPosts(params?: {
  category?: string;
  featured?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<Post[]> {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.set("category", params.category);
  if (params?.featured) searchParams.set("featured", "true");
  if (params?.search) searchParams.set("search", params.search);
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.offset) searchParams.set("offset", String(params.offset));
  const query = searchParams.toString();
  const res = await fetch(`${API_BASE}/posts${query ? `?${query}` : ""}`);
  if (!res.ok) throw new Error("Falha ao carregar posts");
  return res.json();
}

export async function getPost(idOrSlug: string): Promise<Post | null> {
  const res = await fetch(`${API_BASE}/posts/${encodeURIComponent(idOrSlug)}`);
  if (!res.ok) return null;
  return res.json();
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${API_BASE}/categories`);
  if (!res.ok) throw new Error("Falha ao carregar categorias");
  return res.json();
}

export async function createPost(data: {
  title: string;
  slug: string;
  content: string;
  snippet?: string;
  read_time_minutes?: number;
  published_at?: string;
  featured?: boolean;
  category_ids?: string[];
  links?: { label: string; url: string }[];
}): Promise<Post> {
  const res = await fetch(`${API_BASE}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message?.join?.("\n") ?? "Falha ao criar post");
  }
  return res.json();
}

export async function createCategory(data: {
  name: string;
  slug: string;
}): Promise<Category> {
  const res = await fetch(`${API_BASE}/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message?.join?.("\n") ?? "Falha ao criar categoria");
  }
  return res.json();
}
