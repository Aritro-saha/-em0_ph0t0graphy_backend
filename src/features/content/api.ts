import { supabase } from '../../lib/supabase';

export const fetchContent = async (section: string, key: string): Promise<any> => {
  const { data, error } = await supabase
    .from('content')
    .select('value')
    .eq('section', section)
    .eq('key', key)
    .single();

  if (error) throw error;
  return data?.value || null;
};
