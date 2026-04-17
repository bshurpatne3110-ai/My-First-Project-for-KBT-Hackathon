import { mockInventory } from '@/data/mockData';

export type InventoryItem = {
  id: string;
  item: string;
  category: string;
  quantity: number;
  unit: string;
  supplier: string;
  costPerUnit: number;
  status: string;
};

const INVENTORY_STORAGE_KEY = 'buildmaster-inventory';

export const getStoredInventory = (): InventoryItem[] => {
  if (typeof window === 'undefined') {
    return mockInventory;
  }

  const storedValue = localStorage.getItem(INVENTORY_STORAGE_KEY);
  if (!storedValue) {
    return mockInventory;
  }

  try {
    const parsedValue = JSON.parse(storedValue) as InventoryItem[];
    return Array.isArray(parsedValue) ? parsedValue : mockInventory;
  } catch {
    return mockInventory;
  }
};

export const saveStoredInventory = (inventory: InventoryItem[]) => {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(inventory));
};
