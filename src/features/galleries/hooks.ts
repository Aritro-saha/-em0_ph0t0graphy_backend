import { useState, useEffect } from 'react';
import { fetchGalleries, fetchGalleryImages } from './api';
import { Gallery, GalleryImage } from './types';

export const useGalleries = () => {
  const [data, setData] = useState<Gallery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchGalleries()
      .then(setData)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, []);

  return { data, isLoading, error };
};

export const useGalleryImages = (galleryId: string | undefined) => {
  const [data, setData] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!galleryId) return;
    fetchGalleryImages(galleryId)
      .then(setData)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [galleryId]);

  return { data, isLoading, error };
};
