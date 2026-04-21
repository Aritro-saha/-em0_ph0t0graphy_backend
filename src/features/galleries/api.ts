import { supabase } from '../../lib/supabase';
import { Gallery, GalleryImage } from './types';

export const fetchGalleries = async (): Promise<Gallery[]> => {
  const { data, error } = await supabase
    .from('galleries')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const fetchGalleryImages = async (galleryId: string): Promise<GalleryImage[]> => {
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .eq('gallery_id', galleryId)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const validatePin = async (galleryId: string, pin: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('galleries')
    .select('id')
    .eq('id', galleryId)
    .eq('pin', pin)
    .single();

  if (error) return false;
  return !!data;
};
