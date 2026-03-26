import type { Product, Decor, News, ContactMessage, SiteContent, DecorFilters } from '@/types';

const BASE = import.meta.env.VITE_API_URL || '';

function getToken() {
  return localStorage.getItem('opser_token') || '';
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

// Auth
export async function loginWithCredentials(username: string, password: string) {
  return request<{ token: string; user: { id: string; username: string } }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

// Products
export async function getProducts(): Promise<Product[]> {
  return request<Product[]>('/api/products');
}

export async function getProductById(id: string): Promise<Product | null> {
  return request<Product | null>(`/api/products/${id}`);
}

export async function createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
  return request<Product>('/api/products', { method: 'POST', body: JSON.stringify(product) });
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
  return request<Product>(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(product) });
}

export async function deleteProduct(id: string): Promise<void> {
  await request(`/api/products/${id}`, { method: 'DELETE' });
}

// Decors
export async function getDecors(filters?: DecorFilters): Promise<Decor[]> {
  const params = new URLSearchParams();
  if (filters?.productType) params.set('productType', filters.productType);
  if (filters?.colorGroup) params.set('colorGroup', filters.colorGroup);
  if (filters?.patternCategory) params.set('patternCategory', filters.patternCategory);
  if (filters?.search) params.set('search', filters.search);
  const qs = params.toString();
  return request<Decor[]>(`/api/decors${qs ? `?${qs}` : ''}`);
}

export async function getDecorById(id: string): Promise<Decor | null> {
  return request<Decor | null>(`/api/decors/${id}`);
}

export async function createDecor(decor: Omit<Decor, 'id' | 'created_at' | 'updated_at'>): Promise<Decor> {
  return request<Decor>('/api/decors', { method: 'POST', body: JSON.stringify(decor) });
}

export async function updateDecor(id: string, decor: Partial<Decor>): Promise<Decor> {
  return request<Decor>(`/api/decors/${id}`, { method: 'PUT', body: JSON.stringify(decor) });
}

export async function deleteDecor(id: string): Promise<void> {
  await request(`/api/decors/${id}`, { method: 'DELETE' });
}

// News
export async function getPublishedNews(limit?: number): Promise<News[]> {
  const qs = limit ? `?limit=${limit}` : '';
  return request<News[]>(`/api/news${qs}`);
}

export async function getAllNews(): Promise<News[]> {
  return request<News[]>('/api/news?all=true');
}

export async function getNewsById(id: string): Promise<News | null> {
  return request<News | null>(`/api/news/${id}`);
}

export async function createNews(news: Omit<News, 'id' | 'created_at' | 'updated_at'>): Promise<News> {
  return request<News>('/api/news', { method: 'POST', body: JSON.stringify(news) });
}

export async function updateNews(id: string, news: Partial<News>): Promise<News> {
  return request<News>(`/api/news/${id}`, { method: 'PUT', body: JSON.stringify(news) });
}

export async function deleteNews(id: string): Promise<void> {
  await request(`/api/news/${id}`, { method: 'DELETE' });
}

// Contact Messages
export async function createContactMessage(message: Omit<ContactMessage, 'id' | 'is_read' | 'created_at'>): Promise<ContactMessage> {
  return request<ContactMessage>('/api/messages', { method: 'POST', body: JSON.stringify(message) });
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  return request<ContactMessage[]>('/api/messages');
}

export async function markMessageAsRead(id: string): Promise<void> {
  await request(`/api/messages/${id}/read`, { method: 'PATCH' });
}

export async function deleteContactMessage(id: string): Promise<void> {
  await request(`/api/messages/${id}`, { method: 'DELETE' });
}

// Site Content
export async function getSiteContent(): Promise<SiteContent[]> {
  return request<SiteContent[]>('/api/site-content');
}

export async function getSiteContentByKey(key: string): Promise<SiteContent | null> {
  return request<SiteContent | null>(`/api/site-content/${key}`);
}

export async function updateSiteContent(key: string, content: Partial<SiteContent>): Promise<SiteContent> {
  return request<SiteContent>(`/api/site-content/${key}`, { method: 'PUT', body: JSON.stringify(content) });
}

// Statistics
export async function getStatistics(): Promise<{ products: number; decors: number; news: number; messages: number }> {
  return request('/api/stats');
}
