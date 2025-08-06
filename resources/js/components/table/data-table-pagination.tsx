import { Link, router } from '@inertiajs/react';
import { ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PaginationMeta {
    current_page: number;
    per_page: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface DataTablePaginationProps<TData> {
    table: Table<TData>;
    meta: PaginationMeta;
    onPageSizeChange?: (pageSize: number) => void;
    preserveState?: boolean;
    preserveScroll?: boolean;
}

export function DataTablePagination<TData>({
    table,
    meta,
    onPageSizeChange,
    preserveState = true,
    preserveScroll = true,
}: DataTablePaginationProps<TData>) {
    const totalPages = Math.ceil(meta.total / meta.per_page);
    const currentPage = meta.current_page;

    // Find specific links from the Laravel pagination
    const previousLink = meta.links.find((link) => link.label === '&laquo; Previous');
    const nextLink = meta.links.find((link) => link.label === 'Next &raquo;');

    // Build first and last page URLs based on existing pagination URLs
    const buildPageUrl = (page: number): string | null => {
        // Find any numbered link to use as a template
        const numberedLink = meta.links.find((link) => link.url && link.label !== '&laquo; Previous' && link.label !== 'Next &raquo;');

        if (!numberedLink?.url) return null;

        // Replace the page parameter in the URL
        const url = new URL(numberedLink.url);
        url.searchParams.set('page', page.toString());
        return url.toString();
    };

    const firstPageUrl = currentPage > 1 ? buildPageUrl(1) : null;
    const lastPageUrl = currentPage < totalPages ? buildPageUrl(totalPages) : null;

    const handlePageSizeChange = (value: string) => {
        const newPageSize = Number(value);

        if (onPageSizeChange) {
            // Use provided callback
            onPageSizeChange(newPageSize);
        } else {
            // Use Inertia router to handle page size change
            const currentUrl = window.location.href;
            const url = new URL(currentUrl);

            // Update the per_page parameter and reset to page 1
            url.searchParams.set('per_page', newPageSize.toString());
            url.searchParams.set('page', '1');

            // Navigate using Inertia router
            router.get(
                url.pathname + url.search,
                {},
                {
                    preserveState,
                    preserveScroll,
                    replace: true, // Replace current history entry
                },
            );
        }
    };

    return (
        <div className="flex items-center justify-between overflow-auto px-2">
            <div className="hidden flex-1 text-sm text-muted-foreground sm:block">
                {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="flex items-center sm:space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                    <p className="hidden text-sm font-medium sm:block">Rows per page</p>
                    <Select value={`${meta.per_page}`} onValueChange={handlePageSizeChange}>
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={meta.per_page} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[1, 5, 10, 20, 30, 40, 50, 100].map((pageSize) => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center space-x-2">
                    {/* First Page Button */}
                    {firstPageUrl ? (
                        <Link
                            href={firstPageUrl}
                            className="inline-flex hidden h-8 w-8 items-center justify-center whitespace-nowrap rounded-md border border-input bg-background p-0 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:flex"
                            title="Go to first page"
                        >
                            <span className="sr-only">Go to first page</span>
                            <DoubleArrowLeftIcon className="h-4 w-4" />
                        </Link>
                    ) : (
                        <div
                            className="pointer-events-none inline-flex hidden h-8 w-8 cursor-not-allowed items-center justify-center whitespace-nowrap rounded-md border border-input bg-background p-0 text-sm font-medium opacity-50 lg:flex"
                            title="Already on first page"
                        >
                            <span className="sr-only">Go to first page</span>
                            <DoubleArrowLeftIcon className="h-4 w-4" />
                        </div>
                    )}

                    {/* Previous Page Button */}
                    {previousLink?.url ? (
                        <Link
                            href={previousLink.url}
                            className="inline-flex h-8 w-8 items-center justify-center whitespace-nowrap rounded-md border border-input bg-background p-0 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            title="Go to previous page"
                        >
                            <span className="sr-only">Go to previous page</span>
                            <ChevronLeftIcon className="h-4 w-4" />
                        </Link>
                    ) : (
                        <div
                            className="pointer-events-none inline-flex h-8 w-8 cursor-not-allowed items-center justify-center whitespace-nowrap rounded-md border border-input bg-background p-0 text-sm font-medium opacity-50"
                            title="Already on first page"
                        >
                            <span className="sr-only">Go to previous page</span>
                            <ChevronLeftIcon className="h-4 w-4" />
                        </div>
                    )}

                    {/* Next Page Button */}
                    {nextLink?.url ? (
                        <Link
                            href={nextLink.url}
                            className="inline-flex h-8 w-8 items-center justify-center whitespace-nowrap rounded-md border border-input bg-background p-0 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            title="Go to next page"
                        >
                            <span className="sr-only">Go to next page</span>
                            <ChevronRightIcon className="h-4 w-4" />
                        </Link>
                    ) : (
                        <div
                            className="pointer-events-none inline-flex h-8 w-8 cursor-not-allowed items-center justify-center whitespace-nowrap rounded-md border border-input bg-background p-0 text-sm font-medium opacity-50"
                            title="Already on last page"
                        >
                            <span className="sr-only">Go to next page</span>
                            <ChevronRightIcon className="h-4 w-4" />
                        </div>
                    )}

                    {/* Last Page Button */}
                    {lastPageUrl ? (
                        <Link
                            href={lastPageUrl}
                            className="inline-flex hidden h-8 w-8 items-center justify-center whitespace-nowrap rounded-md border border-input bg-background p-0 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:flex"
                            title="Go to last page"
                        >
                            <span className="sr-only">Go to last page</span>
                            <DoubleArrowRightIcon className="h-4 w-4" />
                        </Link>
                    ) : (
                        <div
                            className="pointer-events-none inline-flex hidden h-8 w-8 cursor-not-allowed items-center justify-center whitespace-nowrap rounded-md border border-input bg-background p-0 text-sm font-medium opacity-50 lg:flex"
                            title="Already on last page"
                        >
                            <span className="sr-only">Go to last page</span>
                            <DoubleArrowRightIcon className="h-4 w-4" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
