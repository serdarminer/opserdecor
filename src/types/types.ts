// Database types for OPSERDECOR

export type UserRole = 'user' | 'admin';

export interface Profile {
  id: string;
  email: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name_tr: string;
  name_en: string;
  description_tr: string;
  description_en: string;
  usage_areas_tr: string | null;
  usage_areas_en: string | null;
  technical_specs_tr: string | null;
  technical_specs_en: string | null;
  image_url: string | null;
  category: 'finish_foil' | 'decorative_paper' | 'pp_foil';
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Decor {
  id: string;
  name: string;
  code: string;
  description_tr: string | null;
  description_en: string | null;
  image_url: string;
  color_group: string | null;
  pattern_category: string | null;
  compatible_product_type: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface News {
  id: string;
  title_tr: string;
  title_en: string;
  content_tr: string;
  content_en: string;
  cover_image_url: string | null;
  published_date: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface SiteContent {
  id: string;
  key: string;
  content_tr: string;
  content_en: string;
  image_url: string | null;
  updated_at: string;
}

export type Language = 'tr' | 'en';

export interface DecorFilters {
  productType?: string;
  colorGroup?: string;
  patternCategory?: string;
  search?: string;
}
