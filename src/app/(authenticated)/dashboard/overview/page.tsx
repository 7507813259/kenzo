'use client';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  Calendar,
  Download,
  Filter,
  TrendingUp,
  Users,
  Package,
  DollarSign,
  Activity,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Eye
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

// Mock data for the dashboard
const dashboardData = {
  overview: {
    totalCustomers: 1248,
    activeProjects: 42,
    totalRevenue: 28450,
    pendingOrders: 18,
    customerGrowth: 12.5,
    revenueGrowth: 8.3,
    projectGrowth: -2.1,
    orderGrowth: 5.7
  },
  recentActivities: [
    {
      id: 1,
      customer: 'ABC Manufacturing',
      action: 'New Order',
      material: 'Steel Plates',
      amount: '$12,450',
      time: '2 min ago',
      status: 'completed'
    },
    {
      id: 2,
      customer: 'XYZ Industries',
      action: 'Payment Received',
      material: 'Aluminum Sheets',
      amount: '$8,920',
      time: '15 min ago',
      status: 'completed'
    },
    {
      id: 3,
      customer: 'Global Metals Corp',
      action: 'Project Started',
      material: 'Copper Tubes',
      amount: '$15,670',
      time: '1 hour ago',
      status: 'in-progress'
    },
    {
      id: 4,
      customer: 'Precision Engineering',
      action: 'Quality Check',
      material: 'Stainless Steel',
      amount: '$9,340',
      time: '2 hours ago',
      status: 'pending'
    },
    {
      id: 5,
      customer: 'Metal Works Ltd',
      action: 'Delivery Scheduled',
      material: 'Brass Rods',
      amount: '$6,890',
      time: '3 hours ago',
      status: 'scheduled'
    }
  ],
  performanceMetrics: {
    cuttingEfficiency: 87,
    materialUsage: 92,
    onTimeDelivery: 95,
    qualityScore: 89
  },
  revenueData: [
    { month: 'Jan', revenue: 45000, projects: 12 },
    { month: 'Feb', revenue: 52000, projects: 15 },
    { month: 'Mar', revenue: 48000, projects: 13 },
    { month: 'Apr', revenue: 61000, projects: 18 },
    { month: 'May', revenue: 58000, projects: 16 },
    { month: 'Jun', revenue: 72000, projects: 22 },
    { month: 'Jul', revenue: 68500, projects: 20 }
  ],
  topMaterials: [
    { name: 'Steel Plates', quantity: 2450, value: 124500 },
    { name: 'Aluminum Sheets', quantity: 1820, value: 87400 },
    { name: 'Copper Tubes', quantity: 920, value: 67800 },
    { name: 'Stainless Steel', quantity: 1560, value: 93400 },
    { name: 'Brass Rods', quantity: 780, value: 45600 }
  ]
};

