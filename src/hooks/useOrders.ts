import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../config/queryClient';
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  getRevenueByDateRange,
  getTopSellingProducts,
  getSalesByCategory,
} from '../services/orders.service';
import type { OrderStatus, CreateOrderDTO } from '../types';

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
