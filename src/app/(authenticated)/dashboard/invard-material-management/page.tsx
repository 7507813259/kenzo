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

const itemSchema = z.object({
  id: z.string().min(1, 'Item ID is required.'),
  grade: z.string().min(1, 'Item Grade is required.'),
  size: z.string().min(1, 'Size is required.'),
  quantity: z.string().min(1, 'Quantity is required.'),
  date: z.string().min(1, 'Date is required.'),
  batchNo: z.string().min(1, 'Batch No is required.'),
  name: z.string().min(1, 'Item Name is required.'),
  location: z.string().min(1, 'Location is required.'),
  thickness: z.string().min(1, 'Thickness is required.'),
  evidencePhoto: z.string().optional(),
  time: z.string().min(1, 'Time is required.')
});

type ItemFormData = z.infer<typeof itemSchema>;

const newItemInitialValues: ItemFormData = {
  id: '',
  grade: '',
  size: '',
  quantity: '',
  date: '',
  batchNo: '',
  name: '',
  location: '',
  thickness: '',
  evidencePhoto: '',
  time: ''
};

const staticData = [
  {
    id: 'ITEM-001',
    name: 'Steel Plate',
    grade: 'A36',
    size: '4x8 ft',
    quantity: '50',
    date: '15-12-2024',
    batchNo: 'BATCH-001',
    location: 'Warehouse A',
    thickness: '1/2 inch',
    evidencePhoto: 'evidence_001.jpg',
    time: '09:30 AM'
  },
  {
    id: 'ITEM-002',
    name: 'Aluminum Sheet',
    grade: '6061',
    size: '5x10 ft',
    quantity: '25',
    date: '14-12-2024',
    batchNo: 'BATCH-002',
    location: 'Warehouse B',
    thickness: '1/4 inch',
    evidencePhoto: 'evidence_002.jpg',
    time: '11:15 AM'
  },
  {
    id: 'ITEM-003',
    name: 'Copper Pipe',
    grade: 'C12200',
    size: '1/2 inch',
    quantity: '100',
    date: '13-12-2024',
    batchNo: 'BATCH-003',
    location: 'Warehouse C',
    thickness: '0.035 inch',
    evidencePhoto: 'evidence_003.jpg',
    time: '02:45 PM'
  },
  {
    id: 'ITEM-004',
    name: 'Brass Rod',
    grade: 'C36000',
    size: '1 inch',
    quantity: '75',
    date: '12-12-2024',
    batchNo: 'BATCH-004',
    location: 'Warehouse A',
    thickness: 'N/A',
    evidencePhoto: 'evidence_004.jpg',
    time: '10:00 AM'
  },
  {
    id: 'ITEM-005',
    name: 'Stainless Steel',
    grade: '304',
    size: '3x6 ft',
    quantity: '30',
    date: '11-12-2024',
    batchNo: 'BATCH-005',
    location: 'Warehouse B',
    thickness: '3/8 inch',
    evidencePhoto: 'evidence_005.jpg',
    time: '03:20 PM'
  },
  {
    id: 'ITEM-006',
    name: 'Titanium Plate',
    grade: 'Grade 2',
    size: '2x4 ft',
    quantity: '15',
    date: '10-12-2024',
    batchNo: 'BATCH-006',
    location: 'Warehouse C',
    thickness: '1/4 inch',
    evidencePhoto: 'evidence_006.jpg',
    time: '08:45 AM'
  },
  {
    id: 'ITEM-007',
    name: 'Iron Bar',
    grade: 'AISI 1018',
    size: '20 ft',
    quantity: '80',
    date: '09-12-2024',
    batchNo: 'BATCH-007',
    location: 'Warehouse A',
    thickness: '1 inch',
    evidencePhoto: 'evidence_007.jpg',
    time: '01:30 PM'
  },
  {
    id: 'ITEM-008',
    name: 'Bronze Sheet',
    grade: 'C51000',
    size: '4x8 ft',
    quantity: '20',
    date: '08-12-2024',
    batchNo: 'BATCH-008',
    location: 'Warehouse B',
    thickness: '1/8 inch',
    evidencePhoto: 'evidence_008.jpg',
    time: '04:10 PM'
  }
];

