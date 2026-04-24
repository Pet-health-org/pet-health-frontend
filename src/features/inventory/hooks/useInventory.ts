import { useState, useCallback } from 'react';
import { InventoryItem, InventoryMovement } from '../types';

const initialItems: InventoryItem[] = [
  {
    id: '1',
    code: 'VAC-001',
    name: 'Vacuna Antirrábica',
    description: 'Vacuna para rabia en caninos y felinos',
    category: 'Vacuna',
    presentation: 'Frasco 1ml',
    unit: 'unidades',
    stock: 5,
    minStock: 10,
    expiryDate: '2025-12-31',
    provider: 'Farvet S.A.',
    registrationDate: new Date().toISOString()
  },
  {
    id: '2',
    code: 'MED-001',
    name: 'Amoxicilina 250mg',
    description: 'Antibiótico de amplio espectro',
    category: 'Medicamento',
    presentation: 'Caja x 20 tabletas',
    unit: 'unidades',
    stock: 45,
    minStock: 15,
    expiryDate: '2024-08-20',
    provider: 'VetLogistics',
    registrationDate: new Date().toISOString()
  }
];

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

  return {
    items,
    movements,
    addItem,
    recordMovement,
    getLowStockItems
  };
}
