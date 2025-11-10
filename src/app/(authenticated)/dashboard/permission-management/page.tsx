// app/permissions/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Save, Download, Upload, Eye, EyeOff, Filter } from 'lucide-react';
import PageContainer from '@/components/layout/page-container';

// Types
interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface RolePermissions {
  [role: string]: {
    [permissionId: string]: boolean;
  };
}

interface Role {
  id: string;
  name: string;
  description: string;
}

// Mock data based on your requirements
const permissions: Permission[] = [
  {
    id: 'date',
    name: 'Date',
    description: 'Access to date information',
    category: 'basic'
  },
  {
    id: 'time',
    name: 'Time',
    description: 'Access to time information',
    category: 'basic'
  },
  {
    id: 'customer_name',
    name: 'Customer Name',
    description: 'Access to customer names',
    category: 'basic'
  },
  {
    id: 'material_description',
    name: 'Material Description',
    description: 'Material description access',
    category: 'material'
  },
  {
    id: 'grade',
    name: 'Grade',
    description: 'Material grade information',
    category: 'material'
  },
  {
    id: 'qty_nos',
    name: 'Qty (Nos)',
    description: 'Quantity in numbers',
    category: 'quantity'
  },
  {
    id: 'qty_kgs',
    name: 'Qty Kgs',
    description: 'Quantity in kilograms',
    category: 'quantity'
  },
  {
    id: 'cutting_length',
    name: 'Cutting Length Mtr',
    description: 'Cutting length in meters',
    category: 'operations'
  },
  {
    id: 'piercing',
    name: 'Piercing',
    description: 'Piercing operations',
    category: 'operations'
  },
  {
    id: 'cutting_rate',
    name: 'Cutting Rate',
    description: 'Cutting rate information',
    category: 'financial'
  },
  {
    id: 'total_cost',
    name: 'Total Cost',
    description: 'Total cost calculations',
    category: 'financial'
  },
  {
    id: 'inward_photo',
    name: 'Inward Photo',
    description: 'Inward photos access',
    category: 'media'
  },
  {
    id: 'outward_photo',
    name: 'Outward Photo',
    description: 'Outward photos access',
    category: 'media'
  },
  {
    id: 'file_attachments',
    name: 'File Attachments',
    description: 'File attachments access',
    category: 'documents'
  },
  {
    id: 'program_drgs',
    name: 'Program/Drgs',
    description: 'Program and drawings access',
    category: 'documents'
  },
  {
    id: 'accounting_invoice',
    name: 'Accounting Invoice',
    description: 'Accounting invoices',
    category: 'financial'
  },
  {
    id: 'payment_received',
    name: 'Payment Received',
    description: 'Payment status',
    category: 'financial'
  },
  {
    id: 'scrap_taken',
    name: 'Scrap Taken',
    description: 'Scrap information',
    category: 'operations'
  },
  {
    id: 'qty_scrap_approx',
    name: 'Qty of Scrap approx Kgs',
    description: 'Approximate scrap quantity',
    category: 'operations'
  }
];

const roles: Role[] = [
  { id: 'head1', name: 'Head 1', description: 'Primary Head Role' },
  { id: 'head2', name: 'Head 2', description: 'Secondary Head Role' },
  { id: 'agent', name: 'Agent', description: 'Agent Role' },
  {
    id: 'programmer1',
    name: 'Programmer 1',
    description: 'Primary Programmer'
  },
  {
    id: 'programmer2',
    name: 'Programmer 2',
    description: 'Secondary Programmer'
  },
  { id: 'accounts', name: 'Accounts', description: 'Accounts Department' },
  { id: 'shop_help1', name: 'Shop Help 1', description: 'Shop Assistant 1' },
  { id: 'shop_help2', name: 'Shop Help 2', description: 'Shop Assistant 2' },
  { id: 'shop_help3', name: 'Shop Help 3', description: 'Shop Assistant 3' },
  { id: 'shop_help4', name: 'Shop Help 4', description: 'Shop Assistant 4' }
];

