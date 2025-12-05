'use client';

import { Button } from '@/components/ui/button';
import DialogBox from './dialog-box';

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function DeleteConfirmDialog({
  open,
  onOpenChange,
  title = 'Confirm Deletion',
  message = 'Are you sure you want to delete this item?',
  onConfirm,
  onCancel,
  confirmText = 'Delete',
  cancelText = 'Cancel',
}: DeleteConfirmDialogProps) {
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onOpenChange(false);
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <DialogBox
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      label={message}
    >
      <div className="space-y-4">
        {/* Action buttons */}
        <div className="flex justify-center gap-3 pt-2">
          <Button variant="outline" onClick={handleCancel}>
            {cancelText}
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </DialogBox>
  );
}
