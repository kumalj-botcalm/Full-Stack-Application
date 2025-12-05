import { useState } from 'react';
import { createColumns, Product } from './columns/product-columns';
import { DataTable } from '../../components/data-table/data-table';
import ViewProduct from './model/view-product';
import { useProducts } from '@/hooks/useProducts';
import { DataTableFilter } from '@/components/data-table/data-table-filter';
import { DataTableViewOptions } from '@/components/data-table/data-table-view-options';
import { Button } from '@/components/ui/button';
import DeleteConfirmDialog from '../../components/customUi/DeleteConfirmDialog';
import ProductForm from '@/pages/products/forms/ProductForm';
import { useDeleteProduct } from '@/hooks/useProductMutations';
import { PaginationState } from '@tanstack/react-table';
import { useAuthContext } from '@/contexts/AuthContext';

export default function ProductsPage() {
  // Get user role for conditional rendering
  const { user } = useAuthContext();
  const isSeller = user?.role === 'seller';

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewProduct, setViewProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Delete confirmation dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Edit form state
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  // Delete product mutation
  const deleteProductMutation = useDeleteProduct();

  // Pagination state
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 6,
  });

  // Use React Query hook for fetching products with pagination
  const {
    data: productsResponse,
    isLoading,
    error,
  } = useProducts({
    page: paginationState.pageIndex + 1,
    limit: paginationState.pageSize,
  });

  const allProducts = productsResponse?.products ?? [];
  const totalPages = productsResponse?.pagination?.totalPages ?? 0;

  // Handle view button click
  const handleViewClick = (product: Product) => {
    console.log('Viewing product:', product);
    setSelectedProduct(product);
    setViewProduct(true);
  };

  // Handle view product dialog close
  const handleViewProductClose = (open: boolean) => {
    setViewProduct(open);
    if (!open) {
      setSelectedProduct(null);
    }
  };

  // Handle edit button click
  const handleEditClick = (product: Product) => {
    setProductToEdit(product);
    setIsEditFormOpen(true);
  };

  // Handle delete button click
  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (productToDelete) {
      await deleteProductMutation.mutateAsync(productToDelete.productId);
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  // Handle add product button click
  const handleAddProduct = () => {
    setIsFormOpen(true);
  };

  // Create columns with callbacks
  const columns = createColumns(handleViewClick, handleEditClick, handleDeleteClick);

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;
  if (error)
    return <div className="p-10 text-center text-red-500">{error.message}</div>;

  return (
    <div className="bg-card space-y-6 rounded-lg p-12 shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground mt-2">
            Manage your product catalog and inventory
          </p>
        </div>
        {isSeller && (
          <Button onClick={handleAddProduct} className="ml-4">
            Add Product
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={allProducts}
        showPagination={true}
        manualPagination={true}
        pageCount={totalPages}
        paginationState={paginationState}
        onPaginationChange={setPaginationState}
        paginationOptions={{
          pageSizeOptions: [6, 10, 20, 50],
          showFirstLastButtons: true,
          showSelectedRows: true,
        }}
        toolbar={(table) => (
          <div className="flex w-full items-center space-x-4">
            <DataTableFilter
              table={table}
              columnKey="category"
              placeholder="Filter by category..."
              className="max-w-sm"
            />
            <DataTableViewOptions table={table} />
          </div>
        )}
      />

      {/* View Product Dialog */}
      {viewProduct && selectedProduct && (
        <ViewProduct
          open={viewProduct}
          onOpenChange={handleViewProductClose}
          product={selectedProduct}
        />
      )}

      {/* Add Product Form Dialog */}
      <ProductForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode="create"
      />

      {/* Edit Product Form Dialog */}
      <ProductForm
        isOpen={isEditFormOpen}
        onOpenChange={setIsEditFormOpen}
        product={productToEdit}
        mode="edit"
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}
