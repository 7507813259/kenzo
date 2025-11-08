'use client';
import PageContainer from '@/components/layout/page-container';
import ImprovedDataTable, {
  ImprovedDataTableRef
} from '@/components/table/ImprovedDataTable';
import { Button } from '@/components/ui/button';
import DeleteConfirmationDialog from '@/components/ui/custom/delete-dialog';
import { DeleteCall, GetCall, PostCall, PutCall } from '@/lib/apiClient';
import { ACTIONS, INITIAL_LIMIT, INITIAL_PAGE } from '@/utils/constant';
import { buildQueryParams } from '@/utils/utils';
import React, { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  FormFieldConfig,
  ReusableFormSheet
} from '@/components/drawer/add-fields-drawer';
import { CloudUpload, CopyPlus, Download } from 'lucide-react';

const statusFilter = [
  { label: 'Active', value: 'true' },
  { label: 'Inactive', value: 'false' }
];

const customerSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required.'),
  materialDescription: z.string().min(1, 'Material description is required.'),
  grade: z.string().min(1, 'Grade is required.'),
  quantityNot: z.string().min(1, 'Quantity (Not) is required.'),
  quantityKgs: z.string().min(1, 'Quantity (Kgs) is required.'),
  cuttingLength: z.string().min(1, 'Cutting Length is required.'),
  piercing: z.string().min(1, 'Piercing is required.'),
  cuttingRate: z.string().min(1, 'Cutting Rate is required.'),
  totalCost: z.string().min(1, 'Total Cost is required.'),
  invalidPNodeFile1: z.string().optional(),
  invalidPNodeFile2: z.string().optional(),
  fileAttachments: z.string().optional(),
  invalidPNodeFile3: z.string().optional(),
  programDps: z.string().optional(),
  accountingInvoice: z.string().optional(),
  paymentReceived: z.string().optional(),
  scrapTaken: z.string().optional(),
  quantityOfScrap: z.string().optional()
});

type CustomerFormData = z.infer<typeof customerSchema>;

const newCustomerInitialValues: CustomerFormData = {
  customerName: '',
  materialDescription: '',
  grade: '',
  quantityNot: '',
  quantityKgs: '',
  cuttingLength: '',
  piercing: '',
  cuttingRate: '',
  totalCost: '',
  invalidPNodeFile1: '',
  invalidPNodeFile2: '',
  fileAttachments: '',
  invalidPNodeFile3: '',
  programDps: '',
  accountingInvoice: '',
  paymentReceived: '',
  scrapTaken: '',
  quantityOfScrap: ''
};

