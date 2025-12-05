import { DataTablePagination } from './data-table-pagination';
import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  VisibilityState,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
  getFilteredRowModel,
  PaginationState,
  OnChangeFn,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  paginationOptions?: {
    pageSizeOptions?: number[];
    showRowsPerPage?: boolean;
    showFirstLastButtons?: boolean;
    showPageInfo?: boolean;
    showSelectedRows?: boolean;
    className?: string;
  };
  toolbar?: (table: any) => React.ReactNode;
  getTableInstance?: (table: any) => void;
  showPagination?: boolean;
  manualPagination?: boolean;
  pageCount?: number;
  paginationState?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  paginationOptions,
  toolbar,
  getTableInstance,
  showPagination = false,
  manualPagination = false,
  pageCount,
  paginationState,
  onPaginationChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const defaultPageSize = paginationOptions?.pageSizeOptions?.[0] ?? 10;
  const [internalPagination, setInternalPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: defaultPageSize,
    });

  const activePagination =
    manualPagination && paginationState ? paginationState : internalPagination;

  const handlePaginationChange: OnChangeFn<PaginationState> = (updater) => {
    console.log('DataTable handlePaginationChange:', {
      updater,
      manualPagination,
      hasOnPaginationChange: !!onPaginationChange,
    });

    if (manualPagination && onPaginationChange) {
      console.log('Using manual pagination, calling parent handler');
      onPaginationChange(updater);
      return;
    }

    console.log('Using internal pagination');
    setInternalPagination((old) =>
      typeof updater === 'function'
        ? (updater as (old: PaginationState) => PaginationState)(old)
        : updater
    );
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination,
    pageCount: manualPagination ? pageCount || 1 : undefined,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: activePagination,
    },
    onPaginationChange: handlePaginationChange,
  });

  React.useEffect(() => {
    if (getTableInstance) getTableInstance(table);
  }, [getTableInstance, table]);

  React.useEffect(() => {
    console.log('DataTable state update:', {
      manualPagination,
      pageCount,
      activePagination,
      tableState: table.getState().pagination,
      canPreviousPage: table.getCanPreviousPage(),
      canNextPage: table.getCanNextPage(),
    });
  }, [manualPagination, pageCount, activePagination, table]);

  return (
    <div>
      {toolbar && (
        <div className="mb-4 flex items-center">{toolbar(table)}</div>
      )}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {showPagination && (
        <div className="mt-4">
          <DataTablePagination table={table} {...paginationOptions} />
        </div>
      )}
    </div>
  );
}
