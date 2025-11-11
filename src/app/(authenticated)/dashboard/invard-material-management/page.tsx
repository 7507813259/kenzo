'use client';
import PageContainer from '@/components/layout/page-container';
import ImprovedDataTable, {
  ImprovedDataTableRef
} from '@/components/table/ImprovedDataTable';
import { Button } from '@/components/ui/button';
import DeleteConfirmationDialog from '@/components/ui/custom/delete-dialog';
import { ACTIONS, INITIAL_LIMIT, INITIAL_PAGE } from '@/utils/constant';
import React, { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  FormFieldConfig,
  ReusableFormSheet
} from '@/components/drawer/add-fields-drawer';
import { CloudUpload, CopyPlus, Download } from 'lucide-react';

// Define proper TypeScript interfaces
interface MaterialItem {
  id: string;
  srNo: number;
  date: string;
  time: string;
  customer: string;
  materialDescription: string;
  length: string;
  width: string;
  thickness: string;
  grade: string;
  quantityNos: string;
  quantityKg: string;
  cuttingLength: string;
  piercing: string;
  cuttingRate: string;
  totalCost: string;
  paymentReceived: boolean; // Change to lowercase boolean
  scrapTaken: boolean; // Change to boolean
  scrapQty: string;
  inwardPhotos: string[];
  outwardPhotos: string[];
  fileAttachments: string[];
  programDrgs: string[];
  accountingInvoice: string;
}

const itemSchema = z.object({
  date: z.string().min(1, 'Date is required.'),
  customer: z.string().min(1, 'Customer is required.'),
  materialDescription: z.string().min(1, 'Material Description is required.'),
  length: z.string().min(1, 'Length is required.'),
  width: z.string().min(1, 'Width is required.'),
  thickness: z.string().min(1, 'Thickness is required.'),
  grade: z.string().min(1, 'Grade is required.'),
  quantityNos: z.string().min(1, 'Quantity (NOS) is required.'),
  quantityKg: z.string().optional(),
  cuttingLength: z.string().min(1, 'Cutting Length is required.'),
  piercing: z.string().min(1, 'Piercing is required.'),
  cuttingRate: z.string().min(1, 'Cutting Rate is required.'),
  totalCost: z.string().optional(),
  inwardPhotos: z.array(z.instanceof(File)).optional(),
  outwardPhotos: z.array(z.instanceof(File)).optional(),
  fileAttachments: z.array(z.instanceof(File)).optional(),
  programDrgs: z.array(z.instanceof(File)).optional(),
  accountingInvoice: z.instanceof(File).optional(),
  paymentReceived: z.boolean().optional(), // Add this
  scrapTaken: z.boolean().optional(), // Add this
  scrapQty: z.string().optional()
});

type ItemFormData = z.infer<typeof itemSchema>;

const newItemInitialValues: ItemFormData = {
  date: new Date().toISOString().split('T')[0],
  customer: '',
  materialDescription: '',
  length: '',
  width: '',
  thickness: '',
  grade: '',
  quantityNos: '',
  quantityKg: '',
  cuttingLength: '',
  piercing: '',
  cuttingRate: '',
  totalCost: '',
  inwardPhotos: [],
  outwardPhotos: [],
  fileAttachments: [],
  programDrgs: [],
  accountingInvoice: undefined,
  paymentReceived: false, // Change to false
  scrapTaken: false, // Change to false
  scrapQty: ''
};

// Realistic Indian data
const indianCustomers = [
  'Tata Steel Ltd',
  'Jindal Steel & Power',
  'SAIL (Steel Authority of India)',
  'Essar Steel India',
  'Bhushan Steel Limited',
  'JSW Steel Limited',
  'Vizag Steel Plant',
  'Mukand Steel Limited',
  'Sunflag Iron & Steel',
  'Kalyani Steels Ltd',
  'Other (Enter manually)'
];

const indianMaterialDescriptions = [
  'MS Plate 304 Grade',
  'SS Sheet 316L',
  'Carbon Steel Plate',
  'Structural Steel Beam',
  'Galvanized Iron Sheet',
  'Mild Steel Channel',
  'Stainless Steel Pipe',
  'Alloy Steel Round',
  'Tool Steel Flat',
  'HR Coil Steel'
];

const grades = [
  'SS',
  'MS',
  'SS304',
  'SS316',
  'MS-C45',
  'EN8',
  'EN24',
  'IS2062'
];

