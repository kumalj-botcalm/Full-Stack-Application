'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Control } from 'react-hook-form';

interface FormTextareaProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  className?: string;
}

export function FormTextarea({
  control,
  name,
  label,
  placeholder,
  rows = 3,
  className = '',
}: FormTextareaProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea
              {...field}
              placeholder={placeholder || `Enter ${label.toLowerCase()}`}
              rows={rows}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
