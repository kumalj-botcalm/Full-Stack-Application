'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

// Type definition for user data
export type User = {
  _id: string; // MongoDB uses _id field
  userId: number; // Auto-generated ID starting from 100
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  gender?: string;
  image?: string;
};

// Function to create columns with callbacks
export const createUserColumns = (
  onViewClick: (user: User) => void,
  onEditClick: (user: User) => void,
  onDeleteClick: (user: User) => void
): ColumnDef<User>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'userId',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        ID
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const userId = row.getValue('userId') as number;
      return <div className="font-mono text-sm font-medium">{userId}</div>;
    },
  },
  {
    accessorKey: 'image',
    header: 'Profile Image',
    cell: ({ row }) => {
      const image = row.getValue('image') as string;
      const firstName = row.getValue('firstName') as string;
      return (
        <div className="w-16 h-16">
          {image ? (
            <img
              src={image}
              alt={`${firstName} profile`}
              className="w-full h-full object-cover rounded-full border"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 dark:bg-gray-800 rounded-full border flex items-center justify-center">
              <span className="text-gray-400 text-xs">No image</span>
            </div>
          )}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: 'firstName',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        First Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: 'lastName',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Last Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },

  {
    accessorKey: 'email',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },

  {
    accessorKey: 'birthDate',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Birth Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('birthDate'));
      const formatted = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: 'gender',
    header: 'Gender',
    filterFn: (row, id, value) => {
      return row
        .getValue<string>(id)
        .toLowerCase()
        .includes(value.toLowerCase());
    },
  },
  {
    id: 'actions',
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const user = row.original;

      return (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => onViewClick(user)}
          >
            <span className="sr-only">View user</span>
            <Eye className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => onEditClick(user)}
          >
            <span className="sr-only">Edit user</span>
            <Edit className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            onClick={() => onDeleteClick(user)}
          >
            <span className="sr-only">Delete user</span>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