// Generate 10 realistic Indian dummy records
const generateDummyData = (): MaterialItem[] => {
  const dummyData: MaterialItem[] = [];
  const startDate = new Date(2024, 10, 1); // November 1, 2024

  for (let i = 1; i <= 10; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    const length = (Math.random() * 6000 + 2000).toFixed(0);
    const width = (Math.random() * 2000 + 1000).toFixed(0);
    const thickness = (Math.random() * 40 + 5).toFixed(1);
    const quantityNos = (Math.floor(Math.random() * 50) + 5).toString();
    const cuttingLength = (Math.random() * 500 + 50).toFixed(1);
    const cuttingRate = (Math.random() * 8 + 2).toFixed(2);

    // Calculate auto values with Indian context
    const quantityKg = (
      (parseFloat(length) *
        parseFloat(width) *
        parseFloat(thickness) *
        parseInt(quantityNos) *
        8) /
      1000000
    ).toFixed(2);
    const totalCost = (
      parseFloat(cuttingLength) *
      parseFloat(thickness) *
      parseFloat(cuttingRate)
    ).toFixed(2);

    // Generate realistic Indian time
    const hours = Math.floor(Math.random() * 8) + 8;
    const minutes = Math.floor(Math.random() * 60);
    const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    // Generate file names for uploads
    const inwardPhotos = [`inward_${i}_1.jpg`, `inward_${i}_2.jpg`];
    const outwardPhotos = [`outward_${i}_1.jpg`, `outward_${i}_2.jpg`];
    const fileAttachments = [`attachment_${i}.pdf`, `spec_${i}.docx`];
    const programDrgs = [`drawing_${i}.dwg`, `program_${i}.nc`];
    const accountingInvoice = `invoice_${i}.pdf`;

    dummyData.push({
      id: `MAT-${(2024000 + i).toString()}`,
      srNo: i,
      date: currentDate.toISOString().split('T')[0],
      time: time,
      customer:
        indianCustomers[
          Math.floor(Math.random() * (indianCustomers.length - 1))
        ],
      materialDescription:
        indianMaterialDescriptions[
          Math.floor(Math.random() * indianMaterialDescriptions.length)
        ],
      length: length,
      width: width,
      thickness: thickness,
      grade: grades[Math.floor(Math.random() * grades.length)],
      quantityNos: quantityNos,
      quantityKg: quantityKg,
      cuttingLength: cuttingLength,
      piercing: (Math.floor(Math.random() * 15) + 3).toString(),
      cuttingRate: cuttingRate,
      totalCost: totalCost,
      paymentReceived: Math.random() > 0.3, // Change to boolean
      scrapTaken: Math.random() > 0.5, // Change to boolean
      scrapQty: (Math.random() * 45 + 5).toFixed(1),
      inwardPhotos,
      outwardPhotos,
      fileAttachments,
      programDrgs,
      accountingInvoice
    });
  }
  return dummyData;
};

