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
import { CloudUpload, CopyPlus, Download, User, Camera } from 'lucide-react';

const statusFilter = [
  { label: 'Active', value: 'true' },
  { label: 'Inactive', value: 'false' }
];

const customerSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  mobile: z.string().min(10, 'Mobile number must be at least 10 digits.'),
  email: z.string().email('Please enter a valid email address.').optional().or(z.literal('')),
  photo: z.any().optional()
});

type CustomerFormData = z.infer<typeof customerSchema>;

const newCustomerInitialValues: CustomerFormData = {
  name: '',
  mobile: '',
  email: '',
  photo: null
};

// Static data with 15 customer records
const staticCustomers = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@example.com',
    mobile: '123-456-7890',
    photo: null,
    isActive: true
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    mobile: '123-456-7891',
    photo: null,
    isActive: true
  },
  {
    id: 3,
    name: 'Michael Brown',
    email: 'michael.b@example.com',
    mobile: '123-456-7892',
    photo: null,
    isActive: false
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'emily.d@example.com',
    mobile: '123-456-7893',
    photo: null,
    isActive: true
  },
  {
    id: 5,
    name: 'David Wilson',
    email: 'david.w@example.com',
    mobile: '123-456-7894',
    photo: null,
    isActive: true
  },
  {
    id: 6,
    name: 'Jennifer Lee',
    email: 'jennifer.l@example.com',
    mobile: '123-456-7895',
    photo: null,
    isActive: false
  },
  {
    id: 7,
    name: 'Robert Taylor',
    email: 'robert.t@example.com',
    mobile: '123-456-7896',
    photo: null,
    isActive: true
  },
  {
    id: 8,
    name: 'Amanda Clark',
    email: 'amanda.c@example.com',
    mobile: '123-456-7897',
    photo: null,
    isActive: true
  },
  {
    id: 9,
    name: 'Christopher Martin',
    email: 'chris.m@example.com',
    mobile: '123-456-7898',
    photo: null,
    isActive: false
  },
  {
    id: 10,
    name: 'Jessica White',
    email: 'jessica.w@example.com',
    mobile: '123-456-7899',
    photo: null,
    isActive: true
  },
  {
    id: 11,
    name: 'Matthew Anderson',
    email: 'matt.a@example.com',
    mobile: '123-456-7800',
    photo: null,
    isActive: true
  },
  {
    id: 12,
    name: 'Elizabeth Thomas',
    email: 'elizabeth.t@example.com',
    mobile: '123-456-7801',
    photo: null,
    isActive: false
  },
  {
    id: 13,
    name: 'Daniel Harris',
    email: 'daniel.h@example.com',
    mobile: '123-456-7802',
    photo: null,
    isActive: true
  },
  {
    id: 14,
    name: 'Michelle Walker',
    email: 'michelle.w@example.com',
    mobile: '123-456-7803',
    photo: null,
    isActive: true
  },
  {
    id: 15,
    name: 'Kevin King',
    email: 'kevin.k@example.com',
    mobile: '123-456-7804',
    photo: null,
    isActive: true
  }
];