const staticData = [
  {
    id: 1,
    customerName: 'ABC Manufacturing',
    materialDescription: 'Steel Plates',
    grade: 'A36',
    quantityNot: '50',
    quantityKgs: '2500',
    cuttingLength: '12.5',
    piercing: 'Yes',
    cuttingRate: '45.00',
    totalCost: '5625.00',
    programDps: 'DPS-001',
    accountingInvoice: 'INV-001',
    paymentReceived: 'Yes',
    scrapTaken: 'No',
    quantityOfScrap: '0'
  },
  {
    id: 2,
    customerName: 'XYZ Industries',
    materialDescription: 'Aluminum Sheets',
    grade: '6061',
    quantityNot: '30',
    quantityKgs: '900',
    cuttingLength: '8.2',
    piercing: 'No',
    cuttingRate: '35.50',
    totalCost: '2911.00',
    programDps: 'DPS-002',
    accountingInvoice: 'INV-002',
    paymentReceived: 'No',
    scrapTaken: 'Yes',
    quantityOfScrap: '45'
  },
  {
    id: 3,
    customerName: 'Global Metals Corp',
    materialDescription: 'Copper Tubes',
    grade: 'C11000',
    quantityNot: '75',
    quantityKgs: '1875',
    cuttingLength: '6.8',
    piercing: 'Yes',
    cuttingRate: '52.75',
    totalCost: '9890.63',
    programDps: 'DPS-003',
    accountingInvoice: 'INV-003',
    paymentReceived: 'Yes',
    scrapTaken: 'Yes',
    quantityOfScrap: '28'
  },
  {
    id: 4,
    customerName: 'Precision Engineering',
    materialDescription: 'Stainless Steel',
    grade: '304',
    quantityNot: '40',
    quantityKgs: '1600',
    cuttingLength: '10.5',
    piercing: 'Yes',
    cuttingRate: '48.25',
    totalCost: '6745.00',
    programDps: 'DPS-004',
    accountingInvoice: 'INV-004',
    paymentReceived: 'No',
    scrapTaken: 'No',
    quantityOfScrap: '0'
  },
  {
    id: 5,
    customerName: 'Metal Works Ltd',
    materialDescription: 'Brass Rods',
    grade: 'C36000',
    quantityNot: '60',
    quantityKgs: '1800',
    cuttingLength: '4.5',
    piercing: 'No',
    cuttingRate: '38.90',
    totalCost: '4201.20',
    programDps: 'DPS-005',
    accountingInvoice: 'INV-005',
    paymentReceived: 'Yes',
    scrapTaken: 'Yes',
    quantityOfScrap: '15'
  },
  {
    id: 6,
    customerName: 'Industrial Solutions',
    materialDescription: 'Titanium Plates',
    grade: 'Grade 2',
    quantityNot: '25',
    quantityKgs: '625',
    cuttingLength: '15.2',
    piercing: 'Yes',
    cuttingRate: '75.40',
    totalCost: '9425.00',
    programDps: 'DPS-006',
    accountingInvoice: 'INV-006',
    paymentReceived: 'Yes',
    scrapTaken: 'No',
    quantityOfScrap: '0'
  },
  {
    id: 7,
    customerName: 'Advanced Materials',
    materialDescription: 'Carbon Steel',
    grade: '1045',
    quantityNot: '35',
    quantityKgs: '1400',
    cuttingLength: '9.8',
    piercing: 'No',
    cuttingRate: '42.30',
    totalCost: '5922.00',
    programDps: 'DPS-007',
    accountingInvoice: 'INV-007',
    paymentReceived: 'No',
    scrapTaken: 'Yes',
    quantityOfScrap: '32'
  },
  {
    id: 8,
    customerName: 'Quality Fabrication',
    materialDescription: 'Galvanized Steel',
    grade: 'A653',
    quantityNot: '45',
    quantityKgs: '1575',
    cuttingLength: '7.5',
    piercing: 'Yes',
    cuttingRate: '39.75',
    totalCost: '5981.25',
    programDps: 'DPS-008',
    accountingInvoice: 'INV-008',
    paymentReceived: 'Yes',
    scrapTaken: 'No',
    quantityOfScrap: '0'
  }
];

