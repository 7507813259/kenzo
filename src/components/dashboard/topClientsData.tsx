'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

// Dummy data for top 10 clients
const topClientsData = [
  { id: 1, clientName: "Blair-Hogan", appointmentsBooked: 68, totalCompleted: 61, refunded: 6 },
  { id: 2, clientName: "Brown, Poole and Martin", appointmentsBooked: 63, totalCompleted: 55, refunded: 5 },
  { id: 3, clientName: "Davis-Schwartz", appointmentsBooked: 68, totalCompleted: 60, refunded: 6 },
  { id: 4, clientName: "Dunn-Wolf", appointmentsBooked: 63, totalCompleted: 56, refunded: 3 },
  { id: 5, clientName: "Ferguson, Watts and Torres", appointmentsBooked: 65, totalCompleted: 55, refunded: 8 },
  { id: 6, clientName: "Gonzalez Group", appointmentsBooked: 62, totalCompleted: 55, refunded: 4 },
  { id: 7, clientName: "Gregory and Sons", appointmentsBooked: 62, totalCompleted: 56, refunded: 3 },
  { id: 8, clientName: "Price-Erickson", appointmentsBooked: 63, totalCompleted: 53, refunded: 4 },
  { id: 9, clientName: "Sanchez, Bruce and Wise", appointmentsBooked: 62, totalCompleted: 55, refunded: 7 },
  { id: 10, clientName: "Schmidt and Sons", appointmentsBooked: 62, totalCompleted: 43, refunded: 12 },
  { id: 11, clientName: "Trevino, Knapp and Wells", appointmentsBooked: 63, totalCompleted: 54, refunded: 6 },
  { id: 12, clientName: "Waller, Whitaker and Scott", appointmentsBooked: 63, totalCompleted: 55, refunded: 7 }
];

export default function TopClientsTable() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Top 10 Clients - By Appointments Booked</CardTitle>
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
                <th className="text-left font-medium p-4">Client Name</th>
                <th className="text-right font-medium p-4">Appointments Booked</th>
                <th className="text-right font-medium p-4">Total Completed</th>
                <th className="text-right font-medium p-4">Refunded</th>
              </tr>
            </thead>
            <tbody>
              {topClientsData.map((client, index) => (
                <tr 
                  key={client.id} 
                  className={`border-b hover:bg-muted/30 transition-colors ${
                    index === topClientsData.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <td className="p-4 font-medium">{client.clientName}</td>
                  <td className="p-4 text-right">{client.appointmentsBooked}</td>
                  <td className="p-4 text-right">{client.totalCompleted}</td>
                  <td className="p-4 text-right">{client.refunded}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}