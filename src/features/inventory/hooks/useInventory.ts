import { useState, useCallback, useEffect } from 'react';
import { InventoryItem, InventoryMovement } from '../types';
import { getInventarios, createInventario, updateInventario as apiUpdateInventario, deleteInventario as apiDeleteInventario } from '../../../services/api';

export function useInventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getInventarios();
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const addItem = useCallback(async (data: Omit<InventoryItem, 'id' | 'registrationDate'>) => {
    setIsLoading(true);
    try {
      await createInventario(data);
      await fetchItems();
    } catch (error) {
      console.error('Error adding inventory item:', error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchItems]);

  const recordMovement = useCallback(async (itemId: string, type: 'Entrada' | 'Salida', quantity: number, reason: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    
    const newStock = type === 'Entrada' ? item.stock + quantity : item.stock - quantity;
    setIsLoading(true);
    try {
      await apiUpdateInventario(itemId, { stock: newStock });
      await fetchItems();
      
      const newMovement: InventoryMovement = {
        id: Math.random().toString(36).substr(2, 5),
        itemId,
        type,
        quantity,
        reason,
        date: new Date().toISOString()
      };
      setMovements(prev => [newMovement, ...prev]);
    } catch (error) {
      console.error('Error recording movement:', error);
    } finally {
      setIsLoading(false);
    }
  }, [items, fetchItems]);

  const getLowStockItems = useCallback(() => {
    return items.filter(item => item.stock <= item.minStock);
  }, [items]);

  const updateItem = useCallback(async (id: string, data: any) => {
    setIsLoading(true);
    try {
      await apiUpdateInventario(id, data);
      await fetchItems();
    } catch (error) {
      console.error('Error updating item:', error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchItems]);

  const deleteItem = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      await apiDeleteInventario(id);
      await fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchItems]);

  return {
    items,
    movements,
    isLoading,
    addItem,
    recordMovement,
    getLowStockItems,
    updateItem,
    deleteItem,
    refresh: fetchItems
  };
}
