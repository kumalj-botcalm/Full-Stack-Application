'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { useAuthContext } from '@/contexts/AuthContext';

// Type definition for your product data
export type Product = {
  _id: string;
  productId: number;
  name: string;
  description: string;
  category: string;
  price: number;
  image?: string;
};

// Function to create columns with callbacks
export const createColumns = (
  onViewClick: (product: Product) => void,
  onEditClick: (product: Product) => void,
  onDeleteClick: (product: Product) => void
): ColumnDef<Product>[] => {
  // Get user role for conditional rendering
  const { user } = useAuthContext();
  const isSeller = user?.role === 'seller';

  return [
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
    accessorKey: 'productId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
  },
  {
    accessorKey: 'image',
    header: 'Image',
    cell: ({ row }) => {
      const image = row.getValue('image') as string;
      return (
        <div className="w-16 h-16">
          {image ? (
            <img
              src={image}
              alt={`${row.getValue('name')} image`}
              className="w-full h-full object-cover rounded border"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 dark:bg-gray-800 rounded border flex items-center justify-center">
              <span className="text-gray-400 text-xs">No image</span>
            </div>
          )}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => (
      <div className="w-[280px] truncate">{row.getValue('description')}</div>
    ),
  },
  {
    accessorKey: 'category',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    filterFn: (row, id, value) => {
      // Enables category searching
      return row
        .getValue<string>(id)
        .toLowerCase()
        .includes(value.toLowerCase());
    },
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('price'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'LKR',
      }).format(price);
      return <div className="text-left font-medium">{formatted}</div>;
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const product = row.original;

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => onViewClick(product)}
          >
            <span className="sr-only">View product</span>
            <Eye className="h-4 w-4" />
          </Button>
          {isSeller && (
            <Button
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={() => onEditClick(product)}
            >
              <span className="sr-only">Edit product</span>
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {isSeller && (
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              onClick={() => onDeleteClick(product)}
            >
              <span className="sr-only">Delete product</span>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      );
    },
  },
];
};
