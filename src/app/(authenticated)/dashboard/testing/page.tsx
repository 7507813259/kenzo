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

const statusFilter = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' }
];

const companySchema = z.object({
  companyName: z.string().min(1, 'Company name is required.'),
  website: z
    .url({ error: 'Please enter a valid URL.' })
    .optional()
    .or(z.literal('')),
  emailId: z.email({ error: 'Please enter a valid email address.' }),
  address: z.string().min(1, 'Address is required.')
});

type CompanyFormData = z.infer<typeof companySchema>;

const newCompanyInitialValues: CompanyFormData = {
  companyName: '',
  website: '',
  emailId: '',
  address: ''
};

const companyFormFields: FormFieldConfig[] = [
  {
    name: 'companyName',
    label: 'Company Name',
    type: 'text',
    placeholder: 'e.g. 301io'
  },
  {
    name: 'website',
    label: 'Website',
    type: 'text',
    placeholder: 'https://www.301io.com',
    description: 'Must be a full URL including https://'
  },
  {
    name: 'emailId',
    label: 'Email ID',
    type: 'email',
    placeholder: 'contact@301io.com'
  },
  {
    name: 'address',
    label: 'Address',
    type: 'textarea',
    placeholder: '310, 301io, Pune'
  }
];

function Page() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [totalRecords, setTotalRecords] = useState(10);
  const dataTableRef = useRef<ImprovedDataTableRef>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] =
    useState<any>(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchData({
      page: INITIAL_PAGE,
      limit: INITIAL_LIMIT,
      sortOrder: 'desc',
      sortBy: 'companyId'
    });
  }, []);

  const fetchData = async (params?: any) => {
    setIsLoading(true);
    const queryString = buildQueryParams(params);
    try {
      const response = await GetCall(`/convt/api/convt/company?${queryString}`);
      if (response.code === 'SUCCESS') {
        setCompanies(response.data);
        setTotalRecords(response.total);
      } else {
        setCompanies([]);
        setTotalRecords(0);
        toast.error('Failed to fetch companies.');
      }
    } catch (err: any) {
      console.error('Error fetching data:', err);
      toast.error(err.message || 'An error occurred while fetching data.');
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      key: 'srNo',
      header: '#',
      body: (data: any, options: any) => <span>{options.rowIndex + 1}</span>,
      bodyStyle: { minWidth: 50, maxWidth: 50 }
    },
    {
      key: 'companyName',
      header: 'Company Name',
      field: 'companyName',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: 150, maxWidth: 150 },
      filterPlaceholder: 'Company Name'
    },
    {
      key: 'website',
      header: 'Website',
      field: 'website',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: 150, maxWidth: 150 },
      filterPlaceholder: 'Website'
    },
    {
      key: 'emailId',
      header: 'Email ID',
      field: 'emailId',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: 150, maxWidth: 150 },
      filterPlaceholder: 'Email ID'
    },
    {
      key: 'address',
      header: 'Address',
      field: 'address',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: 150, maxWidth: 150 },
      filterPlaceholder: 'Address'
    },
    {
      key: 'status',
      header: 'Status',
      field: 'status',
      filter: true,
      sortable: true,
      filterType: 'dropdown' as const,
      filterOptions: statusFilter,
      filterOptionLabel: 'label',
      filterOptionValue: 'value',
      bodyStyle: { minWidth: 150, maxWidth: 150 },
      filterPlaceholder: 'Status',
      body: (data: any) => <span>{data.status || '-'}</span>
    }
  ];

  const onRowSelect = async (rowData: any, action: any) => {
    if (action === ACTIONS.DELETE) {
      setSelectedCompany(rowData);
      setIsDeleteDialogVisible(true);
    }

    if (action == ACTIONS.EDIT) {
      setSelectedCompany(rowData);
      setIsSheetOpen(true);
    }

    if (action === ACTIONS.VIEW) {
    }
  };

  const handleOpenCreateSheet = () => {
    setSelectedCompany(null);
    setIsSheetOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogVisible(false);
    setSelectedCompany(null);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    setSelectedCompany(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCompany) return;

    setIsDeleting(true);
    try {
      const response = await DeleteCall(
        `/convt/api/convt/company/${selectedCompany.companyId}`
      );
      if (response.code === 'SUCCESS') {
        toast.success(
          `Company "${selectedCompany.companyName}" deleted successfully!`
        );
        handleCloseDeleteDialog();
        handleRefresh();
      } else {
        toast.error(response.message || 'Failed to delete company.');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during deletion.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSubmit = async (data: z.infer<typeof companySchema>) => {
    setIsSubmitting(true);
    try {
      let response;
      if (selectedCompany) {
        response = await PutCall(
          `/convt/api/convt/company/${selectedCompany.companyId}`,
          data
        );
        if (response.code === 'SUCCESS') {
          toast.success('Company updated successfully!');
        }
      } else {
        response = await PostCall('/convt/api/convt/company', data);
        if (response.code === 'SUCCESS') {
          toast.success('Company created successfully!');
        }
      }

      if (response.code === 'SUCCESS') {
        handleCloseSheet();
        handleRefresh();
      } else {
        toast.error(response.message || 'An error occurred.');
      }
    } catch (error: any) {
      toast.error(error.message || 'An unexpected error occurred.');
    } finally {
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
              Company Management
            </h1>
          </div>
          <div className='flex gap-3'>
            <Button
              className='bg-[var(--primary-light)]'
              onClick={handleOpenCreateSheet}
            >
              + New Company
            </Button>
          </div>
        </div>
      </div>
      <ImprovedDataTable
        ref={dataTableRef}
        tableId='company-management'
        page={INITIAL_PAGE}
        limit={INITIAL_LIMIT}
        totalRecords={totalRecords}
        data={companies}
        columns={columns}
        loading={isLoading}
        filter={true}
        stripedRows={true}
        showGridlines={true}
        isView={true}
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
        title={selectedCompany ? 'Edit Company' : 'Create a New Company'}
        description='Fill in the details below to add a new company to the system.'
        fields={companyFormFields}
        schema={companySchema}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        initialValues={selectedCompany || newCompanyInitialValues}
      />
    </PageContainer>
  );
}

export default Page;
