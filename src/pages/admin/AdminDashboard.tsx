import { ShoppingBag, MessageSquare, DollarSign, TrendingUp } from 'lucide-react';
import { StatsCard } from '../../components/admin/StatsCard';
import { DataTable } from '../../components/admin/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { useOrders } from '../../hooks/useOrders';
import { useQuotes } from '../../hooks/useQuotes';
import { RevenueChart, TopProductsChart, ConversionStats, EventTypeChart } from '../../components/admin/charts';
import type { Order, QuoteRequest } from '../../types';

export function AdminDashboard() {
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const { data: quotes, isLoading: quotesLoading } = useQuotes();

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const todayOrders = orders?.filter((o) => {
    return new Date(o.created_at).toDateString() === today.toDateString();
  }) ?? [];

  const yesterdayOrders = orders?.filter((o) => {
    return new Date(o.created_at).toDateString() === yesterday.toDateString();
  }) ?? [];

  const pendingQuotes = quotes?.filter((q) => q.status === 'new') ?? [];
  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total_amount, 0);
  const yesterdayRevenue = yesterdayOrders.reduce((sum, o) => sum + o.total_amount, 0);
  const recentOrders = orders?.slice(0, 5) ?? [];

  // Calculer les tendances réelles
  const ordersTrend = yesterdayOrders.length > 0
    ? Math.round(((todayOrders.length - yesterdayOrders.length) / yesterdayOrders.length) * 100)
    : todayOrders.length > 0 ? 100 : 0;

  const revenueTrend = yesterdayRevenue > 0
    ? Math.round(((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100)
    : todayRevenue > 0 ? 100 : 0;

  const orderColumns = [
    { key: 'id', header: 'Commande', render: (o: Order) => <span className="font-mono text-sm">#{o.id.slice(0, 8)}</span> },
    { key: 'customer', header: 'Client', render: (o: Order) => o.customer_name },
    { key: 'status', header: 'Statut', render: (o: Order) => <Badge status={o.status}>{o.status}</Badge> },
    { key: 'total', header: 'Total', render: (o: Order) => `${o.total_amount.toFixed(2)} ₪` },
  ];

  const quoteColumns = [
    { key: 'name', header: 'Nom', render: (q: QuoteRequest) => q.name },
    { key: 'event', header: 'Evenement', render: (q: QuoteRequest) => q.event_type.replace('_', ' ') },
    { key: 'guests', header: 'Invites', render: (q: QuoteRequest) => q.guest_count },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-gray-900">Tableau de bord</h1>
        <p className="text-gray-500 mt-1">Bienvenue chez David's Patisserie</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={<ShoppingBag className="w-5 h-5" />}
          label="Commandes du jour"
          value={todayOrders.length}
          trend={ordersTrend !== 0 ? { value: ordersTrend, label: 'vs hier' } : undefined}
        />
        <StatsCard icon={<MessageSquare className="w-5 h-5" />} label="Devis en attente" value={pendingQuotes.length} />
        <StatsCard
          icon={<DollarSign className="w-5 h-5" />}
          label="CA du jour"
          value={`${todayRevenue.toFixed(0)} ₪`}
          trend={revenueTrend !== 0 ? { value: revenueTrend, label: 'vs hier' } : undefined}
        />
        <StatsCard icon={<TrendingUp className="w-5 h-5" />} label="Total commandes" value={orders?.length ?? 0} />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <TopProductsChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConversionStats />
        <EventTypeChart />
      </div>

      {/* Recent Activity Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card padding="none" hover={false}>
          <CardHeader className="p-6 pb-0">
            <CardTitle>Commandes recentes</CardTitle>
          </CardHeader>
          <DataTable columns={orderColumns} data={recentOrders} loading={ordersLoading} keyExtractor={(o) => o.id} emptyMessage="Aucune commande" />
        </Card>

        <Card padding="none" hover={false}>
          <CardHeader className="p-6 pb-0">
            <CardTitle>Devis en attente</CardTitle>
          </CardHeader>
          <DataTable columns={quoteColumns} data={pendingQuotes.slice(0, 5)} loading={quotesLoading} keyExtractor={(q) => q.id} emptyMessage="Aucun devis en attente" />
        </Card>
      </div>
    </div>
  );
}
