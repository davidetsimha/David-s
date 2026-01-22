import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/config/queryClient';
import {
  getGalleryImages,
  createGalleryImage,
  deleteGalleryImage,
  type CreateGalleryImageDTO,
} from '@/services/gallery.service';
import type { GalleryCategory } from '@/types';

export function useGallery(category?: GalleryCategory) {
  return useQuery({
    queryKey: queryKeys.gallery.list(category),
    queryFn: () => getGalleryImages(category),
  });
}

// Alias pour compatibilité
export const useGalleryImages = useGallery;

export function useCreateGalleryImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateGalleryImageDTO) => createGalleryImage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.all });
    },
  });
}

export function useDeleteGalleryImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteGalleryImage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.all });
    },
  });
}
