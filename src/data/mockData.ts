export const mockProjects = [
  { id: 'PRJ-001', name: 'Skyline Tower', status: 'In Progress', budget: 5000000, spent: 2100000, progress: 45 },
  { id: 'PRJ-002', name: 'Riverside Complex', status: 'Planning', budget: 3500000, spent: 150000, progress: 5 },
  { id: 'PRJ-003', name: 'Oceanview Villas', status: 'In Progress', budget: 8000000, spent: 6500000, progress: 80 },
  { id: 'PRJ-004', name: 'Metro Station Upgrade', status: 'Completed', budget: 1200000, spent: 1150000, progress: 100 },
];

export const mockPayments = [
  { id: 'PAY-101', client: 'Acme Corp', project: 'Skyline Tower', amount: 50000, date: '2026-04-01', status: 'Paid' },
  { id: 'PAY-102', client: 'City Council', project: 'Metro Station Upgrade', amount: 120000, date: '2026-04-05', status: 'Paid' },
  { id: 'PAY-103', client: 'Oceanview LLC', project: 'Oceanview Villas', amount: 250000, date: '2026-04-10', status: 'Pending' },
  { id: 'PAY-104', client: 'Riverside Dev', project: 'Riverside Complex', amount: 75000, date: '2026-03-15', status: 'Overdue' },
  { id: 'PAY-105', client: 'Acme Corp', project: 'Skyline Tower', amount: 100000, date: '2026-04-15', status: 'Pending' },
];

export const mockInventory = [
  { id: 'INV-001', item: 'Portland Cement', category: 'Materials', quantity: 450, unit: 'Bags', supplier: 'BuildMat Inc', costPerUnit: 12, status: 'In Stock' },
  { id: 'INV-002', item: 'Steel Rebar 12mm', category: 'Materials', quantity: 50, unit: 'Tons', supplier: 'SteelWorks', costPerUnit: 850, status: 'Low Stock' },
  { id: 'INV-003', item: 'Red Bricks', category: 'Materials', quantity: 15000, unit: 'Pieces', supplier: 'BrickCo', costPerUnit: 0.5, status: 'In Stock' },
  { id: 'INV-004', item: 'Excavator Fuel', category: 'Consumables', quantity: 200, unit: 'Liters', supplier: 'EnergyPlus', costPerUnit: 1.5, status: 'Critical' },
  { id: 'INV-005', item: 'Safety Helmets', category: 'Equipment', quantity: 120, unit: 'Pieces', supplier: 'SafeGear', costPerUnit: 15, status: 'In Stock' },
];

export const mockInvoices = [
  { id: 'INV-2026-001', client: 'Acme Corp', project: 'Skyline Tower', date: '2026-04-01', amount: 50000, status: 'Paid' },
  { id: 'INV-2026-002', client: 'Oceanview LLC', project: 'Oceanview Villas', date: '2026-04-08', amount: 250000, status: 'Sent' },
  { id: 'INV-2026-003', client: 'Riverside Dev', project: 'Riverside Complex', date: '2026-03-01', amount: 75000, status: 'Overdue' },
];

export const mockTeam = [
  { id: 'EMP-001', name: 'John Doe', role: 'Project Manager', project: 'Skyline Tower', status: 'Active' },
  { id: 'EMP-002', name: 'Jane Smith', role: 'Site Supervisor', project: 'Oceanview Villas', status: 'Active' },
  { id: 'EMP-003', name: 'Mike Johnson', role: 'Civil Engineer', project: 'Riverside Complex', status: 'On Leave' },
  { id: 'EMP-004', name: 'Sarah Williams', role: 'Safety Officer', project: 'Multiple', status: 'Active' },
];

export const revenueData = [
  { name: 'Jan', revenue: 400000, expenses: 240000 },
  { name: 'Feb', revenue: 300000, expenses: 139800 },
  { name: 'Mar', revenue: 200000, expenses: 980000 },
  { name: 'Apr', revenue: 278000, expenses: 390800 },
  { name: 'May', revenue: 189000, expenses: 480000 },
  { name: 'Jun', revenue: 239000, expenses: 380000 },
];

export const inventoryUsageData = [
  { name: 'Week 1', cement: 400, steel: 240, bricks: 2400 },
  { name: 'Week 2', cement: 300, steel: 139, bricks: 2210 },
  { name: 'Week 3', cement: 200, steel: 980, bricks: 2290 },
  { name: 'Week 4', cement: 278, steel: 390, bricks: 2000 },
];
