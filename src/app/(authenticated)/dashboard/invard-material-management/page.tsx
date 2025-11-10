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
import { CloudUpload, CopyPlus, Download, X, FileText, Image } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

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
  paymentReceived: string;
  scrapTaken: string;
  scrapQty: string;
  inwardPhotos: string[];
  outwardPhotos: string[];
  fileAttachments: string[];
  programDrgs: string[];
  accountingInvoice: string;
}

interface FormData {
  date: string;
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
  inwardPhotos: File[];
  outwardPhotos: File[];
  fileAttachments: File[];
  programDrgs: File[];
  accountingInvoice?: File;
  paymentReceived: string;
  scrapTaken: string;
  scrapQty: string;
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
  paymentReceived: z.string().optional(),
  scrapTaken: z.string().optional(),
  scrapQty: z.string().optional()
});

type ItemFormData = z.infer<typeof itemSchema>;

const newItemInitialValues: FormData = {
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
  paymentReceived: '',
  scrapTaken: '',
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

const grades = ['SS', 'MS', 'SS304', 'SS316', 'MS-C45', 'EN8', 'EN24', 'IS2062'];

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
    const quantityKg = ((parseFloat(length) * parseFloat(width) * parseFloat(thickness) * parseInt(quantityNos) * 8) / 1000000).toFixed(2);
    const totalCost = (parseFloat(cuttingLength) * parseFloat(thickness) * parseFloat(cuttingRate)).toFixed(2);

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
      customer: indianCustomers[Math.floor(Math.random() * (indianCustomers.length - 1))],
      materialDescription: indianMaterialDescriptions[Math.floor(Math.random() * indianMaterialDescriptions.length)],
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
      paymentReceived: Math.random() > 0.3 ? 'Yes' : 'No',
      scrapTaken: Math.random() > 0.5 ? 'Yes' : 'No',
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
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState<boolean>(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MaterialItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState<FormData>(newItemInitialValues);

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

  const calculateQuantityKg = (length: string, width: string, thickness: string, quantityNos: string): string => {
    if (!length || !width || !thickness || !quantityNos) return '';
    const result = (parseFloat(length) * parseFloat(width) * parseFloat(thickness) * parseInt(quantityNos) * 8) / 1000000;
    return result.toFixed(2);
  };

  const calculateTotalCost = (cuttingLength: string, thickness: string, cuttingRate: string): string => {
    if (!cuttingLength || !thickness || !cuttingRate) return '';
    const result = parseFloat(cuttingLength) * parseFloat(thickness) * parseFloat(cuttingRate);
    return result.toFixed(2);
  };

  const handleFormChange = (field: string, value: any) => {
    const updatedData = { ...formData, [field]: value };
    
    // Auto-calculate Quantity (Kg)
    if (['length', 'width', 'thickness', 'quantityNos'].includes(field)) {
      const quantityKg = calculateQuantityKg(
        field === 'length' ? value : updatedData.length,
        field === 'width' ? value : updatedData.width,
        field === 'thickness' ? value : updatedData.thickness,
        field === 'quantityNos' ? value : updatedData.quantityNos
      );
      updatedData.quantityKg = quantityKg;
    }

    // Auto-calculate Total Cost
    if (['cuttingLength', 'thickness', 'cuttingRate'].includes(field)) {
      const totalCost = calculateTotalCost(
        field === 'cuttingLength' ? value : updatedData.cuttingLength,
        field === 'thickness' ? value : updatedData.thickness,
        field === 'cuttingRate' ? value : updatedData.cuttingRate
      );
      updatedData.totalCost = totalCost;
    }

    setFormData(updatedData);
  };

  const handleFileUpload = (field: keyof FormData, files: FileList | null, isMultiple: boolean = false) => {
    if (!files) return;

    if (isMultiple) {
      const newFiles = Array.from(files);
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field] as File[] || []), ...newFiles]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: files[0]
      }));
    }
  };

  const removeFile = (field: keyof FormData, index: number) => {
    setFormData(prev => {
      const currentFiles = prev[field] as File[];
      if (Array.isArray(currentFiles)) {
        const updatedFiles = currentFiles.filter((_, i) => i !== index);
        return {
          ...prev,
          [field]: updatedFiles
        };
      }
      return prev;
    });
  };

  // Generate item form fields using shadcn components
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
      options: indianCustomers.map(customer => ({ label: customer, value: customer }))
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
      placeholder: 'Enter Length in mm'
    },
    {
      name: 'width',
      label: 'Width (mm)',
      type: 'number',
      placeholder: 'Enter Width in mm'
    },
    {
      name: 'thickness',
      label: 'Thickness (mm)',
      type: 'number',
      placeholder: 'Enter Thickness in mm'
    },
    {
      name: 'grade',
      label: 'Grade',
      type: 'select',
      placeholder: 'Select Grade',
      options: grades.map(grade => ({ label: grade, value: grade }))
    },
    {
      name: 'quantityNos',
      label: 'Quantity (NOS)',
      type: 'number',
      placeholder: 'Enter Quantity'
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
      placeholder: 'Enter Cutting Length'
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
      placeholder: 'Enter Cutting Rate'
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
      type: 'select',
      placeholder: 'Select Option',
      options: [
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' }
      ]
    },
    {
      name: 'scrapTaken',
      label: 'Scrap Taken',
      type: 'select',
      placeholder: 'Select Option',
      options: [
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' }
      ]
    },
    {
      name: 'scrapQty',
      label: 'Qty of Scrap approx Kgs',
      type: 'number',
      placeholder: 'Enter Scrap Quantity'
    }
  ];

  const columns = [
    {
      key: 'srNo',
      header: 'Sr No',
      body: (data: MaterialItem, options: any) => <span>{options.rowIndex + 1}</span>,
      bodyStyle: { minWidth: '70px', maxWidth: '70px', textAlign: 'center' as const }
    },
    {
      key: 'date',
      header: 'Date',
      field: 'date',
      filter: true,
      sortable: true,
      filterType: 'date' as const,
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
      bodyStyle: { minWidth: '90px', maxWidth: '90px', textAlign: 'center' as const },
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
      bodyStyle: { minWidth: '110px', maxWidth: '110px', textAlign: 'right' as const },
      filterPlaceholder: 'Length'
    },
    {
      key: 'width',
      header: 'Width (mm)',
      field: 'width',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: '110px', maxWidth: '110px', textAlign: 'right' as const },
      filterPlaceholder: 'Width'
    },
    {
      key: 'thickness',
      header: 'Thickness (mm)',
      field: 'thickness',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: '120px', maxWidth: '120px', textAlign: 'right' as const },
      filterPlaceholder: 'Thickness'
    },
    {
      key: 'grade',
      header: 'Grade',
      field: 'grade',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: '90px', maxWidth: '90px', textAlign: 'center' as const },
      filterPlaceholder: 'Grade'
    },
    {
      key: 'quantityNos',
      header: 'Qty (NOS)',
      field: 'quantityNos',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: '100px', maxWidth: '100px', textAlign: 'right' as const },
      filterPlaceholder: 'Qty NOS'
    },
    {
      key: 'quantityKg',
      header: 'Qty (Kg)',
      field: 'quantityKg',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: '100px', maxWidth: '100px', textAlign: 'right' as const },
      filterPlaceholder: 'Qty Kg'
    },
    {
      key: 'cuttingLength',
      header: 'Cutting (MTR)',
      field: 'cuttingLength',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: '120px', maxWidth: '120px', textAlign: 'right' as const },
      filterPlaceholder: 'Cutting'
    },
    {
      key: 'piercing',
      header: 'Piercing',
      field: 'piercing',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: '90px', maxWidth: '90px', textAlign: 'right' as const },
      filterPlaceholder: 'Piercing'
    },
    {
      key: 'cuttingRate',
      header: 'Cutting Rate (₹)',
      field: 'cuttingRate',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: '130px', maxWidth: '130px', textAlign: 'right' as const },
      filterPlaceholder: 'Rate'
    },
    {
      key: 'totalCost',
      header: 'Total Cost (₹)',
      field: 'totalCost',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: '120px', maxWidth: '120px', textAlign: 'right' as const },
      filterPlaceholder: 'Total Cost'
    },
    {
      key: 'paymentReceived',
      header: 'Payment',
      field: 'paymentReceived',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: '90px', maxWidth: '90px', textAlign: 'center' as const },
      filterPlaceholder: 'Payment'
    },
    {
      key: 'scrapTaken',
      header: 'Scrap Taken',
      field: 'scrapTaken',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: '110px', maxWidth: '110px', textAlign: 'center' as const },
      filterPlaceholder: 'Scrap'
    },
    {
      key: 'scrapQty',
      header: 'Scrap Qty (Kg)',
      field: 'scrapQty',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: '120px', maxWidth: '120px', textAlign: 'right' as const },
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
      setFormData({
        date: rowData.date,
        customer: rowData.customer,
        materialDescription: rowData.materialDescription,
        length: rowData.length,
        width: rowData.width,
        thickness: rowData.thickness,
        grade: rowData.grade,
        quantityNos: rowData.quantityNos,
        quantityKg: rowData.quantityKg,
        cuttingLength: rowData.cuttingLength,
        piercing: rowData.piercing,
        cuttingRate: rowData.cuttingRate,
        totalCost: rowData.totalCost,
        inwardPhotos: [],
        outwardPhotos: [],
        fileAttachments: [],
        programDrgs: [],
        accountingInvoice: undefined,
        paymentReceived: rowData.paymentReceived,
        scrapTaken: rowData.scrapTaken,
        scrapQty: rowData.scrapQty
      });
      setIsSheetOpen(true);
    }

    if (action === ACTIONS.VIEW) {
      // Handle view action if needed
    }
  };

  const handleOpenCreateSheet = () => {
    setSelectedItem(null);
    setFormData({
      ...newItemInitialValues,
      date: new Date().toISOString().split('T')[0]
    });
    setIsSheetOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogVisible(false);
    setSelectedItem(null);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    setSelectedItem(null);
    setFormData(newItemInitialValues);
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
        toast.success(`Item "${selectedItem.materialDescription}" deleted successfully!`);
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
            inwardPhotos: data.inwardPhotos?.map(f => f.name) || [],
            outwardPhotos: data.outwardPhotos?.map(f => f.name) || [],
            fileAttachments: data.fileAttachments?.map(f => f.name) || [],
            programDrgs: data.programDrgs?.map(f => f.name) || [],
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

  // Custom form component with shadcn components
  const CustomFormContent = () => (
    <div className="space-y-6">
      {/* Material Details Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Material Details
          </CardTitle>
          <CardDescription>Enter the basic material information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleFormChange('date', e.target.value)}
                disabled={!selectedItem}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer">Customer</Label>
              <Select
                value={formData.customer}
                onValueChange={(value) => handleFormChange('customer', value)}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder="Select Customer" />
                </SelectTrigger>
                <SelectContent className='w-full'>
                  {indianCustomers.map((customer) => (
                    <SelectItem key={customer} value={customer}>
                      {customer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="materialDescription">Material Description</Label>
              <Input
                id="materialDescription"
                value={formData.materialDescription}
                onChange={(e) => handleFormChange('materialDescription', e.target.value)}
                placeholder="Enter material description"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dimensions Card */}
      <Card>
        <CardHeader>
          <CardTitle>Dimensions & Specifications</CardTitle>
          <CardDescription>Enter material dimensions and grade</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="length">Length (mm)</Label>
              <Input
                id="length"
                type="number"
                value={formData.length}
                onChange={(e) => handleFormChange('length', e.target.value)}
                placeholder="Enter length"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="width">Width (mm)</Label>
              <Input
                id="width"
                type="number"
                value={formData.width}
                onChange={(e) => handleFormChange('width', e.target.value)}
                placeholder="Enter width"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="thickness">Thickness (mm)</Label>
              <Input
                id="thickness"
                type="number"
                value={formData.thickness}
                onChange={(e) => handleFormChange('thickness', e.target.value)}
                placeholder="Enter thickness"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="grade">Grade</Label>
              <Select
                value={formData.grade}
                onValueChange={(value) => handleFormChange('grade', value)}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder="Select Grade" />
                </SelectTrigger>
                <SelectContent className='w-full'>
                  {grades.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quantity & Calculations Card */}
      <Card>
        <CardHeader>
          <CardTitle>Quantity & Calculations</CardTitle>
          <CardDescription>Quantity details and auto-calculations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantityNos">Quantity (NOS)</Label>
              <Input
                id="quantityNos"
                type="number"
                value={formData.quantityNos}
                onChange={(e) => handleFormChange('quantityNos', e.target.value)}
                placeholder="Enter quantity"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantityKg">Quantity (Kg)</Label>
              <Input
                id="quantityKg"
                type="number"
                value={formData.quantityKg}
                disabled
                className="bg-muted"
                placeholder="Auto-calculated"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cutting Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>Cutting Details</CardTitle>
          <CardDescription>Cutting specifications and costs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cuttingLength">Cutting Length (MTR)</Label>
              <Input
                id="cuttingLength"
                type="number"
                value={formData.cuttingLength}
                onChange={(e) => handleFormChange('cuttingLength', e.target.value)}
                placeholder="Enter cutting length"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="piercing">Piercing</Label>
              <Input
                id="piercing"
                type="number"
                value={formData.piercing}
                onChange={(e) => handleFormChange('piercing', e.target.value)}
                placeholder="Enter piercing count"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cuttingRate">Cutting Rate (₹/mm)</Label>
              <Input
                id="cuttingRate"
                type="number"
                value={formData.cuttingRate}
                onChange={(e) => handleFormChange('cuttingRate', e.target.value)}
                placeholder="Enter cutting rate"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalCost">Total Cost (₹)</Label>
              <Input
                id="totalCost"
                type="number"
                value={formData.totalCost}
                disabled
                className="bg-muted"
                placeholder="Auto-calculated"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="paymentReceived">Payment Received</Label>
              <Select
                value={formData.paymentReceived}
                onValueChange={(value) => handleFormChange('paymentReceived', value)}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent className='w-full'> 
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="scrapTaken">Scrap Taken</Label>
              <Select
                value={formData.scrapTaken}
                onValueChange={(value) => handleFormChange('scrapTaken', value)}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent className='w-full'>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="scrapQty">Scrap Qty (Kg)</Label>
              <Input
                id="scrapQty"
                type="number"
                value={formData.scrapQty}
                onChange={(e) => handleFormChange('scrapQty', e.target.value)}
                placeholder="Enter scrap quantity"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File Uploads Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CloudUpload className="h-5 w-5" />
            File Uploads
          </CardTitle>
          <CardDescription>Upload required documents and photos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Inward Photos */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Image className="h-4 w-4 text-blue-600" />
              Inward Photos (Multiple)
            </Label>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                onChange={(e) => handleFileUpload('inwardPhotos', e.target.files, true)}
                className="flex-1"
              />
            </div>
            <div className="space-y-2">
              {formData.inwardPhotos.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">{file.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {(file.size / 1024).toFixed(1)} KB
                    </Badge>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile('inwardPhotos', index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Outward Photos */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Image className="h-4 w-4 text-green-600" />
              Outward Photos (Multiple)
            </Label>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                onChange={(e) => handleFileUpload('outwardPhotos', e.target.files, true)}
                className="flex-1"
              />
            </div>
            <div className="space-y-2">
              {formData.outwardPhotos.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-green-50 p-3 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">{file.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {(file.size / 1024).toFixed(1)} KB
                    </Badge>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile('outwardPhotos', index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* File Attachments */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-purple-600" />
              File Attachments (Multiple)
            </Label>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                onChange={(e) => handleFileUpload('fileAttachments', e.target.files, true)}
                className="flex-1"
              />
            </div>
            <div className="space-y-2">
              {formData.fileAttachments.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-purple-50 p-3 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">{file.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {(file.size / 1024).toFixed(1)} KB
                    </Badge>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile('fileAttachments', index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Program/Drgs */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-orange-600" />
              Program/Drgs (Multiple)
            </Label>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                multiple
                accept=".dwg,.dxf,.nc,.cnc,.pdf,.jpg,.png"
                onChange={(e) => handleFileUpload('programDrgs', e.target.files, true)}
                className="flex-1"
              />
            </div>
            <div className="space-y-2">
              {formData.programDrgs.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-orange-50 p-3 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium">{file.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {(file.size / 1024).toFixed(1)} KB
                    </Badge>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile('programDrgs', index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Accounting Invoice */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-red-600" />
              Accounting Invoice (Single)
            </Label>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept=".pdf,.jpg,.png,.xls,.xlsx"
                onChange={(e) => handleFileUpload('accountingInvoice', e.target.files, false)}
                className="flex-1"
              />
            </div>
            {formData.accountingInvoice && (
              <div className="flex items-center justify-between bg-red-50 p-3 rounded-lg border">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium">{formData.accountingInvoice.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {(formData.accountingInvoice.size / 1024).toFixed(1)} KB
                  </Badge>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setFormData(prev => ({ ...prev, accountingInvoice: undefined }))}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

    </div>
  );

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
            <Button
              onClick={handleOpenCreateSheet}
              className="flex items-center gap-2"
            >
              <CopyPlus className="h-4 w-4" />
              New Item
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
            >
              <CloudUpload className="h-4 w-4" />
              Upload
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </div>
      
      {/* Data Table */}
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
                inwardPhotos: [],
                outwardPhotos: [],
                fileAttachments: [],
                programDrgs: [],
                accountingInvoice: undefined
              }
            : newItemInitialValues
        }
        customFormContent={<CustomFormContent />}
      />
    </PageContainer>
  );
}

export default MaterialManagement;