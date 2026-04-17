import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getStoredInventory, saveStoredInventory, InventoryItem } from "@/data/inventoryStorage";
import { Plus, Search, AlertTriangle } from "lucide-react";
import { Modal } from "@/components/ui/modal";

export default function Inventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ item: '', category: 'Materials', quantity: '', unit: '', supplier: '', costPerUnit: '' });

  useEffect(() => {
    const storedInventory = getStoredInventory();
    setInventory(storedInventory);
  }, []);

  const updateInventory = (newInventory: InventoryItem[]) => {
    setInventory(newInventory);
    saveStoredInventory(newInventory);
  };

  const filteredInventory = inventory.filter(item => 
    item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'In Stock': return <Badge variant="success">In Stock</Badge>;
      case 'Low Stock': return <Badge variant="warning">Low Stock</Badge>;
      case 'Critical': return <Badge variant="destructive">Critical</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const handleUseStock = (id: string) => {
    const updatedInventory = inventory.map(item => {
      if (item.id === id && item.quantity > 0) {
        const newQuantity = Math.max(0, item.quantity - 10);
        let newStatus = 'In Stock';
        if (newQuantity === 0) newStatus = 'Critical';
        else if (newQuantity < 100) newStatus = 'Low Stock';
        
        return { ...item, quantity: newQuantity, status: newStatus };
      }
      return item;
    });
    updateInventory(updatedInventory);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(formData.quantity);
    let newStatus = 'In Stock';
    if (qty === 0) newStatus = 'Critical';
    else if (qty < 100) newStatus = 'Low Stock';

    const newItem: InventoryItem = {
      id: `INV-${Math.floor(Math.random() * 1000) + 100}`,
      item: formData.item,
      category: formData.category,
      quantity: qty,
      unit: formData.unit,
      supplier: formData.supplier,
      costPerUnit: Number(formData.costPerUnit),
      status: newStatus
    };
    updateInventory([newItem, ...inventory]);
    setIsModalOpen(false);
    setFormData({ item: '', category: 'Materials', quantity: '', unit: '', supplier: '', costPerUnit: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Inventory</h2>
          <p className="text-muted-foreground">Manage materials, equipment, and consumables.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Item
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-destructive/10 border-destructive/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-destructive">
              <AlertTriangle className="mr-2 h-4 w-4" /> Critical Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {inventory.filter(i => i.status === 'Critical').length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-warning/10 border-warning/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-yellow-600">
              <AlertTriangle className="mr-2 h-4 w-4" /> Low Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {inventory.filter(i => i.status === 'Low Stock').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${inventory.reduce((acc, curr) => acc + (curr.quantity * curr.costPerUnit), 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Stock List</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search items..." 
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead className="text-right">Unit Cost</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.item}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.quantity} {item.unit}</TableCell>
                  <TableCell>{item.supplier}</TableCell>
                  <TableCell className="text-right">${item.costPerUnit.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleUseStock(item.id)}
                      disabled={item.quantity === 0}
                    >
                      Use Stock
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Inventory Item">
        <form onSubmit={handleAddItem} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Item Name</label>
            <Input required value={formData.item} onChange={e => setFormData({...formData, item: e.target.value})} placeholder="e.g. Portland Cement" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <select 
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={formData.category} 
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              <option value="Materials">Materials</option>
              <option value="Equipment">Equipment</option>
              <option value="Consumables">Consumables</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity</label>
              <Input required type="number" min="0" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} placeholder="100" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Unit</label>
              <Input required value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} placeholder="e.g. Bags, Tons" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Supplier</label>
              <Input required value={formData.supplier} onChange={e => setFormData({...formData, supplier: e.target.value})} placeholder="Supplier Name" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Cost Per Unit ($)</label>
              <Input required type="number" step="0.01" min="0" value={formData.costPerUnit} onChange={e => setFormData({...formData, costPerUnit: e.target.value})} placeholder="12.50" />
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Item</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
