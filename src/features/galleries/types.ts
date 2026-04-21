export interface Gallery {
  id: string;
  name: string;
  pin: string | null;
  cover_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface GalleryImage {
  id: string;
  gallery_id: string;
  url: string;
  full_res_url: string | null;
  display_order: number;
}