function MaterialManagement() {
  const [items, setItems] = useState<any[]>([]);
  const [totalRecords, setTotalRecords] = useState(10);
  const dataTableRef = useRef<ImprovedDataTableRef>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState<any>(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
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
        setItems(staticData);
        setTotalRecords(staticData.length);
        setIsLoading(false);
      }, 500); // Simulate loading delay
    } catch (err: any) {
      console.error('Error fetching data:', err);
      toast.error(err.message || 'An error occurred while fetching data.');
      setIsLoading(false);
    }
  };

  // Generate item form fields based on the image
  const getItemFormFields = (): FormFieldConfig[] => [
    {
      name: 'id',
      label: 'ID',
      type: 'text',
      placeholder: 'Enter Item ID'
    },
    {
      name: 'grade',
      label: 'Grade',
      type: 'text',
      placeholder: 'Enter Item Grade'
    },
    {
      name: 'size',
      label: 'Size',
      type: 'text',
      placeholder: 'Enter Size'
    },
    {
      name: 'quantity',
      label: 'Quantity',
      type: 'text',
      placeholder: 'Enter Quantity'
    },
    {
      name: 'date',
      label: 'Date',
      type: 'text',
      placeholder: 'dd-mm-yyyy'
    },
    {
      name: 'batchNo',
      label: 'Batch No',
      type: 'text',
      placeholder: 'Enter Batch No'
    },
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      placeholder: 'Enter Item Name'
    },
    {
      name: 'location',
      label: 'Location',
      type: 'text',
      placeholder: 'Enter Location'
    },
    {
      name: 'thickness',
      label: 'Thickness',
      type: 'text',
      placeholder: 'Enter Thickness'
    },
    {
      name: 'evidencePhoto',
      label: 'Evidence Photo',
      type: 'file',
      placeholder: 'Choose File No file chosen'
    },
    {
      name: 'time',
      label: 'Time',
      type: 'text',
      placeholder: 'Enter Time'
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
      key: 'id',
      header: 'ID',
      field: 'id',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: 120, maxWidth: 120 },
      filterPlaceholder: 'Item ID'
    },
    {
      key: 'name',
      header: 'Name',
      field: 'name',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: 150, maxWidth: 150 },
      filterPlaceholder: 'Item Name'
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
      key: 'size',
      header: 'Size',
      field: 'size',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: 100, maxWidth: 100 },
      filterPlaceholder: 'Size'
    },
    {
      key: 'quantity',
      header: 'Quantity',
      field: 'quantity',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: 100, maxWidth: 100 },
      filterPlaceholder: 'Quantity'
    },
    {
      key: 'date',
      header: 'Date',
      field: 'date',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: 120, maxWidth: 120 },
      filterPlaceholder: 'Date'
    },
    {
      key: 'batchNo',
      header: 'Batch No',
      field: 'batchNo',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: 120, maxWidth: 120 },
      filterPlaceholder: 'Batch No'
    },
    {
      key: 'location',
      header: 'Location',
      field: 'location',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: 140, maxWidth: 140 },
      filterPlaceholder: 'Location'
    },
    {
      key: 'thickness',
      header: 'Thickness',
      field: 'thickness',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: 120, maxWidth: 120 },
      filterPlaceholder: 'Thickness'
    },
    {
      key: 'time',
      header: 'Time',
      field: 'time',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: 100, maxWidth: 100 },
      filterPlaceholder: 'Time'
    }
  ];

  const onRowSelect = async (rowData: any, action: any) => {
    if (action === ACTIONS.DELETE) {
      setSelectedItem(rowData);
      setIsDeleteDialogVisible(true);
    }

    if (action == ACTIONS.EDIT) {
      setSelectedItem(rowData);
      setIsSheetOpen(true);
    }

    if (action === ACTIONS.VIEW) {
      // Handle view action if needed
    }
  };

  const handleOpenCreateSheet = () => {
    setSelectedItem(null);
    setIsSheetOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogVisible(false);
    setSelectedItem(null);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    setSelectedItem(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;

    setIsDeleting(true);
    try {
      // Simulate API call with static data
      setTimeout(() => {
        const updatedItems = items.filter(
          (item) => item.id !== selectedItem.id
        );
        setItems(updatedItems);
        setTotalRecords(updatedItems.length);
        toast.success(`Item "${selectedItem.name}" deleted successfully!`);
        handleCloseDeleteDialog();
        setIsDeleting(false);
      }, 500);
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during deletion.');
      setIsDeleting(false);
    }
  };

  const handleFormSubmit = async (data: z.infer<typeof itemSchema>) => {
    setIsSubmitting(true);
    try {
      // Simulate API call with static data
      setTimeout(() => {
        if (selectedItem) {
          // Update existing item
          const updatedItems = items.map((item) =>
            item.id === selectedItem.id
              ? {
                  ...item,
                  ...data,
                  id: selectedItem.id
                }
              : item
          );
          setItems(updatedItems);
          toast.success('Item updated successfully!');
        } else {
          // Create new item
          const newItem = {
            ...data,
            evidencePhoto: data.evidencePhoto || `evidence_${data.id.toLowerCase()}.jpg`
          };
          setItems([...items, newItem]);
          setTotalRecords(items.length + 1);
          toast.success('Item created successfully!');
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
              Invard Material Management
            </h1>
          </div>
          <div className='flex gap-3'>
            <div className='flex gap-3'>
              <Button
                className='cursor-pointer bg-[#00A345] hover:bg-[#00A345]/10 hover:text-[#00A345]'
                onClick={handleOpenCreateSheet}
              >
                <CopyPlus /> New Item
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
        tableId='item-management'
        page={INITIAL_PAGE}
        limit={INITIAL_LIMIT}
        totalRecords={totalRecords}
        data={items}
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
        title={selectedItem ? 'Edit Item' : 'Create a New Item'}
        description='Fill in the details below to add a new item to the system.'
        fields={getItemFormFields()}
        schema={itemSchema}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        initialValues={
          selectedItem
            ? {
                id: selectedItem.id,
                grade: selectedItem.grade,
                size: selectedItem.size,
                quantity: selectedItem.quantity,
                date: selectedItem.date,
                batchNo: selectedItem.batchNo,
                name: selectedItem.name,
                location: selectedItem.location,
                thickness: selectedItem.thickness,
                evidencePhoto: selectedItem.evidencePhoto,
                time: selectedItem.time
              }
            : newItemInitialValues
        }
      />
    </PageContainer>
  );
}

export default MaterialManagement;