'use client';

import FormDialog from '@/components/customUi/dialog-box';
import { Button } from '@/components/ui/button';
import { ImageViewer } from '@/components/customUi';
import { Product } from '../columns/product-columns';

interface ViewProductProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  product: Product;
}

const ViewProduct = ({
  open = false,
  onOpenChange,
  product,
}: ViewProductProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
    }).format(price);
  };

  // Define product fields for display
  const productFields = [
    {
      label: 'Product ID',
      key: 'productId' as keyof Product,
      render: (value: any) => value,
    },
    {
      label: 'Product Image',
      key: 'image' as keyof Product,
      render: (value: any) => (
        <div className="flex justify-center">
          <ImageViewer
            src={value}
            alt={`${product.name} - Product Image`}
            width="w-48"
            height="h-48"
            showPlaceholder={true}
          />
        </div>
      ),
      className: 'flex justify-center',
    },
    {
      label: 'Title',
      key: 'name' as keyof Product,
      render: (value: any) => value,
    },
    {
      label: 'Description',
      key: 'description' as keyof Product,
      render: (value: any) => value,
      className: 'min-h-[80px]',
    },
    {
      label: 'Category',
      key: 'category' as keyof Product,
      render: (value: any) => (
        <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset">
          {value}
        </span>
      ),
    },
    {
      label: 'Price',
      key: 'price' as keyof Product,
      render: (value: any) => (
        <span className="text-lg font-semibold text-green-600">
          {formatPrice(value)}
        </span>
      ),
    },
  ];

  return (
    <FormDialog
      label="Product Details"
      title="View Product"
      open={open}
      onOpenChange={onOpenChange}
    >
      <div className="flex flex-col h-full ">
        {/* Scrollable Content Area */}
        <div className="max-h-[60vh] overflow-y-auto space-y-6 pr-2">
          {productFields.map((field) => (
            <div key={field.key} className="space-y-2">
              <label className="text-sm font-medium ">
                {field.label}
              </label>
              <div
                className={`rounded-md border bg-muted p-3 ${field.className || ''}`}
              >
                {field.render(product[field.key])}
              </div>
            </div>
          ))}
        </div>

        {/* Fixed Action Buttons */}
        <div className="flex justify-end gap-3 border-t pt-4 mt-4">
          <Button variant="outline" onClick={() => onOpenChange?.(false)}>
            Close
          </Button>
        </div>
      </div>
    </FormDialog>
  );
};

export default ViewProduct;
