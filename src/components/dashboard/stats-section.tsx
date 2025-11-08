// // components/dashboard/stats-section.tsx
// import { StatsGrid } from './stats-grid';
// import { ClientsRevenue } from './clients-revenue';
// import ContractDashboard from './donot-stats';
// import { ContractChart } from './graph-card';
// import SecondContractDashboard from './second-donut';
// import SecondGraphChart from './second-graph-card';
// import StackedBarChart from './third-graph-card';
// import TopClientsTable from './topClientsData';
// import TopPayingClientsTable from './payingClientsData';
// import SupplierTypeTable from './supplierTypeData';
// import FourthBarChart from './forth-graph-card';
// import { ChartLineLinear } from './liner-graph';

// interface StatsSectionProps {
//   statsData: {
//     appointments: number;
//     totalCompleted: number;
//     totalCancelled: number;
//     chargedCancellations: number;
//     totalVendors: number;
//     totalClients: number;
//     totalExpenditure: number;
//     revenue: number;
//     previousRevenue: number;
//     revenueChange: string;
//   };
//   filters?: {
//     selectedYear: string;
//     client: string;
//     contractType: string;
//     date: Date | null;
//   };
// }

// export const StatsSection = ({ statsData, filters }: StatsSectionProps) => {
//   console.log('📦 StatsSection received statsData:', statsData);
//   console.log('📦 StatsSection received filters:', filters);

//   return (
//     <>
//       <div className='flex flex-col gap-3'>
//         <div className='flex gap-3'>
//           <div className='w-full max-w-[65%]'>
//             <StatsGrid statsData={statsData} />
//           </div>
//           <div className='w-full max-w-[35%]'>
//             <ClientsRevenue statsData={statsData} />
//           </div>
//         </div>
//         <div>
//           <ContractDashboard statsData={statsData} filters={filters} />
//         </div>
//         <div className='flex gap-3'>
//           <div className='w-[65%]'>
//             <ContractChart />
//           </div>
//           <div className='w-[35%]'>
//             <SecondContractDashboard statsData={statsData} filters={filters} />
//           </div>
//         </div>

//         <div className='w-full'>
//           <SecondGraphChart />
//         </div>
//         <div className='w-full'>
//           <ChartLineLinear />
//         </div>
//          <div className='w-full'>
//           <StackedBarChart />
//         </div>
//         <div className='w-full'>
//           <TopClientsTable />
//         </div>
//         <div className='flex gap-3'>
//           <SupplierTypeTable />
//           <TopPayingClientsTable />
//         </div>
//         <div className='w-full'>
//           <FourthBarChart />
//         </div>
//       </div>
//     </>
//   );
// };


// components/dashboard/stats-section.tsx
import { StatsGrid } from './stats-grid';
import { ClientsRevenue } from './clients-revenue';
import ContractDashboard from './donot-stats';
import { ContractChart } from './graph-card';
import SecondContractDashboard from './second-donut';
import SecondGraphChart from './second-graph-card';
import StackedBarChart from './third-graph-card';
import TopClientsTable from './topClientsData';
import TopPayingClientsTable from './payingClientsData';
import SupplierTypeTable from './supplierTypeData';
import FourthBarChart from './forth-graph-card';
import { ChartLineLinear } from './liner-graph';

interface StatsSectionProps {
  statsData: {
    appointments: number;
    totalCompleted: number;
    totalCancelled: number;
    chargedCancellations: number;
    totalVendors: number;
    totalClients: number;
    totalExpenditure: number;
    revenue: number;
    previousRevenue: number;
    revenueChange: string;
    previousExpenditure: number;
    expenditureChange: string;
  };
  filters?: {
    selectedYear: string;
    client: string;
    contractType: string;
    date: Date | null;
  };
}

export const StatsSection = ({ statsData, filters }: StatsSectionProps) => {
  console.log('📦 StatsSection received statsData:', statsData);
  console.log('📦 StatsSection received filters:', filters);

  // Extract filter values for easier passing
  const clientFilter = filters?.client || '';
  const contractFilter = filters?.contractType || '';
  const yearFilter = filters?.selectedYear || 'All';
  console.log('clientFilter:', clientFilter);
  console.log('contractFilter:', contractFilter);
  console.log('yearFilter:', yearFilter);

  return (
    <>
      <div className='flex flex-col gap-3'>
        <div className='flex gap-3'>
          <div className='w-full max-w-[65%]'>
            <StatsGrid statsData={statsData}  />
          </div>
          <div className='w-full max-w-[35%]'>
            <ClientsRevenue statsData={statsData} />
          </div>
        </div>
        <div>
          <ContractDashboard 
            statsData={statsData} 
            filters={filters}
            contractFilter={contractFilter}
            clientFilter={clientFilter}
          />
        </div>
        <div className='flex gap-3'>
          <div className='w-[65%]'>
            <ContractChart 
              clientFilter={clientFilter}
              contractFilter={contractFilter}
              yearFilter={yearFilter}
            />
          </div>
          <div className='w-[35%]'>
            <SecondContractDashboard 
              statsData={statsData} 
              filters={filters}
              clientFilter={clientFilter}
              contractFilter={contractFilter}
              // yearFilter={yearFilter}
            />
          </div>
        </div>

        <div className='w-full'>
          <SecondGraphChart 
            clientFilter={clientFilter}
            contractFilter={contractFilter}
            yearFilter={yearFilter}
          />
        </div>
        <div className='w-full'>
          <ChartLineLinear 
            clientFilter={clientFilter}
            // contractFilter={contractFilter}
            // yearFilter={yearFilter}
          />
        </div>
         <div className='w-full'>
          <StackedBarChart 
            // clientFilter={clientFilter}
            // contractFilter={contractFilter}
            // yearFilter={yearFilter}
          />
        </div>
        <div className='w-full'>
          <TopClientsTable 
            // clientFilter={clientFilter}
            // contractFilter={contractFilter}
            // yearFilter={yearFilter}
          />
        </div>
        <div className='flex gap-3'>
          <SupplierTypeTable 
            // clientFilter={clientFilter}
            // contractFilter={contractFilter}
            // yearFilter={yearFilter}
          />
          <TopPayingClientsTable 
            // clientFilter={clientFilter}
            // contractFilter={contractFilter}
            // yearFilter={yearFilter}
          />
        </div>
        <div className='w-full'>
          <FourthBarChart 
            // clientFilter={clientFilter}
            // contractFilter={contractFilter}
            // yearFilter={yearFilter}
          />
        </div>
      </div>
    </>
  );
};