const initialPermissions: RolePermissions = {
  head1: {
    date: true,
    time: true,
    customer_name: true,
    material_description: true,
    grade: true,
    qty_nos: true,
    qty_kgs: true,
    cutting_length: true,
    piercing: true,
    cutting_rate: true,
    total_cost: true,
    inward_photo: true,
    outward_photo: true,
    file_attachments: true,
    program_drgs: true,
    accounting_invoice: true,
    payment_received: true,
    scrap_taken: false,
    qty_scrap_approx: true
  },
  head2: {
    date: true,
    time: true,
    customer_name: true,
    material_description: true,
    grade: true,
    qty_nos: true,
    qty_kgs: true,
    cutting_length: true,
    piercing: true,
    cutting_rate: true,
    total_cost: true,
    inward_photo: true,
    outward_photo: true,
    file_attachments: true,
    program_drgs: true,
    accounting_invoice: true,
    payment_received: true,
    scrap_taken: false,
    qty_scrap_approx: true
  },
  agent: {
    date: true,
    time: true,
    customer_name: true,
    material_description: true,
    grade: true,
    qty_nos: true,
    qty_kgs: true,
    cutting_length: true,
    piercing: true,
    cutting_rate: true,
    total_cost: true,
    inward_photo: true,
    outward_photo: true,
    file_attachments: true,
    program_drgs: true,
    accounting_invoice: true,
    payment_received: true,
    scrap_taken: false,
    qty_scrap_approx: true
  },
  programmer1: {
    date: true,
    time: true,
    customer_name: true,
    material_description: true,
    grade: true,
    qty_nos: true,
    qty_kgs: true,
    cutting_length: true,
    piercing: true,
    cutting_rate: true,
    total_cost: true,
    inward_photo: true,
    outward_photo: true,
    file_attachments: true,
    program_drgs: true,
    accounting_invoice: true,
    payment_received: true,
    scrap_taken: true,
    qty_scrap_approx: true
  },
  programmer2: {
    date: true,
    time: true,
    customer_name: true,
    material_description: true,
    grade: true,
    qty_nos: true,
    qty_kgs: true,
    cutting_length: true,
    piercing: true,
    cutting_rate: true,
    total_cost: true,
    inward_photo: true,
    outward_photo: true,
    file_attachments: true,
    program_drgs: true,
    accounting_invoice: true,
    payment_received: true,
    scrap_taken: true,
    qty_scrap_approx: true
  },
  accounts: {
    date: true,
    time: true,
    customer_name: true,
    material_description: true,
    grade: true,
    qty_nos: true,
    qty_kgs: true,
    cutting_length: true,
    piercing: true,
    cutting_rate: false,
    total_cost: false,
    inward_photo: true,
    outward_photo: false,
    file_attachments: true,
    program_drgs: false,
    accounting_invoice: true,
    payment_received: false,
    scrap_taken: false,
    qty_scrap_approx: true
  },
  shop_help1: {
    date: true,
    time: true,
    customer_name: true,
    material_description: true,
    grade: true,
    qty_nos: true,
    qty_kgs: true,
    cutting_length: true,
    piercing: true,
    cutting_rate: true,
    total_cost: true,
    inward_photo: true,
    outward_photo: true,
    file_attachments: true,
    program_drgs: true,
    accounting_invoice: true,
    payment_received: false,
    scrap_taken: false,
    qty_scrap_approx: true
  },
  shop_help2: {
    date: true,
    time: true,
    customer_name: true,
    material_description: true,
    grade: true,
    qty_nos: true,
    qty_kgs: true,
    cutting_length: true,
    piercing: true,
    cutting_rate: false,
    total_cost: false,
    inward_photo: false,
    outward_photo: true,
    file_attachments: true,
    program_drgs: false,
    accounting_invoice: true,
    payment_received: false,
    scrap_taken: false,
    qty_scrap_approx: true
  },
  shop_help3: {
    date: true,
    time: true,
    customer_name: true,
    material_description: true,
    grade: true,
    qty_nos: true,
    qty_kgs: true,
    cutting_length: true,
    piercing: true,
    cutting_rate: false,
    total_cost: false,
    inward_photo: false,
    outward_photo: true,
    file_attachments: true,
    program_drgs: false,
    accounting_invoice: true,
    payment_received: false,
    scrap_taken: false,
    qty_scrap_approx: true
  },
  shop_help4: {
    date: true,
    time: true,
    customer_name: true,
    material_description: true,
    grade: true,
    qty_nos: true,
    qty_kgs: true,
    cutting_length: true,
    piercing: true,
    cutting_rate: false,
    total_cost: false,
    inward_photo: false,
    outward_photo: true,
    file_attachments: true,
    program_drgs: false,
    accounting_invoice: true,
    payment_received: false,
    scrap_taken: false,
    qty_scrap_approx: true
  }
};

