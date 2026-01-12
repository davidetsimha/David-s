import { useQuery } from '@tanstack/react-query';
import { getCustomers, getCustomerOrders } from '../services/customers.service';

export function useCustomers() {
  return useQuery({
    queryKey: ['customers'],
    queryFn: getCustomers,
  });
}

export function useCustomerOrders(email: string) {
  return useQuery({
    queryKey: ['customers', email, 'orders'],
    queryFn: () => getCustomerOrders(email),
    enabled: !!email,
  });
}