function CustomerManagement() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [totalRecords, setTotalRecords] = useState(10);
  const dataTableRef = useRef<ImprovedDataTableRef>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState<any>(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchData({
      page: INITIAL_PAGE,
      limit: INITIAL_LIMIT,
      sortOrder: 'desc',
      sortBy: 'id'
    });
  }, []);

  const fetchData = async (params?: any) => {
    setIsLoading(true);
    try {
      // Use static data instead of API call
      setTimeout(() => {
        setCustomers(staticData);
        setTotalRecords(staticData.length);
        setIsLoading(false);
      }, 500); // Simulate loading delay
    } catch (err: any) {
      console.error('Error fetching data:', err);
      toast.error(err.message || 'An error occurred while fetching data.');
      setIsLoading(false);
    }
  };

  // Generate customer form fields based on the image structure
  const getCustomerFormFields = (): FormFieldConfig[] => [
    // Customer Name Section
    {
      name: 'customerName',
      label: 'Customer Name',
      type: 'text',
      placeholder: 'Enter customer name',
      section: 'customer'
    },
    
    // Material Description Section
    {
      name: 'materialDescription',
      label: 'Material Description',
      type: 'text',
      placeholder: 'Enter material description',
      section: 'material'
    },
    
    // Grade Section
    {
      name: 'grade',
      label: 'Grade',
      type: 'text',
      placeholder: 'Enter grade',
      section: 'grade'
    },
    {
      name: 'quantityNot',
      label: 'Quantity (Not)',
      type: 'text',
      placeholder: 'Enter quantity in numbers',
      section: 'grade'
    },
    {
      name: 'quantityKgs',
      label: 'Quantity (Kgs)',
      type: 'text',
      placeholder: 'Enter quantity in kilograms',
      section: 'grade'
    },
    
    // Cutting Length Section
    {
      name: 'cuttingLength',
      label: 'Cutting Length (Mtr)',
      type: 'text',
      placeholder: 'Enter cutting length in meters',
      section: 'cutting'
    },
    {
      name: 'piercing',
      label: 'Piercing',
      type: 'text',
      placeholder: 'Enter piercing details',
      section: 'cutting'
    },
    {
      name: 'cuttingRate',
      label: 'Cutting Rate',
      type: 'text',
      placeholder: 'Enter cutting rate',
      section: 'cutting'
    },
    
    // Total Cost Section
    {
      name: 'totalCost',
      label: 'Total Cost',
      type: 'text',
      placeholder: 'Enter total cost',
      section: 'cost'
    },
    
    // Invalid PNode File Uploads
    {
      name: 'invalidPNodeFile1',
      label: 'Invalid PNode',
      type: 'file',
      placeholder: 'Choose File No file chosen',
      section: 'files'
    },
    {
      name: 'invalidPNodeFile2',
      label: '',
      type: 'file',
      placeholder: 'Choose File No file chosen',
      section: 'files'
    },
    {
      name: 'fileAttachments',
      label: 'File Attachments',
      type: 'file',
      placeholder: 'Choose File No file chosen',
      section: 'files'
    },
    {
      name: 'invalidPNodeFile3',
      label: '',
      type: 'file',
      placeholder: 'Choose File No file chosen',
      section: 'files'
    },
    
    // Program / DPS
    {
      name: 'programDps',
      label: 'Program / Dps',
      type: 'text',
      placeholder: 'Enter program/DPS details',
      section: 'program'
    },
    
    // Accounting Invoice
    {
      name: 'accountingInvoice',
      label: 'Accounting Invoice',
      type: 'text',
      placeholder: 'Enter accounting invoice',
      section: 'accounting'
    },
    
    // Payment Received (Select)
    {
      name: 'paymentReceived',
      label: 'Payment Received',
      type: 'select',
      placeholder: 'Select',
      options: [
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' }
      ],
      section: 'payment'
    },
    
    // Scrap Taken (Select)
    {
      name: 'scrapTaken',
      label: 'Scrap Taken',
      type: 'select',
      placeholder: 'Select',
      options: [
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' }
      ],
      section: 'scrap'
    },
    
    // Quantity of Scrap
    {
      name: 'quantityOfScrap',
      label: 'Quantity of Scrap (Kgs)',
      type: 'text',
      placeholder: 'Enter quantity of scrap',
      section: 'scrap'
    }
  ];

  const columns = [
    {
      key: 'srNo',
      header: '#',
      body: (data: any, options: any) => <span>{options.rowIndex + 1}</span>,
      bodyStyle: { minWidth: 50, maxWidth: 50 }
    },
    {
      key: 'customerName',
      header: 'Customer Name',
      field: 'customerName',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: 180, maxWidth: 180 },
      filterPlaceholder: 'Customer Name'
    },
    {
      key: 'materialDescription',
      header: 'Material Description',
      field: 'materialDescription',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: 180, maxWidth: 180 },
      filterPlaceholder: 'Material Description'
    },
    {
      key: 'grade',
      header: 'Grade',
      field: 'grade',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: 100, maxWidth: 100 },
      filterPlaceholder: 'Grade'
    },
    {
      key: 'quantityNot',
      header: 'Qty (Not)',
      field: 'quantityNot',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: 100, maxWidth: 100 },
      filterPlaceholder: 'Qty Not'
    },
    {
      key: 'quantityKgs',
      header: 'Qty (Kgs)',
      field: 'quantityKgs',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: 100, maxWidth: 100 },
      filterPlaceholder: 'Qty Kgs'
    },
    {
      key: 'cuttingLength',
      header: 'Cutting Length',
      field: 'cuttingLength',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: 120, maxWidth: 120 },
      filterPlaceholder: 'Cutting Length'
    },
    {
      key: 'totalCost',
      header: 'Total Cost',
      field: 'totalCost',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: 120, maxWidth: 120 },
      filterPlaceholder: 'Total Cost',
      body: (data: any) => <span>${data.totalCost}</span>
    },
    {
      key: 'paymentReceived',
      header: 'Payment Received',
      field: 'paymentReceived',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: 140, maxWidth: 140 },
      filterPlaceholder: 'Payment'
    },
    {
      key: 'scrapTaken',
      header: 'Scrap Taken',
      field: 'scrapTaken',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: 120, maxWidth: 120 },
      filterPlaceholder: 'Scrap'
    }
  ];

  const onRowSelect = async (rowData: any, action: any) => {
    if (action === ACTIONS.DELETE) {
      setSelectedCustomer(rowData);
      setIsDeleteDialogVisible(true);
    }

    if (action == ACTIONS.EDIT) {
      setSelectedCustomer(rowData);
      setIsSheetOpen(true);
    }

    if (action === ACTIONS.VIEW) {
      // Handle view action if needed
    }
  };

  const handleOpenCreateSheet = () => {
    setSelectedCustomer(null);
    setIsSheetOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogVisible(false);
    setSelectedCustomer(null);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    setSelectedCustomer(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCustomer) return;

    setIsDeleting(true);
    try {
      // Simulate API call with static data
      setTimeout(() => {
        const updatedCustomers = customers.filter(
          (customer) => customer.id !== selectedCustomer.id
        );
        setCustomers(updatedCustomers);
        setTotalRecords(updatedCustomers.length);
        toast.success(`Customer "${selectedCustomer.customerName}" deleted successfully!`);
        handleCloseDeleteDialog();
        setIsDeleting(false);
      }, 500);
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during deletion.');
      setIsDeleting(false);
    }
  };

  const handleFormSubmit = async (data: z.infer<typeof customerSchema>) => {
    setIsSubmitting(true);
    try {
      // Simulate API call with static data
      setTimeout(() => {
        if (selectedCustomer) {
          // Update existing customer
          const updatedCustomers = customers.map((customer) =>
            customer.id === selectedCustomer.id
              ? {
                  ...customer,
                  ...data,
                  id: selectedCustomer.id
                }
              : customer
          );
          setCustomers(updatedCustomers);
          toast.success('Customer record updated successfully!');
        } else {
          // Create new customer
          const newCustomer = {
            id: customers.length + 1,
            ...data
          };
          setCustomers([...customers, newCustomer]);
          setTotalRecords(customers.length + 1);
          toast.success('Customer record created successfully!');
        }

        handleCloseSheet();
        setIsSubmitting(false);
      }, 500);
    } catch (error: any) {
      toast.error(error.message || 'An unexpected error occurred.');
      setIsSubmitting(false);
    }
  };

  const handleRefresh = () => dataTableRef.current?.refreshData();

  return (
    <PageContainer scrollable={false}>
      <div className='flex-shrink-0'>
        <div className='mb-2 flex w-full items-center justify-between'>
          <div className='flex flex-col'>
            <h1 className='text-xl font-semibold text-[#525252] dark:text-[#ffffff]'>
              Material Management
            </h1>
          </div>
          <div className='flex gap-3'>
            <div className='flex gap-3'>
              <Button
                className='cursor-pointer bg-[#00A345] hover:bg-[#00A345]/10 hover:text-[#00A345]'
                onClick={handleOpenCreateSheet}
              >
                <CopyPlus /> New Customer
              </Button>
            </div>
            <div className='flex gap-3'>
              <Button
                className='cursor-pointer bg-[#00A345] hover:bg-[#00A345]/10 hover:text-[#00A345]'
              >
                <CloudUpload />
                Upload
              </Button>
            </div>
            <div className='flex gap-3'>
              <Button
                className='cursor-pointer bg-[#00A345] hover:bg-[#00A345]/10 hover:text-[#00A345]'
              >
                <Download />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>
      <ImprovedDataTable
        ref={dataTableRef}
        tableId='customer-management'
        page={INITIAL_PAGE}
        limit={INITIAL_LIMIT}
        totalRecords={totalRecords}
        data={customers}
        columns={columns}
        loading={isLoading}
        filter={true}
        stripedRows={true}
        showGridlines={true}
        isView={false}
        isEdit={true}
        isDelete={true}
        onLoad={fetchData}
        onView={(item: any) => onRowSelect(item, 'view')}
        onEdit={(item: any) => onRowSelect(item, 'edit')}
        onDelete={(item: any) => onRowSelect(item, 'delete')}
      />

      <DeleteConfirmationDialog
        visible={isDeleteDialogVisible}
        isLoading={isDeleting}
        itemDescription=''
        onHide={handleCloseDeleteDialog}
        onConfirm={handleDeleteConfirm}
      />

      <ReusableFormSheet
        isOpen={isSheetOpen}
        onClose={handleCloseSheet}
        title={selectedCustomer ? 'Edit Cutting Registration Form' : 'Cutting Registration Form'}
        description='Fill in the customer details and material information below.'
        fields={getCustomerFormFields()}
        schema={customerSchema}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        initialValues={
          selectedCustomer
            ? {
                customerName: selectedCustomer.customerName,
                materialDescription: selectedCustomer.materialDescription,
                grade: selectedCustomer.grade,
                quantityNot: selectedCustomer.quantityNot,
                quantityKgs: selectedCustomer.quantityKgs,
                cuttingLength: selectedCustomer.cuttingLength,
                piercing: selectedCustomer.piercing,
                cuttingRate: selectedCustomer.cuttingRate,
                totalCost: selectedCustomer.totalCost,
                programDps: selectedCustomer.programDps,
                accountingInvoice: selectedCustomer.accountingInvoice,
                paymentReceived: selectedCustomer.paymentReceived,
                scrapTaken: selectedCustomer.scrapTaken,
                quantityOfScrap: selectedCustomer.quantityOfScrap
              }
            : newCustomerInitialValues
        }
      />
    </PageContainer>
  );
}

export default CustomerManagement;