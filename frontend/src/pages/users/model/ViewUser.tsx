'use client';

import FormDialog from '@/components/customUi/dialog-box';
import { Button } from '@/components/ui/button';
import { ImageViewer } from '@/components/customUi';
import { User } from '../table-column/UserColumns';

interface ViewUserProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  user: User;
}

const ViewUser = ({ open = false, onOpenChange, user }: ViewUserProps) => {
  // Define user fields for display
  const userFields = [
    { label: 'User ID', key: 'userId' as keyof User },
    {
      label: 'Profile Image',
      key: 'image' as keyof User,
      render: (value: any) => (
        <div className="flex justify-center">
          <ImageViewer
            src={value}
            alt={`${user.firstName} ${user.lastName} - Profile Image`}
            width="w-32"
            height="h-32"
            showPlaceholder={true}
          />
        </div>
      ),
    },
    { label: 'First Name', key: 'firstName' as keyof User },
    { label: 'Last Name', key: 'lastName' as keyof User },
    { label: 'Email', key: 'email' as keyof User },
    { label: 'Birthdate', key: 'birthDate' as keyof User },
    { label: 'Gender', key: 'gender' as keyof User },
  ] as Array<{
    label: string;
    key: keyof User;
    render?: (value: any) => React.ReactNode;
  }>;

  return (
    <FormDialog
      label="User Details"
      title="View User"
      open={open}
      onOpenChange={onOpenChange}
    >
      <div className="flex flex-col h-full">
        {/* Scrollable Content Area */}
        <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-2">
          {userFields.map((field) => (
            <div key={field.key} className="space-y-2">
              <label className="text-sm font-medium ">
                {field.label}
              </label>
              <div className="rounded-md border bg-muted p-3">
                {'render' in field && field.render ? field.render(user[field.key]) : user[field.key]}
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

export default ViewUser;
