'use client';

import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

// Chart data for stacked bar chart
const stackedChartData = [
  { month: "Jan", america: 4, workshop: 5, webinar: 6, psychometric: 5 },
  { month: "Feb", america: 5, workshop: 4, webinar: 4, psychometric: 4 },
  { month: "Mar", america: 5, workshop: 3, webinar: 3, psychometric: 4 },
  { month: "Apr", america: 5, workshop: 3, webinar: 1, psychometric: 5 },
  { month: "May", america: 1, workshop: 0, webinar: 6, psychometric: 6 },
  { month: "Jun", america: 5, workshop: 0, webinar: 3, psychometric: 4 },
  { month: "Jul", america: 0, workshop: 4, webinar: 2, psychometric: 6 },
  { month: "Aug", america: 0, workshop: 3, webinar: 3, psychometric: 4 },
  { month: "Sep", america: 4, workshop: 0, webinar: 1, psychometric: 4 },
  { month: "Oct", america: 2, workshop: 4, webinar: 3, psychometric: 0 },
  { month: "Nov", america: 3, workshop: 0, webinar: 0, psychometric: 3 },
  { month: "Dec", america: 1, workshop: 2, webinar: 0, psychometric: 1 }
];

// Custom tooltip for stacked chart
const StackedTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);
    
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
        <p className="font-medium text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm flex justify-between gap-4" style={{ color: entry.color }}>
            <span>{entry.name}:</span>
            <span className="font-medium">{entry.value}</span>
          </p>
        ))}
        <div className="border-t border-gray-200 mt-2 pt-2">
          <p className="text-sm font-medium flex justify-between gap-4">
            <span>Total:</span>
            <span>{total}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export default function FourthBarChart() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Expiring Clients by region: Based on Client End date</CardTitle>
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                2026
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>2026</DropdownMenuItem>
              <DropdownMenuItem>2025</DropdownMenuItem>
              <DropdownMenuItem>2024</DropdownMenuItem>
              <DropdownMenuItem>2023</DropdownMenuItem>
              <DropdownMenuItem>2022</DropdownMenuItem>
              <DropdownMenuItem>2021</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
        <CardDescription>January - December 2026</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stackedChartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                domain={[0, 15]}
                ticks={[0, 1, 2, 5, 7, 10, 12,15,20]}
              />
              <Tooltip content={<StackedTooltip />} />
              {/* Stacked bars with specified colors and order */}
              <Bar 
                dataKey="america" 
                name="AU / NZ" 
                stackId="a"
                fill="#07DBFA" 
                radius={[0, 0, 4, 4]}
                barSize={30}
              />
              <Bar 
                dataKey="psychometric" 
                name="Asia Pacific" 
                stackId="a"
                fill="#FFAE4C" 
                radius={[0, 0, 0, 0]}
                barSize={30}
              />
              <Bar 
                dataKey="webinar" 
                name="EU" 
                stackId="a"
                fill="#6FD195" 
                radius={[0, 0, 0, 0]}
              />
              <Bar 
                dataKey="workshop" 
                name="America" 
                stackId="a"
                fill="#7086FD" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-4 text-sm">
        <div className="flex items-center justify-center w-full gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[#7086FD]"></div>
            <span className="text-muted-foreground">AU / NZ</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[#6FD195]"></div>
            <span className="text-muted-foreground">Asia Pacific</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[#FFAE4C]"></div>
            <span className="text-muted-foreground">EU</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[#37E0F9]"></div>
            <span className="text-muted-foreground">America</span>
          </div>
          {/* <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[#FF7474]"></div>
            <span className="text-muted-foreground">Coaching Session</span>
          </div> */}
        </div>
      </CardFooter>
    </Card>
  );
}