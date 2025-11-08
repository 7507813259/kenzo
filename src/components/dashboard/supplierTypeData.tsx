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

// Dummy data for appointments by supplier type
const supplierTypeData = [
  { id: 1, supplierType: "Webinar Host", appointmentsBooked: 1151 },
  { id: 2, supplierType: "Health Coach", appointmentsBooked: 1137 },
  { id: 3, supplierType: "LGBTQIA+ Helpline", appointmentsBooked: 1131 },
  { id: 4, supplierType: "Nutrition Coach", appointmentsBooked: 1127 },
  { id: 5, supplierType: "Psychologist", appointmentsBooked: 1118 },
  { id: 6, supplierType: "Spiritual Helpline", appointmentsBooked: 1109 },
  { id: 7, supplierType: "Meditation Coach", appointmentsBooked: 1090 },
  { id: 8, supplierType: "Career Coach", appointmentsBooked: 1070 },
  { id: 9, supplierType: "ElderCare Helpline", appointmentsBooked: 1067 }
];


export default function SupplierTypeTable() {
  const [sortBy, setSortBy] = useState<'supplierType' | 'appointmentsBooked'>('appointmentsBooked');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sortedData = [...supplierTypeData].sort((a, b) => {
    if (sortBy === 'supplierType') {
      return sortOrder === 'asc' 
        ? a.supplierType.localeCompare(b.supplierType)
        : b.supplierType.localeCompare(a.supplierType);
    } else {
      return sortOrder === 'asc' 
        ? a.appointmentsBooked - b.appointmentsBooked
        : b.appointmentsBooked - a.appointmentsBooked;
    }
  });

  const handleSort = (column: 'supplierType' | 'appointmentsBooked') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  return (
    <div className='w-full space-y-6'>
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Appointments by Supplier Type</CardTitle>
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
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th 
                  className="text-left font-medium p-4 cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => handleSort('supplierType')}
                >
                  <div className="flex items-center gap-2">
                    Vendor Type
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th 
                  className="text-right font-medium p-4 cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => handleSort('appointmentsBooked')}
                >
                  <div className="flex items-center gap-2 justify-end">
                    Appointments
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((supplier, index) => (
                <tr 
                  key={supplier.id} 
                  className={`border-b hover:bg-muted/30 transition-colors ${
                    index === sortedData.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <td className="p-4 font-medium">{supplier.supplierType}</td>
                  <td className="p-4 text-right font-semibold">{supplier.appointmentsBooked}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-muted/30">
              <tr>
                <td className="p-4 font-semibold">Total</td>
                <td className="p-4 text-right font-semibold">
                  {sortedData.reduce((sum, supplier) => sum + supplier.appointmentsBooked, 0)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
    </div>
  );
}