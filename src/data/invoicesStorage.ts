import { mockInvoices } from '@/data/mockData';

export type Invoice = {
  id: string;
  client: string;
  project: string;
  date: string;
  amount: number;
  status: string;
};

const INVOICES_STORAGE_KEY = 'buildmaster-invoices';

export const getStoredInvoices = (): Invoice[] => {
  if (typeof window === 'undefined') {
    return mockInvoices;
  }

  const storedValue = localStorage.getItem(INVOICES_STORAGE_KEY);
  if (!storedValue) {
    return mockInvoices;
  }

  try {
    const parsedValue = JSON.parse(storedValue) as Invoice[];
    return Array.isArray(parsedValue) ? parsedValue : mockInvoices;
  } catch {
    return mockInvoices;
  }
};

export const saveStoredInvoices = (invoices: Invoice[]) => {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(invoices));
};
