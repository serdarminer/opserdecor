import { supabase } from './supabase';
import type { Product, Decor, News, ContactMessage, SiteContent, DecorFilters } from '@/types';

// Products API
export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProduct(id: string, product: Partial<Product>) {
  const { data, error } = await supabase
    .from('products')
    .update({ ...product, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Decors API
export async function getDecors(filters?: DecorFilters) {
  let query = supabase
    .from('decors')
    .select('*')
    .order('display_order', { ascending: true });

  if (filters?.productType && filters.productType !== 'all') {
    query = query.or(`compatible_product_type.eq.${filters.productType},compatible_product_type.eq.all`);
  }

  if (filters?.colorGroup) {
    query = query.eq('color_group', filters.colorGroup);
  }

  if (filters?.patternCategory) {
    query = query.eq('pattern_category', filters.patternCategory);
  }

  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,code.ilike.%${filters.search}%`);
  }

  const { data, error } = await query;

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getDecorById(id: string) {
  const { data, error } = await supabase
    .from('decors')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createDecor(decor: Omit<Decor, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('decors')
    .insert(decor)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateDecor(id: string, decor: Partial<Decor>) {
  const { data, error } = await supabase
    .from('decors')
    .update({ ...decor, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteDecor(id: string) {
  const { error } = await supabase
    .from('decors')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// News API
export async function getPublishedNews(limit?: number) {
  let query = supabase
    .from('news')
    .select('*')
    .eq('status', 'published')
    .order('published_date', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getAllNews() {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('published_date', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getNewsById(id: string) {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createNews(news: Omit<News, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('news')
    .insert(news)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateNews(id: string, news: Partial<News>) {
  const { data, error } = await supabase
    .from('news')
    .update({ ...news, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteNews(id: string) {
  const { error } = await supabase
    .from('news')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Contact Messages API
export async function createContactMessage(message: Omit<ContactMessage, 'id' | 'is_read' | 'created_at'>) {
  const { data, error } = await supabase
    .from('contact_messages')
    .insert(message)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getContactMessages() {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function markMessageAsRead(id: string) {
  const { error } = await supabase
    .from('contact_messages')
    .update({ is_read: true })
    .eq('id', id);

  if (error) throw error;
}

export async function deleteContactMessage(id: string) {
  const { error } = await supabase
    .from('contact_messages')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Site Content API
export async function getSiteContent() {
  const { data, error } = await supabase
    .from('site_content')
    .select('*');

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getSiteContentByKey(key: string) {
  const { data, error } = await supabase
    .from('site_content')
    .select('*')
    .eq('key', key)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateSiteContent(key: string, content: Partial<SiteContent>) {
  const { data, error } = await supabase
    .from('site_content')
    .update({ ...content, updated_at: new Date().toISOString() })
    .eq('key', key)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Statistics API for Admin Dashboard
export async function getStatistics() {
  const [products, decors, news, messages] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('decors').select('id', { count: 'exact', head: true }),
    supabase.from('news').select('id', { count: 'exact', head: true }),
    supabase.from('contact_messages').select('id', { count: 'exact', head: true })
  ]);

  return {
    products: products.count || 0,
    decors: decors.count || 0,
    news: news.count || 0,
    messages: messages.count || 0
  };
}
