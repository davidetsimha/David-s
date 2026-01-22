import { useState, useCallback } from 'react';

interface UseSelectionReturn {
  selectedIds: Set<string>;
  selectedCount: number;
  isSelected: (id: string) => boolean;
  isAllSelected: boolean;
  isIndeterminate: boolean;
  toggle: (id: string) => void;
  toggleAll: (allIds: string[]) => void;
  selectMany: (ids: string[]) => void;
  deselectMany: (ids: string[]) => void;
  clearSelection: () => void;
  getSelectedIds: () => string[];
}

export function useSelection(initialIds?: string[]): UseSelectionReturn {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() =>
    new Set(initialIds ?? [])
  );

  const selectedCount = selectedIds.size;

  const isSelected = useCallback((id: string) => selectedIds.has(id), [selectedIds]);

  const toggle = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const toggleAll = useCallback((allIds: string[]) => {
    setSelectedIds((prev) => {
      const allSelected = allIds.every((id) => prev.has(id));
      if (allSelected) {
        // Deselect all
        const next = new Set(prev);
        allIds.forEach((id) => next.delete(id));
        return next;
      } else {
        // Select all
        const next = new Set(prev);
        allIds.forEach((id) => next.add(id));
        return next;
      }
    });
  }, []);

  const selectMany = useCallback((ids: string[]) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.add(id));
      return next;
    });
  }, []);

  const deselectMany = useCallback((ids: string[]) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.delete(id));
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const getSelectedIds = useCallback(() => Array.from(selectedIds), [selectedIds]);

  // These are computed based on a specific list of items (provided externally)
  // We'll compute them dynamically with useMemo when needed
  const isAllSelected = false; // Will be computed in component
  const isIndeterminate = false; // Will be computed in component

  return {
    selectedIds,
    selectedCount,
    isSelected,
    isAllSelected,
    isIndeterminate,
    toggle,
    toggleAll,
    selectMany,
    deselectMany,
    clearSelection,
    getSelectedIds,
  };
}

// Helper to compute selection state for a list of items
export function computeSelectionState(selectedIds: Set<string>, itemIds: string[]) {
  if (itemIds.length === 0) {
    return { isAllSelected: false, isIndeterminate: false };
  }

  const selectedInList = itemIds.filter((id) => selectedIds.has(id));
  const isAllSelected = selectedInList.length === itemIds.length;
  const isIndeterminate = selectedInList.length > 0 && selectedInList.length < itemIds.length;

  return { isAllSelected, isIndeterminate };
}
