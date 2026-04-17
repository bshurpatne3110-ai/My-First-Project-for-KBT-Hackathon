import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { revenueData, inventoryUsageData, mockPayments } from "@/data/mockData";
import { getStoredProjects } from "@/data/projectStorage";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { DollarSign, Package, HardHat, AlertCircle, MessageCircle, X } from "lucide-react";
import { useState } from 'react';

export default function Dashboard() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(true);
  const totalRevenue = mockPayments.filter((p: any) => p.status === 'Paid').reduce((acc: number, curr: any) => acc + curr.amount, 0);
  const pendingPayments = mockPayments.filter((p: any) => p.status === 'Pending').reduce((acc: number, curr: any) => acc + curr.amount, 0);
  const activeProjects = getStoredProjects().filter((p: any) => p.status === 'In Progress').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your construction projects and resources.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pendingPayments.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <HardHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects}</div>
            <p className="text-xs text-muted-foreground">Across 3 locations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Steel Rebar, Excavator Fuel</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue vs Expenses</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                  <Tooltip formatter={(value: any) => `$${value ? value.toLocaleString() : 0}`} />
                  <Legend />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Inventory Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={inventoryUsageData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="cement" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="steel" stroke="#82ca9d" strokeWidth={2} />
                  <Line type="monotone" dataKey="bricks" stroke="#ffc658" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Botpress Chatbot */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
        {isChatbotOpen && (
          <div className="relative">
            <button
              onClick={() => setIsChatbotOpen(false)}
              className="absolute -top-2 -right-2 bg-destructive hover:bg-destructive/90 text-white rounded-full p-1 shadow-md z-10"
              title="Close chatbot"
            >
              <X className="h-4 w-4" />
            </button>
            <iframe
              src="https://cdn.botpress.cloud/webchat/v3.6/shareable.html?configUrl=https://files.bpcontent.cloud/2026/04/17/14/20260417141002-A29YJ680.json"
              style={{
                width: '400px',
                height: '500px',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              }}
              title="AI Chatbot"
            />
          </div>
        )}
        {!isChatbotOpen && (
          <button
            onClick={() => setIsChatbotOpen(true)}
            className="bg-primary hover:bg-primary/90 text-white rounded-full p-3 shadow-lg flex items-center gap-2 transition-all"
            title="Open chatbot"
          >
            <MessageCircle className="h-6 w-6" />
            <span className="text-sm font-medium">Chat with AI</span>
          </button>
        )}
      </div>
    </div>
  );
}