function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const StatCard = ({ title, value, change, icon: Icon, trend }: any) => (
    <Card className='relative overflow-hidden'>
      <CardContent className='px-6'>
        <div className='flex items-center justify-between'>
          <div className='space-y-2'>
            <p className='text-muted-foreground text-sm font-medium'>{title}</p>
            <div className='flex items-baseline gap-2'>
              <h2 className='text-3xl font-bold'>
                {typeof value === 'number' && value >= 1000
                  ? `$${(value / 1000).toFixed(0)}K`
                  : value}
              </h2>
              <div
                className={`flex items-center text-sm font-medium ${
                  change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {change >= 0 ? (
                  <ArrowUpRight className='h-4 w-4' />
                ) : (
                  <ArrowDownRight className='h-4 w-4' />
                )}
                {Math.abs(change)}%
              </div>
            </div>
          </div>
          <div
            className={`rounded-full p-3 ${
              title.includes('Revenue')
                ? 'bg-green-100 text-green-600'
                : title.includes('Customers')
                  ? 'bg-blue-100 text-blue-600'
                  : title.includes('Projects')
                    ? 'bg-purple-100 text-purple-600'
                    : 'bg-orange-100 text-orange-600'
            }`}
          >
            <Icon className='h-6 w-6' />
          </div>
        </div>
        {trend && (
          <div className='mt-4'>
            <div className='text-muted-foreground mb-1 flex justify-between text-sm'>
              <span>Trend</span>
              <span>{trend.value}</span>
            </div>
            <div className='h-2 w-full rounded-full bg-gray-200'>
              <div
                className={`h-2 rounded-full ${
                  trend.positive ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(Math.abs(trend.value), 100)}%` }}
              ></div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const MetricCard = ({ title, value, subtitle, icon: Icon, color }: any) => (
    <Card>
      <CardContent className='p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-muted-foreground text-sm font-medium'>{title}</p>
            <h3 className='mt-1 text-2xl font-bold'>{value}%</h3>
            <p className='text-muted-foreground mt-1 text-xs'>{subtitle}</p>
          </div>
          <div className={`rounded-full p-3 ${color}`}>
            <Icon className='h-6 w-6' />
          </div>
        </div>
        <div className='mt-4'>
          <div className='h-2 w-full rounded-full bg-gray-200'>
            <div
              className={`h-2 rounded-full ${
                color.includes('green')
                  ? 'bg-green-500'
                  : color.includes('blue')
                    ? 'bg-blue-500'
                    : color.includes('purple')
                      ? 'bg-purple-500'
                      : 'bg-yellow-500'
              }`}
              style={{ width: `${value}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ActivityItem = ({ activity }: any) => (
    <div className='flex items-center space-x-4 py-3'>
      <div
        className={`h-2 w-2 rounded-full ${
          activity.status === 'completed'
            ? 'bg-green-500'
            : activity.status === 'in-progress'
              ? 'bg-blue-500'
              : activity.status === 'pending'
                ? 'bg-yellow-500'
                : 'bg-purple-500'
        }`}
      />
      <div className='flex-1 space-y-1'>
        <div className='flex items-center justify-between'>
          <p className='text-sm font-medium'>{activity.customer}</p>
          <span className='text-muted-foreground text-xs'>{activity.time}</span>
        </div>
        <p className='text-muted-foreground text-sm'>
          {activity.action} • {activity.material}
        </p>
      </div>
      <div className='text-right'>
        <p className='text-sm font-medium'>{activity.amount}</p>
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
            activity.status === 'completed'
              ? 'bg-green-100 text-green-800'
              : activity.status === 'in-progress'
                ? 'bg-blue-100 text-blue-800'
                : activity.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-purple-100 text-purple-800'
          }`}
        >
          {activity.status}
        </span>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <PageContainer scrollable={false}>
        <div className='animate-pulse'>
          <div className='mb-6 h-8 w-1/4 rounded bg-gray-200'></div>
          <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
            {[...Array(4)].map((_, i) => (
              <div key={i} className='h-32 rounded-lg bg-gray-200'></div>
            ))}
          </div>
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
            <div className='h-96 rounded-lg bg-gray-200 lg:col-span-2'></div>
            <div className='h-96 rounded-lg bg-gray-200'></div>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer scrollable={false}>
      {/* Header */}
      <div className='mb-5 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Dashboard </h1>
          <p className='mt-1 text-muted-foreground'>
            Welcome back! Here s whats happening with your business today.
          </p>
        </div>
        <div className='flex items-center space-x-2'>
          <Button variant='outline' size='sm'>
            <Calendar className='mr-2 h-4 w-4' />
            Last 30 days
          </Button>
          <Button variant='outline' size='sm'>
            <Download className='mr-2 h-4 w-4' />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
        <StatCard
          title='Total Revenue'
          value={dashboardData.overview.totalRevenue}
          change={dashboardData.overview.revenueGrowth}
          icon={DollarSign}
          trend={{
            value: dashboardData.overview.revenueGrowth,
            positive: true
          }}
        />
        <StatCard
          title='Total Customers'
          value={dashboardData.overview.totalCustomers}
          change={dashboardData.overview.customerGrowth}
          icon={Users}
          trend={{
            value: dashboardData.overview.customerGrowth,
            positive: true
          }}
        />
        <StatCard
          title='Active Projects'
          value={dashboardData.overview.activeProjects}
          change={dashboardData.overview.projectGrowth}
          icon={Package}
          trend={{
            value: Math.abs(dashboardData.overview.projectGrowth),
            positive: false
          }}
        />
        <StatCard
          title='Pending Orders'
          value={dashboardData.overview.pendingOrders}
          change={dashboardData.overview.orderGrowth}
          icon={ShoppingCart}
          trend={{ value: dashboardData.overview.orderGrowth, positive: true }}
        />
      </div>

      {/* Main Content Grid */}
      <div className='mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3'>
        {/* Performance Metrics */}
        <div className='lg:col-span-1'>
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Key operational indicators</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <MetricCard
                title='Cutting Efficiency'
                value={dashboardData.performanceMetrics.cuttingEfficiency}
                subtitle='Optimal material usage'
                icon={Activity}
                color='bg-green-100 text-green-600'
              />
              <MetricCard
                title='Material Usage'
                value={dashboardData.performanceMetrics.materialUsage}
                subtitle='Resource optimization'
                icon={TrendingUp}
                color='bg-blue-100 text-blue-600'
              />
              <MetricCard
                title='On-Time Delivery'
                value={dashboardData.performanceMetrics.onTimeDelivery}
                subtitle='Delivery performance'
                icon={Package}
                color='bg-purple-100 text-purple-600'
              />
              <MetricCard
                title='Quality Score'
                value={dashboardData.performanceMetrics.qualityScore}
                subtitle='Customer satisfaction'
                icon={Eye}
                color='bg-yellow-100 text-yellow-600'
              />
            </CardContent>
          </Card>
        </div>

        {/* Revenue Chart & Activities */}
        <div className='lg:col-span-2'>
          <Tabs defaultValue='revenue' className='space-y-6'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='revenue'>Revenue Analytics</TabsTrigger>
              <TabsTrigger value='activities'>Recent Activities</TabsTrigger>
            </TabsList>

            <TabsContent value='revenue' className='space-y-4'>
              <Card>
                <CardHeader>
                  <div className='flex items-center justify-between'>
                    <div>
                      <CardTitle>Revenue Overview</CardTitle>
                      <CardDescription>
                        Monthly revenue and project performance
                      </CardDescription>
                    </div>
                    <Button variant='outline' size='sm'>
                      <Filter className='mr-2 h-4 w-4' />
                      Filter
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='h-80'>
                    {/* Simple bar chart visualization */}
                    <div className='mt-4 flex h-64 items-end justify-between space-x-2'>
                      {dashboardData.revenueData.map((item, index) => (
                        <div
                          key={item.month}
                          className='flex flex-1 flex-col items-center space-y-2'
                        >
                          <div className='text-muted-foreground text-xs'>
                            {item.month}
                          </div>
                          <div className='group relative flex w-full flex-1 flex-col items-center'>
                            <div
                              className='w-full cursor-pointer rounded-t bg-blue-500 transition-all duration-200 hover:bg-blue-600'
                              style={{
                                height: `${(item.revenue / 80000) * 100}%`
                              }}
                            ></div>
                            <div
                              className='mt-1 w-full cursor-pointer rounded-t bg-green-500 transition-all duration-200 hover:bg-green-600'
                              style={{
                                height: `${(item.projects / 25) * 100}%`
                              }}
                            ></div>
                            <div className='absolute bottom-full z-10 mb-2 hidden rounded bg-gray-900 p-2 text-xs whitespace-nowrap text-white group-hover:block'>
                              <div>
                                Revenue: ${item.revenue.toLocaleString()}
                              </div>
                              <div>Projects: {item.projects}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className='mt-4 flex justify-center space-x-4'>
                      <div className='flex items-center space-x-2'>
                        <div className='h-3 w-3 rounded bg-blue-500'></div>
                        <span className='text-muted-foreground text-sm'>
                          Revenue
                        </span>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <div className='h-3 w-3 rounded bg-green-500'></div>
                        <span className='text-muted-foreground text-sm'>
                          Projects
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='activities'>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>
                    Latest customer interactions and orders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-1'>
                    {dashboardData.recentActivities.map((activity) => (
                      <ActivityItem key={activity.id} activity={activity} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          {/* Top Materials */}
          <Card className='mt-3'>
            <CardHeader>
              <CardTitle>Top Materials</CardTitle>
              <CardDescription>Most used materials by value</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {dashboardData.topMaterials.map((material, index) => (
                  <div
                    key={material.name}
                    className='flex items-center justify-between'
                  >
                    <div className='flex items-center space-x-3'>
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full font-medium text-white ${
                          index === 0
                            ? 'bg-blue-500'
                            : index === 1
                              ? 'bg-green-500'
                              : index === 2
                                ? 'bg-purple-500'
                                : index === 3
                                  ? 'bg-orange-500'
                                  : 'bg-pink-500'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <p className='font-medium'>{material.name}</p>
                        <p className='text-muted-foreground text-sm'>
                          {material.quantity.toLocaleString()} units
                        </p>
                      </div>
                    </div>
                    <div className='text-right'>
                      <p className='font-medium'>
                        ${material.value.toLocaleString()}
                      </p>
                      <p className='text-muted-foreground text-sm'>
                        {(
                          (material.value /
                            dashboardData.topMaterials.reduce(
                              (sum, m) => sum + m.value,
                              0
                            )) *
                          100
                        ).toFixed(1)}
                        %
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}

export default DashboardPage;
