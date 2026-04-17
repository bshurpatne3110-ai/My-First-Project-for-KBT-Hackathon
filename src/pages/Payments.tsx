import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getStoredPayments, saveStoredPayments, Payment } from "@/data/paymentsStorage";
import { Plus, Search } from "lucide-react";
import { Modal } from "@/components/ui/modal";

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ client: '', project: '', amount: '', date: '', status: 'Pending' });

  useEffect(() => {
    const storedPayments = getStoredPayments();
    setPayments(storedPayments);
  }, []);

  const updatePayments = (newPayments: Payment[]) => {
    setPayments(newPayments);
    saveStoredPayments(newPayments);
  };

  const filteredPayments = payments.filter(p => 
    p.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.project.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid': return <Badge variant="success">Paid</Badge>;
      case 'Pending': return <Badge variant="warning">Pending</Badge>;
      case 'Overdue': return <Badge variant="destructive">Overdue</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const handleStatusToggle = (id: string) => {
    const updatedPayments = payments.map(p => {
      if (p.id === id) {
        const nextStatus = p.status === 'Paid' ? 'Pending' : p.status === 'Pending' ? 'Overdue' : 'Paid';
        return { ...p, status: nextStatus };
      }
      return p;
    });
    updatePayments(updatedPayments);
  };

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const newPayment: Payment = {
      id: `PAY-${Math.floor(Math.random() * 1000) + 200}`,
      client: formData.client,
      project: formData.project,
      amount: Number(formData.amount),
      date: formData.date,
      status: formData.status as 'Paid' | 'Pending' | 'Overdue'
    };
    updatePayments([newPayment, ...payments]);
    setIsModalOpen(false);
    setFormData({ client: '', project: '', amount: '', date: '', status: 'Pending' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Payments</h2>
          <p className="text-muted-foreground">Manage client payments and track revenue.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Payment
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Payment History</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search clients or projects..." 
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
                <TableHead>ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.id}</TableCell>
                  <TableCell>{payment.client}</TableCell>
                  <TableCell>{payment.project}</TableCell>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell className="text-right">${payment.amount.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleStatusToggle(payment.id)}
                    >
                      Update Status
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredPayments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No payments found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Payment">
        <form onSubmit={handleAddPayment} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Client Name</label>
            <Input required value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} placeholder="e.g. Acme Corp" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Project</label>
            <Input required value={formData.project} onChange={e => setFormData({...formData, project: e.target.value})} placeholder="e.g. Skyline Tower" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount ($)</label>
            <Input required type="number" min="0" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="50000" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <Input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <select 
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={formData.status} 
              onChange={e => setFormData({...formData, status: e.target.value})}
            >
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Payment</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
