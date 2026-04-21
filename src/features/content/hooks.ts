import { useState, useEffect } from 'react';
import { fetchContent } from './api';

export const useContent = <T>(section: string, key: string) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchContent(section, key)
      .then(setData)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [section, key]);

  return { data, isLoading, error };
};
