import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../config/queryClient';
import { getGalleryImages } from '../services/gallery.service';
import type { GalleryCategory } from '../types';

export function useGalleryImages(category?: GalleryCategory) {
  return useQuery({
    queryKey: queryKeys.gallery.list(category),
    queryFn: () => getGalleryImages(category),
  });
}
