import { useState, useEffect } from 'react';
import { fetchPortfolio } from './api';
import { PortfolioImage } from './types';

export const usePortfolio = () => {
  const [data, setData] = useState<PortfolioImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchPortfolio()
      .then(setData)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, []);

  return { data, isLoading, error };
};
