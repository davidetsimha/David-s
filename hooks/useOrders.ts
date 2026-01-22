import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/config/queryClient';
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  getRevenueByDateRange,
  getTopSellingProducts,
  getSalesByCategory,
  getOrdersByConfirmationStatus,
  confirmPlateauOrder,
  rejectPlateauOrder,
  updateOrderAdminNotes,
} from '@/services/orders.service';
import type { OrderStatus, CreateOrderDTO, ConfirmationStatus } from '@/types';

export function useOrders(status?: OrderStatus) {
  return useQuery({
    queryKey: queryKeys.orders.list(status),
    queryFn: () => getOrders(status),
    refetchInterval: 30000,
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: () => getOrderById(id),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOrderDTO) => createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      updateOrderStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(id) });
    },
  });
}

// Plateau order confirmation hooks

export function useOrdersByConfirmationStatus(confirmationStatus: ConfirmationStatus) {
  return useQuery({
    queryKey: ['orders', 'confirmation', confirmationStatus],
    queryFn: () => getOrdersByConfirmationStatus(confirmationStatus),
    refetchInterval: 30000,
  });
}

export function useConfirmPlateauOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      paymentLink,
      adminNotes,
    }: {
      id: string;
      paymentLink: string;
      adminNotes?: string;
    }) => confirmPlateauOrder(id, paymentLink, adminNotes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
  });
}

export function useRejectPlateauOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => rejectPlateauOrder(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
  });
}

export function useUpdateOrderAdminNotes() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes: string }) => updateOrderAdminNotes(id, notes),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(id) });
    },
  });
}

// Analytics hooks

export function useRevenueAnalytics(days: number) {
  return useQuery({
    queryKey: ['analytics', 'revenue', days],
    queryFn: () => getRevenueByDateRange(days),
    refetchInterval: 30000,
  });
}

export function useTopProducts(limit: number = 5) {
  return useQuery({
    queryKey: ['analytics', 'topProducts', limit],
    queryFn: () => getTopSellingProducts(limit),
    refetchInterval: 30000,
  });
}

export function useCategorySales() {
  return useQuery({
    queryKey: ['analytics', 'categorySales'],
    queryFn: getSalesByCategory,
    refetchInterval: 30000,
  });
}
