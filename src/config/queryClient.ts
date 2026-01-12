import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export const queryKeys = {
  products: {
    all: ['products'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.products.all, 'list', filters] as const,
    detail: (id: string) => [...queryKeys.products.all, 'detail', id] as const,
  },
  categories: {
    all: ['categories'] as const,
    list: () => [...queryKeys.categories.all, 'list'] as const,
  },
  orders: {
    all: ['orders'] as const,
    list: (status?: string) => [...queryKeys.orders.all, 'list', status] as const,
    detail: (id: string) => [...queryKeys.orders.all, 'detail', id] as const,
  },
  quotes: {
    all: ['quotes'] as const,
    list: () => [...queryKeys.quotes.all, 'list'] as const,
  },
  gallery: {
    all: ['gallery'] as const,
    list: (category?: string) => [...queryKeys.gallery.all, 'list', category] as const,
  },
  faqs: {
    all: ['faqs'] as const,
    list: () => [...queryKeys.faqs.all, 'list'] as const,
  },
  creations: {
    all: ['creations'] as const,
    list: () => [...queryKeys.creations.all, 'list'] as const,
  },
  eventTypes: {
    all: ['eventTypes'] as const,
    list: () => [...queryKeys.eventTypes.all, 'list'] as const,
  },
} as const;
