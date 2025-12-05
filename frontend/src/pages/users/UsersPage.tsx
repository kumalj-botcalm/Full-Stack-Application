import { useState } from 'react';
import { createUserColumns, User } from './table-column/UserColumns';
import { DataTable } from '../../components/data-table/data-table';
import { DataTableFilter } from '@/components/data-table/data-table-filter';
import { DataTableViewOptions } from '@/components/data-table/data-table-view-options';
import { Button } from '@/components/ui/button';
import { useUsers } from '@/hooks/useUser';
import ViewUser from './model/ViewUser';
import DeleteConfirmDialog from '../../components/customUi/DeleteConfirmDialog';
import UserForm from '@/pages/users/forms/UserForm';
import { useDeleteUser } from '@/hooks/useUserMutations';
import { PaginationState } from '@tanstack/react-table';

export default function UsersPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Pagination state
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Use React Query hook for fetching users with pagination
  const {
    data: usersResponse,
    isLoading,
    error,
  } = useUsers({
    page: paginationState.pageIndex + 1,
    limit: paginationState.pageSize,
  });

  const allUsers = usersResponse?.users ?? [];
  const totalPages = usersResponse?.pagination?.totalPages ?? 0;

  // View user dialog state
  const [isViewUserOpen, setIsViewUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Delete confirmation dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Edit form state
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  // Delete user mutation
  const deleteUserMutation = useDeleteUser();

  // Handle view user
  const handleView = (user: User) => {
    console.log('Viewing user:', user);
    setSelectedUser(user);
    setIsViewUserOpen(true);
  };

  // Handle edit user
  const handleEdit = (user: User) => {
    console.log('Editing user:', user);
    setUserToEdit(user);
    setIsEditFormOpen(true);
  };

  // Handle delete user
  const handleDelete = (user: User) => {
    console.log('Preparing to delete user:', user);
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete user
  const confirmDeleteUser = async () => {
    if (userToDelete) {
      try {
        await deleteUserMutation.mutateAsync(userToDelete._id);
        console.log('User deleted successfully:', userToDelete);
        setIsDeleteDialogOpen(false);
        setUserToDelete(null);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  // Handle view user dialog close
  const handleViewUserClose = (open: boolean) => {
    setIsViewUserOpen(open);
    if (!open) {
      setSelectedUser(null);
    }
  };

  // Handle edit form close
  const handleEditFormClose = (open: boolean) => {
    setIsEditFormOpen(open);
    if (!open) {
      setUserToEdit(null);
    }
  };

  // Create columns with callbacks
  const columns = createUserColumns(handleView, handleEdit, handleDelete);

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;
  if (error)
    return <div className="p-10 text-center text-red-500">{error.message}</div>;

  return (
    <div className="bg-card space-y-6 rounded-lg p-12 shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold">Users</h1>
          <p className="text-muted-foreground mt-2">
            Manage your user database and accounts
          </p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Add New User
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={allUsers}
        showPagination={true}
        manualPagination={true}
        pageCount={totalPages}
        paginationState={paginationState}
        onPaginationChange={setPaginationState}
        paginationOptions={{
          pageSizeOptions: [4, 8, 16, 32],
          showFirstLastButtons: true,
          showSelectedRows: true,
        }}
        toolbar={(table) => (
          <div className="flex w-full items-center space-x-4">
            <DataTableFilter
              table={table}
              columnKey="email"
              placeholder="Filter by email..."
              className="max-w-sm"
            />
            <DataTableViewOptions table={table} />
          </div>
        )}
      />

      {/* Add User Form */}
      <UserForm open={isFormOpen} onOpenChange={setIsFormOpen} />

      {/* Edit User Form */}
      {isEditFormOpen && userToEdit && (
        <UserForm
          open={isEditFormOpen}
          onOpenChange={handleEditFormClose}
          user={userToEdit}
        />
      )}

      {/* View User Dialog */}
      {isViewUserOpen && selectedUser && (
        <ViewUser
          open={isViewUserOpen}
          onOpenChange={handleViewUserClose}
          user={selectedUser}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && userToDelete && (
        <DeleteConfirmDialog
          open={isDeleteDialogOpen}
          onOpenChange={(open) => {
            setIsDeleteDialogOpen(open);
            if (!open) {
              setUserToDelete(null);
            }
          }}
          onConfirm={confirmDeleteUser}
          title={`Delete ${userToDelete.firstName} ${userToDelete.lastName}`}
          message={`Are you sure you want to delete this user? This action cannot be undone.`}
        />
      )}
    </div>
  );
}
