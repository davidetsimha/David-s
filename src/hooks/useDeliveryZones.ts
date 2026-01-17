import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../config/queryClient';
import {
  getDeliveryZones,
  getDeliveryZoneById,
  createDeliveryZone,
  updateDeliveryZone,
  deleteDeliveryZone,
  toggleDeliveryZoneActive,
  type CreateDeliveryZoneDTO,
} from '../services/delivery.service';

export function useDeliveryZones(activeOnly = true) {
  return useQuery({
    queryKey: queryKeys.deliveryZones.list(activeOnly),
    queryFn: () => getDeliveryZones(activeOnly),
  });
}

export function useDeliveryZone(id: string) {
  return useQuery({
    queryKey: queryKeys.deliveryZones.detail(id),
    queryFn: () => getDeliveryZoneById(id),
    enabled: !!id,
  });
}

export function useCreateDeliveryZone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDeliveryZoneDTO) => createDeliveryZone(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.deliveryZones.all });
    },
  });
}

export function useUpdateDeliveryZone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateDeliveryZoneDTO> }) =>
      updateDeliveryZone(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.deliveryZones.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.deliveryZones.detail(id) });
    },
  });
}

export function useDeleteDeliveryZone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDeliveryZone(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.deliveryZones.all });
    },
  });
}

export function useToggleDeliveryZoneActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      toggleDeliveryZoneActive(id, active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.deliveryZones.all });
    },
  });
}
