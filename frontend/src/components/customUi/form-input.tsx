'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control } from 'react-hook-form';

interface FormInputProps {
  control: Control<any>;
  name: string;
  label: string;
  type?: 'text' | 'email' | 'date' | 'number' | 'password';
  placeholder?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
}

export function FormInput({
  control,
  name,
  label,
  type = 'text',
  placeholder,
  className = '',
  disabled = false,
}: FormInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              type={type}
              placeholder={placeholder || `Enter ${label.toLowerCase()}`}
              disabled={disabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
