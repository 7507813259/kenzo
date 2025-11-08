'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { Loader2 } from 'lucide-react';

export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'switch';

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
  defaultValue?: any;
  fetchOptions?: () => Promise<Array<{ label: string; value: string }>>;
  colSpan?: number;
}

interface FormDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  fields: FormField[];
  onSubmit: (data: Record<string, any>) => Promise<void>;
  loading?: boolean;
  initialData?: Record<string, any>;
  isEdit?: boolean;
}

export function FormDrawer({
  open,
  onOpenChange,
  title,
  description,
  fields,
  onSubmit,
  loading = false,
  initialData = {},
  isEdit = false
}: FormDrawerProps) {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dropdownOptions, setDropdownOptions] = useState<
    Record<string, Array<{ label: string; value: string }>>
  >({});
  const [optionsLoading, setOptionsLoading] = useState<Record<string, boolean>>(
    {}
  );

  // Initialize form data when initialData changes or when opening in edit mode
  useEffect(() => {
    if (open) {
      setFormData(initialData);
      // Fetch dropdown options for fields that have fetchOptions
      fields.forEach(async (field) => {
        if (field.fetchOptions && !dropdownOptions[field.name]) {
          setOptionsLoading((prev) => ({ ...prev, [field.name]: true }));
          try {
            const options = await field.fetchOptions();
            setDropdownOptions((prev) => ({
              ...prev,
              [field.name]: options
            }));
          } catch (error) {
            console.error(`Failed to fetch options for ${field.name}:`, error);
          } finally {
            setOptionsLoading((prev) => ({ ...prev, [field.name]: false }));
          }
        }
      });
    }
  }, [open, initialData, isEdit]);

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      if (field.required) {
        if (field.type === 'checkbox' || field.type === 'switch') {
          if (
            formData[field.name] === undefined ||
            formData[field.name] === null
          ) {
            newErrors[field.name] = `${field.label} is required`;
          }
        } else {
          if (!formData[field.name] || formData[field.name] === '') {
            newErrors[field.name] = `${field.label} is required`;
          }
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  const handleClose = () => {
    setFormData({});
    setErrors({});
    onOpenChange(false);
  };

  const renderField = (field: FormField) => {
    const commonProps = {
      id: field.name,
      value: formData[field.name] ?? field.defaultValue ?? '',
      onChange: (value: any) => handleInputChange(field.name, value),
      placeholder: field.placeholder,
      required: field.required
    };

    // Get options - either from static options or fetched options
    const fieldOptions = dropdownOptions[field.name] || field.options || [];

    switch (field.type) {
      case 'select':
        return (
          <div className='relative'>
            <Select
              onValueChange={(value) => handleInputChange(field.name, value)}
              value={formData[field.name]?.toString()}
            >
              <SelectTrigger className='w-full'>
                <SelectValue
                  placeholder={
                    optionsLoading[field.name]
                      ? 'Loading...'
                      : field.placeholder || `Select ${field.label}`
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {optionsLoading[field.name] ? (
                  <div className='flex items-center justify-center py-2'>
                    <Loader2 className='h-4 w-4 animate-spin' />
                  </div>
                ) : (
                  fieldOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        );

      case 'checkbox':
        return (
          <Checkbox
            checked={formData[field.name] || false}
            onCheckedChange={(checked) =>
              handleInputChange(field.name, checked)
            }
          />
        );

      case 'switch':
        return (
          <Switch
            checked={formData[field.name] || false}
            onCheckedChange={(checked) =>
              handleInputChange(field.name, checked)
            }
          />
        );

      case 'textarea':
        return (
          <textarea
            {...commonProps}
            className='border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
            onChange={(e) => handleInputChange(field.name, e.target.value)}
          />
        );

      default:
        return (
          <Input
            {...commonProps}
            type={field.type}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
          />
        );
    }
  };

  // Group fields into rows of 2
  const groupedFields = [];
  for (let i = 0; i < fields.length; i += 2) {
    groupedFields.push(fields.slice(i, i + 2));
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className='flex w-full flex-col p-0 sm:w-1/2 sm:max-w-2xl'>
        <SheetHeader className='border-b p-4'>
          <SheetTitle className='text-xl font-semibold'>{title}</SheetTitle>
        </SheetHeader>

        {/* Scrollable content */}
        <form
          onSubmit={handleSubmit}
          className='flex-1 overflow-y-auto px-6 py-6'
        >
          <div className='space-y-6'>
            {groupedFields.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className='grid grid-cols-1 gap-6 md:grid-cols-2'
              >
                {row.map((field) => (
                  <div
                    key={field.name}
                    className={`space-y-2 ${field.colSpan === 2 ? 'md:col-span-2' : ''}`}
                  >
                    <Label htmlFor={field.name} className='text-sm font-medium'>
                      {field.label}
                      {field.required && (
                        <span className='ml-1 text-red-500'>*</span>
                      )}
                    </Label>
                    {renderField(field)}
                    {errors[field.name] && (
                      <p className='text-sm text-red-500'>
                        {errors[field.name]}
                      </p>
                    )}
                  </div>
                ))}
                {row.length === 1 && <div />}
              </div>
            ))}
          </div>
        </form>

        {/* Fixed footer */}
        <div className='bg-background sticky bottom-0 w-full border-t p-4'>
          <div className='flex justify-end space-x-3'>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              disabled={loading}
              className='min-w-24'
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={loading}
              className='min-w-24 bg-red-500 text-white hover:bg-red-600 focus:bg-red-600'
              onClick={handleSubmit}
            >
              {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              {isEdit ? 'Update' : 'Save'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
