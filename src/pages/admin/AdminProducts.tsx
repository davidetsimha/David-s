import { useState, useMemo } from 'react';
import { Plus, Search, LayoutGrid, List, SlidersHorizontal } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';
import { ConfirmModal } from '../../components/admin/ConfirmModal';
import { ProductsTable } from '../../components/admin/ProductsTable';
import { ProductCard } from '../../components/admin/ProductCard';
import { ProductForm } from '../../components/admin/ProductForm';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, useToggleProductAvailability } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import type { Product, CreateProductDTO } from '../../types';

type ViewMode = 'grid' | 'list';
type SortKey = 'name' | 'price' | 'category';
type SortDirection = 'asc' | 'desc';
type AvailabilityFilter = 'all' | 'available' | 'hidden';

interface SortOption {
  value: string;
  label: string;
  key: SortKey;
  direction: SortDirection;
}

const sortOptions: SortOption[] = [
  { value: 'name_asc', label: 'Nom A-Z', key: 'name', direction: 'asc' },
  { value: 'name_desc', label: 'Nom Z-A', key: 'name', direction: 'desc' },
  { value: 'price_asc', label: 'Prix croissant', key: 'price', direction: 'asc' },
  { value: 'price_desc', label: 'Prix decroissant', key: 'price', direction: 'desc' },
];

const availabilityOptions = [
  { value: 'all', label: 'Tous les statuts' },
  { value: 'available', label: 'Disponible' },
  { value: 'hidden', label: 'Masque' },
];

export function AdminProducts() {
  const { data: products, isLoading } = useProducts();
  const { data: categories } = useCategories();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();
  const toggleAvailabilityMutation = useToggleProductAvailability();

  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Filters & View
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<AvailabilityFilter>('all');
  const [sortValue, setSortValue] = useState('name_asc');
  const [showFilters, setShowFilters] = useState(false);

  const currentSort = sortOptions.find(s => s.value === sortValue) ?? sortOptions[0];

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let result = [...products];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name_fr.toLowerCase().includes(q) || p.name_he.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (categoryFilter) {
      result = result.filter(p => p.category_id === categoryFilter);
    }

    // Availability filter
    if (availabilityFilter !== 'all') {
      result = result.filter(p =>
        availabilityFilter === 'available' ? p.available : !p.available
      );
    }

    // Sort
    result.sort((a, b) => {
      const dir = currentSort.direction === 'asc' ? 1 : -1;
      switch (currentSort.key) {
        case 'name':
          return a.name_fr.localeCompare(b.name_fr) * dir;
        case 'price':
          return (a.price - b.price) * dir;
        case 'category':
          return (a.category?.name_fr ?? '').localeCompare(b.category?.name_fr ?? '') * dir;
        default:
          return 0;
      }
    });

    return result;
  }, [products, search, categoryFilter, availabilityFilter, currentSort]);

  const categoryOptions = [
    { value: '', label: 'Toutes les categories' },
    ...(categories?.map(c => ({ value: c.id, label: c.name_fr })) ?? []),
  ];

  const openCreate = () => { setEditProduct(undefined); setModalOpen(true); };
  const openEdit = (p: Product) => { setEditProduct(p); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditProduct(undefined); };

  const handleSubmit = (data: CreateProductDTO) => {
    setError(null);
    if (editProduct) {
      updateMutation.mutate({ id: editProduct.id, data }, {
        onSuccess: closeModal,
        onError: (err) => setError(err instanceof Error ? err.message : 'Erreur lors de la mise a jour'),
      });
    } else {
      createMutation.mutate(data, {
        onSuccess: closeModal,
        onError: (err) => setError(err instanceof Error ? err.message : 'Erreur lors de la creation'),
      });
    }
  };

  const handleDelete = () => {
    if (deleteId) deleteMutation.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
  };

  const handleToggleAvailability = (id: string, available: boolean) => {
    toggleAvailabilityMutation.mutate({ id, available });
  };

  const handleSort = (key: SortKey) => {
    const current = sortOptions.find(s => s.value === sortValue);
    if (current?.key === key) {
      // Toggle direction
      const newDir = current.direction === 'asc' ? 'desc' : 'asc';
      const newOption = sortOptions.find(s => s.key === key && s.direction === newDir);
      if (newOption) setSortValue(newOption.value);
    } else {
      const newOption = sortOptions.find(s => s.key === key);
      if (newOption) setSortValue(newOption.value);
    }
  };

  const activeFiltersCount = [categoryFilter, availabilityFilter !== 'all'].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Produits</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {products?.length ?? 0} produit{(products?.length ?? 0) > 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4" />
          Ajouter
        </Button>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Toolbar */}
      <Card padding="sm" variant="bordered">
        <div className="flex flex-col gap-3">
          {/* Search and view toggle */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9 ps-9 pe-3 rounded-lg border border-gray-200 text-sm
                  placeholder:text-gray-400 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-100
                  transition-all"
              />
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`
                relative h-9 px-3 rounded-lg border text-sm font-medium transition-all
                flex items-center gap-2
                ${showFilters || activeFiltersCount > 0
                  ? 'border-gold-300 bg-gold-50 text-gold-700'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }
              `}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filtres</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-gold-500 text-white text-xs flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* View toggle */}
            <div className="flex rounded-lg border border-gray-200 p-0.5">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                aria-label="Vue liste"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                aria-label="Vue grille"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filters row */}
          {showFilters && (
            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-gray-100">
              <div className="w-48">
                <Select
                  options={categoryOptions}
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  selectSize="sm"
                  placeholder="Categorie"
                />
              </div>
              <div className="w-40">
                <Select
                  options={availabilityOptions}
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value as AvailabilityFilter)}
                  selectSize="sm"
                />
              </div>
              <div className="w-44">
                <Select
                  options={sortOptions.map(s => ({ value: s.value, label: s.label }))}
                  value={sortValue}
                  onChange={(e) => setSortValue(e.target.value)}
                  selectSize="sm"
                />
              </div>
              {activeFiltersCount > 0 && (
                <button
                  onClick={() => {
                    setCategoryFilter('');
                    setAvailabilityFilter('all');
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Reinitialiser
                </button>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Products View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-gray-100" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-8 bg-gray-100 rounded" />
                </div>
              </div>
            ))
          ) : filteredProducts.length === 0 ? (
            <div className="col-span-full py-12 text-center">
              <p className="text-sm text-gray-500">Aucun produit trouve</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={openEdit}
                onDelete={setDeleteId}
                onToggleAvailability={handleToggleAvailability}
              />
            ))
          )}
        </div>
      ) : (
        <Card padding="none">
          <ProductsTable
            products={filteredProducts}
            loading={isLoading}
            onEdit={openEdit}
            onDelete={setDeleteId}
            onToggleAvailability={handleToggleAvailability}
            sortKey={currentSort.key}
            sortDirection={currentSort.direction}
            onSort={handleSort}
          />
        </Card>
      )}

      {/* Modals */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editProduct ? 'Modifier le produit' : 'Nouveau produit'}
        size="lg"
      >
        <ProductForm
          product={editProduct}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          loading={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>

      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Supprimer le produit"
        message="Etes-vous sur de vouloir supprimer ce produit ? Cette action est irreversible."
        confirmText="Supprimer"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
