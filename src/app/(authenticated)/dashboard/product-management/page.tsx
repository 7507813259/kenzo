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

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required.'),
  batchNo: z.string().min(1, 'Batch number is required.'),
  length: z.string().min(1, 'Length is required.'),
  cost: z.number().min(0, 'Cost must be a positive number.'),
  inputWeight: z.string().min(1, 'Input weight is required.'),
  burningLoss: z.string().min(1, 'Burning loss is required.'),
  scrapRemaining: z.string().min(1, 'Scrap remaining is required.'),
  totalCuttings: z.number().min(0, 'Total cuttings must be a positive number.'),
  creatorName: z.string().min(1, 'Creator name is required.'),
  editorName: z.string().min(1, 'Editor name is required.')
});

type ProductFormData = z.infer<typeof productSchema>;

const newProductInitialValues: ProductFormData = {
  name: '',
  batchNo: '',
  length: '',
  cost: 0,
  inputWeight: '',
  burningLoss: '',
  scrapRemaining: '',
  totalCuttings: 0,
  creatorName: '',
  editorName: ''
};

const staticData = [
  {
    id: 1,
    name: 'Steel Rod',
    totalCuttings: 10,
    length: '12m',
    cost: 1500,
    inputWeight: '100kg',
    burningLoss: '5kg',
    scrapRemaining: '3kg',
    creatorName: 'John Smith',
    editorName: 'Sarah Johnson',
    batchNo: 'BATCH-001',
    file: 'steel_rod_batch_001.pdf'
  },
  {
    id: 2,
    name: 'Iron Sheet',
    totalCuttings: 8,
    length: '10m',
    cost: 1200,
    inputWeight: '80kg',
    burningLoss: '4kg',
    scrapRemaining: '2kg',
    creatorName: 'Michael Brown',
    editorName: 'Emily Davis',
    batchNo: 'BATCH-002',
    file: 'iron_sheet_batch_002.pdf'
  },
  {
    id: 3,
    name: 'Copper Wire',
    totalCuttings: 15,
    length: '25m',
    cost: 2500,
    inputWeight: '50kg',
    burningLoss: '2kg',
    scrapRemaining: '1kg',
    creatorName: 'David Wilson',
    editorName: 'Jennifer Lee',
    batchNo: 'BATCH-003',
    file: 'copper_wire_batch_003.pdf'
  },
  {
    id: 4,
    name: 'Aluminum Pipe',
    totalCuttings: 12,
    length: '18m',
    cost: 1800,
    inputWeight: '90kg',
    burningLoss: '6kg',
    scrapRemaining: '3kg',
    creatorName: 'Robert Taylor',
    editorName: 'Amanda Clark',
    batchNo: 'BATCH-004',
    file: 'aluminum_pipe_batch_004.pdf'
  },
  {
    id: 5,
    name: 'Brass Sheet',
    totalCuttings: 9,
    length: '15m',
    cost: 2100,
    inputWeight: '70kg',
    burningLoss: '3kg',
    scrapRemaining: '2kg',
    creatorName: 'Christopher Martin',
    editorName: 'Jessica White',
    batchNo: 'BATCH-005',
    file: 'brass_sheet_batch_005.pdf'
  },
  {
    id: 6,
    name: 'Steel Beam',
    totalCuttings: 14,
    length: '20m',
    cost: 3200,
    inputWeight: '150kg',
    burningLoss: '7kg',
    scrapRemaining: '5kg',
    creatorName: 'Matthew Anderson',
    editorName: 'Elizabeth Thomas',
    batchNo: 'BATCH-006',
    file: 'steel_beam_batch_006.pdf'
  },
  {
    id: 7,
    name: 'Titanium Rod',
    totalCuttings: 6,
    length: '8m',
    cost: 5000,
    inputWeight: '60kg',
    burningLoss: '2kg',
    scrapRemaining: '1kg',
    creatorName: 'Daniel Harris',
    editorName: 'Michelle Walker',
    batchNo: 'BATCH-007',
    file: 'titanium_rod_batch_007.pdf'
  },
  {
    id: 8,
    name: 'Iron Pipe',
    totalCuttings: 11,
    length: '16m',
    cost: 1600,
    inputWeight: '95kg',
    burningLoss: '5kg',
    scrapRemaining: '4kg',
    creatorName: 'Kevin King',
    editorName: 'John Smith',
    batchNo: 'BATCH-008',
    file: 'iron_pipe_batch_008.pdf'
  }
];