function CustomersManagement() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [totalRecords, setTotalRecords] = useState(10);
  const dataTableRef = useRef<ImprovedDataTableRef>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState<any>(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

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
        setCustomers(staticCustomers);
        setTotalRecords(staticCustomers.length);
        setIsLoading(false);
      }, 500); // Simulate loading delay
    } catch (err: any) {
      console.error('Error fetching data:', err);
      toast.error(err.message || 'An error occurred while fetching data.');
      setIsLoading(false);
    }
  };

  // Generate customer form fields
  const getCustomerFormFields = (): FormFieldConfig[] => [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      placeholder: 'e.g. John Smith',
    },
    {
      name: 'mobile',
      label: 'Mobile Number',
      type: 'text',
      placeholder: 'e.g. 123-456-7890',
    },
    {
      name: 'email',
      label: 'Email (Optional)',
      type: 'email',
      placeholder: 'john@example.com',
    },
    {
      name: 'photo',
      label: 'Photo (Optional)',
      type: 'file',
      placeholder: 'Upload customer photo',
      accept: 'image/*',
      onFileChange: (file: File) => {
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setPhotoPreview(e.target?.result as string);
          };
          reader.readAsDataURL(file);
        }
      }
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
      key: 'photo',
      header: 'Photo',
      body: (data: any) => (
        <div className="flex justify-center">
          {data.photo ? (
            <img 
              src={data.photo} 
              alt={data.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-500" />
            </div>
          )}
        </div>
      ),
      bodyStyle: { minWidth: 80, maxWidth: 80 }
    },
    {
      key: 'name',
      header: 'Name',
      field: 'name',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: 150, maxWidth: 150 },
      filterPlaceholder: 'Name'
    },
    {
      key: 'mobile',
      header: 'Mobile No',
      field: 'mobile',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: 120, maxWidth: 120 },
      filterPlaceholder: 'Mobile No'
    },
    {
      key: 'email',
      header: 'Email',
      field: 'email',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: 200, maxWidth: 200 },
      filterPlaceholder: 'Email',
      body: (data: any) => (
        <span>{data.email || '-'}</span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      field: 'isActive',
      filter: true,
      sortable: true,
      filterType: 'dropdown' as const,
      filterOptions: statusFilter,
      filterOptionLabel: 'label',
      filterOptionValue: 'value',
      bodyStyle: { minWidth: 100, maxWidth: 100 },
      filterPlaceholder: 'Status',
      body: (data: any) => (
        <span
          className={`capitalize ${data.isActive ? 'text-green-600' : 'text-red-600'}`}
        >
          {data.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ];

  const onRowSelect = async (rowData: any, action: any) => {
    if (action === ACTIONS.DELETE) {
      setSelectedCustomer(rowData);
      setIsDeleteDialogVisible(true);
    }

    if (action == ACTIONS.EDIT) {
      setSelectedCustomer(rowData);
      setPhotoPreview(rowData.photo || null);
      setIsSheetOpen(true);
    }

    if (action === ACTIONS.VIEW) {
      // Handle view action if needed
    }
  };

  const handleOpenCreateSheet = () => {
    setSelectedCustomer(null);
    setPhotoPreview(null);
    setIsSheetOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogVisible(false);
    setSelectedCustomer(null);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    setSelectedCustomer(null);
    setPhotoPreview(null);
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
        toast.success(`Customer "${selectedCustomer.name}" deleted successfully!`);
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
      // Prepare the data for API
      const submitData = {
        ...data,
        isActive: true // Default to active for new customers
      };

      // Simulate API call with static data
      setTimeout(() => {
        if (selectedCustomer) {
          // Update existing customer
          const updatedCustomers = customers.map((customer) =>
            customer.id === selectedCustomer.id
              ? {
                  ...customer,
                  ...submitData,
                  id: selectedCustomer.id,
                  photo: photoPreview || customer.photo
                }
              : customer
          );
          setCustomers(updatedCustomers);
          toast.success('Customer updated successfully!');
        } else {
          // Create new customer
          const newCustomer = {
            id: customers.length + 1,
            ...submitData,
            photo: photoPreview || null,
            isActive: true
          };
          setCustomers([...customers, newCustomer]);
          setTotalRecords(customers.length + 1);
          toast.success('Customer created successfully!');
        }

        handleCloseSheet();
        setIsSubmitting(false);
        setPhotoPreview(null);
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
              Customer Management
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
              <Button className='cursor-pointer bg-[#00A345] hover:bg-[#00A345]/10 hover:text-[#00A345]'>
                <CloudUpload />
                Upload
              </Button>
            </div>
            <div className='flex gap-3'>
              <Button className='cursor-pointer bg-[#00A345] hover:bg-[#00A345]/10 hover:text-[#00A345]'>
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
        title={selectedCustomer ? 'Edit Customer' : 'Create a New Customer'}
        description='Fill in the details below to add a new customer to the system.'
        fields={getCustomerFormFields()}
        schema={customerSchema}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        initialValues={
          selectedCustomer
            ? {
                name: selectedCustomer.name,
                mobile: selectedCustomer.mobile,
                email: selectedCustomer.email || '',
                photo: selectedCustomer.photo || null
              }
            : newCustomerInitialValues
        }
        customFormContent={
          photoPreview && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Photo Preview:</p>
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-300">
                <img 
                  src={photoPreview} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )
        }
      />
    </PageContainer>
  );
}

export default CustomersManagement;