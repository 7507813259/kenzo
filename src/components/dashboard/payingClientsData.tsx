'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, ArrowUpDown } from "lucide-react";
import { useState } from 'react';

// Dummy data for top 10 paying clients
const payingClientsData = [

  { id: 1, clientName: "Ferguson, Watts and Torres", appointmentRate: 17040, supplierFee: 4191, totalRevenue: 21231 },
  { id: 2, clientName: "Sanchez, Bruce and Wise", appointmentRate: 16690, supplierFee: 3937, totalRevenue: 20627 },
  { id: 3, clientName: "Davis-Schwartz", appointmentRate: 15205, supplierFee: 4827, totalRevenue: 20032 },
  { id: 4, clientName: "Benitez-Watts", appointmentRate: 15335, supplierFee: 4022, totalRevenue: 19357 },
  { id: 5, clientName: "Blair-Hogan", appointmentRate: 15785, supplierFee: 3570, totalRevenue: 19355 },
  { id: 6, clientName: "Taylor-Bradley", appointmentRate: 16310, supplierFee: 2828, totalRevenue: 19138 },
  { id: 7, clientName: "Trevino, Knapp and Wells", appointmentRate: 15080, supplierFee: 3879, totalRevenue: 18959 },
  { id: 8, clientName: "Price-Erickson", appointmentRate: 15175, supplierFee: 3505, totalRevenue: 18680 },
  { id: 9, clientName: "Schmidt and Sons", appointmentRate: 15300, supplierFee: 3365, totalRevenue: 18665 },
  { id: 10, clientName: "Waller, Whitaker and Scott", appointmentRate: 15975, supplierFee: 2525, totalRevenue: 18500 }

];

export default function TopPayingClientsTable() {
  const [sortBy, setSortBy] = useState<'clientName' | 'appointmentRate' | 'supplierFee' | 'totalRevenue'>('totalRevenue');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sortedData = [...payingClientsData].sort((a, b) => {
    if (sortBy === 'clientName') {
      return sortOrder === 'asc' 
        ? a.clientName.localeCompare(b.clientName)
        : b.clientName.localeCompare(a.clientName);
    } else {
      const aValue = sortBy === 'appointmentRate' ? a.appointmentRate : 
                    sortBy === 'supplierFee' ? a.supplierFee : a.totalRevenue;
      const bValue = sortBy === 'appointmentRate' ? b.appointmentRate : 
                    sortBy === 'supplierFee' ? b.supplierFee : b.totalRevenue;
      
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }
  });

  const handleSort = (column: 'clientName' | 'appointmentRate' | 'supplierFee' | 'totalRevenue') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className='w-full space-y-6'>
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Top 10 Paying Clients</CardTitle>
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                2025
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>2025</DropdownMenuItem>
              <DropdownMenuItem>2024</DropdownMenuItem>
              <DropdownMenuItem>2023</DropdownMenuItem>
              <DropdownMenuItem>2022</DropdownMenuItem>
              <DropdownMenuItem>2021</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <div className="overflow-y-auto max-h-[580px]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th 
                  className="text-left font-medium p-4 cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => handleSort('clientName')}
                >
                  <div className="flex items-center gap-2">
                    Client Name
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th 
                  className="text-right font-medium p-4 cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => handleSort('appointmentRate')}
                >
                  <div className="flex items-center gap-2 justify-end">
                    	Contract Amount
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th 
                  className="text-right font-medium p-4 cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => handleSort('supplierFee')}
                >
                  <div className="flex items-center gap-2 justify-end">
                    Additional Appointments
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th 
                  className="text-right font-medium p-4 cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => handleSort('totalRevenue')}
                >
                  <div className="flex items-center gap-2 justify-end">
                    Total Revenue
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((client, index) => (
                <tr 
                  key={client.id} 
                  className={`border-b hover:bg-muted/30 transition-colors ${
                    index === sortedData.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <td className="p-4 font-medium">{client.clientName}</td>
                  <td className="p-4 text-right font-semibold text-blue-600">
                    {formatCurrency(client.appointmentRate)}
                  </td>
                  <td className="p-4 text-right font-semibold text-green-600">
                    {formatCurrency(client.supplierFee)}
                  </td>
                  <td className="p-4 text-right font-semibold text-purple-600">
                    {formatCurrency(client.totalRevenue)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-muted/30">
              <tr>
                <td className="p-4 font-semibold">Total</td>
                <td className="p-4 text-right font-semibold text-blue-600">
                  {formatCurrency(sortedData.reduce((sum, client) => sum + client.appointmentRate, 0))}
                </td>
                <td className="p-4 text-right font-semibold text-green-600">
                  {formatCurrency(sortedData.reduce((sum, client) => sum + client.supplierFee, 0))}
                </td>
                <td className="p-4 text-right font-semibold text-purple-600">
                  {formatCurrency(sortedData.reduce((sum, client) => sum + client.totalRevenue, 0))}
                </td>
              </tr>
            </tfoot>
          </table>
          </div>
        </div>
      </CardContent>
    </Card>
    </div>
  );
}