import { ColumnDef } from '@tanstack/react-table';
import { LucideIcon } from 'lucide-react';

// Core pagination types
export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginationMeta {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number | null;
    to: number | null;
    path: string;
    links: PaginationLink[];
}

// Filter option types
export interface FilterOption {
    label: string;
    value: string;
    icon?: LucideIcon | React.ComponentType<{ className?: string }>;
    count?: number;
}

export interface FilterConfig {
    column: string;
    title: string;
    options: FilterOption[];
    multiSelect?: boolean;
    searchable?: boolean;
}

export interface FilterInputConfig {
    column: string;
    title: string;
    placeholder: string;
    searchColumns?: string[]; // Multiple columns to search in
}

export interface FacetedFilterConfig {
    filterInput?: FilterInputConfig;
    filters: FilterConfig[];
}

// URL parameter types
export interface SearchParams {
    search?: string;
    filters?: string[];
    sort?: string;
    direction?: 'asc' | 'desc';
    page?: number;
    per_page?: number;
    [key: string]: any;
}

// Table state types
export interface TableState {
    globalFilter: string;
    columnFilters: Array<{
        id: string;
        value: any;
    }>;
    sorting: Array<{
        id: string;
        desc: boolean;
    }>;
    columnVisibility: Record<string, boolean>;
    rowSelection: Record<string, boolean>;
    pagination: {
        pageIndex: number;
        pageSize: number;
    };
}

// Hook return types
export interface DebouncedSearchReturn {
    params: SearchParams;
    setParams: (params: SearchParams) => void;
    setTimeDebounce: (time: number) => void;
    isLoading: boolean;
}

// Component prop types
export interface DataTableProps<TData, TValue = unknown> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    meta: PaginationMeta;
    facetedFilter: FacetedFilterConfig;
    initialFilters?: SearchParams;
    isLoading?: boolean;
    className?: string;
    enableRowSelection?: boolean;
    enableColumnVisibility?: boolean;
    enableSorting?: boolean;
    enableFiltering?: boolean;
    onRowSelectionChange?: (selection: Record<string, boolean>) => void;
    onPageSizeChange?: (pageSize: number) => void;
}

export interface DataTableToolbarProps<TData> {
    table: any; // TanStack table instance
    facetedFilter: FacetedFilterConfig;
    params: SearchParams;
    setParams: (params: SearchParams) => void;
    setTimeDebounce: (time: number) => void;
    isLoading?: boolean;
}

export interface DataTablePaginationProps<TData> {
    table: any; // TanStack table instance
    meta: PaginationMeta;
    onPageSizeChange?: (pageSize: number) => void;
    preserveState?: boolean;
    preserveScroll?: boolean;
    isLoading?: boolean;
}

export interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
    column: any; // TanStack column instance
    title: string;
    sortable?: boolean;
}

export interface DataTableFacetedFilterProps {
    title: string;
    column: string;
    options: FilterOption[];
    params: SearchParams;
    setParams: (params: SearchParams) => void;
    setTimeDebounce: (time: number) => void;
    multiSelect?: boolean;
    searchable?: boolean;
    maxItems?: number;
}

export interface DataTableViewOptionsProps<TData> {
    table: any; // TanStack table instance
}

// Utility types
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
    column: string;
    direction: SortDirection;
}

// Performance optimization types
export interface VirtualizationConfig {
    enabled: boolean;
    itemHeight: number;
    overscan: number;
}

// Export utility type for better column definitions
export type DataTableColumn<TData, TValue = unknown> = ColumnDef<TData, TValue> & {
    meta?: {
        headerClassName?: string;
        cellClassName?: string;
        sortable?: boolean;
        filterable?: boolean;
    };
};
