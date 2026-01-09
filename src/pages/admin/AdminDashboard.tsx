import { ShoppingBag, MessageSquare, DollarSign, TrendingUp } from 'lucide-react';
import { StatsCard } from '../../components/admin/StatsCard';
import { DataTable } from '../../components/admin/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { useOrders } from '../../hooks/useOrders';
import { useQuotes } from '../../hooks/useQuotes';
import type { Order, QuoteRequest } from '../../types';

export function AdminDashboard() {
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const { data: quotes, isLoading: quotesLoading } = useQuotes();

  const todayOrders = orders?.filter((o) => {
    const today = new Date().toDateString();
    return new Date(o.created_at).toDateString() === today;
  }) ?? [];

  const pendingQuotes = quotes?.filter((q) => q.status === 'new') ?? [];
  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total_amount, 0);
  const recentOrders = orders?.slice(0, 5) ?? [];

  const orderColumns = [
    { key: 'id', header: 'Order', render: (o: Order) => <span className="font-mono text-sm">#{o.id.slice(0, 8)}</span> },
    { key: 'customer', header: 'Customer', render: (o: Order) => o.customer_name },
    { key: 'status', header: 'Status', render: (o: Order) => <Badge status={o.status}>{o.status}</Badge> },
    { key: 'total', header: 'Total', render: (o: Order) => `${o.total_amount.toFixed(2)} ILS` },
  ];

  const quoteColumns = [
    { key: 'name', header: 'Name', render: (q: QuoteRequest) => q.name },
    { key: 'event', header: 'Event', render: (q: QuoteRequest) => q.event_type.replace('_', ' ') },
    { key: 'guests', header: 'Guests', render: (q: QuoteRequest) => q.guest_count },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back to David's Patisserie</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard icon={<ShoppingBag className="w-5 h-5" />} label="Orders Today" value={todayOrders.length} trend={{ value: 12, label: 'vs yesterday' }} />
        <StatsCard icon={<MessageSquare className="w-5 h-5" />} label="Pending Quotes" value={pendingQuotes.length} />
        <StatsCard icon={<DollarSign className="w-5 h-5" />} label="Today's Revenue" value={`${todayRevenue.toFixed(0)} ILS`} trend={{ value: 8, label: 'vs yesterday' }} />
        <StatsCard icon={<TrendingUp className="w-5 h-5" />} label="Total Orders" value={orders?.length ?? 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card padding="none" hover={false}>
          <CardHeader className="p-6 pb-0">
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <DataTable columns={orderColumns} data={recentOrders} loading={ordersLoading} keyExtractor={(o) => o.id} emptyMessage="No orders yet" />
        </Card>

        <Card padding="none" hover={false}>
          <CardHeader className="p-6 pb-0">
            <CardTitle>Pending Quotes</CardTitle>
          </CardHeader>
          <DataTable columns={quoteColumns} data={pendingQuotes.slice(0, 5)} loading={quotesLoading} keyExtractor={(q) => q.id} emptyMessage="No pending quotes" />
        </Card>
      </div>
    </div>
  );
}
