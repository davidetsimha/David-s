import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/config/queryClient';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkUpdateProductAvailability,
} from '@/services/products.service';
import type { ProductFilters, CreateProductDTO, Product } from '@/types';

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: () => getProducts(filters),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProductDTO) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateProductDTO> }) =>
      updateProduct(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(id) });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}

export function useToggleProductAvailability() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, available }: { id: string; available: boolean }) =>
      updateProduct(id, { available }),
    onMutate: async ({ id, available }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.products.all });
      const previousProducts = queryClient.getQueryData(queryKeys.products.list());

      queryClient.setQueryData(
        queryKeys.products.list(),
        (old: Product[] | undefined) =>
          old?.map((p) => (p.id === id ? { ...p, available } : p))
      );

      return { previousProducts };
    },
    onError: (_, __, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(queryKeys.products.list(), context.previousProducts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}

export function useBulkUpdateProductAvailability() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, available }: { ids: string[]; available: boolean }) =>
      bulkUpdateProductAvailability(ids, available),
    onMutate: async ({ ids, available }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.products.all });
      const previousProducts = queryClient.getQueryData(queryKeys.products.list());

      const idsSet = new Set(ids);
      queryClient.setQueryData(
        queryKeys.products.list(),
        (old: Product[] | undefined) =>
          old?.map((p) => (idsSet.has(p.id) ? { ...p, available } : p))
      );

      return { previousProducts };
    },
    onError: (_, __, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(queryKeys.products.list(), context.previousProducts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}
