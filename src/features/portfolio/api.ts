import { supabase } from '../../lib/supabase';
import { PortfolioImage } from './types';

export const fetchPortfolio = async (): Promise<PortfolioImage[]> => {
  const { data, error } = await supabase
    .from('portfolio')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data || [];
};
