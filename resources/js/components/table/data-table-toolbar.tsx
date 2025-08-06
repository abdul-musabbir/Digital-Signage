import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { DataTableViewOptions } from './data-table-view-options';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FacetedFilterConfig {
    filterInput?: {
        column: string;
        title: string;
        placeholder: string;
    };
    filter: Array<{
        column: string;
        title: string;
        options: Array<{
            label: string;
            value: string;
            icon?: React.ComponentType<{ className?: string }>;
        }>;
    }>;
}

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    facetedFilter: FacetedFilterConfig;
    params: any; // URL parameters from useDebouncedSearch
    setParams: (params: any) => void; // Function to update URL parameters
    setTimeDebounce: (time: number) => void; // Function to set debounce time
}

export function DataTableToolbar<TData>({ table, facetedFilter, params, setParams, setTimeDebounce }: DataTableToolbarProps<TData>) {
    const isFiltered = params.filters && params.filters.length > 0;

    const resetFilters = () => {
        setParams({ ...params, filters: [], search: '' });
    };

    const handleSearchChange = (value: string) => {
        setTimeDebounce(300); // Longer debounce for search input
        setParams({ ...params, search: value });
    };

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                {facetedFilter.filterInput && (
                    <Input
                        placeholder={facetedFilter.filterInput.placeholder}
                        value={params.search || ''}
                        onChange={(event) => handleSearchChange(event.target.value)}
                        className="h-8 w-[150px] lg:w-[250px]"
                    />
                )}
                {facetedFilter.filter.map((filter) => (
                    <DataTableFacetedFilter
                        key={filter.column}
                        column={filter.column}
                        title={filter.title}
                        options={filter.options}
                        params={params}
                        setParams={setParams}
                        setTimeDebounce={setTimeDebounce}
                    />
                ))}
                {isFiltered && (
                    <Button variant="ghost" onClick={resetFilters} className="h-8 px-2 lg:px-3">
                        Reset
                        <Cross2Icon className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            <DataTableViewOptions table={table} />
        </div>
    );
}
