import { supabase } from './supabase';

export async function uploadImage(
  file: File,
  bucket: 'portfolio' | 'galleries',
  userId: string,
  folder: string = ''
) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = folder ? `${userId}/${folder}/${fileName}` : `${userId}/${fileName}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return { path: data.path, url: publicUrl };
}

export async function deleteImage(bucket: string, path: string) {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);
  
  if (error) throw error;
}