function MaterialManagement() {
  const [items, setItems] = useState<MaterialItem[]>([]);
  const [totalRecords, setTotalRecords] = useState(10);
  const dataTableRef = useRef<ImprovedDataTableRef>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] =
    useState<boolean>(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MaterialItem | null>(null);
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
      setTimeout(() => {
        const dummyData = generateDummyData();
        setItems(dummyData);
        setTotalRecords(dummyData.length);
        setIsLoading(false);
      }, 500);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      toast.error(err.message || 'An error occurred while fetching data.');
      setIsLoading(false);
    }
  };

  // Calculation functions
  const calculateQuantityKg = (
    length: string,
    width: string,
    thickness: string,
    quantityNos: string
  ): string => {
    if (!length || !width || !thickness || !quantityNos) return '';
    const result =
      (parseFloat(length) *
        parseFloat(width) *
        parseFloat(thickness) *
        parseInt(quantityNos) *
        8) /
      1000000;
    return result.toFixed(2);
  };

  const calculateTotalCost = (
    cuttingLength: string,
    thickness: string,
    cuttingRate: string
  ): string => {
    if (!cuttingLength || !thickness || !cuttingRate) return '';
    const result =
      parseFloat(cuttingLength) *
      parseFloat(thickness) *
      parseFloat(cuttingRate);
    return result.toFixed(2);
  };

  // Generate item form fields with auto-calculation logic
  const getItemFormFields = (): FormFieldConfig[] => [
    {
      name: 'date',
      label: 'Date',
      type: 'date',
      placeholder: 'Select Date',
      disabled: !selectedItem
    },
    {
      name: 'customer',
      label: 'Customer',
      type: 'select',
      placeholder: 'Select Customer',
      options: indianCustomers.map((customer) => ({
        label: customer,
        value: customer
      }))
    },
    {
      name: 'materialDescription',
      label: 'Material Description',
      type: 'text',
      placeholder: 'Enter Material Description'
    },
    {
      name: 'length',
      label: 'Length (mm)',
      type: 'number',
      placeholder: 'Enter Length in mm',
      onValueChange: (
        value: any,
        setValue: (name: string, value: any) => void,
        formValues?: any
      ) => {
        const quantityKg = calculateQuantityKg(
          value,
          formValues?.width || '',
          formValues?.thickness || '',
          formValues?.quantityNos || ''
        );
        if (quantityKg) setValue('quantityKg', quantityKg);

        const totalCost = calculateTotalCost(
          formValues?.cuttingLength || '',
          formValues?.thickness || '',
          formValues?.cuttingRate || ''
        );
        if (totalCost) setValue('totalCost', totalCost);
      }
    },
    {
      name: 'width',
      label: 'Width (mm)',
      type: 'number',
      placeholder: 'Enter Width in mm',
      onValueChange: (
        value: any,
        setValue: (name: string, value: any) => void,
        formValues?: any
      ) => {
        const quantityKg = calculateQuantityKg(
          formValues?.length || '',
          value,
          formValues?.thickness || '',
          formValues?.quantityNos || ''
        );
        if (quantityKg) setValue('quantityKg', quantityKg);
      }
    },
    {
      name: 'thickness',
      label: 'Thickness (mm)',
      type: 'number',
      placeholder: 'Enter Thickness in mm',
      onValueChange: (
        value: any,
        setValue: (name: string, value: any) => void,
        formValues?: any
      ) => {
        const quantityKg = calculateQuantityKg(
          formValues?.length || '',
          formValues?.width || '',
          value,
          formValues?.quantityNos || ''
        );
        if (quantityKg) setValue('quantityKg', quantityKg);

        const totalCost = calculateTotalCost(
          formValues?.cuttingLength || '',
          value,
          formValues?.cuttingRate || ''
        );
        if (totalCost) setValue('totalCost', totalCost);
      }
    },
    {
      name: 'grade',
      label: 'Grade',
      type: 'select',
      placeholder: 'Select Grade',
      options: grades.map((grade) => ({ label: grade, value: grade }))
    },
    {
      name: 'quantityNos',
      label: 'Quantity (NOS)',
      type: 'number',
      placeholder: 'Enter Quantity',
      onValueChange: (
        value: any,
        setValue: (name: string, value: any) => void,
        formValues?: any
      ) => {
        const quantityKg = calculateQuantityKg(
          formValues?.length || '',
          formValues?.width || '',
          formValues?.thickness || '',
          value
        );
        if (quantityKg) setValue('quantityKg', quantityKg);
      }
    },
    {
      name: 'quantityKg',
      label: 'Quantity (Kg)',
      type: 'number',
      placeholder: 'Auto-calculated',
      disabled: true
    },
    {
      name: 'cuttingLength',
      label: 'Cutting Length (MTR)',
      type: 'number',
      placeholder: 'Enter Cutting Length',
      onValueChange: (
        value: any,
        setValue: (name: string, value: any) => void,
        formValues?: any
      ) => {
        const totalCost = calculateTotalCost(
          value,
          formValues?.thickness || '',
          formValues?.cuttingRate || ''
        );
        if (totalCost) setValue('totalCost', totalCost);
      }
    },
    {
      name: 'piercing',
      label: 'Piercing',
      type: 'number',
      placeholder: 'Enter Piercing Count'
    },
    {
      name: 'cuttingRate',
      label: 'Cutting Rate (₹/mm)',
      type: 'number',
      placeholder: 'Enter Cutting Rate',
      onValueChange: (
        value: any,
        setValue: (name: string, value: any) => void,
        formValues?: any
      ) => {
        const totalCost = calculateTotalCost(
          formValues?.cuttingLength || '',
          formValues?.thickness || '',
          value
        );
        if (totalCost) setValue('totalCost', totalCost);
      }
    },
    {
      name: 'totalCost',
      label: 'Total Cost (₹)',
      type: 'number',
      placeholder: 'Auto-calculated',
      disabled: true
    },
    {
      name: 'paymentReceived',
      label: 'Payment Received',
      type: 'dropdown',
      placeholder: 'Select Option',
      options: [
        { label: 'Yes', value: 'true' }, // Use string 'true'
        { label: 'No', value: 'false' } // Use string 'false'
      ]
    },
    {
      name: 'scrapTaken',
      label: 'Scrap Taken',
      type: 'dropdown',
      placeholder: 'Select Option',
      options: [
        { label: 'Yes', value: 'true' }, // Use string 'true'
        { label: 'No', value: 'false' } // Use string 'false'
      ]
    },
    {
      name: 'scrapQty',
      label: 'Qty of Scrap approx Kgs',
      type: 'number',
      placeholder: 'Enter Scrap Quantity'
    },
    {
      name: 'inwardPhotos',
      label: 'Inward Photos',
      type: 'file',
      placeholder: 'Upload inward photos',
      multiple: true,
      accept: 'image/*,.pdf,.doc,.docx'
    },
    {
      name: 'outwardPhotos',
      label: 'Outward Photos',
      type: 'file',
      placeholder: 'Upload outward photos',
      multiple: true,
      accept: 'image/*,.pdf,.doc,.docx'
    },
    {
      name: 'fileAttachments',
      label: 'File Attachments',
      type: 'file',
      placeholder: 'Upload file attachments',
      multiple: true,
      accept: '.pdf,.doc,.docx,.xls,.xlsx,.txt'
    },
    {
      name: 'programDrgs',
      label: 'Program/Drgs',
      type: 'file',
      placeholder: 'Upload program/drgs files',
      multiple: true,
      accept: '.dwg,.dxf,.nc,.cnc,.pdf,.jpg,.png'
    },
    {
      name: 'accountingInvoice',
      label: 'Accounting Invoice',
      type: 'file',
      placeholder: 'Upload accounting invoice',
      accept: '.pdf,.jpg,.png,.xls,.xlsx'
    }
  ];

  const columns = [
    {
      key: 'srNo',
      header: 'Sr No',
      body: (data: MaterialItem, options: any) => (
        <span>{options.rowIndex + 1}</span>
      ),
      bodyStyle: {
        minWidth: '70px',
        maxWidth: '70px',
        textAlign: 'center' as const
      }
    },
    {
      key: 'date',
      header: 'Date',
      field: 'date',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: '110px', maxWidth: '110px' },
      filterPlaceholder: 'Date'
    },
    {
      key: 'time',
      header: 'Time',
      field: 'time',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: {
        minWidth: '90px',
        maxWidth: '90px',
        textAlign: 'center' as const
      },
      filterPlaceholder: 'Time'
    },
    {
      key: 'customer',
      header: 'Customer',
      field: 'customer',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: '200px', maxWidth: '200px' },
      filterPlaceholder: 'Customer'
    },
    {
      key: 'materialDescription',
      header: 'Material Description',
      field: 'materialDescription',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: '220px', maxWidth: '220px' },
      filterPlaceholder: 'Material'
    },
    {
      key: 'length',
      header: 'Length (mm)',
      field: 'length',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: {
        minWidth: '110px',
        maxWidth: '110px',
        textAlign: 'right' as const
      },
      filterPlaceholder: 'Length'
    },
    {
      key: 'width',
      header: 'Width (mm)',
      field: 'width',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: {
        minWidth: '110px',
        maxWidth: '110px',
        textAlign: 'right' as const
      },
      filterPlaceholder: 'Width'
    },
    {
      key: 'thickness',
      header: 'Thickness (mm)',
      field: 'thickness',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: {
        minWidth: '120px',
        maxWidth: '120px',
        textAlign: 'right' as const
      },
      filterPlaceholder: 'Thickness'
    },
    {
      key: 'grade',
      header: 'Grade',
      field: 'grade',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: {
        minWidth: '90px',
        maxWidth: '90px',
        textAlign: 'center' as const
      },
      filterPlaceholder: 'Grade'
    },
    {
      key: 'quantityNos',
      header: 'Qty (NOS)',
      field: 'quantityNos',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: {
        minWidth: '100px',
        maxWidth: '100px',
        textAlign: 'right' as const
      },
      filterPlaceholder: 'Qty NOS'
    },
    {
      key: 'quantityKg',
      header: 'Qty (Kg)',
      field: 'quantityKg',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: {
        minWidth: '100px',
        maxWidth: '100px',
        textAlign: 'right' as const
      },
      filterPlaceholder: 'Qty Kg'
    },
    {
      key: 'cuttingLength',
      header: 'Cutting (MTR)',
      field: 'cuttingLength',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: {
        minWidth: '120px',
        maxWidth: '120px',
        textAlign: 'right' as const
      },
      filterPlaceholder: 'Cutting'
    },
    {
      key: 'piercing',
      header: 'Piercing',
      field: 'piercing',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: {
        minWidth: '90px',
        maxWidth: '90px',
        textAlign: 'right' as const
      },
      filterPlaceholder: 'Piercing'
    },
    {
      key: 'cuttingRate',
      header: 'Cutting Rate (₹)',
      field: 'cuttingRate',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: {
        minWidth: '130px',
        maxWidth: '130px',
        textAlign: 'right' as const
      },
      filterPlaceholder: 'Rate'
    },
    {
      key: 'totalCost',
      header: 'Total Cost (₹)',
      field: 'totalCost',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: {
        minWidth: '120px',
        maxWidth: '120px',
        textAlign: 'right' as const
      },
      filterPlaceholder: 'Total Cost'
    },
    {
      key: 'paymentReceived',
      header: 'Payment',
      field: 'paymentReceived',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: {
        minWidth: '90px',
        maxWidth: '90px',
        textAlign: 'center' as const
      },
      filterPlaceholder: 'Payment'
    },
    {
      key: 'scrapTaken',
      header: 'Scrap Taken',
      field: 'scrapTaken',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: {
        minWidth: '110px',
        maxWidth: '110px',
        textAlign: 'center' as const
      },
      filterPlaceholder: 'Scrap'
    },
    {
      key: 'scrapQty',
      header: 'Scrap Qty (Kg)',
      field: 'scrapQty',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: {
        minWidth: '120px',
        maxWidth: '120px',
        textAlign: 'right' as const
      },
      filterPlaceholder: 'Scrap Qty'
    }
  ];

  const onRowSelect = async (rowData: MaterialItem, action: string) => {
    if (action === ACTIONS.DELETE) {
      setSelectedItem(rowData);
      setIsDeleteDialogVisible(true);
    }

    if (action === ACTIONS.EDIT) {
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
      setTimeout(() => {
        const updatedItems = items.filter(
          (item) => item.id !== selectedItem.id
        );
        setItems(updatedItems);
        setTotalRecords(updatedItems.length);
        toast.success(
          `Item "${selectedItem.materialDescription}" deleted successfully!`
        );
        handleCloseDeleteDialog();
        setIsDeleting(false);
      }, 500);
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during deletion.');
      setIsDeleting(false);
    }
  };

  const handleFormSubmit = async (data: ItemFormData) => {
    setIsSubmitting(true);
    try {
      setTimeout(() => {
        const currentTime = new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });

        if (selectedItem) {
          const updatedItems = items.map((item: any) =>
            item.id === selectedItem.id
              ? {
                  ...item,
                  ...data,
                  time: currentTime,
                  id: selectedItem.id
                }
              : item
          );
          setItems(updatedItems);
          toast.success('Item updated successfully!');
        } else {
          const newItem: MaterialItem = {
            ...data,
            id: `MAT-${(2024000 + items.length + 1).toString()}`,
            srNo: items.length + 1,
            time: currentTime,
            paymentReceived: data.paymentReceived || false,
            scrapTaken: data.scrapTaken || false,
            scrapQty: data.scrapQty || '',
            inwardPhotos: data.inwardPhotos?.map((f) => f.name) || [],
            outwardPhotos: data.outwardPhotos?.map((f) => f.name) || [],
            fileAttachments: data.fileAttachments?.map((f) => f.name) || [],
            programDrgs: data.programDrgs?.map((f) => f.name) || [],
            accountingInvoice: data.accountingInvoice?.name || ''
          } as MaterialItem;
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
              Inward Material Management
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
        onView={(item: MaterialItem) => onRowSelect(item, 'view')}
        onEdit={(item: MaterialItem) => onRowSelect(item, 'edit')}
        onDelete={(item: MaterialItem) => onRowSelect(item, 'delete')}
      />

      <DeleteConfirmationDialog
        visible={isDeleteDialogVisible}
        isLoading={isDeleting}
        itemDescription={selectedItem?.materialDescription || ''}
        onHide={handleCloseDeleteDialog}
        onConfirm={handleDeleteConfirm}
      />

      <ReusableFormSheet
        isOpen={isSheetOpen}
        onClose={handleCloseSheet}
        title={selectedItem ? 'Edit Material Item' : 'Create New Material Item'}
        description='Fill in all the material details and upload required documents.'
        fields={getItemFormFields()}
        schema={itemSchema}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        initialValues={
          selectedItem
            ? {
                ...selectedItem,
                date: selectedItem.date,
                paymentReceived: selectedItem.paymentReceived, // Add this
                scrapTaken: selectedItem.scrapTaken, // Add this
                scrapQty: selectedItem.scrapQty, // Add this
                inwardPhotos: [],
                outwardPhotos: [],
                fileAttachments: [],
                programDrgs: [],
                accountingInvoice: undefined
              }
            : newItemInitialValues
        }
      />
    </PageContainer>
  );
}

export default MaterialManagement;
