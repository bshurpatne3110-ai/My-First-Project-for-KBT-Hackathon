import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getStoredInvoices, saveStoredInvoices, Invoice } from "@/data/invoicesStorage";
import { Plus, Search, Download, FileText } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Modal } from "@/components/ui/modal";

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ client: '', project: '', date: '', amount: '' });

  useEffect(() => {
    const storedInvoices = getStoredInvoices();
    setInvoices(storedInvoices);
  }, []);

  const updateInvoices = (newInvoices: Invoice[]) => {
    setInvoices(newInvoices);
    saveStoredInvoices(newInvoices);
  };

  const filteredInvoices = invoices.filter(inv => 
    inv.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid': return <Badge variant="success">Paid</Badge>;
      case 'Sent': return <Badge variant="secondary">Sent</Badge>;
      case 'Overdue': return <Badge variant="destructive">Overdue</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const generatePDF = (invoice: Invoice) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text("INVOICE", 14, 22);
    
    doc.setFontSize(10);
    doc.text("BuildMaster Pro Construction", 14, 30);
    doc.text("123 Builder Ave, City, State 12345", 14, 35);
    
    // Invoice Details
    doc.text(`Invoice #: ${invoice.id}`, 140, 30);
    doc.text(`Date: ${invoice.date}`, 140, 35);
    
    // Client Details
    doc.text("Bill To:", 14, 50);
    doc.setFont(undefined, 'bold');
    doc.text(invoice.client, 14, 55);
    doc.setFont(undefined, 'normal');
    doc.text(`Project: ${invoice.project}`, 14, 60);
    
    // Items Table
    autoTable(doc, {
      startY: 70,
      head: [['Description', 'Quantity', 'Unit Price', 'Total']],
      body: [
        ['Construction Services', '1', `$${(invoice.amount * 0.8).toLocaleString()}`, `$${(invoice.amount * 0.8).toLocaleString()}`],
        ['Materials', '1', `$${(invoice.amount * 0.2).toLocaleString()}`, `$${(invoice.amount * 0.2).toLocaleString()}`],
      ],
    });
    
    // Totals
    const finalY = (doc as any).lastAutoTable.finalY || 100;
    const gst = invoice.amount * 0.1; // 10% GST
    const total = invoice.amount + gst;
    
    doc.text(`Subtotal: $${invoice.amount.toLocaleString()}`, 140, finalY + 10);
    doc.text(`GST (10%): $${gst.toLocaleString()}`, 140, finalY + 15);
    doc.setFont(undefined, 'bold');
    doc.text(`Total: $${total.toLocaleString()}`, 140, finalY + 20);
    
    doc.save(`${invoice.id}.pdf`);
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const newInvoice: Invoice = {
      id: `INV-2026-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      client: formData.client,
      project: formData.project,
      date: formData.date,
      amount: Number(formData.amount),
      status: 'Sent'
    };
    updateInvoices([newInvoice, ...invoices]);
    setIsModalOpen(false);
    setFormData({ client: '', project: '', date: '', amount: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Invoices</h2>
          <p className="text-muted-foreground">Generate and manage client invoices.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Invoice
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Invoice History</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search invoices..." 
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
                <TableHead>Invoice #</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium flex items-center">
                    <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                    {invoice.id}
                  </TableCell>
                  <TableCell>{invoice.client}</TableCell>
                  <TableCell>{invoice.project}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell className="text-right">${invoice.amount.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => generatePDF(invoice)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Invoice">
        <form onSubmit={handleCreateInvoice} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Client Name</label>
            <Input required value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} placeholder="e.g. Acme Corp" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Project</label>
            <Input required value={formData.project} onChange={e => setFormData({...formData, project: e.target.value})} placeholder="e.g. Skyline Tower" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <Input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount ($)</label>
            <Input required type="number" min="0" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="50000" />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Generate Invoice</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
