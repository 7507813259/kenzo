// components/dashboard/stats-grid.tsx
'use client';
import { StatCard } from "./stats";

interface StatsGridProps {
  statsData: {
    appointments: number;
    totalCompleted: number;
    totalCancelled: number;
    chargedCancellations: number;
    totalVendors: number;
    totalClients: number;
  };
}

export const StatsGrid = ({ statsData }: StatsGridProps) => {
  console.log('📊 StatsGrid received statsData:', statsData); // Add this debug log

  const stats = [
    {
      title: 'Appointments',
      value: statsData.appointments.toLocaleString(),
      change: '3.5%',
      trend: 'positive' as const
    },
    {
      title: 'Total Completed',
      value: statsData.totalCompleted.toLocaleString(),
      change: '2.5%',
      trend: 'neutral' as const
    },
    {
      title: 'Total Cancelled',
      value: statsData.totalCancelled.toLocaleString(),
      change: '2.5%',
      trend: 'negative' as const
    },
    {
      title: 'Charged Cancellations',
      value: statsData.chargedCancellations.toLocaleString(),
      change: '1.5%',
      trend: 'positive' as const
    },
    {
      title: 'Total Vendors',
      value: statsData.totalVendors.toLocaleString(),
      change: '3.5%',
      trend: 'positive' as const
    },
    {
      title: 'Total Clients',
      value: statsData.totalClients.toLocaleString(),
      change: '7.2%',
      trend: 'negative' as const
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          trend={stat.trend}
        />
      ))}
    </div>
  );
};