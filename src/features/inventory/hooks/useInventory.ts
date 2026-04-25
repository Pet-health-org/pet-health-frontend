import { useState, useCallback } from 'react';
import { InventoryItem, InventoryMovement } from '../types';

const initialItems: InventoryItem[] = [];

export function useInventory() {
  const [items, setItems] = useState<InventoryItem[]>(initialItems);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);

  const addItem = useCallback((data: Omit<InventoryItem, 'id' | 'registrationDate'>) => {
    const newItem: InventoryItem = {
      ...data,
      id: Math.random().toString(36).substr(2, 5),
      registrationDate: new Date().toISOString(),
    };
    setItems(prev => [...prev, newItem]);
  }, []);

  const recordMovement = useCallback((itemId: string, type: 'Entrada' | 'Salida', quantity: number, reason: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const newStock = type === 'Entrada' ? item.stock + quantity : item.stock - quantity;
        return { ...item, stock: newStock };
      }
      return item;
    }));

    const newMovement: InventoryMovement = {
      id: Math.random().toString(36).substr(2, 5),
      itemId,
      type,
      quantity,
      reason,
      date: new Date().toISOString()
    };
    setMovements(prev => [newMovement, ...prev]);
  }, []);

  const getLowStockItems = useCallback(() => {
    return items.filter(item => item.stock <= item.minStock);
  }, [items]);

  const updateItem = useCallback((id: string, data: any) => {
    // Stub
  }, []);

  const deleteItem = useCallback((id: string) => {
    // Stub
  }, []);

  return {
    items,
    movements,
    addItem,
    recordMovement,
    getLowStockItems,
    updateItem,
    deleteItem
  };
}