export default function PermissionManagement() {
  const [rolePermissions, setRolePermissions] =
    useState<RolePermissions>(initialPermissions);
  const [selectedRole, setSelectedRole] = useState<string>(roles[0].id);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [hasChanges, setHasChanges] = useState(false);

  const categories = [
    'all',
    ...Array.from(new Set(permissions.map((p) => p.category)))
  ];

  const filteredPermissions =
    selectedCategory === 'all'
      ? permissions
      : permissions.filter((p) => p.category === selectedCategory);

  const handlePermissionChange = (permissionId: string, enabled: boolean) => {
    setRolePermissions((prev) => ({
      ...prev,
      [selectedRole]: {
        ...prev[selectedRole],
        [permissionId]: enabled
      }
    }));
    setHasChanges(true);
  };

  const handleBulkAction = (enabled: boolean) => {
    setRolePermissions((prev) => {
      const newPermissions = { ...prev };
      filteredPermissions.forEach((permission) => {
        newPermissions[selectedRole] = {
          ...newPermissions[selectedRole],
          [permission.id]: enabled
        };
      });
      return newPermissions;
    });
    setHasChanges(true);
  };

  const handleSave = () => {
    // Here you would typically send the updated permissions to your API
    console.log('Saving permissions:', rolePermissions);
    setHasChanges(false);
    // Add your API call here
  };

  const handleReset = () => {
    setRolePermissions(initialPermissions);
    setHasChanges(false);
  };

  const getPermissionCounts = (roleId: string) => {
    const rolePerms = rolePermissions[roleId];
    const total = Object.keys(rolePerms).length;
    const enabled = Object.values(rolePerms).filter(Boolean).length;
    return { total, enabled };
  };

  return (
    <PageContainer scrollable={false}>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold'>Permission Management</h1>
            <p className='text-muted-foreground'>
              Manage access rights for different user roles across the system
            </p>
          </div>
          <div className='flex gap-2'>
            <Button variant='outline' onClick={handleReset}>
              Reset
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasChanges}
              className='gap-2'
            >
              <Save className='h-4 w-4' />
              Save Changes
            </Button>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-4'>
          {/* Role Selection Sidebar */}
          <Card className='lg:col-span-1'>
            <CardHeader>
              <CardTitle>User Roles</CardTitle>
              <CardDescription>
                Select a role to manage permissions
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {roles.map((role) => {
                const counts = getPermissionCounts(role.id);
                return (
                  <div
                    key={role.id}
                    className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                      selectedRole === role.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedRole(role.id)}
                  >
                    <div className='flex items-start justify-between'>
                      <div>
                        <h3 className='font-semibold'>{role.name}</h3>
                        <p className='text-muted-foreground text-sm'>
                          {role.description}
                        </p>
                      </div>
                      <Badge variant='secondary'>
                        {counts.enabled}/{counts.total}
                      </Badge>
                    </div>
                    <div className='bg-secondary mt-2 h-2 w-full rounded-full'>
                      <div
                        className='bg-primary h-2 rounded-full transition-all'
                        style={{
                          width: `${(counts.enabled / counts.total) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Permissions Table */}
          <Card className='lg:col-span-3'>
            <CardHeader>
              <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
                <div>
                  <CardTitle>
                    Permissions for{' '}
                    {roles.find((r) => r.id === selectedRole)?.name}
                  </CardTitle>
                  <CardDescription>
                    Configure what this role can access and view
                  </CardDescription>
                </div>
                <div className='flex flex-wrap gap-2'>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className='w-[180px]'>
                      <Filter className='mr-2 h-4 w-4' />
                      <SelectValue placeholder='Filter by category' />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className='flex gap-1'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleBulkAction(true)}
                      className='gap-1'
                    >
                      <Eye className='h-4 w-4' />
                      Enable All
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleBulkAction(false)}
                      className='gap-1'
                    >
                      <EyeOff className='h-4 w-4' />
                      Disable All
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='rounded-md border'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='w-[300px]'>Permission</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className='text-center'>Access</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPermissions.map((permission) => (
                      <TableRow key={permission.id}>
                        <TableCell className='font-medium'>
                          {permission.name}
                        </TableCell>
                        <TableCell>
                          <span className='text-muted-foreground text-sm'>
                            {permission.description}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant='outline'>{permission.category}</Badge>
                        </TableCell>
                        <TableCell className='text-center'>
                          <Switch
                            checked={
                              rolePermissions[selectedRole]?.[permission.id] ||
                              false
                            }
                            onCheckedChange={(checked) =>
                              handlePermissionChange(permission.id, checked)
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredPermissions.length === 0 && (
                <div className='text-muted-foreground py-8 text-center'>
                  No permissions found for the selected category.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-muted-foreground text-sm font-medium'>
                    Total Roles
                  </p>
                  <p className='text-2xl font-bold'>{roles.length}</p>
                </div>
                <Badge variant='secondary'>Active</Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-muted-foreground text-sm font-medium'>
                    Total Permissions
                  </p>
                  <p className='text-2xl font-bold'>{permissions.length}</p>
                </div>
                <Badge variant='secondary'>Configured</Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-muted-foreground text-sm font-medium'>
                    Current Role
                  </p>
                  <p className='text-lg font-bold'>
                    {roles.find((r) => r.id === selectedRole)?.name}
                  </p>
                </div>
                <Badge variant='outline'>Selected</Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-muted-foreground text-sm font-medium'>
                    Changes
                  </p>
                  <p className='text-lg font-bold'>
                    {hasChanges ? 'Unsaved' : 'Saved'}
                  </p>
                </div>
                <Badge variant={hasChanges ? 'destructive' : 'default'}>
                  {hasChanges ? 'Pending' : 'Updated'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
