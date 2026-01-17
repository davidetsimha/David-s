import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../config/queryClient';
import { getEventFormulas, updateEventFormula } from '../services/formulas.service';
import type { UpdateEventFormulaDTO } from '../types';

export function useEventFormulas() {
  return useQuery({
    queryKey: queryKeys.eventFormulas.list(),
    queryFn: getEventFormulas,
  });
}

export function useUpdateEventFormula() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEventFormulaDTO }) =>
      updateEventFormula(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.eventFormulas.all });
    },
  });
}
