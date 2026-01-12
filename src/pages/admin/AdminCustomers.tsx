import { useState, useMemo } from 'react';
import {
  Search,
  Loader2,
  User,
  Mail,
  Phone,
  ShoppingBag,
  Calendar,
  ArrowUpDown,
  ChevronRight,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { useCustomers, useCustomerOrders } from '../../hooks/useCustomers';
import type { Customer } from '../../types';
import type { OrderStatus } from '../../types';

type SortField = 'name' | 'total_orders' | 'total_spent' | 'last_order_date';
type SortOrder = 'asc' | 'desc';

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'En attente',
  confirmed: 'Confirmee',
  completed: 'Terminee',
  cancelled: 'Annulee',
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export function AdminCustomers() {
  const { data: customers, isLoading } = useCustomers();
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('total_spent');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = useMemo(() => {
    if (!customers) return [];

    let result = customers.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search)
    );

    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'total_orders':
          comparison = a.total_orders - b.total_orders;
          break;
        case 'total_spent':
          comparison = a.total_spent - b.total_spent;
          break;
        case 'last_order_date':
          comparison = new Date(a.last_order_date).getTime() - new Date(b.last_order_date).getTime();
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [customers, search, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const totalRevenue = customers?.reduce((sum, c) => sum + c.total_spent, 0) ?? 0;
  const totalCustomers = customers?.length ?? 0;
  const avgOrderValue = totalCustomers > 0 ? totalRevenue / (customers?.reduce((sum, c) => sum + c.total_orders, 0) ?? 1) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl lg:text-3xl text-gray-900">Clients</h1>
        <p className="text-gray-500 mt-1">{totalCustomers} clients | CA total: {formatCurrency(totalRevenue)}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <p className="text-sm text-gray-500">Clients</p>
          <p className="text-2xl font-semibold text-gray-900">{totalCustomers}</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-sm text-gray-500">CA Total</p>
          <p className="text-2xl font-semibold text-gold-600">{formatCurrency(totalRevenue)}</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-sm text-gray-500">Panier moyen</p>
          <p className="text-2xl font-semibold text-gray-900">{formatCurrency(avgOrderValue)}</p>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par nom, email ou telephone..."
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
        </div>
      ) : filteredCustomers.length === 0 ? (
        <Card className="text-center py-12">
          <User className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">
            {search ? 'Aucun client trouve' : 'Aucun client pour le moment'}
          </p>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-1 hover:text-gray-900"
                  >
                    Client
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 hidden md:table-cell">Contact</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">
                  <button
                    onClick={() => handleSort('total_orders')}
                    className="flex items-center gap-1 hover:text-gray-900 mx-auto"
                  >
                    Commandes
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">
                  <button
                    onClick={() => handleSort('total_spent')}
                    className="flex items-center gap-1 hover:text-gray-900 ml-auto"
                  >
                    CA
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 hidden sm:table-cell">
                  <button
                    onClick={() => handleSort('last_order_date')}
                    className="flex items-center gap-1 hover:text-gray-900 ml-auto"
                  >
                    Derniere cmd
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.email}
                  onClick={() => setSelectedCustomer(customer)}
                  className="border-b border-gray-100 hover:bg-gold-50/50 cursor-pointer transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-gold-600 font-medium">
                          {customer.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{customer.name}</p>
                        <p className="text-sm text-gray-500 truncate md:hidden">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 hidden md:table-cell">
                    <p className="text-sm text-gray-600">{customer.email}</p>
                    <p className="text-sm text-gray-400">{customer.phone}</p>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-sm">
                      <ShoppingBag className="w-3 h-3" />
                      {customer.total_orders}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="font-medium text-gold-600">{formatCurrency(customer.total_spent)}</span>
                  </td>
                  <td className="py-4 px-4 text-right text-sm text-gray-500 hidden sm:table-cell">
                    {formatDate(customer.last_order_date)}
                  </td>
                  <td className="py-4 px-4">
                    <ChevronRight className="w-5 h-5 text-gray-300" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
}

function CustomerDetailModal({
  customer,
  onClose,
}: {
  customer: Customer;
  onClose: () => void;
}) {
  const { data: orders, isLoading } = useCustomerOrders(customer.email);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Modal open={true} onClose={onClose} title="Detail client">
      <div className="space-y-6">
        {/* Customer Info */}
        <div className="flex items-start gap-4 pb-4 border-b">
          <div className="w-16 h-16 rounded-full bg-gold-100 flex items-center justify-center">
            <span className="text-gold-600 font-semibold text-2xl">
              {customer.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-medium text-gray-900">{customer.name}</h3>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
              <a href={`mailto:${customer.email}`} className="flex items-center gap-1 hover:text-gold-600">
                <Mail className="w-4 h-4" />
                {customer.email}
              </a>
              {customer.phone && (
                <a href={`tel:${customer.phone}`} className="flex items-center gap-1 hover:text-gold-600">
                  <Phone className="w-4 h-4" />
                  {customer.phone}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-semibold text-gray-900">{customer.total_orders}</p>
            <p className="text-xs text-gray-500">Commandes</p>
          </div>
          <div className="text-center p-3 bg-gold-50 rounded-lg">
            <p className="text-2xl font-semibold text-gold-600">{formatCurrency(customer.total_spent)}</p>
            <p className="text-xs text-gray-500">CA Total</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-semibold text-gray-900">
              {formatCurrency(customer.total_spent / customer.total_orders)}
            </p>
            <p className="text-xs text-gray-500">Panier moyen</p>
          </div>
        </div>

        {/* Order History */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Historique des commandes</h4>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gold-500" />
            </div>
          ) : orders?.length === 0 ? (
            <p className="text-center text-gray-500 py-4">Aucune commande</p>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {orders?.map((order) => (
                <div key={order.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{formatDate(order.created_at)}</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status]}`}>
                      {STATUS_LABELS[order.status]}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      {order.items?.length ?? 0} article{(order.items?.length ?? 0) > 1 ? 's' : ''}
                    </p>
                    <p className="font-medium text-gold-600">{formatCurrency(order.total_amount)}</p>
                  </div>
                  {order.items && order.items.length > 0 && (
                    <div className="mt-2 text-xs text-gray-500">
                      {order.items.map((item) => (
                        <span key={item.id}>
                          {item.product_name_fr} x{item.quantity}
                          {order.items!.indexOf(item) < order.items!.length - 1 && ', '}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
