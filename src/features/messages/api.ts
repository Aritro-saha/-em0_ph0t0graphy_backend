import { supabase } from '../../lib/supabase';
import { Message } from './types';

export const submitMessage = async (message: Message): Promise<void> => {
  const { error } = await supabase
    .from('messages')
    .insert([message]);

  if (error) throw error;
};
