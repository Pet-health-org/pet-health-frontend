export type ItemCategory = 'Medicamento' | 'Vacuna' | 'Insumo';

export interface InventoryItem {
  id: string;
  code: string;
  name: string;
  description: string;
  category: ItemCategory;
  presentation: string;
  unit: string; // ml, mg, unidades, etc.
  stock: number;
  minStock: number;
  expiryDate: string;
  provider: string;
  registrationDate: string;
}

export interface InventoryMovement {
  id: string;
  itemId: string;
  type: 'Entrada' | 'Salida';
  quantity: number;
  reason: string; // Ej: "Consulta #123", "Compra a proveedor"
  date: string;
}
