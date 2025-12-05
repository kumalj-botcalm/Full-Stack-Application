'use client';

import FormDialog from './dialog-box';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useForm, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { z } from 'zod';

interface FormWrapperProps {
  // Dialog props
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  label?: string;

  // Form configuration
  schema: z.ZodSchema<any>;
  defaultValues: Record<string, any>;

  // Form behavior
  onSubmit: (data: any) => void;
  submitButtonText?: string;
  isLoading?: boolean;

  // Optional initial data for editing
  initialData?: Record<string, any>;

  // Entity name for labels
  entityName?: string;

  // Form content
  children: (form: any) => React.ReactNode;
}

export function FormWrapper({
  open = false,
  onOpenChange,
  title,
  label,
  schema,
  defaultValues,
  onSubmit,
  submitButtonText,
  isLoading = false,
  initialData,
  entityName = 'Item',
  children,
}: FormWrapperProps) {
  // Determine if we're in edit mode
  const isEditMode = !!initialData && Object.keys(initialData).length > 0;

  // Auto-generate titles and labels based on mode
  const finalTitle =
    title || (isEditMode ? `Edit ${entityName}` : `Add ${entityName}`);
  const finalLabel =
    label ||
    (isEditMode
      ? `Edit ${entityName.toLowerCase()} information`
      : `Add a new ${entityName.toLowerCase()}`);
  const finalSubmitButtonText =
    submitButtonText ||
    (isEditMode ? `Update ${entityName}` : `Add ${entityName}`);

  const form = useForm({
    resolver: zodResolver(schema as any),
    defaultValues: initialData
      ? { ...defaultValues, ...initialData }
      : defaultValues,
  });

  // Update form when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      form.reset({ ...defaultValues, ...initialData });
    } else {
      form.reset(defaultValues);
    }
  }, [initialData, form, defaultValues]);

  const handleSubmit = (data: FieldValues) => {
    console.log('Form submitted with data:', data);

    // Call the provided onSubmit function (parent handles reset and close)
    onSubmit(data);
  };

  return (
    <FormDialog
      label={finalLabel}
      title={finalTitle}
      open={open}
      onOpenChange={onOpenChange}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col h-full">
          {/* Scrollable Form Fields */}
          <div className="max-h-[60vh] overflow-y-auto space-y-8 pr-2">
            {children(form)}
          </div>
          
          {/* Fixed Submit Button */}
          <div className="border-t pt-4 mt-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Processing...
                </>
              ) : (
                finalSubmitButtonText
              )}
            </Button>
            {isLoading && (
              <p className="text-xs text-gray-500 text-center mt-2">
                Please wait while we process your request...
              </p>
            )}
          </div>
        </form>
      </Form>
    </FormDialog>
  );
}
