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
  { month: "Jan", workshop: 186, webinar: 80, psychometric: 60 },
  { month: "Feb", workshop: 305, webinar: 200, psychometric: 120 },
  { month: "Mar", workshop: 237, webinar: 120, psychometric: 90 },
  { month: "Apr", workshop: 73, webinar: 190, psychometric: 140 },
  { month: "May", workshop: 209, webinar: 130, psychometric: 100 },
  { month: "Jun", workshop: 214, webinar: 140, psychometric: 110 },
  { month: "Jul", workshop: 186, webinar: 80, psychometric: 60 },
  { month: "Aug", workshop: 305, webinar: 200, psychometric: 120 },
  { month: "Sep", workshop: 237, webinar: 120, psychometric: 90 },
  { month: "Oct", workshop: 73, webinar: 190, psychometric: 140 },
  { month: "Nov", workshop: 209, webinar: 130, psychometric: 100 },
  { month: "Dec", workshop: 214, webinar: 140, psychometric: 110 },
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

export default function StackedBarChart() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Appointment by Region Trend</CardTitle>
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
        <CardDescription>January - December 2025</CardDescription>
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
                domain={[0, 600]}
                ticks={[0, 100, 200, 300, 400, 500, 600]}
              />
              <Tooltip content={<StackedTooltip />} />
              {/* Stacked bars with specified colors and order */}
              <Bar 
                dataKey="psychometric" 
                name="EU" 
                stackId="a"
                fill="#FFAE4C" 
                radius={[0, 0, 4, 4]}
                barSize={30}
              />
              <Bar 
                dataKey="webinar" 
                name="Americas" 
                stackId="a"
                fill="#6FD195" 
                radius={[0, 0, 0, 0]}
              />
              <Bar 
                dataKey="workshop" 
                name="AU/NZ" 
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
            <span className="text-muted-foreground">AU/NZ</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[#6FD195]"></div>
            <span className="text-muted-foreground">Americas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[#FFAE4C]"></div>
            <span className="text-muted-foreground">EU</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[#37E0F9]"></div>
            <span className="text-muted-foreground">Asia Pacific</span>
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