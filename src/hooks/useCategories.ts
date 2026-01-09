import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../config/queryClient';
import { getCategories } from '../services/categories.service';

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.list(),
    queryFn: getCategories,
  });
}
