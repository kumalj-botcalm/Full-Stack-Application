'use client';

import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from '@/components/ui/card';
import DialogHeader from './dialog-header';

interface CardWrapperProps {
  label: string;
  title: string;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const FormDialog = ({
  label,
  title,
  children,
  open = false,
  onOpenChange,
}: CardWrapperProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 sm:max-w-[625px] max-h-[98vh] flex flex-col">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">{label}</DialogDescription>
        <Card className="border-0 shadow-none flex flex-col h-full">
          <CardHeader className="shrink-0">
            <DialogHeader label={label} title={title} />
          </CardHeader>

          <CardContent className="space-y-4 flex-1 overflow-y-auto pt-6">
            {children && children}
          </CardContent>
          <CardFooter className="shrink-0"></CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default FormDialog;
