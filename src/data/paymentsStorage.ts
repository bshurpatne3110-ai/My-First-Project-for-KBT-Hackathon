import { mockPayments } from '@/data/mockData';

export type Payment = {
  id: string;
  client: string;
  project: string;
  amount: number;
  date: string;
  status: string;
};

const PAYMENTS_STORAGE_KEY = 'buildmaster-payments';

export const getStoredPayments = (): Payment[] => {
  if (typeof window === 'undefined') {
    return mockPayments;
  }

  const storedValue = localStorage.getItem(PAYMENTS_STORAGE_KEY);
  if (!storedValue) {
    return mockPayments;
  }

  try {
    const parsedValue = JSON.parse(storedValue) as Payment[];
    return Array.isArray(parsedValue) ? parsedValue : mockPayments;
  } catch {
    return mockPayments;
  }
};

export const saveStoredPayments = (payments: Payment[]) => {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(payments));
};