function ProductsManagement() {
  const [products, setProducts] = useState<any[]>([]);
  const [totalRecords, setTotalRecords] = useState(10);
  const dataTableRef = useRef<ImprovedDataTableRef>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState<any>(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
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
        setProducts(staticData);
        setTotalRecords(staticData.length);
        setIsLoading(false);
      }, 500); // Simulate loading delay
    } catch (err: any) {
      console.error('Error fetching data:', err);
      toast.error(err.message || 'An error occurred while fetching data.');
      setIsLoading(false);
    }
  };

  // Generate product form fields
  const getProductFormFields = (): FormFieldConfig[] => [
    {
      name: 'name',
      label: 'Product Name',
      type: 'text',
      placeholder: 'e.g. Steel Rod'
    },
    {
      name: 'batchNo',
      label: 'Batch Number',
      type: 'text',
      placeholder: 'e.g. BATCH-001'
    },
    {
      name: 'length',
      label: 'Length',
      type: 'text',
      placeholder: 'e.g. 12m'
    },
    {
      name: 'cost',
      label: 'Cost',
      type: 'number',
      placeholder: 'e.g. 1500'
    },
    {
      name: 'inputWeight',
      label: 'Input Weight',
      type: 'text',
      placeholder: 'e.g. 100kg'
    },
    {
      name: 'burningLoss',
      label: 'Burning Loss',
      type: 'text',
      placeholder: 'e.g. 5kg'
    },
    {
      name: 'scrapRemaining',
      label: 'Scrap Remaining',
      type: 'text',
      placeholder: 'e.g. 3kg'
    },
    {
      name: 'totalCuttings',
      label: 'Total Cuttings',
      type: 'number',
      placeholder: 'e.g. 10'
    },
    {
      name: 'creatorName',
      label: 'Creator Name',
      type: 'text',
      placeholder: 'e.g. John Smith'
    },
    {
      name: 'editorName',
      label: 'Editor Name',
      type: 'text',
      placeholder: 'e.g. Sarah Johnson'
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
      key: 'name',
      header: 'Product Name',
      field: 'name',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: 150, maxWidth: 150 },
      filterPlaceholder: 'Product Name'
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
      key: 'length',
      header: 'Length',
      field: 'length',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: 80, maxWidth: 80 },
      filterPlaceholder: 'Length'
    },
    {
      key: 'cost',
      header: 'Cost',
      field: 'cost',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: 100, maxWidth: 100 },
      filterPlaceholder: 'Cost',
      body: (data: any) => <span>${data.cost?.toLocaleString()}</span>
    },
    {
      key: 'inputWeight',
      header: 'Input Weight',
      field: 'inputWeight',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: 120, maxWidth: 120 },
      filterPlaceholder: 'Input Weight'
    },
    {
      key: 'burningLoss',
      header: 'Burning Loss',
      field: 'burningLoss',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: 140, maxWidth: 140 },
      filterPlaceholder: 'Burning Loss'
    },
    {
      key: 'scrapRemaining',
      header: 'Scrap Remaining',
      field: 'scrapRemaining',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: 160, maxWidth: 160 },
      filterPlaceholder: 'Scrap Remaining'
    },
    {
      key: 'totalCuttings',
      header: 'Total Cuttings',
      field: 'totalCuttings',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: 140, maxWidth: 140 },
      filterPlaceholder: 'Total Cuttings'
    },
    {
      key: 'creatorName',
      header: 'Creator',
      field: 'creatorName',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: 140, maxWidth: 140 },
      filterPlaceholder: 'Creator'
    },
    {
      key: 'editorName',
      header: 'Editor',
      field: 'editorName',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: 140, maxWidth: 140 },
      filterPlaceholder: 'Editor'
    }
  ];

  const onRowSelect = async (rowData: any, action: any) => {
    if (action === ACTIONS.DELETE) {
      setSelectedProduct(rowData);
      setIsDeleteDialogVisible(true);
    }

    if (action == ACTIONS.EDIT) {
      setSelectedProduct(rowData);
      setIsSheetOpen(true);
    }

    if (action === ACTIONS.VIEW) {
      // Handle view action if needed
    }
  };

  const handleOpenCreateSheet = () => {
    setSelectedProduct(null);
    setIsSheetOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogVisible(false);
    setSelectedProduct(null);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    setSelectedProduct(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;

    setIsDeleting(true);
    try {
      // Simulate API call with static data
      setTimeout(() => {
        const updatedProducts = products.filter(
          (product) => product.id !== selectedProduct.id
        );
        setProducts(updatedProducts);
        setTotalRecords(updatedProducts.length);
        toast.success(`Product "${selectedProduct.name}" deleted successfully!`);
        handleCloseDeleteDialog();
        setIsDeleting(false);
      }, 500);
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during deletion.');
      setIsDeleting(false);
    }
  };

  const handleFormSubmit = async (data: z.infer<typeof productSchema>) => {
    setIsSubmitting(true);
    try {
      // Simulate API call with static data
      setTimeout(() => {
        if (selectedProduct) {
          // Update existing product
          const updatedProducts = products.map((product) =>
            product.id === selectedProduct.id
              ? {
                  ...product,
                  ...data,
                  id: selectedProduct.id
                }
              : product
          );
          setProducts(updatedProducts);
          toast.success('Product updated successfully!');
        } else {
          // Create new product
          const newProduct = {
            id: products.length + 1,
            ...data,
            file: `${data.name.toLowerCase().replace(/\s+/g, '_')}_${data.batchNo.toLowerCase()}.pdf`
          };
          setProducts([...products, newProduct]);
          setTotalRecords(products.length + 1);
          toast.success('Product created successfully!');
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
              Products Management
            </h1>
          </div>
          <div className='flex gap-3'>
            <div className='flex gap-3'>
              <Button
                className='cursor-pointer bg-[#00A345] hover:bg-[#00A345]/10 hover:text-[#00A345]'
                onClick={handleOpenCreateSheet}
              >
                <CopyPlus /> New Product
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
        tableId='product-management'
        page={INITIAL_PAGE}
        limit={INITIAL_LIMIT}
        totalRecords={totalRecords}
        data={products}
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
        title={selectedProduct ? 'Edit Product' : 'Create a New Product'}
        description='Fill in the details below to add a new product to the system.'
        fields={getProductFormFields()}
        schema={productSchema}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        initialValues={
          selectedProduct
            ? {
                name: selectedProduct.name,
                batchNo: selectedProduct.batchNo,
                length: selectedProduct.length,
                cost: selectedProduct.cost,
                inputWeight: selectedProduct.inputWeight,
                burningLoss: selectedProduct.burningLoss,
                scrapRemaining: selectedProduct.scrapRemaining,
                totalCuttings: selectedProduct.totalCuttings,
                creatorName: selectedProduct.creatorName,
                editorName: selectedProduct.editorName
              }
            : newProductInitialValues
        }
      />
    </PageContainer>
  );
}

export default ProductsManagement;