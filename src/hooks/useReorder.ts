import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores';
import { getProductById } from '../services/products.service';
import { ROUTES } from '../config/routes';
import type { Order } from '../types';
import type { ReorderAction } from '../components/checkout/ReorderConfirmDialog';

interface ReorderResult {
  success: boolean;
  addedItems: number;
  unavailableItems: string[];
}

export function useReorder() {
  const navigate = useNavigate();
  const { items: cartItems, addItem, clearCart } = useCartStore();
  const [isReordering, setIsReordering] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<Order | null>(null);

  const processReorder = useCallback(async (
    order: Order,
    action: ReorderAction
  ): Promise<ReorderResult> => {
    if (action === 'cancel') {
      return { success: false, addedItems: 0, unavailableItems: [] };
    }

    setIsReordering(true);
    const unavailableItems: string[] = [];
    let addedItems = 0;

    try {
      // Clear cart if replacing
      if (action === 'replace') {
        clearCart();
      }

      // Process each item from the order
      if (order.items && order.items.length > 0) {
        for (const orderItem of order.items) {
          if (!orderItem.product_id) {
            unavailableItems.push(orderItem.product_name_fr);
            continue;
          }

          try {
            // Fetch current product to get up-to-date info and prices
            const product = await getProductById(orderItem.product_id);

            // Check if product is still available
            if (!product.available) {
              unavailableItems.push(product.name_fr);
              continue;
            }

            // Add to cart with current price
            const result = addItem(product, orderItem.quantity);
            if (result.valid) {
              addedItems += orderItem.quantity;
            } else {
              // Cart validation failed (e.g., mixed cart not allowed)
              unavailableItems.push(product.name_fr);
            }
          } catch {
            // Product not found or error
            unavailableItems.push(orderItem.product_name_fr);
          }
        }
      }

      return {
        success: addedItems > 0,
        addedItems,
        unavailableItems,
      };
    } finally {
      setIsReordering(false);
    }
  }, [addItem, clearCart]);

  const initiateReorder = useCallback((order: Order) => {
    // Check if cart has items
    if (cartItems.length > 0) {
      setPendingOrder(order);
      setShowConfirmDialog(true);
    } else {
      // Cart is empty, proceed directly
      handleReorderAction(order, 'replace');
    }
  }, [cartItems.length]);

  const handleReorderAction = useCallback(async (
    order: Order,
    action: ReorderAction
  ) => {
    setShowConfirmDialog(false);

    if (action === 'cancel') {
      setPendingOrder(null);
      return;
    }

    const result = await processReorder(order, action);
    setPendingOrder(null);

    if (result.success) {
      // Navigate to checkout
      navigate(ROUTES.CHECKOUT);
    }

    return result;
  }, [processReorder, navigate]);

  const handleDialogAction = useCallback((action: ReorderAction) => {
    if (pendingOrder) {
      handleReorderAction(pendingOrder, action);
    } else {
      setShowConfirmDialog(false);
    }
  }, [pendingOrder, handleReorderAction]);

  const closeDialog = useCallback(() => {
    setShowConfirmDialog(false);
    setPendingOrder(null);
  }, []);

  return {
    isReordering,
    showConfirmDialog,
    initiateReorder,
    handleDialogAction,
    closeDialog,
  };
}
