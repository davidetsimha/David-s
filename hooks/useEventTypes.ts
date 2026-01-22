import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/config/queryClient';
import {
  getEventTypes,
  updateEventType,
  type UpdateEventTypeDTO,
} from '@/services/eventTypes.service';

export function useEventTypes() {
  return useQuery({
    queryKey: queryKeys.eventTypes.list(),
    queryFn: getEventTypes,
  });
}

export function useUpdateEventType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEventTypeDTO }) =>
      updateEventType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.eventTypes.all });
    },
  });
}
