'use client';

import { useState, useMemo } from 'react';
import { 
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Select from '@radix-ui/react-select';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, CaretSortIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';

export default function RadixTable({ data, columns }) {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  
  // Define table columns with accessors
  const tableColumns = useMemo(() => 
    columns.map(col => ({
      id: col.key,
      accessorKey: col.key,
      header: col.label,
      cell: info => {
        const value = info.getValue();
        
        // Handle rendering different cell types
        if ((col.key === 'website' || col.key === 'googleMaps') && value !== 'N/A') {
          return (
            <a href={value} target="_blank" rel="noopener noreferrer" className="cell-link">
              {col.key === 'website' ? 'Visit Website' : 'View on Google Maps'}
            </a>
          );
        } else if (col.key === 'phone' && value !== 'N/A') {
          return (
            <a href={`tel:${value.replace(/\D/g, '')}`} className="cell-link">
              {value}
            </a>
          );
        } else if (col.key === 'hours') {
          return value === 'N/A' ? 'N/A' : (
            <div className="hours-container">
              {value.split(' | ').map((day, idx) => (
                <div key={idx} className="hours-row">{day}</div>
              ))}
            </div>
          );
        }
        
        return value;
      }
    })),
    [columns]
  );
  
  // Initialize the table
  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });
  
  return (
    <div className="radix-table-container">
      {/* Table toolbar */}
      <div className="radix-table-toolbar">
        <div className="radix-search-wrapper">
          <MagnifyingGlassIcon className="radix-search-icon" />
          <input
            type="text"
            placeholder="Search all columns..."
            value={globalFilter}
            onChange={e => setGlobalFilter(e.target.value)}
            className="radix-search-input"
          />
        </div>
        
        <div className="radix-pagination-top">
          <span className="radix-page-text">
            Page{' '}
            <strong>
              {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </strong>
          </span>
          
          <Select.Root
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <Select.Trigger className="radix-select-trigger">
              <Select.Value />
              <Select.Icon>
                <ChevronDownIcon />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="radix-select-content">
                <Select.Viewport>
                  {[10, 20, 30, 40, 50].map(pageSize => (
                    <Select.Item key={pageSize} value={pageSize.toString()} className="radix-select-item">
                      <Select.ItemText>{pageSize} rows</Select.ItemText>
                      <Select.ItemIndicator className="radix-select-indicator">
                        <CheckIcon />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>
      </div>
      
      {/* Table */}
      <div className="radix-table-wrapper">
        <table className="radix-table">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th 
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={
                      header.column.getIsSorted()
                        ? `sorted-${header.column.getIsSorted()}`
                        : ''
                    }
                  >
                    <div className="radix-th-content">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      <span className="radix-sort-icon">
                        {header.column.getIsSorted() === 'asc' ? (
                          <ChevronUpIcon />
                        ) : header.column.getIsSorted() === 'desc' ? (
                          <ChevronDownIcon />
                        ) : (
                          <CaretSortIcon />
                        )}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="radix-no-data">
                  {globalFilter ? 'No matching results' : 'No data available'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="radix-pagination">
        <div className="radix-pagination-buttons">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="radix-page-button"
          >
            {'<<'}
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="radix-page-button"
          >
            {'<'}
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="radix-page-button"
          >
            {'>'}
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="radix-page-button"
          >
            {'>>'}
          </button>
        </div>
        
        <div className="radix-page-info">
          <span className="radix-page-text">
            Showing{' '}
            <strong>
              {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
            </strong>
            {' '}-{' '}
            <strong>
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}
            </strong>
            {' '}of{' '}
            <strong>{table.getFilteredRowModel().rows.length}</strong> results
          </span>
        </div>
      </div>
    </div>
  );
}