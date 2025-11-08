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

const userSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  email: z.email({ error: 'Please enter a valid email address.' }),
  phone: z.string().optional(),
  roleId: z.string().min(1, 'Role is required.'),
  isActive: z.string().min(1, 'Status is required.')
});

type UserFormData = z.infer<typeof userSchema>;

const newUserInitialValues: UserFormData = {
  name: '',
  email: '',
  phone: '',
  roleId: '',
  isActive: 'true'
};

// Static data with 15 records
const staticUsers = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '123-456-7890',
    roleId: '1',
    roleName: 'Admin',
    isActive: true
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '123-456-7891',
    roleId: '2',
    roleName: 'Manager',
    isActive: true
  },
  {
    id: 3,
    name: 'Michael Brown',
    email: 'michael.b@example.com',
    phone: '123-456-7892',
    roleId: '2',
    roleName: 'Manager',
    isActive: false
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'emily.d@example.com',
    phone: '123-456-7893',
    roleId: '3',
    roleName: 'User',
    isActive: true
  },
  {
    id: 5,
    name: 'David Wilson',
    email: 'david.w@example.com',
    phone: '123-456-7894',
    roleId: '1',
    roleName: 'Admin',
    isActive: true
  },
  {
    id: 6,
    name: 'Jennifer Lee',
    email: 'jennifer.l@example.com',
    phone: '123-456-7895',
    roleId: '3',
    roleName: 'User',
    isActive: false
  },
  {
    id: 7,
    name: 'Robert Taylor',
    email: 'robert.t@example.com',
    phone: '123-456-7896',
    roleId: '2',
    roleName: 'Manager',
    isActive: true
  },
  {
    id: 8,
    name: 'Amanda Clark',
    email: 'amanda.c@example.com',
    phone: '123-456-7897',
    roleId: '3',
    roleName: 'User',
    isActive: true
  },
  {
    id: 9,
    name: 'Christopher Martin',
    email: 'chris.m@example.com',
    phone: '123-456-7898',
    roleId: '1',
    roleName: 'Admin',
    isActive: false
  },
  {
    id: 10,
    name: 'Jessica White',
    email: 'jessica.w@example.com',
    phone: '123-456-7899',
    roleId: '2',
    roleName: 'Manager',
    isActive: true
  },
  {
    id: 11,
    name: 'Matthew Anderson',
    email: 'matt.a@example.com',
    phone: '123-456-7800',
    roleId: '3',
    roleName: 'User',
    isActive: true
  },
  {
    id: 12,
    name: 'Elizabeth Thomas',
    email: 'elizabeth.t@example.com',
    phone: '123-456-7801',
    roleId: '3',
    roleName: 'User',
    isActive: false
  },
  {
    id: 13,
    name: 'Daniel Harris',
    email: 'daniel.h@example.com',
    phone: '123-456-7802',
    roleId: '2',
    roleName: 'Manager',
    isActive: true
  },
  {
    id: 14,
    name: 'Michelle Walker',
    email: 'michelle.w@example.com',
    phone: '123-456-7803',
    roleId: '1',
    roleName: 'Admin',
    isActive: true
  },
  {
    id: 15,
    name: 'Kevin King',
    email: 'kevin.k@example.com',
    phone: '123-456-7804',
    roleId: '3',
    roleName: 'User',
    isActive: true
  }
];

const staticRoles = [
  { roleId: 1, name: 'Admin' },
  { roleId: 2, name: 'Manager' },
  { roleId: 3, name: 'User' }
];

function UsersManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [totalRecords, setTotalRecords] = useState(10);
  const dataTableRef = useRef<ImprovedDataTableRef>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] =
    useState<any>(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchData({
      page: INITIAL_PAGE,
      limit: INITIAL_LIMIT,
      sortOrder: 'desc',
      sortBy: 'id'
    });
    fetchRoles();
  }, []);

  const fetchData = async (params?: any) => {
    setIsLoading(true);
    try {
      // Use static data instead of API call
      setTimeout(() => {
        setUsers(staticUsers);
        setTotalRecords(staticUsers.length);
        setIsLoading(false);
      }, 500); // Simulate loading delay
    } catch (err: any) {
      console.error('Error fetching data:', err);
      toast.error(err.message || 'An error occurred while fetching data.');
      setIsLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      // Use static roles data instead of API call
      setRoles(staticRoles);
    } catch (err: any) {
      console.error('Error fetching roles:', err);
      toast.error(err.message || 'An error occurred while fetching roles.');
    }
  };

  // Generate user form fields with dynamic roles dropdown
  const getUserFormFields = (): FormFieldConfig[] => [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      placeholder: 'e.g. Abhishek'
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'abhishek@example.com'
    },
    {
      name: 'phone',
      label: 'Phone',
      type: 'text',
      placeholder: 'e.g. 9503562161'
    },
    {
      name: 'roleId',
      label: 'Role',
      type: 'dropdown',
      placeholder: 'Select role',
      options: roles.map((role) => ({
        label: role.name,
        value: role.roleId.toString()
      }))
    },
    {
      name: 'isActive',
      label: 'Status',
      type: 'dropdown',
      placeholder: 'Select status',
      options: [
        { label: 'Active', value: 'true' },
        { label: 'Inactive', value: 'false' }
      ]
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
      header: 'Name',
      field: 'name',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: 150, maxWidth: 150 },
      filterPlaceholder: 'Name'
    },
    {
      key: 'email',
      header: 'Email',
      field: 'email',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: 200, maxWidth: 200 },
      filterPlaceholder: 'Email'
    },
    {
      key: 'phone',
      header: 'Phone',
      field: 'phone',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: 120, maxWidth: 120 },
      filterPlaceholder: 'Phone'
    },
    {
      key: 'role',
      header: 'Role',
      field: 'roleName',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: 120, maxWidth: 120 },
      filterPlaceholder: 'Role',
      body: (data: any) => (
        <span>{data.roleName || data.role?.name || '-'}</span>
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
      setSelectedUser(rowData);
      setIsDeleteDialogVisible(true);
    }

    if (action == ACTIONS.EDIT) {
      setSelectedUser(rowData);
      setIsSheetOpen(true);
    }

    if (action === ACTIONS.VIEW) {
    }
  };

  const handleOpenCreateSheet = () => {
    setSelectedUser(null);
    setIsSheetOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogVisible(false);
    setSelectedUser(null);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;

    setIsDeleting(true);
    try {
      // Simulate API call with static data
      setTimeout(() => {
        const updatedUsers = users.filter(
          (user) => user.id !== selectedUser.id
        );
        setUsers(updatedUsers);
        setTotalRecords(updatedUsers.length);
        toast.success(`User "${selectedUser.name}" deleted successfully!`);
        handleCloseDeleteDialog();
        setIsDeleting(false);
      }, 500);
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during deletion.');
      setIsDeleting(false);
    }
  };

  const handleFormSubmit = async (data: z.infer<typeof userSchema>) => {
    setIsSubmitting(true);
    try {
      // Prepare the data for API
      const submitData = {
        ...data,
        isActive: data.isActive === 'true'
      };

      // Simulate API call with static data
      setTimeout(() => {
        if (selectedUser) {
          // Update existing user
          const updatedUsers = users.map((user) =>
            user.id === selectedUser.id
              ? {
                  ...user,
                  ...submitData,
                  id: selectedUser.id,
                  roleName:
                    staticRoles.find(
                      (role) => role.roleId.toString() === data.roleId
                    )?.name || 'User'
                }
              : user
          );
          setUsers(updatedUsers);
          toast.success('User updated successfully!');
        } else {
          // Create new user
          const newUser = {
            id: users.length + 1,
            ...submitData,
            roleName:
              staticRoles.find((role) => role.roleId.toString() === data.roleId)
                ?.name || 'User'
          };
          setUsers([...users, newUser]);
          setTotalRecords(users.length + 1);
          toast.success('User created successfully!');
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
              Users Management
            </h1>
          </div>
          <div className='flex gap-3'>
            <div className='flex gap-3'>
              <Button
                className='cursor-pointer bg-[#00A345] hover:bg-[#00A345]/10 hover:text-[#00A345]'
                onClick={handleOpenCreateSheet}
              >
                <CopyPlus /> New User
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
        tableId='user-management'
        page={INITIAL_PAGE}
        limit={INITIAL_LIMIT}
        totalRecords={totalRecords}
        data={users}
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
        title={selectedUser ? 'Edit User' : 'Create a New User'}
        description='Fill in the details below to add a new user to the system.'
        fields={getUserFormFields()}
        schema={userSchema}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        initialValues={
          selectedUser
            ? {
                name: selectedUser.name,
                email: selectedUser.email,
                phone: selectedUser.phone,
                roleId: selectedUser.roleId?.toString(),
                isActive: selectedUser.isActive?.toString()
              }
            : newUserInitialValues
        }
      />
    </PageContainer>
  );
}

export default UsersManagement;
