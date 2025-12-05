import { Input } from '@/components/ui/input';

interface DataTableFilterProps {
  table: any;
  columnKey: string;
  placeholder?: string;
  className?: string;
}

export function DataTableFilter({
  table,
  columnKey,
  placeholder = 'Filter...',
  className,
}: DataTableFilterProps) {
  return (
    <Input
      placeholder={placeholder}
      value={(table.getColumn(columnKey)?.getFilterValue() as string) ?? ''}
      onChange={(event) =>
        table.getColumn(columnKey)?.setFilterValue(event.target.value)
      }
      className={className}
    />
  );
}
