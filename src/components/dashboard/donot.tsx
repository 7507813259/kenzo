'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface DonutChartCardProps {
  title: string;
  total: string | number;
  data: {
    name: string;
    value: number;
    color: string;
  }[];
}

export const DonutChartCard = ({ title, total, data }: DonutChartCardProps) => {
  return (
    <Card className="rounded-2xl shadow-sm h-full">
      <CardHeader>
        <CardTitle className="text-[15px] font-semibold text-[#074556]">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <div className="relative w-[180px] h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Total */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-sm text-gray-400">Total</span>
            <span className="text-xl font-bold text-gray-700">{total}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span
                className="h-2 w-2 rounded-sm"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-gray-600 text-sm">{item.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
