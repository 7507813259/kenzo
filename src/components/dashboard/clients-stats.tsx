// components/dashboard/client-stats-grid.tsx
'use client';
import { StatCard } from "./stats";

interface StatItem {
  title: string;
  value: string;
  change: string;
  trend: 'positive' | 'negative' | 'neutral';
}

interface ClientStatsGridProps {
  statsData?: StatItem[]; // Change to accept array
}

export const ClientStatsGrid = ({ statsData }: ClientStatsGridProps) => {
  // Default data as array
  const defaultStats: StatItem[] = [
    {
      title: 'Total Clients',
      value: '247',
      change: '+12.5%',
      trend: 'positive'
    },
    {
      title: 'Active Contracts',
      value: '189',
      change: '+8.3%',
      trend: 'positive'
    },
    {
      title: 'Expired Contracts',
      value: '42',
      change: '+2.1%',
      trend: 'negative'
    },
    {
      title: 'Expiring in 90 Days',
      value: '28',
      change: '+15.7%',
      trend: 'neutral'
    },
    {
      title: 'Client Retention Rate',
      value: '87.5%',
      change: '+3.2%',
      trend: 'positive'
    },
    {
      title: 'Avg Contract Value',
      value: '$12,500',
      change: '+5.8%',
      trend: 'positive'
    }
  ];

  const statsToDisplay = statsData || defaultStats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {statsToDisplay.map((stat, index) => (
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